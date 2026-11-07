# Conversation History & Operational Context - Captain Nexus

## Genesis of the Problem
- **User Role**: J1C Agent Executive at Rapido handling Captain onboarding and activation.
- **Pain Point**: Captains apply from villages, peri-urban zones, or satellite towns. Executives must verify whether the town has active Rapido operations, or identify the nearest operating city cluster and determine if it supports their specific vehicle type (Bike, Auto, Cab, E-Rickshaw, Tuk-tuk, B2B).
- **Physical Walk-in Requirement**: In addition to active operational hubs, executives need to direct Captains to the nearest physical **City Office / Walk-in Onboarding Hub** for in-person document verification, vehicle inspection, or issue resolution.

## Key Evolution & Milestones
1. **Repository Home**: Set directly in `O:\Projects\GitHub Repos\captain-nexus`.
2. **Database & Auth**: Google Firebase (Firestore) under project `silenvault-ops` with local fallback.
3. **Map Technology**: Open-source Leaflet with OpenStreetMap layers tailored for Indian cities and boundaries.
4. **Demand Clustering & Hexagons**: Replicating Uber H3-style surge cluster visualization in the UI.
5. **City Offices Feature Added**:
   - Integrated `src/data/offices.ts` listing verified physical hubs (Bengaluru HSR Layout, Hyderabad Madhapur, Noida Sector 6, Gurugram Sector 15, Chennai Guindy, Kolkata Sector V, Pune Shivajinagar, etc.).
   - Added dual-tab switcher (`Active Cities` vs `City Offices`) in the top navigation.
   - Searching an applicant's city/PIN code automatically ranks the closest walk-in offices by distance with address, operating hours, and contact details.
6. **Auto Session Refresh**: Automated 10-minute (600s) session reload via HTML meta tag, bundled with a `start-dev.bat` script.
