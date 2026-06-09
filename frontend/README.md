# IPru Product Comparison — Frontend UI

> **Team Kappa · IIT Madras · SolveX 2025 · Mentor: Ankita**
>
> This repo contains **only the React frontend UI**.
> Backend (FastAPI) → being built by the backend team.
> Scraper → [Rutvik0003/IPRU_Chatbot](https://github.com/Rutvik0003/IPRU_Chatbot)

---

## Run locally

```bash
npm install
cp .env.example .env      # set VITE_API_URL to your backend URL
npm run dev               # → http://localhost:3000
```

> **No backend? No problem.** All screens work with mock data out of the box.
> Swap in real API calls by editing `src/services/api.js`.

---

## What's inside

```
src/
├── pages/
│   ├── Landing.jsx           # Home — links to Customer & Admin portals
│   ├── CustomerPortal.jsx    # Orchestrates the customer flow
│   └── AdminPortal.jsx       # Orchestrates the admin flow
│
├── components/
│   ├── customer/
│   │   ├── Onboarding.jsx    # 8-question quiz (Q1–Q8 from brief)
│   │   ├── FeatureSearch.jsx # NL search box + quick tags
│   │   ├── ProductResults.jsx# Ranked product cards (IPru highlighted)
│   │   └── GapAnalysis.jsx   # Radar chart, feature matrix, white spaces
│   │
│   ├── admin/
│   │   ├── PDFUploader.jsx   # Drag-and-drop PDF upload → classifier queue
│   │   ├── ScraperDashboard.jsx # Per-insurer scraper status & trigger
│   │   └── KnowledgeBase.jsx # Searchable indexed document list
│   │
│   └── shared/
│       ├── Navbar.jsx        # Top nav (switches Customer ↔ Admin)
│       └── ProgressBar.jsx   # Reusable progress bar
│
└── services/
    └── api.js                # ⭐ ALL backend calls are here — read this!
```

---

## Routes

| URL | Page |
|-----|------|
| `/` | Landing |
| `/customer` | Customer Portal (quiz → results → gap analysis) |
| `/admin` | Admin Portal (upload / scraper / knowledge base) |

---

## 🔌 Backend API contract

All the endpoints the UI expects are documented in **`src/services/api.js`** with full request/response shapes.

### Summary

| Method | Endpoint | Used by |
|--------|----------|---------|
| `POST` | `/api/onboarding/match` | Quiz results → product recommendations |
| `POST` | `/api/search` | Natural language feature search |
| `POST` | `/api/compare` | Side-by-side product comparison |
| `POST` | `/api/upload` | Admin PDF upload |
| `POST` | `/api/scraper/run` | Trigger web scraper |
| `GET`  | `/api/scraper/status` | Scraper status per insurer |
| `GET`  | `/api/kb/documents` | List knowledge base docs |
| `GET`  | `/api/health` | Health check |

### Connecting real data

Right now `ProductResults.jsx` and `GapAnalysis.jsx` use **mock data** (clearly marked at the top of each file).

To wire real data:
1. Backend team builds the endpoints above
2. Set `VITE_API_URL=http://<your-backend>` in `.env`
3. Replace the `MOCK_PRODUCTS` / `MOCK_DOCS` arrays with calls from `src/services/api.js`

---

## Tech stack

| | |
|-|-|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP | Axios (via `src/services/api.js`) |
| Icons | Lucide React |

---

## Screens

### Customer Portal
1. **Onboarding Quiz** — 8 questions, ~90 sec, animated selection, progress bar
2. **Feature Search** — plain-English query + quick-select tags
3. **Product Results** — match score, IPru vs competitors, expandable features
4. **Gap Analysis** — radar chart, bar chart, feature matrix, market white spaces

### Admin Portal
- **Upload PDFs** — drag-and-drop, insurer + category metadata, processing status
- **Web Scraper** — per-insurer status, run now / run all, schedule info
- **Knowledge Base** — searchable/filterable indexed document list
