# Olongapo City Civic Operations Terminal

**Date:** 2026-11-10  
**Status:** Approved direction; ready for implementation planning

## Context

FloodControl is a Vite/React disaster-risk dashboard with sign-in, overview, live map, sensor network, predictive analytics, and alert-management surfaces. The current implementation is functional but visually generic: rounded SaaS cards, a cyan-heavy palette, and San Isidro City copy do not communicate the intended Olongapo City setting.

The redesign is based on the information hierarchy and civic identity of the official [Olongapo City website](https://olongapocity.gov.ph/): clear numbered sections, direct access to services and emergency information, and prominent city identity. It will remain a dark-mode operational product rather than copying the public website's light editorial presentation.

## Problem statement

Make the existing flood-monitoring workflow feel like a credible Olongapo City operations tool while preserving its current interactions and demo data model.

## Design direction

### Chosen anchor: Industrial

The product is used for time-sensitive monitoring and coordination, so the visual system should prioritize scanability, tabular numerics, status clarity, and durable contrast. The Industrial anchor gives the UI a confident operational character without relying on decorative gradients or generic SaaS softness.

### Differentiator: city fieldboard

Every primary surface uses a numbered folio (`01`, `02`, `03`) and a thin rule system inspired by the reference site's numbered civic sections. The Olongapo seal stays visible in the shell, so the dashboard reads as a city instrument rather than an anonymous analytics product.

### Tokens

- Surface: warm black `#0B0C0A`, with near-black `#050605` for the shell and charcoal `#141714` for raised regions.
- Primary signal: amber `#FFB800`; use it for active navigation, current readings, focus rings, and the most important operational call-to-actions.
- Semantic support: restrained neutral tones for normal states; retain explicit status text for `Critical`, `Warning`, `Watch`, and `Normal`. Critical alerts may use a narrowly scoped red treatment for safety comprehension, but the overall system remains amber-led.
- Rules: 1px rgba white/amber hairlines; no soft card shadows.
- Typography: IBM Plex Mono for display, body, labels, and tabular numerics. Use tabular numerals for readings and forecast values.
- Geometry: mostly squared containers with minimal 2px rounding; avoid pill-heavy UI and large rounded cards.
- Texture: restrained grid rules and an image scrim on the sign-in banner. No grain or ornamental noise.

## Asset plan

Use official public assets from `olongapocity.gov.ph` and store implementation copies under `floodcontrol-frontend/public/assets/olongapo/`:

- `logo-olongapo.png` as the shell and sign-in identity mark.
- `main-banner.png` as the sign-in contextual banner, darkened with an overlay so form contrast remains high.

The banner is used as context, not as a data visualization or emergency claim. Images must have meaningful alt text, and decorative use must be marked as such. Avoid using the mayor portrait as a generic hero because it is not necessary for the flood-operations workflow.

## Information architecture

The current routes and state model remain intact. The visible shell is reorganized as follows:

1. **Sign in / registration** — Olongapo identity, role selection, existing demo access, and clear demo-environment disclosure.
2. **Overview (`01`)** — greeting, sensor filter, KPI strip, live flood map, active alerts, forecast, sensor health, response readiness.
3. **Live Map (`02`)** — filters, map, legend, selected sensor detail, and map export action.
4. **Sensor Network (`03`)** — district filters, device table, connectivity, battery, and service status.
5. **Predictive Analytics (`04`)** — period selector, sensor selector, forecast chart, risk summary, model inputs, comparison table.
6. **Alert Management (`05`)** — incident queue, dispatch/resolution actions, response-team status, and public advisory.

The left rail contains the Olongapo mark, product name, numbered navigation, system status, settings/sign-out actions, and the authenticated user block. The top bar contains the current surface name, city/environment context, live-data status, search, notifications, and the mobile navigation trigger.

## Component changes

- `AuthScreen`: replace the generic iFlood lockup and San Isidro copy with Olongapo City Flood Control identity; add official seal/banner treatment; preserve login/sign-up, role selection, validation, and demo buttons.
- `DashboardNavigation`: introduce numbered labels, official seal lockup, Olongapo City naming, and the Industrial active-state treatment; preserve alert count and mobile drawer behavior.
- `DashboardShell`: restyle header, page background, notification tray, and content frame; preserve notification toggle/dismissal and responsive behavior.
- `DashboardOverview`: add the numbered folio, restyle KPI strip, map, alert rail, forecast, sensor health, and response readiness using flat rules and amber signal emphasis; preserve sensor selection, filters, and alert acknowledgement.
- `DashboardWorkspace`: apply the same folio/rule system to all secondary surfaces; preserve filtering, selected sensor state, forecast periods, sensor comparison, dispatch, and resolution interactions.
- Shared UI (`Button`, `PageHeading`, `TextField`, `Row`, `Icon`): centralize focus styling and typography assumptions so all surfaces remain consistent.
- `index.css`: define the Industrial tokens, local font loading/import, background rule utilities, selection colors, and any small entrance/focus animations.

## Content rules

- Replace product-context references to `San Isidro City` with `Olongapo City`.
- Keep existing sensor readings and forecast values as demo data; expose a small `Demo environment` label where users could mistake them for live city telemetry.
- Keep standard action labels such as `Sign in`, `Create account`, `Export map`, `Download report`, `Dispatch`, and `Resolve`.
- Do not introduce fabricated official departments, hotlines, street closures, or city statistics. Existing mock values may remain when visually useful, but should be presented as demo telemetry.
- Use real icons from the existing SVG icon component; do not substitute unicode glyphs.

## Interaction and accessibility

- Preserve all current click and form behaviors.
- Keep keyboard focus visible with an amber outline and sufficient offset against the dark background.
- Preserve accessible button labels for icon-only controls and meaningful alt text for official imagery.
- Maintain responsive behavior at mobile, tablet, and desktop widths; the rail becomes a drawer on smaller screens.
- Use animation sparingly: a short staggered reveal for major sections and subtle status pulses only where they communicate live state. Respect `prefers-reduced-motion`.
- Maintain contrast for body text, status labels, form controls, and critical actions in the dark theme.

## Verification criteria

- `npm run frontend:build` succeeds from the repository root.
- `npm test` and `npm run typecheck` remain green.
- The sign-in flow, demo access, navigation, filters, sensor selection, alert acknowledgement, dispatch/resolution, and forecast selectors still work.
- No remaining product-identity copy says `San Isidro City`.
- The UI is dark across every state and viewport; no light-mode fallback appears in forms, tables, selects, or browser focus states.
- Official assets load from local `public/assets/olongapo/` paths and do not block the build if an image fails to load.
- The redesigned surfaces visibly use the numbered fieldboard motif, amber signal palette, flat rules, IBM Plex Mono typography, and Olongapo identity.

## Non-goals

- No new backend or live sensor integration.
- No changes to the prediction algorithm or test fixtures.
- No route or state-management rewrite.
- No public-site recreation beyond the visual cues and official assets needed to establish city identity.
