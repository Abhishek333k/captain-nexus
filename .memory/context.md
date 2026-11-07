# Project Context & Specifications - Captain Nexus

## 1. Problem Statement
Captains applying from peripheral or rural locations often submit pincodes or town names outside major metro zones. This tool resolves the nearest active Rapido city cluster within an operational commute boundary (default 30 km) and maps verified physical corporate offices.

## 2. Infrastructure & Hosting
- **Dedicated Firebase Project**: `captain-nexus-199cc`
- **Hosting URL**: `https://captain-nexus-199cc.web.app`
- **Source Code**: `O:\Projects\GitHub Repos\captain-nexus`

## 3. Design & Usability Standards
- Distinct marker pins (Gold for operational hubs, Blue/Violet/Green for corporate offices, Red for target).
- Layer toggles in navbar to prevent map information overload.
- Ad slot auto-collapses completely from the DOM if no sponsor ad is returned.
- Strict two-zone structure (`Zone-A-Public` and `Zone-B-Admin`).
