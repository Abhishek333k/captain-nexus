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
  - `taxi.silenvault.com` &rarr; `silenvault-taxi.web.app` (Clean institutional directory landing page)
  - `rapido.taxi.silenvault.com` &rarr; `silenvault-taxi-rapido.web.app` (Mobile-ready public transit portal)
  - `admin.taxi.silenvault.com` &rarr; `silenvault-taxi-admin.web.app` (Protected operations control plane)
- **Database**: Cloud Firestore (`cities`, `offices`, `boundaries`, `dropbox_payloads`, `feedback_reports`)

---

## 3. UI/UX & Compliance Standards
- **Google Play & Capacitor Compliance**:
  - `select-none` on interactive elements to prevent browser-like text selection.
  - Safe-area insets (`pt-[env(safe-area-inset-top)]`, `pb-[env(safe-area-inset-bottom)]`).
  - No pull-to-refresh reload loops on root containers.
- **Tone & Messaging**:
  - Zero vanity jargon, marketing hype, or technical developer explanations in user-facing UI.
  - Institutional, clean transit terminology.
- **Keyboard Shortcuts**:
  - `Ctrl + F` / `Cmd + F`: Focuses and selects search input directly.
  - `Esc`: Clears active city selection and dismisses modals.
- **Spotlight Guide (`?` Button)**:
  - Step-by-step element spotlighting with animated cutout around active DOM elements.
- **Admin In-Place City Editor**:
  - Direct modal for updating city names, physical office addresses, landmarks, pin codes, coordinates, notes, services, and active toggles.
- **Operations Cloud Dropbox**:
  - Persistent staging vault for raw spreadsheets and statutory exports in Firestore.
