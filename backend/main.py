"""
ICICI Prudential — Intelligent Product Comparison API
FastAPI backend with PDF upload, scraper trigger, and product matching endpoints.
"""
import asyncio
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from models.product import SearchRequest, CompareRequest
from classifier.worker import classifier_worker
from scraper.pdf_scraper import run_scraper
from shared.queue_manager import pdf_queue

load_dotenv()

UPLOAD_DIR = Path(os.getenv("PDF_UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
NUM_WORKERS = 3


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start classifier workers on startup
    workers = [
        asyncio.create_task(classifier_worker(i + 1))
        for i in range(NUM_WORKERS)
    ]
    print(f"[Startup] {NUM_WORKERS} classifier workers started")
    yield
    for w in workers:
        w.cancel()


app = FastAPI(
    title="IPru Product Comparison API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Upload ──────────────────────────────────────────────────────────────────

@app.post("/api/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    insurer: str = "ICICI Prudential",
    category: str = "Term",
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted")

    dest_dir = UPLOAD_DIR / insurer.replace(" ", "_") / category
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / file.filename

    content = await file.read()
    dest.write_bytes(content)

    await pdf_queue.put(str(dest))
    return {"message": "Queued for processing", "path": str(dest), "queue_size": pdf_queue.qsize()}


@app.get("/api/upload/status")
async def queue_status():
    return {"queue_size": pdf_queue.qsize()}


# ── Scraper ─────────────────────────────────────────────────────────────────

@app.post("/api/scraper/run")
async def trigger_scraper(background_tasks: BackgroundTasks, insurer: str | None = None):
    background_tasks.add_task(run_scraper)
    return {"message": "Scraper started in background"}


@app.get("/api/scraper/status")
async def scraper_status():
    # Placeholder — real impl would query a status store
    return {
        "sources": [
            {"insurer": "ICICI Prudential", "status": "success", "docs": 24},
            {"insurer": "HDFC Life",        "status": "success", "docs": 18},
            {"insurer": "Max Life",         "status": "warning", "docs": 12},
            {"insurer": "SBI Life",         "status": "error",   "docs": 0},
            {"insurer": "Tata AIA",         "status": "success", "docs": 15},
        ]
    }


# ── Products / Search ────────────────────────────────────────────────────────

@app.post("/api/search")
async def search_products(req: SearchRequest):
    """
    Natural language feature search.
    In production: embed the query and run vector similarity against ChromaDB.
    """
    # Stub response for frontend integration
    return {
        "query": req.query,
        "results": [
            {"id": 1, "name": "ICICI Pru iProtect Smart", "match_score": 0.96, "insurer": "ICICI Prudential"},
            {"id": 2, "name": "HDFC Click 2 Protect Super", "match_score": 0.88, "insurer": "HDFC Life"},
            {"id": 3, "name": "Max Life Smart Secure Plus", "match_score": 0.82, "insurer": "Max Life"},
        ],
    }


@app.post("/api/compare")
async def compare_products(req: CompareRequest):
    """Side-by-side feature comparison for selected product IDs."""
    return {"product_ids": req.product_ids, "comparison": "stub"}


@app.post("/api/onboarding/match")
async def match_from_onboarding(answers: dict):
    """
    Takes quiz answers and returns ranked product recommendations.
    In production: map answers → feature tags → vector search → ranked results.
    """
    return {
        "answers": answers,
        "top_pick": "ICICI Pru iProtect Smart",
        "match_score": 0.96,
        "products": [],  # populated by vector search in prod
    }


# ── Knowledge Base ────────────────────────────────────────────────────────────

@app.get("/api/kb/documents")
async def list_documents(insurer: str | None = None, category: str | None = None):
    return {"documents": [], "total": 0}


@app.get("/api/health")
async def health():
    return {"status": "ok", "workers": NUM_WORKERS, "queue": pdf_queue.qsize()}
