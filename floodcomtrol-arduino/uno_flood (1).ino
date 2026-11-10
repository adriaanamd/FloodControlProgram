// =====================================================
// JSN-SR04T Flood Level Sensor - Arduino Uno R3
// Median filter + DHT11 temperature compensation
// + spike rejection + blind zone alarm
// + rain sensor (dry / light / heavy)
// + passive buzzer alarm
// + settings changeable from the web dashboard (saved in EEPROM)
//
// Wiring:
//   JSN-SR04T : VCC -> 5V, GND -> GND, TRIG -> D9, ECHO -> D10
//   DHT11     : S -> D2, middle -> 5V, "-" -> GND
//   Rain board: VCC -> D4, GND -> GND, AO -> A0 (DO not used)
//   Buzzer    : + -> 100 ohm -> D8, - -> GND
//               (3-pin module: S -> D8, + -> 5V, - -> GND)
//   NodeMCU   : Uno D11 -> 1k -> NodeMCU D7, NodeMCU D7 -> 2k -> GND
//               NodeMCU D1 -> 1k -> Uno D12
//               Uno 5V -> NodeMCU Vin, Uno GND -> NodeMCU G
//
// Library needed: "DHT sensor library" by Adafruit
// =====================================================

#include <DHT.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

// ---------- Pins ----------
const uint8_t TRIG_PIN     = 9;
const uint8_t ECHO_PIN     = 10;
const uint8_t DHT_PIN      = 2;
const uint8_t ESP_RX_PIN   = 12;    // NodeMCU D1 -> 1k -> Uno D12
const uint8_t ESP_TX_PIN   = 11;    // Uno D11 -> divider -> NodeMCU D7
const uint8_t RAIN_AO_PIN  = A0;    // rain board AO
const uint8_t RAIN_PWR_PIN = 4;     // rain board VCC (powered only when reading)
const uint8_t BUZZER_PIN   = 8;     // passive buzzer

DHT dht(DHT_PIN, DHT11);
SoftwareSerial espSerial(ESP_RX_PIN, ESP_TX_PIN);

// ---------- Sensor limits ----------
const float MIN_CM = 20.0;          // blind zone; ignore anything closer
const float MAX_CM = 450.0;         // ignore anything farther
const uint8_t SAMPLES = 15;         // readings per measurement
const uint16_t PING_GAP_MS = 60;    // let the transducer stop ringing

// ---------- Calibration ----------
const float CAL_SCALE  = 1.000;
const float CAL_OFFSET = 0.0;       // cm

// ---------- Settings (changeable from the dashboard) ----------
// These are only the DEFAULTS. Once you change them on the dashboard,
// the new values are saved in EEPROM and used after every restart.
struct Settings {
  uint16_t magic;
  float    heightCm;   // sensor face -> "0 cm water" point
  float    warnCm;     // WARNING water level
  float    dangerCm;   // DANGER water level
  uint8_t  buzzerOn;   // 1 = buzzer enabled
  int16_t  rainLight;  // rain value below this = LIGHT rain
  int16_t  rainHeavy;  // rain value below this = HEAVY rain
};

const uint16_t SETTINGS_MAGIC = 0xF10D;
const Settings DEFAULT_SETTINGS = { SETTINGS_MAGIC, 50.0, 10.0, 20.0, 1, 800, 500 };
Settings cfg;

// ---------- Filter settings ----------
const float   EMA_ALPHA    = 0.3;
const float   JUMP_CM      = 10.0;
const uint8_t CONFIRM_NEED = 3;
const float   NEAR_ZONE_CM = MIN_CM + 15.0;
const uint8_t FAIL_ALARM   = 3;

// ---------- Timing ----------
const float DEFAULT_TEMP_C = 30.0;
const unsigned long TEMP_INTERVAL_MS = 2000;
const unsigned long RAIN_INTERVAL_MS = 5000;
const unsigned long LINK_REPRINT_MS  = 30000;
const unsigned long CFG_SEND_MS      = 5000;

