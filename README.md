# NWIS.AI — Nearby Wells Intelligence System
### Oil India Limited · Smart India Hackathon 2024

---

## 🚀 Quick Start

```bash
cd nwis-ai
npm install
npm start
# Opens at http://localhost:3000
```

---

## 📋 What's Built

| Feature | Status | Location |
|---------|--------|----------|
| Live Drilling Dashboard | ✅ | `Dashboard.jsx` |
| eRTMAC Real-Time Channel Feed | ✅ | Simulated @ 2s refresh |
| Geospatial Well Map | ✅ | `MapView.jsx` |
| Offset Well Detail Panel | ✅ | Click any well on map |
| Depth vs Torque / ROP / Mud Weight Charts | ✅ | `OffsetAnalysis.jsx` |
| Multi-well Parameter Radar | ✅ | `OffsetAnalysis.jsx` |
| Formation Banding (6 formations) | ✅ | All chart views |
| AI Predictive Alerts | ✅ | `RiskAlerts.jsx` |
| 5×5 Risk Matrix | ✅ | `RiskAlerts.jsx` |
| NPT Breakdown Chart | ✅ | `RiskAlerts.jsx` |
| Pre-emptive Checklist | ✅ | `RiskAlerts.jsx` |
| NLP Document Library | ✅ | `KnowledgeBase.jsx` |
| Entity Extraction Viewer | ✅ | `KnowledgeBase.jsx` |
| Searchable Incident Database | ✅ | `KnowledgeBase.jsx` |
| Tag-based Filtering | ✅ | `KnowledgeBase.jsx` |
| Document Upload Simulation | ✅ | `KnowledgeBase.jsx` |
| Casing Program Table | ✅ | `OffsetAnalysis.jsx` |
| Formation Risk Summary Table | ✅ | `OffsetAnalysis.jsx` |
| Live Clock + Risk Countdown | ✅ | Header component |

---

## 🏗️ Architecture

```
src/
├── App.jsx                    # Root: tab routing + live drilling simulator
├── index.js                   # React entry point
├── data/
│   ├── mockData.js            # All structured drilling/incident/NLP data
│   └── chartData.js           # Depth-synced time-series data generators
├── components/layout/
│   ├── Sidebar.jsx            # Navigation sidebar
│   └── Header.jsx             # Top bar with live clock & risk countdown
└── pages/
    ├── Dashboard.jsx          # Main live dashboard (5 sections)
    ├── MapView.jsx            # SVG geospatial map
    ├── OffsetAnalysis.jsx     # Cross-well parameter correlation
    ├── RiskAlerts.jsx         # Predictive alert management
    └── KnowledgeBase.jsx      # Document & incident repository
```

---

## 🎯 SIH Requirements Coverage

### i. AI/NLP/OCR Extraction
- Simulated pipeline: Upload → OCR → NLP-NER → Entity tagging → Indexed knowledge base
- Entity types: WELL_NAME, DEPTH, FORMATION, EVENT, MITIGATION, NPT, MUD_WEIGHT, PRESSURE
- Source text highlighting with entity color overlay in modal view

### ii. Interactive Map Visualization
- SVG-based geospatial map with topographic contour lines
- Animated active well pulse (SVG animation)
- Clickable offset wells with incident markers
- Adjustable search radius (1–10km slider)
- Connection lines with distance labels

### iii. Searchable Knowledge Repository
- Full-text search across events, mitigations, formations
- Multi-tag filter system
- Incident detail modal with drilling parameters at time of event
- Document library with NLP entity viewer

### iv. Cross-well Data Correlation
- Depth-synchronized multi-well overlays for Torque, ROP, Mud Weight
- Formation band overlays on all charts
- Radar chart for holistic performance comparison
- Formation-by-formation risk summary table

### v. Predictive Analytics
- ML confidence scores for each alert (based on historical incident pattern matching)
- Risk zone visual highlighting (red shaded area 2440–2500m)
- 5×5 Risk Matrix with probability × severity grid
- NPT category breakdown

### vi. Real-time Alerts & Recommendations
- Expandable alert cards with full mitigation guidance
- Referenced offset wells for each alert
- Pre-emptive action checklist (critical/high/medium priority)
- Risk countdown in header when within 50m of risk zone

### vii. User-friendly Dashboard
- Professional dark theme (oil & gas industry standard)
- Live drilling parameter simulation (updates every 2s)
- Formation progression strip with current position marker
- Color-coded severity throughout all components

---

## 📊 Data Sources Simulated

- Well Completion Reports (WCR) — 3 documents
- Daily Drilling Reports (DDR) — 2 documents
- Formation log (6 formations: Alluvium → Sylhet Limestone)
- 7 historical incidents across 5 offset wells
- 12 real-time drilling parameters (depth, ROP, WOB, RPM, torque, SPP, ECD, MW, flow rate, temp, hook load, block speed)

---

## 🛠️ Tech Stack

| Package | Purpose |
|---------|---------|
| React 18 | UI framework |
| Recharts 2.x | LineChart, AreaChart, BarChart, RadarChart |
| Lucide React | Icon library |
| Tailwind CSS (CDN) | Styling |
| React hooks | State, effects, simulator |
