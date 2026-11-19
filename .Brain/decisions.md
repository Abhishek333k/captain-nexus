# SilenVault Mobility & Taxi Infrastructure - Architectural Decisions

## 1. Domain & Multi-Zone Topology

| Subdomain | Environment / Zone | Directory | Firebase Target | Firebase Site ID | Production URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `taxi.silenvault.com` | Fleet Directory Landing Page | `Zone Taxi Home/` | `taxi-landing` | `silenvault-taxi` | `https://silenvault-taxi.web.app` |
| `rapido.taxi.silenvault.com` | Rapido Public Operations Directory | `Zone Rapido/` | `taxi-rapido` | `silenvault-taxi-rapido` | `https://silenvault-taxi-rapido.web.app` |
| `admin.taxi.silenvault.com` | Operations Control Plane (Unified Admin) | `Zone Admin/` | `taxi-admin` | `silenvault-taxi-admin` | `https://silenvault-taxi-admin.web.app` |
| *(Future: Uber, Ola)* | Upcoming Fleet Platforms | `Zone <Fleet>/` | *(Dedicated)* | *(Dedicated)* | `https://<fleet>.taxi.silenvault.com` |

---

## 2. Evolution & What Changed (What Turned Into What)

### Repository Reorganization:
- **`taxi-landing/`** &rarr; **`Zone Taxi Home/`**: Clean, functional transit index. Stripped of vanity labels, pulse animations, and marketing buzzwords. Direct navigation portal for transit operators and commuters.
- **`Zone-A-Public/`** &rarr; **`Zone Rapido/`**: Completely air-gapped public directory. Zero administrative write capabilities. Fully mobile-responsive dual-mode (List/Map toggle) with Google Play / Capacitor touch compliance (`select-none`, safe areas).
- **`Zone-B-Admin/`** &rarr; **`Zone Admin/`**: Unified multi-fleet control plane with modular dashboard card switcher.

### Core Architectural Decisions:
1. **Air-Gapped Dual-Zone Security**:
   - `Zone Rapido` has zero admin components or authentication write paths.
   - `Zone Admin` enforces a hard gate: only `mabhishekramesh1@gmail.com` and `@silenvault.com` can authenticate or write to Firestore. Any other account is immediately expelled via `signOut(auth)`.
2. **Dynamic Route & Boundary Engine**:
   - Precomputed boundary caching with localStorage fallback (`30-day TTL`).
   - Nominatim municipal polygon queries for dynamic boundary discovery.
   - Ray-casting point-in-polygon verification to test if users/captains are inside official municipal bounds.
   - Dual-tier distance: instant Haversine sorting followed by asynchronous 25-node batch driving route calculations via OSRM Table API.
3. **Hexagons Default OFF**:
   - Surge/demand hexagon overlay set to default `OFF` to prevent visual clutter on initial load.
4. **Operations Cloud Dropbox**:
   - Switched from volatile local browser memory to **Cloud Firestore** (`dropbox_payloads`).
   - Staging for raw, unparsed spreadsheets and statutory files, accessible across localhost and production without destructive regex auto-parsing.
5. **Interactive Spotlight Tour**:
   - Gaming-style element spotlighting with darkened overlay and dynamic anchoring next to each DOM section.
6. **City Office Physical Address Architecture & Persistence**:
   - `City` schema in `Zone Rapido` expanded with `address`, `landmarkNote`, and `pincode`.
   - Admin city editor (`CityEditModal.tsx`) and new city registration form equipped with dedicated physical office address inputs, separating statutory address from operational demand notes.
   - City additions, edits, and active status toggles automatically persist to Cloud Firestore (`/cities` collection) with local storage fallback, broadcasting live updates directly from `Zone Admin` to `Zone Rapido`.
   - City directory cards and MapView Leaflet popups display physical city office addresses with dedicated iconography and landmark hints.
7. **Purge of Developer & Marketing Vanity Jargon**:
   - Eliminated technical jargon ("CIN", "MCA filings", "Haversine sort", "municipal boundary polygon", "Firestore DB sync") from public-facing UI modals, banners, and landing pages. Replaced with clear, user-facing transit terminology.