// ---------- Link to NodeMCU ----------
char espBuf[64];
uint8_t espLen = 0;
char webIp[16] = "";
unsigned long lastLinkPrint = 0;
unsigned long lastCfgSend = 0;

// ---------- State ----------
float filteredCm = NAN;
float candidateCm = NAN;
float waterLevelCm = NAN;
uint8_t confirmCount = 0;
uint8_t failCount = 0;
const char* statusText = "STARTING";

float airTempC = DEFAULT_TEMP_C;
bool tempOk = false;
unsigned long lastTempRead = 0;

int rainValue = -1;
const char* rainText = "UNKNOWN";
unsigned long lastRainRead = 0;

unsigned long muteUntil = 0;        // 0 = not muted
bool testRequested = false;

uint8_t cntOk, cntNoEcho, cntClose, cntFar;

enum PingResult { PING_OK, PING_NO_ECHO, PING_TOO_CLOSE, PING_TOO_FAR };

// =====================================================
// Settings
// =====================================================
bool settingsValid(const Settings &s) {
  return s.heightCm >= MIN_CM + 5.0 && s.heightCm <= MAX_CM &&
         s.warnCm > 0.0 &&
         s.dangerCm > s.warnCm &&
         s.dangerCm <= s.heightCm - MIN_CM &&
         s.rainHeavy > 0 &&
         s.rainLight > s.rainHeavy &&
         s.rainLight <= 1023;
}

void loadSettings() {
  EEPROM.get(0, cfg);
  if (cfg.magic != SETTINGS_MAGIC || !settingsValid(cfg)) {
    cfg = DEFAULT_SETTINGS;
    EEPROM.put(0, cfg);
  }
}

void printSettings() {
  Serial.print(F(">> Settings: height="));  Serial.print(cfg.heightCm, 1);
  Serial.print(F(" cm, warning="));         Serial.print(cfg.warnCm, 1);
  Serial.print(F(" cm, danger="));          Serial.print(cfg.dangerCm, 1);
  Serial.print(F(" cm, buzzer="));          Serial.print(cfg.buzzerOn ? F("ON") : F("OFF"));
  Serial.print(F(", rain light<"));         Serial.print(cfg.rainLight);
  Serial.print(F(", heavy<"));              Serial.println(cfg.rainHeavy);
}

// =====================================================
// Buzzer
// =====================================================
bool isMuted() {
  return muteUntil != 0 && (long)(muteUntil - millis()) > 0;
}

unsigned long muteLeftSec() {
  return isMuted() ? (muteUntil - millis()) / 1000UL : 0;
}

void beep(unsigned int freq, unsigned int ms) {
  tone(BUZZER_PIN, freq);
  delay(ms);
  noTone(BUZZER_PIN);
}

// Plays the alarm for the current status.
// Always takes about 500 ms, and runs only BETWEEN measurements
// so the tone doesn't disturb the distance readings.
void soundAlarm() {
  if (testRequested) {              // "Test buzzer" button on the dashboard
    testRequested = false;
    beep(2000, 150); delay(50); beep(2500, 150); delay(50); beep(3000, 100);
    return;
  }

  if (!cfg.buzzerOn || isMuted()) { delay(500); return; }

  if (strcmp(statusText, "CRITICAL") == 0) {
    beep(3000, 400); delay(100);                              // long high beep
  } else if (strcmp(statusText, "DANGER") == 0) {
    beep(2500, 120); delay(80); beep(2500, 120); delay(180);  // 2 beeps
  } else if (strcmp(statusText, "WARNING") == 0) {
    beep(2000, 120); delay(380);                              // 1 beep
  } else {
    delay(500);                                               // silent
  }
}

