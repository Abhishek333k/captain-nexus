# SilenVault Mobility & Taxi Infrastructure

## 1. Domain & Workspace Topology

To accommodate multiple taxi/fleet platforms dynamically, the repository is organized into dedicated zone directories:

| Subdomain | Environment / Zone | Local Directory | Firebase Target | Firebase Site ID | Production URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `taxi.silenvault.com` | Landing Page & Fleet Switcher | `Zone Taxi Home/` | `taxi-landing` | `silenvault-taxi` | `https://silenvault-taxi.web.app` |
| `rapido.taxi.silenvault.com` | Rapido Public Operations Directory | `Zone Rapido/` | `taxi-rapido` | `silenvault-taxi-rapido` | `https://silenvault-taxi-rapido.web.app` |
| `admin.taxi.silenvault.com` | Operations Control Plane (Unified Admin) | `Zone Admin/` | `taxi-admin` | `silenvault-taxi-admin` | `https://silenvault-taxi-admin.web.app` |
| *(Future Fleet)* | *(e.g. Uber, Ola, InDrive)* | `Zone <Platform>/` | *(Target TBD)* | *(Site TBD)* | `https://<platform>.taxi.silenvault.com` |

---

## 2. DNS Configuration (CNAME Records on Cloudflare)

Firebase uses **CNAME records** for each subdomain:

```dns
# 1. Main Taxi Landing Page
Type:  CNAME
Name:  taxi
Value: silenvault-taxi.web.app
Proxy: DNS Only (Grey Cloud)

# 2. Zone Rapido: Public Directory
Type:  CNAME
Name:  rapido.taxi
Value: silenvault-taxi-rapido.web.app
Proxy: DNS Only (Grey Cloud)

# 3. Zone Admin: Operations Portal
Type:  CNAME
Name:  admin.taxi
Value: silenvault-taxi-admin.web.app
Proxy: DNS Only (Grey Cloud)
```

---

## 3. Local Development

Run the dual-zone runner from repository root:
```bat
start-dev.bat
```
- **Zone Rapido** (Public): `http://localhost:5173`
- **Zone Admin** (Operations): `http://localhost:5174`
- **Zone Taxi Home** (Landing): Open `Zone Taxi Home/index.html` in browser or serve statically

---

## 4. Multi-Site Build & Deployment Commands

```bash
# 1. Build Zone Rapido
cd "Zone Rapido" && npm run build && cd ..

# 2. Build Zone Admin
cd "Zone Admin" && npm run build && cd ..

# 3. Deploy all sites simultaneously
npx firebase deploy --only hosting --project captain-nexus-199cc

# Or deploy individually per zone
npx firebase deploy --only hosting:taxi-landing --project captain-nexus-199cc
npx firebase deploy --only hosting:taxi-rapido --project captain-nexus-199cc
npx firebase deploy --only hosting:taxi-admin --project captain-nexus-199cc
```
