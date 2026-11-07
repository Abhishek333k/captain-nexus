# Captain Nexus - Architectural Decisions, Security Architecture & Deployment

## 1. Production Repositories & URLs
- **GitHub Repository**: [https://github.com/Abhishek333k/captain-nexus](https://github.com/Abhishek333k/captain-nexus)
- **Dedicated Live Production URL**: [https://captain-nexus-199cc.web.app](https://captain-nexus-199cc.web.app) (and `https://captain-nexus-199cc.firebaseapp.com`)
- **Local Dev Server**: `http://localhost:5174/` (10-minute auto-refresh session)
- **Local Workspace**: `O:\Projects\GitHub Repos\captain-nexus`
- **Dedicated GCP Project**: `captain-nexus-199cc` (Project #`770635003132`)
  - Web App ID: `1:770635003132:web:771255059f95f663819379`
  - Completely decoupled from `silenvault-ops`.

## 2. Public vs. Internal Scrutiny (Air-Gapped Two-Zone Architecture)
To eliminate exposure of internal workplace terms and prevent malicious tampering, the system implements a strict **Two-Zone Segregation**:

### Zone A: Public / Captain Facing (Zero Attack Surface)
- **Public Domain**: `nexus.silenvault.com` / `captain-nexus-199cc.web.app`
- **Read-Only**: Static bundled dataset of 95 official Rapido cities and verified corporate hubs.
- **Sanitized UI**:
  - All internal operations jargon (e.g., `J1C`, internal approval codes, CRM notes) stripped.
  - Public branding: **"CAPTAIN NEXUS: Regional Network Radar"**.
  - **Zero Admin Buttons or Login Modals**: Attackers cannot find an entry point to brute-force or inspect passwords.
  - Integrated non-invasive AdSense banner (`AdBanner.tsx`) for monetization.

### Zone B: Internal Admin Portal (Control Plane)
- **Internal Subdomain**: `admin.nexus.silenvault.com` / separate internal route or repo (`silenvault-ops` / private VPN).
- **Capabilities**:
  - Full CRUD operations for city databases, coordinates, and service toggles.
  - Authenticated via Firebase Authentication (email/password or SSO) + Firestore Security Rules (`allow write: if request.auth != null`).

## 3. Security & Zero-Leak Audit Summary
1. **GitHub Secret Scanning**: All client API keys removed from code and moved to `.env.local` (ignored by git). Template stored in `.env.example`.
2. **Internal Terminology Cleaned**:
   - `J1C RADAR` -> `NETWORK RADAR`
   - `J1C operations` removed from comments and markup.
   - Hardcoded passcode `silenvault77` removed from source files and moved to `VITE_ADMIN_PASSCODE` in `.env.local`.
3. **Data Authenticity**:
   - 95 verified active servicing cities verified via `https://www.rapido.bike/sitemaps/cities/sitemap.xml`.
   - 5 legally filed Roppen Transportation corporate & regional offices retained; all dummy placeholders removed.