// =====================================================
// Sensors
// =====================================================
void updateTemperature() {
  if (lastTempRead != 0 && millis() - lastTempRead < TEMP_INTERVAL_MS) return;
  lastTempRead = millis();

  float t = dht.readTemperature();
  if (!isnan(t) && t > -20.0 && t < 70.0) {
    airTempC = t;
    tempOk = true;
  } else {
    tempOk = false;                 // keep the last good value
  }
}

void updateRain() {
  if (lastRainRead != 0 && millis() - lastRainRead < RAIN_INTERVAL_MS) return;
  lastRainRead = millis();

  digitalWrite(RAIN_PWR_PIN, HIGH); // power the sensor
  delay(10);                        // let it settle
  long sum = 0;
  for (uint8_t i = 0; i < 5; i++) {
    sum += analogRead(RAIN_AO_PIN);
    delay(2);
  }
  digitalWrite(RAIN_PWR_PIN, LOW);  // power off to prevent corrosion

  rainValue = sum / 5;
  if (rainValue < cfg.rainHeavy)      rainText = "HEAVY";
  else if (rainValue < cfg.rainLight) rainText = "LIGHT";
  else                                rainText = "DRY";
}

PingResult pingOnce(float cmPerUs, float &d) {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(20);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long us = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (us == 0) return PING_NO_ECHO;

  d = us * cmPerUs / 2.0;
  if (d < MIN_CM) return PING_TOO_CLOSE;
  if (d > MAX_CM) return PING_TOO_FAR;
  return PING_OK;
}

float measureMedianCm() {
  float cmPerUs = (331.3 + 0.606 * airTempC) / 10000.0;

  float vals[SAMPLES];
  cntOk = cntNoEcho = cntClose = cntFar = 0;

  for (uint8_t i = 0; i < SAMPLES; i++) {
    float d;
    switch (pingOnce(cmPerUs, d)) {
      case PING_OK:        vals[cntOk++] = d; break;
      case PING_NO_ECHO:   cntNoEcho++; break;
      case PING_TOO_CLOSE: cntClose++;  break;
      case PING_TOO_FAR:   cntFar++;    break;
    }
    delay(PING_GAP_MS);
  }

  if (cntOk < SAMPLES / 2 + 1) return NAN;

  for (uint8_t i = 1; i < cntOk; i++) {         // insertion sort
    float key = vals[i];
    int8_t j = i - 1;
    while (j >= 0 && vals[j] > key) { vals[j + 1] = vals[j]; j--; }
    vals[j + 1] = key;
  }

  float m = (cntOk % 2) ? vals[cntOk / 2]
                        : (vals[cntOk / 2 - 1] + vals[cntOk / 2]) / 2.0;
  return m * CAL_SCALE + CAL_OFFSET;
}

void updateFilter(float d) {
  if (isnan(filteredCm)) { filteredCm = d; return; }

  if (fabs(d - filteredCm) <= JUMP_CM) {
    filteredCm = EMA_ALPHA * d + (1 - EMA_ALPHA) * filteredCm;
    confirmCount = 0;
    return;
  }

  if (!isnan(candidateCm) && fabs(d - candidateCm) <= JUMP_CM) {
    confirmCount++;
  } else {
    candidateCm = d;
    confirmCount = 1;
  }

  if (confirmCount >= CONFIRM_NEED) {
    filteredCm = d;
    confirmCount = 0;
  }
}

// =====================================================
// Send to NodeMCU
// =====================================================
// DATA,raw,distance,level,temp,tempOk,ok,samples,status,rainValue,rainText
void sendField(float v) {
  espSerial.print(',');
  if (isnan(v)) espSerial.print(F("nan"));
  else          espSerial.print(v, 1);
}

void sendToEsp(float raw) {
  espSerial.print(F("DATA"));
  sendField(raw);
  sendField(filteredCm);
  sendField(waterLevelCm);
  sendField(airTempC);
  espSerial.print(','); espSerial.print(tempOk ? 1 : 0);
  espSerial.print(','); espSerial.print(cntOk);
  espSerial.print(','); espSerial.print(SAMPLES);
  espSerial.print(','); espSerial.print(statusText);
  espSerial.print(','); espSerial.print(rainValue);
  espSerial.print(','); espSerial.println(rainText);
}

