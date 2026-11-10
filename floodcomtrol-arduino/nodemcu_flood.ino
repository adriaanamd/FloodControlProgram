// =====================================================
// NodeMCU (ESP8266) - WiFi dashboard for the flood sensor
// - Shows live readings from the Arduino Uno
// - Lets you change settings, test / mute the buzzer
//   (the Uno saves settings in its EEPROM)
//
// Wiring:
//   Uno D11 -> 1k -> NodeMCU D7, NodeMCU D7 -> 2k -> GND
//   NodeMCU D1 -> 1k -> Uno D12
//   Uno 5V -> NodeMCU Vin, Uno GND -> NodeMCU G
//
// Board: NodeMCU 1.0 (ESP-12E Module)
// =====================================================

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <SoftwareSerial.h>

// ---------- WiFi (2.4 GHz only) ----------
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// ---------- Link to Uno ----------
SoftwareSerial unoSerial(D7, D1);   // RX = D7 (from Uno), TX = D1 (to Uno D12)
const unsigned long DATA_TIMEOUT_MS = 10000;
const unsigned long IP_SEND_MS      = 5000;
const unsigned long RETRY_MS        = 2500;   // resend settings until Uno confirms
const uint8_t       MAX_TRIES       = 8;

// Must match the Uno's limits
const float MIN_CM = 25.0;
const float MAX_CM = 450.0;

ESP8266WebServer server(80);

// ---------- Latest data from Uno ----------
float rawCm = NAN, distCm = NAN, levelCm = NAN, tempC = NAN;
bool tempOk = false;
int okCount = 0, samples = 15;
String statusText = "WAITING";
int rainValue = -1;
String rainText = "UNKNOWN";
unsigned long lastDataMs = 0;
bool gotData = false;
String lineBuf;
unsigned long lastIpSend = 0;

// ---------- Settings ----------
struct Cfg {
  float h, w, d;     // sensor height, warning level, danger level (cm)
  int bz;            // buzzer on (1) / off (0)
  int rl, rh;        // rain light / heavy thresholds
};

Cfg unoCfg;                         // what the Uno says it is using
bool haveCfg = false;
long muteLeftAtRx = 0;              // mute seconds left when last CFG arrived
unsigned long lastCfgMs = 0;

Cfg wanted;                         // what the dashboard asked for
bool setPending = false;
uint8_t setTries = 0;
unsigned long lastSetSend = 0;
String setState = "idle";           // idle / saving / saved / failed

long muteWanted = 0;                // minutes; 0 = unmute
bool mutePending = false;
uint8_t muteTries = 0;
unsigned long lastMuteSend = 0;

