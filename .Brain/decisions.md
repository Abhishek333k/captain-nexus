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
- **`taxi-landing/`** &rarr; **`Zone Taxi Home/`**: Animated transport network directory. Stripped of vanity buttons or admin links. Direct entry point to live fleets.
- **`Zone-A-Public/`** &rarr; **`Zone Rapido/`**: Completely air-gapped public directory. Zero administrative write capabilities.
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
   - Staging for raw, unparsed spreadsheets and statutory files, accessible across localhost and production.
5. **Interactive Spotlight Tour**:
   - Gaming-style element spotlighting with darkened overlay and dynamic anchoring next to each DOM section.
6. **City Office Physical Address Architecture & Persistence**:
   - `City` schema in `Zone Rapido` expanded with `address`, `landmarkNote`, and `pincode`.
   - Admin city editor (`CityEditModal.tsx`) and new city registration form equipped with dedicated physical office address inputs, separating statutory address from operational demand notes.
   - City additions, edits, and active status toggles automatically persist to Cloud Firestore (`/cities` collection) with local storage fallback, broadcasting live updates directly from `Zone Admin` to `Zone Rapido`.
   - City directory cards and MapView Leaflet popups display physical city office addresses with dedicated iconography and landmark hints.
