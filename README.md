# ICICI Prudential — Intelligent Product Comparison & Gap Analysis Tool

A GenAI-powered platform to compare ICICI Prudential life insurance products against competitors, identify portfolio gaps, and surface market white spaces.

---

## Overview

This project was built for **SolveX 2025 — IIT Madras Hackathon**, sponsored by ICICI Prudential Life Insurance.

**Problem Statement:** Currently, designing new products and benchmarking against competitors is a manual, time-consuming process involving reading through long brochures and regulatory guidelines. This tool automates that process using GenAI.

---

## Features

### Customer Portal
- **Profile Quiz** — 8-question onboarding wizard that captures life goals, risk appetite, tenure, and rider preferences
- **Feature Search** — Natural language search ("I am 30 and looking for a term plan with ROP") matched against IPru and competitor products
- **Product Results** — Ranked product cards with match scores, strengths, and gaps highlighted
- **Gap Analysis** — Visual radar + bar charts, side-by-side feature matrix, and market white space insights
- **Peer-to-Peer Comparison** — Select any IPru product and up to 3 competitor products; get a detailed feature matrix, similarity scores, gap summary, and opportunity cards

### Admin Portal
- **PDF Uploader** — Drag-and-drop brochure upload with insurer + category tagging; simulates the indexing pipeline
- **Web Scraper Dashboard** — Monitor and trigger automated monthly scraping from all insurer websites
- **Knowledge Base** — Browse, search, and filter all indexed product documents

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| PDF Scraper | Python (separate repo — [Rutvik0003/IPRU_Chatbot](https://github.com/Rutvik0003/IPRU_Chatbot)) |
| Backend API | FastAPI (in progress) |

---

## Project Structure

```
ipru-product-comparison/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── customer/
│   │   │   │   ├── Onboarding.jsx       # 8-step profile quiz
│   │   │   │   ├── FeatureSearch.jsx    # NL search interface
│   │   │   │   ├── ProductResults.jsx   # Ranked results cards
│   │   │   │   ├── GapAnalysis.jsx      # Charts + feature matrix
│   │   │   │   └── PeerComparison.jsx   # Peer-to-peer selector + comparison
│   │   │   ├── admin/
│   │   │   │   ├── PDFUploader.jsx      # Drag-and-drop PDF intake
│   │   │   │   ├── ScraperDashboard.jsx # Scraper monitor + trigger
│   │   │   │   └── KnowledgeBase.jsx    # Document browser
│   │   │   └── shared/
│   │   │       ├── Navbar.jsx
│   │   │       └── ProgressBar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── CustomerPortal.jsx
│   │   │   └── AdminPortal.jsx
│   │   └── services/
│   │       └── api.js                   # Mock ↔ real API switch
│   └── package.json
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Switching to real backend

In `frontend/src/services/api.js`, set:
```js
const USE_MOCK = false
```

And add `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

---


---

## Roadmap

- [ ] Connect live FastAPI backend
- [ ] Integrate vector search (RAG) for natural language matching
- [ ] Customer sentiment analysis from app store reviews
- [ ] Automated monthly PDF refresh pipeline
- [ ] Export gap analysis as PDF report
