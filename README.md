# Captain Nexus

> Geospatial proximity radar and operational hub locator across 95 verified Rapido servicing cities in India.

[![Live App](https://img.shields.io/badge/Deployment-Live-success?style=flat-square)](https://captain-nexus-199cc.web.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌐 Live Deployment
- **Official Production URL**: [https://captain-nexus-199cc.web.app](https://captain-nexus-199cc.web.app)
- **Alternative Mirror**: [https://captain-nexus-199cc.firebaseapp.com](https://captain-nexus-199cc.firebaseapp.com)

---

## 🚀 Key Capabilities
- **95 Verified Rapido Servicing Cities**: Extracted directly from official production sitemaps with coordinates, states, and service categories (`Bike`, `Auto`, `Cab`, `B2B`, `E-Rickshaw`, `Tuk-Tuk`).
- **Verified Corporate & Regional Hubs**: Physical Roppen Transportation addresses across Bengaluru, Hyderabad, and Noida with operating hours.
- **Dynamic Commute Limit**: Adjustable radius slider (5 km – 100 km, default 30 km).
- **Interactive Layer Toggles**: Quick toggles to show/hide Operational City Pins, Corporate Office Pins, or Demand Hexagons without visual clutter.
- **Client-Side Distance Engine**: Millisecond Great-Circle Haversine distance calculations.
- **Non-Invasive Ad Placement**: Ad card auto-collapses from the DOM when no ad is served.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Dark-slate ergonomic palette)
- **Mapping**: Leaflet, OpenStreetMap CartoDB Tiles (Zero paid billing dependencies)
- **Infrastructure**: Google Firebase Hosting & Firestore (`captain-nexus-199cc`)

---

## 💻 Local Development

```powershell
# 1. Clone repository
git clone https://github.com/Abhishek333k/captain-nexus.git
cd captain-nexus

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Or double-click start-dev.bat
```

---

## 🔒 Security Architecture
This project enforces a two-zone air-gapped security model:
- **Zone A (Public)**: Pure read-only client plane with zero admin logic or login inputs.
- **Zone B (Admin)**: Isolated administrative interface for data curation.