// CFG,height,warn,danger,buzzerOn,rainLight,rainHeavy,muteLeftSec
void sendConfig() {
  espSerial.print(F("CFG,"));
  espSerial.print(cfg.heightCm, 1);  espSerial.print(',');
  espSerial.print(cfg.warnCm, 1);    espSerial.print(',');
  espSerial.print(cfg.dangerCm, 1);  espSerial.print(',');
  espSerial.print(cfg.buzzerOn);     espSerial.print(',');
  espSerial.print(cfg.rainLight);    espSerial.print(',');
  espSerial.print(cfg.rainHeavy);    espSerial.print(',');
  espSerial.println(muteLeftSec());
  lastCfgSend = millis();
}

// =====================================================
// Receive from NodeMCU
// =====================================================
// Messages:
//   IP,192.168.1.45   or   IP,NONE
//   SET,height,warn,danger,buzzerOn,rainLight,rainHeavy
//   MUTE,minutes      (0 = unmute)
//   TEST              (test buzzer)
bool looksLikeIp(const char *s) {
  size_t n = strlen(s);
  if (n < 7 || n > 15) return false;
  uint8_t dots = 0;
  for (size_t i = 0; i < n; i++) {
    if (s[i] == '.') dots++;
    else if (s[i] < '0' || s[i] > '9') return false;
  }
  return dots == 3;
}

void printLink() {
  if (strcmp(webIp, "NONE") == 0) {
    Serial.println(F(">> NodeMCU: WiFi not connected yet"));
  } else {
    Serial.print(F(">> Web page: http://"));
    Serial.println(webIp);
  }
  lastLinkPrint = millis();
}

void handleSet(char *args) {
  float v[6];
  uint8_t n = 0;
  char *tok = strtok(args, ",");
  while (tok != NULL && n < 6) {
    v[n++] = atof(tok);
    tok = strtok(NULL, ",");
  }
  if (n != 6) return;               // garbled line, NodeMCU will resend

  Settings s = cfg;
  s.heightCm  = v[0];
  s.warnCm    = v[1];
  s.dangerCm  = v[2];
  s.buzzerOn  = (v[3] > 0.5) ? 1 : 0;
  s.rainLight = (int16_t)v[4];
  s.rainHeavy = (int16_t)v[5];

  if (!settingsValid(s)) {
    Serial.println(F(">> Dashboard sent invalid settings - ignored"));
  } else if (memcmp(&s, &cfg, sizeof(Settings)) != 0) {
    cfg = s;
    EEPROM.put(0, cfg);             // only changed bytes are written
    Serial.println(F(">> Settings changed from dashboard"));
    printSettings();
  }
  sendConfig();                     // confirm current settings to NodeMCU
}

void handleEspLine(char *line) {
  if (strncmp(line, "IP,", 3) == 0) {
    const char *v = line + 3;
    if (strcmp(v, "NONE") != 0 && !looksLikeIp(v)) return;  // garbled
    if (strcmp(v, webIp) != 0) {
      strncpy(webIp, v, sizeof(webIp) - 1);
      webIp[sizeof(webIp) - 1] = '\0';
      printLink();
    }
  } else if (strncmp(line, "SET,", 4) == 0) {
    handleSet(line + 4);
  } else if (strncmp(line, "MUTE,", 5) == 0) {
    long m = atol(line + 5);
    if (m <= 0) {
      muteUntil = 0;
      Serial.println(F(">> Buzzer unmuted from dashboard"));
    } else {
      if (m > 120) m = 120;
      muteUntil = millis() + (unsigned long)m * 60000UL;
      if (muteUntil == 0) muteUntil = 1;
      Serial.print(F(">> Buzzer muted for ")); Serial.print(m); Serial.println(F(" min"));
    }
    sendConfig();
  } else if (strcmp(line, "TEST") == 0) {
    testRequested = true;
    Serial.println(F(">> Buzzer test from dashboard"));
  }
}