8. **Map Attribution & Watermark Purge**:
   - Leaflet watermark and attribution control overlay (`.leaflet-control-attribution`, `.leaflet-attribution-flag`) completely removed via `attributionControl={false}` and forced CSS suppression (`display: none !important`), keeping map canvas clean and institutional.
9. **Invisible Monetization Cell Positioning**:
   - Positioned `<AdBanner />` after the scrollable list container, pinned at the bottom of the sidebar.
   - Guarded against AdSense policy violations (rejecting forced 5-min timer modal popups which trigger account strikes).
   - Component remains 100% invisible (`return null;` / zero height) until live ad content is served from Google AdSense.
10. **Admin Whitelist & Identity Leak Purge**:
   - Completely stripped all visible administrator email whitelists, partial credentials, and revealing UI hints from `AdminLogin.tsx`.
   - Error messages standardized to generic security notifications without echoing user identity.
11. **Dynamic City Count Purge**:
   - Eradicated all fixed city count references ("95", "95+", "Cities (95)") from public portals (`Zone Taxi Home` and `Zone Rapido`) because operating cities expand dynamically via Firestore.
12. **Google Maps-Style Selectable Text & 1-Click Clipboard Actions**:
   - Enabled `-webkit-user-select: text !important; user-select: text !important;` across map tooltips, popups, and city cards.
   - Inactive cities are fully visible, selectable, and copiable with `Inactive Hub / Service Zone` markers.
   - Injected 1-click clipboard copy buttons for City Name, Office Address, and Coordinates.
13. **Disambiguation for Identical / Regional Location Names**:
   - Solved ambiguous names (e.g., Tadepalli, Narayanpet, Parvathipuram, Bilaspur) by parsing Nominatim `county` (District) and `state` details.
   - Titles are qualified with `(District, State)`, and debounced requests employ `AbortController` and 5s timeouts (complying with performance rules).

14. **Community Discrepancy & Address Reporting Pipeline (Implemented)**:
   - Built `ReportDiscrepancyModal.tsx` in `Zone Rapido` allowing public commuters and captains to suggest moved office addresses, new operating hubs, or boundary shifts directly into Cloud Firestore (`/feedback_reports`).
   - Built `FeedbackReportsTab.tsx` in `Zone Admin` allowing administrators to triage, review, and 1-click apply reported addresses directly into `/cities` documents or dismiss them.
   - Deployed updated `firestore.rules` allowing public creation of reports with schema string validation, and admin-only management.
15. **Performance, Skeletons, and Network Guardrails (Implemented)**:
   - Built `CityCardSkeleton.tsx` for animated skeleton states during search and distance calculations (Rules 1 & 15 of `vibe-codded app rules.txt`).
   - Injected in-memory `Map` caching (`sessionBoundaryCache`, `roadDistanceCache`) and 5-6 second `AbortController` timeouts on all external Nominatim and OSRM API calls to prevent UI thread lockups and duplicate requests (Rules 3 & 13).
   - Created Web App Manifests (`manifest.json`) in `Zone Rapido` and `Zone Taxi Home` configured for `standalone` display mode, meeting Capacitor and Google Play standards.
   - Sanitized admin header user display (`Authenticated Session`) to prevent personal email leaks in screenshots or production recordings.

---

## 3. Catalog of Parked Suggestions & Future Fleet Expansions

1. **Pre-computed Edge-Cached TopoJSON / Municipal Boundaries**:
   - Pre-download and compress boundary polygons for all operating cities into Cloud Storage / CDN to eliminate Nominatim external rate limits.
2. **Offline Service Worker / PWA Caching**:
   - Full service worker with cache-first strategy for city directory and base map tiles, enabling offline lookups in network-dead zones.
3. **Multi-Fleet Dataset Activation (Uber India & Ola Cabs)**:
   - Dedicated Firestore collections (`/uber_cities`, `/ola_cities`) and datasets to activate the pending fleet cards in `Zone Admin` and `Zone Taxi Home`.
4. **Web Worker Spatial Offloading (`geoWorker.ts`)**:
   - Move ray-casting point-in-polygon checks and Haversine matrix sorting into a dedicated Web Worker for 60 FPS performance on lower-tier mobile chipsets.
