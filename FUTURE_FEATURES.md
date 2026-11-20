# Captain Nexus - Future Features & Backlog

This document tracks all planned, suggested, and parked features for the **SilenVault Mobility / Captain Nexus** transit infrastructure across `taxi.silenvault.com`, `rapido.taxi.silenvault.com`, and `admin.taxi.silenvault.com`.

> [!NOTE]
> **Current Project Status (as of November 2026)**:
> All core map enhancements, selectable/copiable Google Maps-style text, location disambiguation, community feedback pipes, admin leak purges, PWA manifests, and **18 scavenged physical office addresses** are fully built, verified, deployed, and live on Firebase Hosting.
> **Service Coverage Clarification**: Having a verified physical city office address vs. not having one does not indicate absence of service in that city. All operating cities retain full active transit coverage regardless of physical office listings.

---

## 1. Physical Office Address Ingestion Progress

| Item | Description | Current State | Action Required |
| :--- | :--- | :--- | :--- |
| **Scavenged Vault Addresses (18 Hubs)** | Addresses for Agra, Ahmedabad, Aligarh, Amritsar, Anantapur, Asansol, Bengaluru (HSR & HQ), Bareilly, Bhopal, Bhubaneswar, Bilaspur, Chandigarh, Chennai, Coimbatore, Dehradun, Delhi NCR (Kotla Mubarakpur, Noida Sec 6, Gurugram Sec 30). | **Integrated & Live**: Populated in `cities.ts` and `offices.ts` with pinpoint coordinates, landmarks, pin codes, and driving distance routing. | Maintain real-time sync with field reports. |
| **Remaining Tier-2/Tier-3 Operating Hubs** | Verify and populate statutory branch office addresses, landmarks, and pin codes for remaining active cities. | Cities retain active operational service status (`active: true`), bike/auto/cab services, and boundary routing without physical address display. | Ingest remaining addresses into Admin Dropbox as ground data arrives. |

---

## 2. Platform Expansions (Multi-Fleet Activation)

### 2.1 Uber India Fleet Integration
- **Objective**: Activate the currently locked Uber India card in `Zone Taxi Home` and `Zone Admin`.
- **Requirements**:
  - Research and compile official Uber India operating cities and airport coverage zones.
  - Create dedicated Cloud Firestore collection (`/uber_cities`).
  - Add Uber Fleet view tab in `Zone Admin` and public directory in `Zone Taxi Home` / dedicated subdomain (`uber.taxi.silenvault.com`).

### 2.2 Ola Mobility Fleet Integration
- **Objective**: Activate the currently locked Ola Cabs card in `Zone Taxi Home` and `Zone Admin`.
- **Requirements**:
  - Research and compile ANI Technologies / Ola operating clusters and vehicle tiers (Mini, Prime, Auto, Bike).
  - Create dedicated Cloud Firestore collection (`/ola_cities`).
  - Add Ola Fleet view tab in `Zone Admin` and public directory in `Zone Taxi Home` / dedicated subdomain (`ola.taxi.silenvault.com`).

---

## 3. Performance & Spatial Computing Enhancements

### 3.1 Pre-computed Edge-Cached TopoJSON / Municipal Boundaries
- **Objective**: Eliminate all dependence on the external OpenStreetMap Nominatim API.
- **Details**:
  - Download and compress boundary polygons for all operating cities into high-efficiency TopoJSON.
  - Host files on Firebase Cloud Storage or Cloudflare CDN.
  - Zero network latency for boundary polygon rendering and ray-casting.

### 3.2 Offline Service Worker & Full PWA Caching
- **Objective**: Full offline functionality for drivers and commuters in low/zero connectivity areas.
- **Details**:
  - Web App Manifests are already linked (`manifest.json`).
  - Next step: Register a custom Service Worker with a `cache-first` strategy for static city metadata, office addresses, and base Leaflet map tiles.

### 3.3 Web Worker Spatial Math Offloading (`geoWorker.ts`)
- **Objective**: Maintain consistent 60 FPS UI responsiveness on entry-level Android devices.
- **Details**:
  - Offload ray-casting point-in-polygon math and Haversine matrix sorting into a dedicated Web Worker thread.
  - Keeps the main UI thread 100% free for map panning and touch gestures.

---

## 4. Operational & Community Workflow Enhancements

### 4.1 Admin Notification Alerts for Discrepancy Reports
- **Objective**: Instant notification when a captain or commuter reports a moved office or boundary change.
- **Details**:
  - Connect a Cloud Function to Firestore `/feedback_reports` on `create`.
  - Dispatch a lightweight webhook notification (Telegram bot or email) to operations personnel.

### 4.2 Bulk Review & Export in Admin Console
- **Objective**: Bulk triage of community reports in `Zone Admin/src/components/FeedbackReportsTab.tsx`.
- **Details**:
  - Multi-select checkboxes to approve or dismiss multiple community reports simultaneously.
  - CSV export for verified city addresses and discrepancy audit history.

---

## 5. Monetization & AdSense Integration

### 5.1 Google AdSense Activation
- **Objective**: Monetize high-volume search traffic without violating Google Publisher policies.
- **Details**:
  - Non-intrusive ad placeholder cell (`<AdBanner />`) is already positioned after the scrollable list container, invisible until configured.
  - Once Google AdSense account approval is confirmed, input the publisher client ID (`data-ad-client`) and ad slot ID (`data-ad-slot`) into `AdBanner.tsx`.
  - Strictly adhere to Better Ads Standards: no timed popups or blocking overlays.

