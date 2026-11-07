# Captain Nexus - Architectural Decisions & Deployment

## 1. Production Repositories & URLs
- **GitHub Repository**: [https://github.com/Abhishek333k/captain-nexus](https://github.com/Abhishek333k/captain-nexus)
- **Live Production URL**: [https://captain-nexus-199cc.web.app](https://captain-nexus-199cc.web.app)
- **Dedicated GCP Project**: `captain-nexus-199cc` (Project #`770635003132`)
- **Stale Hosting Cleaned**: Unused sites on other projects permanently deleted.

## 2. Air-Gapped Two-Zone Architecture
- **Zone A (`Zone-A-Public`)**: 
  - Pure read-only client application for Captains and field lookup.
  - Zero admin modals, zero login forms, zero attack surface.
  - Map layer filters for City Pins, Corporate Offices, and Demand Hexagons.
  - Auto-collapsing Google AdSense placement (hides if no ad is returned).
- **Zone B (`Zone-B-Admin`)**: 
  - Isolated control plane for database maintenance.

## 3. Verified Production Data
- **95 Live Servicing Cities**: Extracted from official `rapido.bike` sitemaps with complete coordinates and service matrices.
- **5 Physical Corporate Hubs**: Legally filed Roppen Transportation corporate & regional offices. Dummy placeholders purged.
