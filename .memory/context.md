# Conversation History & Operational Context - Captain Nexus

## Genesis of the Problem
- **User Role**: Agent Executive handling Captain onboarding and activation.
- **Pain Point**: Captains apply from villages, peri-urban zones, or satellite towns. Executives must verify whether the town has active Rapido operations, or identify the nearest operating city cluster and determine if it supports their specific vehicle type (Bike, Auto, Cab, E-Rickshaw, Tuk-tuk, B2B).
- **Physical Walk-in Requirement**: In addition to active operational hubs, executives need to direct Captains to the nearest physical **City Office / Corporate Hub** for in-person document verification, vehicle inspection, or issue resolution.

## Key Evolution & Milestones
1. **Repository Home**: Set directly in `O:\Projects\GitHub Repos\captain-nexus`.
2. **Dedicated Cloud Infrastructure**: Created and bound to Firebase project `captain-nexus-199cc` (Project #`770635003132`), completely isolating it from `silenvault-ops`.
3. **Data Verification**:
   - Replaced all sample records with 95 official Rapido servicing cities extracted from production sitemaps.
   - Verified physical corporate hubs against official MCA & Roppen Transportation legal filings.
4. **Security & Zero-Leak Audit**:
   - Stripped internal acronyms (`J1C`) from user-facing screens and comments.
   - Eradicated hardcoded secrets and migrated to `.env.local` with strict `.gitignore` rules.
   - Cleared GitHub secret-scanning exposure.
5. **Architectural Transition to Two-Zone Model**:
   - **Zone A (Public)**: Pure read-only client for Captains and field lookup (`captain-nexus-199cc.web.app`). No login modals, no admin buttons, zero attack surface.
   - **Zone B (Private Admin)**: Isolated administrative control plane for authenticated data maintenance.
