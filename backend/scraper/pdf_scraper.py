"""
Web scraper: fetches product brochure PDF links from insurer websites.
Queues downloaded PDFs for the classifier pipeline.
"""
import os
import asyncio
import httpx
from bs4 import BeautifulSoup
from shared.queue_manager import pdf_queue

DOWNLOAD_DIR = os.getenv("PDF_UPLOAD_DIR", "./uploads")

SCRAPER_SOURCES = [
    {
        "insurer": "ICICI Prudential",
        "url": "https://www.iciciprulife.com/insurance-products/all-products.html",
        "pdf_pattern": "iciciprulife.com",
    },
    {
        "insurer": "HDFC Life",
        "url": "https://www.hdfclife.com/insurance-plans",
        "pdf_pattern": "hdfclife.com",
    },
    {
        "insurer": "Max Life",
        "url": "https://www.maxlifeinsurance.com/all-products",
        "pdf_pattern": "maxlifeinsurance.com",
    },
]


async def fetch_pdf_links(client: httpx.AsyncClient, source: dict) -> list[str]:
    try:
        resp = await client.get(source["url"], timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
        links = [
            a["href"] for a in soup.find_all("a", href=True)
            if a["href"].endswith(".pdf")
        ]
        return links[:10]  # cap per source
    except Exception as e:
        print(f"[Scraper] Failed {source['insurer']}: {e}")
        return []


async def download_pdf(client: httpx.AsyncClient, url: str, insurer: str) -> str | None:
    try:
        os.makedirs(DOWNLOAD_DIR, exist_ok=True)
        filename = os.path.join(DOWNLOAD_DIR, insurer.replace(" ", "_"), url.split("/")[-1])
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        resp = await client.get(url, timeout=30)
        with open(filename, "wb") as f:
            f.write(resp.content)
        print(f"[Scraper] Downloaded: {filename}")
        return filename
    except Exception as e:
        print(f"[Scraper] Download failed {url}: {e}")
        return None


async def run_scraper():
    """Called by the scheduler monthly."""
    async with httpx.AsyncClient(follow_redirects=True) as client:
        for source in SCRAPER_SOURCES:
            print(f"[Scraper] Scraping {source['insurer']}...")
            links = await fetch_pdf_links(client, source)
            for link in links:
                path = await download_pdf(client, link, source["insurer"])
                if path:
                    await pdf_queue.put(path)