void readEsp() {
  while (espSerial.available()) {
    char c = espSerial.read();
    if (c == '\n') {
      espBuf[espLen] = '\0';
      if (espLen > 0) handleEspLine(espBuf);
      espLen = 0;
    } else if (c != '\r') {
      if (espLen < sizeof(espBuf) - 1) espBuf[espLen++] = c;
      else espLen = 0;              // too long = garbage, drop it
    }
  }

  if (webIp[0] != '\0' && millis() - lastLinkPrint >= LINK_REPRINT_MS) printLink();
  if (millis() - lastCfgSend >= CFG_SEND_MS) sendConfig();
}

// =====================================================
// Setup / loop
// =====================================================
void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  pinMode(RAIN_PWR_PIN, OUTPUT);
  digitalWrite(RAIN_PWR_PIN, LOW);

  pinMode(BUZZER_PIN, OUTPUT);

  loadSettings();

  if (cfg.buzzerOn) {               // startup test: 2 short beeps
    beep(2000, 100); delay(100); beep(2500, 100);
  }

  dht.begin();
  delay(1500);

  Serial.println(F("JSN-SR04T flood sensor started (Uno + NodeMCU + rain + buzzer)"));
  printSettings();
  Serial.println(F("Waiting for web address from NodeMCU..."));
  sendConfig();
}

void loop() {
  readEsp();
  updateTemperature();
  updateRain();
  float d = measureMedianCm();

  if (isnan(d)) {
    failCount++;
    bool critical = !isnan(filteredCm) && filteredCm < NEAR_ZONE_CM &&
                    failCount >= FAIL_ALARM;
    statusText = critical ? "CRITICAL" : "NO READING";

    Serial.print(F("No valid reading (ok="));  Serial.print(cntOk);
    Serial.print(F(" noEcho="));               Serial.print(cntNoEcho);
    Serial.print(F(" tooClose="));             Serial.print(cntClose);
    Serial.print(F(" tooFar="));               Serial.print(cntFar);
    Serial.print(F(") | Rain: "));             Serial.print(rainText);
    Serial.print(F(" ("));                     Serial.print(rainValue);
    Serial.println(')');
    if (critical) Serial.println(F("!!! CRITICAL: water at/above sensor blind zone !!!"));
  } else {
    failCount = 0;
    updateFilter(d);

    waterLevelCm = cfg.heightCm - filteredCm;
    if (waterLevelCm < 0) waterLevelCm = 0;

    if (waterLevelCm >= cfg.dangerCm)    statusText = "DANGER";
    else if (waterLevelCm >= cfg.warnCm) statusText = "WARNING";
    else                                 statusText = "NORMAL";

    Serial.print(F("Raw: "));               Serial.print(d, 1);
    Serial.print(F(" cm | Filtered: "));    Serial.print(filteredCm, 1);
    Serial.print(F(" cm | Level: "));       Serial.print(waterLevelCm, 1);
    Serial.print(F(" cm | Temp: "));        Serial.print(airTempC, 1);
    Serial.print(tempOk ? F(" C") : F(" C (DHT11 error)"));
    Serial.print(F(" | Rain: "));           Serial.print(rainText);
    Serial.print(F(" ("));                  Serial.print(rainValue);
    Serial.print(F(") | ok="));             Serial.print(cntOk);
    Serial.print('/');                      Serial.print(SAMPLES);
    Serial.print(F(" | "));                 Serial.print(statusText);
    if (isMuted()) Serial.print(F(" (muted)"));
    Serial.println();
  }

  sendToEsp(d);
  readEsp();
  soundAlarm();                     // ~500 ms, replaces the old delay(500)
}
