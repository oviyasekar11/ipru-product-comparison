# ICICI Prudential — Intelligent Product Comparison & Gap Analysis Tool

> **Team Kappa · IIT Madras · SolveX 2025 · Mentor: Ankita**

A GenAI-powered tool that compares ICICI Prudential life insurance products against competitors, identifies feature gaps, and recommends the best plan for each customer profile.

---

## Project Structure

```
icici-repo/
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/     # Landing, CustomerPortal, AdminPortal
│       └── components/
│           ├── customer/   # Onboarding, FeatureSearch, ProductResults, GapAnalysis
│           ├── admin/      # PDFUploader, ScraperDashboard, KnowledgeBase
│           └── shared/     # Navbar, ProgressBar
└── backend/           # FastAPI Python
    ├── main.py
    ├── classifier/    # PDF processing pipeline + worker queue
    ├── scraper/       # Web scraper for insurer websites
    ├── models/        # Pydantic data models
    └── shared/        # Async queue manager
```

---

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # add your API keys
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## Key Features

### Customer Portal (`/customer`)
| Step | Feature |
|------|---------|
| 1 | **Onboarding Quiz** — 8 questions (90 sec), profile-based matching |
| 2 | **Feature Search** — Natural language query (e.g. "term plan with ROP for 30yr old") |
| 3 | **Product Results** — Ranked match scores, IPru vs. competitors |
| 4 | **Gap Analysis** — Radar chart, feature matrix, market white spaces |

### Admin Portal (`/admin`)
| Tab | Feature |
|-----|---------|
| Upload PDFs | Drag-and-drop PDF upload → classifier queue |
| Web Scraper | Monitor & trigger monthly scraper per insurer |
| Knowledge Base | Search, filter, view all indexed documents |

---

## Architecture

```
User Query
    │
    ▼
Feature Search (NLP / embeddings)
    │
    ▼
Vector DB (ChromaDB) ◄── PDF Pipeline ◄── Web Scraper
    │                                            │
    ▼                                       Monthly cron
Ranked Products + Gap Analysis
```

### PDF Processing Pipeline
1. PDF uploaded or scraped → added to `asyncio.Queue`
2. 3 async **classifier workers** dequeue and process
3. `pipeline.py` extracts text, detects features via keyword matching
4. Features stored as JSON + indexed in ChromaDB

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Upload a PDF brochure |
| POST | `/api/scraper/run` | Trigger web scraper |
| GET | `/api/scraper/status` | Scraper status per insurer |
| POST | `/api/search` | Natural language product search |
| POST | `/api/onboarding/match` | Match products from quiz answers |
| POST | `/api/compare` | Side-by-side product comparison |
| GET | `/api/kb/documents` | List knowledge base documents |
| GET | `/api/health` | System health check |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, React Router |
| Backend | FastAPI, Python 3.11+, asyncio |
| AI/ML | LangChain, ChromaDB, Sentence Transformers |
| PDF | pdfplumber, PyPDF2 |
| Scraping | httpx, BeautifulSoup4 |
| Scheduler | APScheduler (monthly refresh) |
