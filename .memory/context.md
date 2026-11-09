# SilenVault Mobility - Project Context & Operational Specifications

## 1. Problem Statement & Scope
Captains and commuters applying or searching from rural, peripheral, or unmapped pin-codes across India need to determine:
1. Nearest active operational city hub.
2. Accurate road driving distance (not just straight-line distance).
3. Whether they fall strictly inside or outside the official municipal boundary.
4. Physical registered legal statutory offices for documentation and in-person verification.

---

## 2. Infrastructure & Hosting
- **Dedicated Firebase Project**: `captain-nexus-199cc` (Project #`770635003132`)
- **DNS Host**: Cloudflare (CNAME records, SSL verification via Grey Cloud)
- **Active Subdomains**:
  - `taxi.silenvault.com` &rarr; `silenvault-taxi.web.app`
  - `rapido.taxi.silenvault.com` &rarr; `silenvault-taxi-rapido.web.app`
  - `admin.taxi.silenvault.com` &rarr; `silenvault-taxi-admin.web.app`
- **Database**: Cloud Firestore (`cities`, `offices`, `boundaries`, `dropbox_payloads`)

---

## 3. UI/UX & Power Features
- **Vector Emblems & Splash Screens**:
  - Custom geometric helmet vector for Rapido directory boot.
  - Official SilenVault brand emblem for Admin control plane.
- **Keyboard Shortcuts**:
  - `Ctrl + F` / `Cmd + F`: Focuses and selects search input directly.
  - `Esc`: Clears active city selection and dismisses modals.
- **Interactive Spotlight Guide (`?` Button)**:
  - Step-by-step gaming-style HUD spotlighting with animated cutout around the active DOM element.
- **Admin In-Place City Editor**:
  - Direct modal for updating city names, coordinates, notes, services (`bike`, `auto`, `cab`, `tuk_tuk`, `e_rickshaw`, `b2b`), and active toggles.
- **Operations Cloud Dropbox**:
  - Persistent staging vault for raw spreadsheets and statutory exports in Firestore.
