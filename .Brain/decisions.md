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

---

## 3. Catalog of Future Features & Parked Suggestions (From Chat History)

1. **Public Discrepancy & Office Update Reporting Pipe**:
   - Allow commuters and captains on `Zone Rapido` to flag relocated office addresses or expanded boundaries directly into Firestore (`/feedback_reports`).
   - Triaged and approved with 1-click in `Zone Admin`.
2. **Pre-computed Edge-Cached TopoJSON / Municipal Boundaries**:
   - Pre-download and compress boundary polygons for all 95 cities into Cloud Storage / CDN to eliminate Nominatim rate limits and latency.
3. **Offline PWA Support**:
   - Service worker with cache-first strategy for the 95-city directory and base map tiles, enabling offline lookups in network-dead zones.
4. **Multi-Fleet Support (Uber India & Ola Cabs)**:
   - Dedicated Firestore collections (`/uber_cities`, `/ola_cities`) and datasets to activate the pending fleet cards in `Zone Admin` and `Zone Taxi Home`.
5. **Web Worker Spatial Offloading (`geoWorker.ts`)**:
   - Move ray-casting point-in-polygon checks and Haversine matrix sorting into a Web Worker to ensure 60 FPS performance on lower-end mobile devices.
6. **Minimal Non-Intrusive Ad / Sponsor Slot**:
   - Non-intrusive ad placeholder card at the end of the city directory list (no popups).
7. **SEO & OpenGraph Metadata**:
   - Dynamic meta tags, OpenGraph previews, and JSON-LD schema (`Place`, `LocalBusiness`) for Indian city office queries on Google.
8. **Dynamic Commute Limit Slider**:
   - Replace the fixed 30km range with a dynamic slider (15km - 50km) per city tier.
