# Captain Nexus - Architectural Decisions, Technical Specs & Deployment

## 1. Production Repositories & URLs
- **GitHub Repository**: [https://github.com/Abhishek333k/captain-nexus](https://github.com/Abhishek333k/captain-nexus)
- **Dedicated Live Production URL**: [https://captain-nexus.web.app](https://captain-nexus.web.app) (Site ID: `captain-nexus`)
- **Alternative Domain**: [https://captain-nexus.firebaseapp.com](https://captain-nexus.firebaseapp.com)
- **Local Dev Server**: `http://localhost:5174/` (10-minute auto-refresh session)
- **Local Workspace**: `O:\Projects\GitHub Repos\captain-nexus`

## 2. Official Production Data Architecture
- **95 Live Servicing Cities**: Extracted directly from `https://www.rapido.bike/sitemaps/cities/sitemap.xml`.
  - All dummy or placeholder data has been removed.
  - Sourced cities include all active regional clusters (e.g., Bengaluru, Hyderabad, Delhi NCR, Asansol, Dibrugarh, Gorakhpur, Nandyala, Ramagundam, Shillong, Tezpur, etc.).
- **Physical Corporate & Regional Hubs**: Strictly filtered to legally filed Roppen Transportation Services corporate hubs and MCA registered offices (SLV Nilaya HSR, HSR Optima, Mantri Commercio Campus, Madhapur Sai Prithvi Arcade, Noida Sector 6).

## 3. Admin Authentication & Editing Console
- **Access Route**: Top navbar **"⚙️ Admin"** button.
- **Security Gate**: Protected by executive passcode: `silenvault77`.
- **Edit Capabilities**:
  - Live edit of existing city names, states, latitude/longitude, and supported vehicle categories.
  - Toggle city active/disabled states.
  - Add newly launched clusters.
  - Automatically synchronizes with Firebase Firestore and updates session memory.

## 4. Non-Invasive AdSense Placement
- Integrated [`AdBanner.tsx`](file:///O:/Projects/GitHub%20Repos/captain-nexus/src/components/AdBanner.tsx) right above the results list.
- Minimalist, dark-charcoal card styled for captain accessories and partner gear.
- No intrusive popups, banners, or layout shifts.