// =====================================================
// Web page
// =====================================================
const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Flood Sensor</title>
<style>
 *{box-sizing:border-box}
 body{font-family:Arial,sans-serif;background:#f2f4f7;margin:0;padding:16px;color:#222}
 .card{background:#fff;max-width:420px;margin:0 auto 16px;border-radius:14px;padding:18px;
       box-shadow:0 2px 8px rgba(0,0,0,.12)}
 h2{margin:0 0 10px;text-align:center}
 h3{margin:0 0 12px;font-size:18px}
 .center{text-align:center}
 .lvl{font-size:56px;font-weight:bold;margin:6px 0}
 .unit{font-size:22px;color:#666}
 .status{display:inline-block;padding:8px 18px;border-radius:20px;color:#fff;
         font-weight:bold;font-size:20px;margin-bottom:8px}
 table{width:100%;font-size:16px;border-collapse:collapse;margin-top:10px}
 td{padding:6px;border-top:1px solid #eee}
 td:last-child{text-align:right;font-weight:bold}
 .small{color:#888;font-size:13px;margin-top:8px}
 .bar{position:relative;height:18px;background:#e9ecef;border-radius:9px;overflow:hidden;margin-top:6px}
 .fill{height:100%;width:0;background:#2e9e44;transition:width .5s}
 .mark{position:absolute;top:0;bottom:0;width:3px}
 .legend{display:flex;justify-content:space-between;font-size:12px;color:#888;margin-top:4px}
 label{display:block;font-size:14px;color:#555;margin:10px 0 4px}
 input[type=number]{width:100%;padding:10px;font-size:16px;border:1px solid #ccc;border-radius:8px}
 .row{display:flex;gap:10px}
 .row>div{flex:1}
 button{padding:11px 14px;font-size:15px;border:0;border-radius:8px;background:#1c7ed6;color:#fff;
        cursor:pointer;margin-top:10px}
 button.grey{background:#868e96}
 button.red{background:#e03131}
 button:disabled{opacity:.5}
 .btns{display:flex;flex-wrap:wrap;gap:8px}
 .btns button{flex:1;min-width:120px}
 .hint{font-size:12px;color:#888;margin-top:3px}
 .switch{display:flex;align-items:center;justify-content:space-between;font-size:16px}
 .switch input{width:52px;height:28px}
 #msg{min-height:20px;margin-top:10px;font-size:14px}
</style></head><body>

<div class="card center">
 <h2>Flood Level Monitor</h2>
 <div id="status" class="status" style="background:#999">LOADING</div>
 <div class="lvl"><span id="lvl">--</span> <span class="unit">cm</span></div>
 <div style="color:#666">Water level</div>
 <div class="bar">
  <div class="fill" id="fill"></div>
  <div class="mark" id="mw" style="background:#f39c12"></div>
  <div class="mark" id="md" style="background:#e03131"></div>
 </div>
 <div class="legend"><span>0 cm</span><span>orange = warning, red = danger</span><span id="lmax">--</span></div>
 <table>
  <tr><td>Rain</td><td id="rain">--</td></tr>
  <tr><td>Distance to surface</td><td id="dist">--</td></tr>
  <tr><td>Raw median</td><td id="raw">--</td></tr>
  <tr><td>Air temperature</td><td id="temp">--</td></tr>
  <tr><td>Good pings</td><td id="ok">--</td></tr>
 </table>
 <div class="small" id="age">Waiting for data...</div>
</div>

<div class="card">
 <h3>Alarm</h3>
 <div class="switch"><span>Buzzer enabled</span><input type="checkbox" id="bz" disabled></div>
 <div class="hint" id="mutetxt">--</div>
 <div class="btns">
  <button id="test" disabled>Test buzzer</button>
  <button id="m10" class="grey" disabled>Mute 10 min</button>
  <button id="m30" class="grey" disabled>Mute 30 min</button>
  <button id="um" class="grey" disabled>Unmute</button>
 </div>
</div>

<div class="card">
 <h3>Settings</h3>
 <div id="wait" class="hint">Waiting for settings from Arduino...</div>

 <label for="h">Sensor height (cm)</label>
 <input type="number" id="h" step="0.1" min="30" max="450">
 <div class="hint">Distance from the sensor face down to the dry ground / "0 cm water" point.</div>
 <button id="zero" class="grey" disabled>Use current distance as height</button>
 <div class="hint">Only press this when there is NO water under the sensor.</div>

 <div class="row">
  <div><label for="w">Warning level (cm)</label>
   <input type="number" id="w" step="0.5" min="0.5"></div>
  <div><label for="d">Danger level (cm)</label>
   <input type="number" id="d" step="0.5" min="1"></div>
 </div>
 <div class="hint">Highest level the sensor can measure: <b id="maxlvl">--</b> (blind zone is 25 cm).</div>

 <div class="row">
  <div><label for="rl">Light rain below</label>
   <input type="number" id="rl" step="1" min="2" max="1023"></div>
  <div><label for="rh">Heavy rain below</label>
   <input type="number" id="rh" step="1" min="1" max="1022"></div>
 </div>
 <div class="hint">Rain sensor value: lower = wetter. Current value: <b id="rainnow">--</b></div>

 <div class="btns">
  <button id="save" disabled>Save settings</button>
  <button id="revert" class="grey" disabled>Undo changes</button>
 </div>
 <div id="msg"></div>
</div>

<script>
const $=id=>document.getElementById(id);
const colors={NORMAL:'#2e9e44',WARNING:'#f39c12',DANGER:'#e03131',CRITICAL:'#8b0000',
              'NO READING':'#888','NO DATA':'#555',WAITING:'#888',STARTING:'#888'};
const rainColors={DRY:'#2e9e44',LIGHT:'#1c7ed6',HEAVY:'#e03131'};
const fields=['h','w','d','rl','rh'];
let dirty=false, awaiting=false, last=null;

function f(v,u){return v===null?'--':v.toFixed(1)+' '+u;}
function msg(t,ok){const m=$('msg');m.textContent=t;
  m.style.color=ok===false?'#e03131':(ok?'#2e9e44':'#555');}
function enable(on){['bz','test','m10','m30','um','zero','save','revert']
  .forEach(id=>$(id).disabled=!on);}

function fillForm(c){
  if(!c||dirty)return;
  $('h').value=c.h;$('w').value=c.w;$('d').value=c.d;$('rl').value=c.rl;$('rh').value=c.rh;
  hint();
}
function hint(){const h=parseFloat($('h').value);
  $('maxlvl').textContent=isNaN(h)?'--':(h-25).toFixed(1)+' cm';}
fields.forEach(id=>$(id).addEventListener('input',()=>{dirty=true;hint();msg('Unsaved changes');}));

function check(){
  const h=+$('h').value,w=+$('w').value,d=+$('d').value,rl=+$('rl').value,rh=+$('rh').value;
  if(!(h>=30&&h<=450))return 'Sensor height must be 30-450 cm';
  if(!(w>0))return 'Warning level must be above 0';
  if(!(d>w))return 'Danger level must be higher than warning level';
  if(d>h-25)return 'Danger level can be at most '+(h-25).toFixed(1)+' cm for this height';
  if(!(rh>0&&rl>rh&&rl<=1023))return 'Heavy rain value must be lower than light rain value (1-1023)';
  return null;
}

async function post(url,data){
  const r=await fetch(url,{method:'POST',body:new URLSearchParams(data||{})});
  let j={};try{j=await r.json();}catch(e){}
  if(!r.ok||!j.ok)throw new Error(j.msg||'Request failed');
  return j;
}

$('save').onclick=async()=>{
  const err=check(); if(err){msg(err,false);return;}
  try{await post('/set',{h:$('h').value,w:$('w').value,d:$('d').value,
                         rl:$('rl').value,rh:$('rh').value});
      awaiting=true;msg('Sending to Arduino...');}catch(e){msg(e.message,false);}
};
$('revert').onclick=()=>{dirty=false;if(last)fillForm(last.cfg);msg('');};
$('zero').onclick=async()=>{
  if(!last||last.distance===null){msg('No distance reading right now',false);return;}
  if(!confirm('Set sensor height to '+last.distance.toFixed(1)+
      ' cm?\nOnly do this when there is NO water under the sensor.'))return;
  try{await post('/zero');dirty=false;awaiting=true;msg('Sending to Arduino...');}
  catch(e){msg(e.message,false);}
};
$('bz').onchange=async()=>{
  try{await post('/set',{bz:$('bz').checked?1:0});awaiting=true;
      msg($('bz').checked?'Turning buzzer on...':'Turning buzzer off...');}
  catch(e){msg(e.message,false);}
};
$('test').onclick=async()=>{try{await post('/test');msg('Test beep sent (plays after the next reading)',true);}
  catch(e){msg(e.message,false);}};
$('m10').onclick=()=>mute(10);
$('m30').onclick=()=>mute(30);
$('um').onclick=()=>mute(0);
async function mute(m){try{await post('/mute',{m:m});msg(m?'Muting...':'Unmuting...');}
  catch(e){msg(e.message,false);}}

function drawBar(j){
  const c=j.cfg; if(!c){return;}
  const max=c.h-25; const lv=j.level===null?0:j.level;
  const pct=v=>Math.max(0,Math.min(100,v/max*100));
  $('fill').style.width=pct(lv)+'%';
  $('fill').style.background=colors[j.status]||'#2e9e44';
  $('mw').style.left=pct(c.w)+'%';
  $('md').style.left=pct(c.d)+'%';
  $('lmax').textContent=max.toFixed(0)+' cm';
}

async function upd(){
 try{
  const j=await (await fetch('/data')).json(); last=j;
  $('lvl').textContent=j.level===null?'--':j.level.toFixed(1);
  $('dist').textContent=f(j.distance,'cm');
  $('raw').textContent=f(j.raw,'cm');
  $('temp').textContent=f(j.temp,'C')+(j.tempOk?'':' (error)');
  $('ok').textContent=j.ok+' / '+j.samples;
  const r=$('rain');
  r.textContent=j.rain<0?'--':j.rainText+' ('+j.rain+')';
  r.style.color=rainColors[j.rainText]||'#333';
  $('rainnow').textContent=j.rain<0?'--':j.rain;
  const s=$('status');
  s.textContent=j.status; s.style.background=colors[j.status]||'#888';
  $('age').textContent=j.age<0?'No data from Arduino yet':'Updated '+j.age+' s ago';

  if(j.cfg){
    $('wait').style.display='none'; enable(true);
    if(j.setState!=='saving'){ $('bz').checked=j.cfg.bz==1; fillForm(j.cfg); }
    $('mutetxt').textContent=j.mute>0
      ?'Muted: '+Math.floor(j.mute/60)+' min '+(j.mute%60)+' s left'
      :(j.cfg.bz==1?'Not muted':'Buzzer is off');
    drawBar(j);
  }else{ enable(false); $('wait').style.display='block'; }

  if(awaiting){
    if(j.setState==='saved'){awaiting=false;dirty=false;fillForm(j.cfg);msg('Saved on Arduino',true);}
    else if(j.setState==='failed'){awaiting=false;msg('Arduino did not confirm. Check the D1 -> D12 wire and try again.',false);}
  }
 }catch(e){
  const s=$('status'); s.textContent='OFFLINE'; s.style.background='#555';
 }
}
setInterval(upd,2000); upd();
</script></body></html>
)rawliteral";

// =====================================================
// Helpers
// =====================================================
String jsonNum(float v) {
  return isnan(v) ? String("null") : String(v, 1);
}

float round1(float v) {
  return roundf(v * 10.0f) / 10.0f;
}

bool validCfg(const Cfg &c, String &msg) {
  if (isnan(c.h) || c.h < MIN_CM + 5.0 || c.h > MAX_CM) { msg = "Sensor height must be 30-450 cm"; return false; }
  if (isnan(c.w) || c.w <= 0) { msg = "Warning level must be above 0"; return false; }
  if (isnan(c.d) || c.d <= c.w) { msg = "Danger level must be higher than warning level"; return false; }
  if (c.d > c.h - MIN_CM) {
    msg = "Danger level can be at most " + String(c.h - MIN_CM, 1) + " cm for this height";
    return false;
  }
  if (c.rh <= 0 || c.rl <= c.rh || c.rl > 1023) {
    msg = "Heavy rain value must be lower than light rain value (1-1023)";
    return false;
  }
  return true;
}

bool cfgMatches(const Cfg &a, const Cfg &b) {
  return fabs(a.h - b.h) < 0.06 && fabs(a.w - b.w) < 0.06 && fabs(a.d - b.d) < 0.06 &&
         a.bz == b.bz && a.rl == b.rl && a.rh == b.rh;
}

long muteLeftNow() {
  if (!haveCfg) return 0;
  long left = muteLeftAtRx - (long)((millis() - lastCfgMs) / 1000);
  return left > 0 ? left : 0;
}

void sendJson(int code, bool ok, const String &msg) {
  String j = "{\"ok\":" + String(ok ? "true" : "false");
  if (msg.length()) j += ",\"msg\":\"" + msg + "\"";
  j += "}";
  server.send(code, "application/json", j);
}

// =====================================================
// Sending settings / commands to the Uno (with retries)
// =====================================================
void sendSet() {
  unoSerial.print("SET,");
  unoSerial.print(wanted.h, 1);  unoSerial.print(',');
  unoSerial.print(wanted.w, 1);  unoSerial.print(',');
  unoSerial.print(wanted.d, 1);  unoSerial.print(',');
  unoSerial.print(wanted.bz);    unoSerial.print(',');
  unoSerial.print(wanted.rl);    unoSerial.print(',');
  unoSerial.println(wanted.rh);
}

void startSet(const Cfg &c) {
  wanted = c;
  setPending = true;
  setTries = 0;
  lastSetSend = 0;
  setState = "saving";
}

void processPending() {
  if (setPending) {
    if (haveCfg && cfgMatches(unoCfg, wanted)) {
      setPending = false;
      setState = "saved";
    } else if (lastSetSend == 0 || millis() - lastSetSend >= RETRY_MS) {
      if (setTries >= MAX_TRIES) {
        setPending = false;
        setState = "failed";
      } else {
        sendSet();
        setTries++;
        lastSetSend = millis();
      }
    }
  }

  if (mutePending) {
    long left = muteLeftNow();
    bool done = (muteWanted == 0) ? (left == 0) : (left > 0);
    if (done && muteTries > 0) {
      mutePending = false;
    } else if (lastMuteSend == 0 || millis() - lastMuteSend >= RETRY_MS) {
      if (muteTries >= MAX_TRIES) {
        mutePending = false;
      } else {
        unoSerial.print("MUTE,");
        unoSerial.println(muteWanted);
        muteTries++;
        lastMuteSend = millis();
      }
    }
  }
}

// =====================================================
// Web handlers
// =====================================================
void handleRoot() {
  server.send_P(200, "text/html", INDEX_HTML);
}

void handleData() {
  bool fresh = gotData && (millis() - lastDataMs < DATA_TIMEOUT_MS);
  String st = fresh ? statusText : String(gotData ? "NO DATA" : "WAITING");
  long age = gotData ? (long)((millis() - lastDataMs) / 1000) : -1;

  String j = "{";
  j += "\"level\":"    + jsonNum(levelCm) + ",";
  j += "\"distance\":" + jsonNum(fresh ? distCm : NAN) + ",";
  j += "\"raw\":"      + jsonNum(rawCm) + ",";
  j += "\"temp\":"     + jsonNum(tempC) + ",";
  j += "\"tempOk\":"   + String(tempOk ? "true" : "false") + ",";
  j += "\"ok\":"       + String(okCount) + ",";
  j += "\"samples\":"  + String(samples) + ",";
  j += "\"status\":\"" + st + "\",";
  j += "\"rain\":"     + String(rainValue) + ",";
  j += "\"rainText\":\"" + rainText + "\",";
  j += "\"age\":"      + String(age) + ",";
  if (haveCfg) {
    j += "\"cfg\":{";
    j += "\"h\":"  + String(unoCfg.h, 1) + ",";
    j += "\"w\":"  + String(unoCfg.w, 1) + ",";
    j += "\"d\":"  + String(unoCfg.d, 1) + ",";
    j += "\"bz\":" + String(unoCfg.bz) + ",";
    j += "\"rl\":" + String(unoCfg.rl) + ",";
    j += "\"rh\":" + String(unoCfg.rh);
    j += "},";
  } else {
    j += "\"cfg\":null,";
  }
  j += "\"mute\":"     + String(muteLeftNow()) + ",";
  j += "\"setState\":\"" + setState + "\"";
  j += "}";
  server.send(200, "application/json", j);
}

// POST /set  (any of: h, w, d, bz, rl, rh)
void handleSet() {
  if (!haveCfg) { sendJson(503, false, "No settings from Arduino yet"); return; }

  Cfg c = unoCfg;
  if (server.hasArg("h"))  c.h  = round1(server.arg("h").toFloat());
  if (server.hasArg("w"))  c.w  = round1(server.arg("w").toFloat());
  if (server.hasArg("d"))  c.d  = round1(server.arg("d").toFloat());
  if (server.hasArg("bz")) c.bz = server.arg("bz").toInt() ? 1 : 0;
  if (server.hasArg("rl")) c.rl = server.arg("rl").toInt();
  if (server.hasArg("rh")) c.rh = server.arg("rh").toInt();

  String msg;
  if (!validCfg(c, msg)) { sendJson(400, false, msg); return; }

  startSet(c);
  processPending();                 // send right away
  sendJson(200, true, "");
}

// POST /zero  -> sensor height = current distance
void handleZero() {
  if (!haveCfg) { sendJson(503, false, "No settings from Arduino yet"); return; }
  bool fresh = gotData && (millis() - lastDataMs < DATA_TIMEOUT_MS);
  if (!fresh || isnan(distCm)) { sendJson(400, false, "No distance reading right now"); return; }

  Cfg c = unoCfg;
  c.h = round1(distCm);
  String msg;
  if (!validCfg(c, msg)) {
    sendJson(400, false, msg + ". Lower the warning/danger levels first.");
    return;
  }

  startSet(c);
  processPending();
  sendJson(200, true, "");
}

// POST /test  -> buzzer test beep
void handleTest() {
  unoSerial.println("TEST");
  sendJson(200, true, "");
}

// POST /mute?m=minutes  (0 = unmute)
void handleMute() {
  long m = server.hasArg("m") ? server.arg("m").toInt() : 0;
  if (m < 0) m = 0;
  if (m > 120) m = 120;
  muteWanted = m;
  mutePending = true;
  muteTries = 0;
  lastMuteSend = 0;
  processPending();
  sendJson(200, true, "");
}

// =====================================================
// Receive from Uno
// =====================================================
float parseNum(const String &s) {
  if (s.length() == 0 || s == "nan") return NAN;
  return s.toFloat();
}

uint8_t splitCsv(const String &line, String *out, uint8_t maxParts) {
  uint8_t idx = 0;
  unsigned int start = 0;
  for (unsigned int i = 0; i <= line.length() && idx < maxParts; i++) {
    if (i == line.length() || line[i] == ',') {
      out[idx++] = line.substring(start, i);
      start = i + 1;
    }
  }
  return idx;
}

// DATA,raw,distance,level,temp,tempOk,ok,samples,status,rainValue,rainText
void parseData(const String &line) {
  String f[11];
  uint8_t n = splitCsv(line, f, 11);
  if (n < 9) return;

  rawCm      = parseNum(f[1]);
  distCm     = parseNum(f[2]);
  levelCm    = parseNum(f[3]);
  tempC      = parseNum(f[4]);
  tempOk     = (f[5] == "1");
  okCount    = f[6].toInt();
  samples    = f[7].toInt();
  statusText = f[8];
  if (n >= 11) {
    rainValue = f[9].toInt();
    rainText  = f[10];
  }

  lastDataMs = millis();
  gotData = true;

  Serial.print("From Uno: ");
  Serial.println(line);
}

// CFG,height,warn,danger,buzzerOn,rainLight,rainHeavy,muteLeftSec
void parseCfg(const String &line) {
  String f[8];
  if (splitCsv(line, f, 8) < 8) return;

  Cfg c;
  c.h  = parseNum(f[1]);
  c.w  = parseNum(f[2]);
  c.d  = parseNum(f[3]);
  c.bz = f[4].toInt();
  c.rl = f[5].toInt();
  c.rh = f[6].toInt();

  String msg;
  if (!validCfg(c, msg)) return;    // garbled line, wait for the next one

  unoCfg = c;
  muteLeftAtRx = f[7].toInt();
  lastCfgMs = millis();
  haveCfg = true;
}

void readUno() {
  while (unoSerial.available()) {
    char c = unoSerial.read();
    if (c == '\n') {
      lineBuf.trim();
      if (lineBuf.startsWith("DATA,"))     parseData(lineBuf);
      else if (lineBuf.startsWith("CFG,")) parseCfg(lineBuf);
      lineBuf = "";
    } else if (c != '\r') {
      lineBuf += c;
      if (lineBuf.length() > 120) lineBuf = "";   // garbage protection
    }
  }
}

// =====================================================
// Send web address to Uno
// =====================================================
void sendIpToUno() {
  if (millis() - lastIpSend < IP_SEND_MS) return;
  lastIpSend = millis();

  unoSerial.print("IP,");
  if (WiFi.status() == WL_CONNECTED) {
    unoSerial.println(WiFi.localIP().toString());
  } else {
    unoSerial.println("NONE");
  }
}

// =====================================================
// WiFi
// =====================================================
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Connected! Open this in your browser: http://");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi not connected yet - will keep trying in the background.");
  }
}

// =====================================================
// Setup / loop
// =====================================================
void setup() {
  Serial.begin(115200);
  unoSerial.begin(9600);
  delay(200);
  Serial.println();
  Serial.println("NodeMCU flood dashboard starting");

  connectWiFi();

  if (MDNS.begin("floodsensor")) {
    Serial.println("Also available at: http://floodsensor.local");
  }

  server.on("/", HTTP_GET, handleRoot);
  server.on("/data", HTTP_GET, handleData);
  server.on("/set", HTTP_POST, handleSet);
  server.on("/zero", HTTP_POST, handleZero);
  server.on("/test", HTTP_POST, handleTest);
  server.on("/mute", HTTP_POST, handleMute);
  server.begin();
  Serial.println("Web server started");
}

void loop() {
  readUno();
  server.handleClient();
  MDNS.update();
  sendIpToUno();
  processPending();

  static bool wasConnected = WiFi.status() == WL_CONNECTED;
  bool connected = WiFi.status() == WL_CONNECTED;
  if (connected && !wasConnected) {
    Serial.print("WiFi connected: http://");
    Serial.println(WiFi.localIP());
  }
  wasConnected = connected;
}
