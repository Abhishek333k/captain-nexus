# Captain Nexus - Architectural Decisions, Technical Specs & Setup

## 1. Project Overview & Scope
- **Organization / Brand**: SilentVault (`silenvault`)
- **Repository Location**: `O:\Projects\GitHub Repos\captain-nexus`
- **Target User**: J1C Agent Executives (Rapido Captain Onboarding Team)
- **Core Mission**: Accelerate Captain verification & activation by:
  1. Instantly identifying the nearest active Rapido city cluster for applicants registering from peripheral or inactive areas.
  2. Resolving the closest **Physical City Offices & Walk-in Onboarding Hubs** so executives can direct Captains for document verification, device checks, or in-person support.

## 2. Technical Stack & Architecture
- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling & Design System**: Tailwind CSS (Rapido enterprise palette: Amber/Yellow `#F9C80E`, Carbon Slate `#121417`, high contrast, dark-mode ergonomics)
- **Mapping & Geospatial**: Leaflet + React-Leaflet + OpenStreetMap Carto tiles (100% open-source, zero API cost)
- **Distance Computation**: In-memory Spherical Haversine calculation (evaluates 150+ hubs in < 2ms)
- **Auto-Refresh Session**: Integrated automatic 10-minute browser session refresh (`<meta http-equiv="refresh" content="600" />`) to prevent stale shift caches.
- **Local Dev Launcher**: `start-dev.bat` for one-click startup on `http://localhost:5173/`.
- **Backend & Database**: Google Firebase (Firestore + Auth)
  - Firebase Web App ID: `1:414237928741:web:f9954e30c35715da823ecc`
  - Project ID: `silenvault-ops`
  - High availability strategy: Pre-seeded local dataset with Firestore live sync & local fallback.

## 3. Core Modules & Data Repositories
1. **Active Cities (`src/data/cities.ts`)**: 50+ pre-seeded active operating cities with coordinates and supported service matrix (`bike`, `auto`, `cab`, `b2b`, `e_rickshaw`, `tuk_tuk`).
2. **City Offices (`src/data/offices.ts`)**: Pre-seeded directory of Rapido corporate, regional onboarding hubs, and walk-in centres across major metros (Bengaluru HSR Layout, Hyderabad Madhapur, Noida Sector 6, Gurugram, Delhi South, Pune FC Road, Mumbai Andheri, Kolkata Sector V, etc.) complete with addresses, PIN codes, operating hours, and coordinates.
3. **Dual Radar Workspace (`src/App.tsx`)**:
   - Tab 1: **Active Cities** (Commute boundary filtering & service matrix).
   - Tab 2: **City Offices** (Distance-ranked walk-in hubs).

## 4. Policy & Compliance Guardrails
- **1-Click Copy for CRM**: Deferred (compliance precaution).
- **Captain WhatsApp/SMS Trigger**: Strictly excluded.
- **Service Categories Matrix**: Supports Bike, Auto, Cab, B2B/Parcel, E-Rickshaw, and Tuk-Tuk.
- **Operational Commute Boundary**: Default 30 km rule with dynamic slider (5 km – 100 km).
- **Google Play & Capacitor Guardrails**:
  - `select-none` applied to interactive UI elements.
  - Contextual permissions only.
  - Clean unmount teardown for all geolocation and realtime listeners to avoid battery drain.
