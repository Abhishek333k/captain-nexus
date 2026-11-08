# SilenVault Mobility & Taxi Infrastructure

## 1. Domain & Deployment Topology

| Subdomain | Environment / Zone | Firebase Target | Firebase Site ID | Production URL |
| :--- | :--- | :--- | :--- | :--- |
| `taxi.silenvault.com` | Landing Page & Fleet Switcher | `taxi-landing` | `silenvault-taxi` | `https://silenvault-taxi.web.app` |
| `rapido.taxi.silenvault.com` | **Zone A**: Public Captain Nexus (Rapido) | `taxi-rapido` | `silenvault-taxi-rapido` | `https://silenvault-taxi-rapido.web.app` |
| `admin.taxi.silenvault.com` | **Zone B**: Operations Admin Control Plane | `taxi-admin` | `silenvault-taxi-admin` | `https://silenvault-taxi-admin.web.app` |

---

## 2. DNS Configuration (CNAME & A Records)

Firebase uses **CNAME records** for subdomains:

```dns
# 1. Main Taxi Landing Page
Type:  CNAME
Name:  taxi
Value: silenvault-taxi.web.app (or Firebase supplied target)
TTL:   Auto / 3600

# 2. Zone A: Rapido Public Directory
Type:  CNAME
Name:  rapido.taxi
Value: silenvault-taxi-rapido.web.app
TTL:   Auto / 3600

# 3. Zone B: Operations Admin Portal
Type:  CNAME
Name:  admin.taxi
Value: silenvault-taxi-admin.web.app
TTL:   Auto / 3600
```

> **Cloudflare Notice**: If your DNS is routed through Cloudflare, set proxy status to **DNS Only (Grey Cloud)** during domain connection so Firebase SSL verification certificates can issue immediately.

---

## 3. Local Development

Run the dual-zone controller:
```bat
start-dev.bat
```
- Zone A (Public): `http://localhost:5173`
- Zone B (Admin): `http://localhost:5174`

---

## 4. Multi-Site Deployment Commands

```bash
# Deploy all sites simultaneously
firebase deploy --only hosting

# Or deploy individually per zone
firebase deploy --only hosting:taxi-landing
firebase deploy --only hosting:taxi-rapido
firebase deploy --only hosting:taxi-admin
```

