"""
PDF → Feature extraction pipeline.
Extracts structured product features from insurance brochure PDFs.
"""
import os
import json
import pdfplumber


FEATURE_KEYWORDS = {
    "Return of Premium": ["return of premium", "rop", "maturity benefit equal to"],
    "Critical Illness": ["critical illness", "ci rider", "cancer", "heart attack", "stroke"],
    "Accidental Death": ["accidental death", "adb", "accident benefit"],
    "Waiver of Premium": ["waiver of premium", "wop", "premium waiver"],
    "Income Benefit": ["income benefit", "monthly income", "regular income payout"],
    "Joint Life": ["joint life", "second life", "spouse cover"],
    "Premium Flexibility": ["flexible premium", "top-up", "reduce sum assured"],
    "Partial Withdrawal": ["partial withdrawal", "liquidity", "surrender"],
    "Guaranteed Returns": ["guaranteed", "assured returns", "guaranteed maturity"],
    "Market Linked": ["market linked", "unit linked", "ulip", "nav"],
    "Loyalty Additions": ["loyalty addition", "wealth booster", "guaranteed additions"],
}


def extract_text(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.lower()


def detect_features(text: str) -> dict:
    return {
        feature: any(kw in text for kw in keywords)
        for feature, keywords in FEATURE_KEYWORDS.items()
    }


def extract_metadata(pdf_path: str) -> dict:
    filename = os.path.basename(pdf_path)
    return {
        "filename": filename,
        "path": pdf_path,
        "size_kb": round(os.path.getsize(pdf_path) / 1024, 1),
    }


def process_pdf(pdf_path: str) -> dict:
    """Main entry point called by classifier_worker."""
    print(f"[Pipeline] Starting: {pdf_path}")
    text = extract_text(pdf_path)
    features = detect_features(text)
    meta = extract_metadata(pdf_path)

    result = {**meta, "features": features}

    # Persist alongside PDF
    out_path = pdf_path.replace(".pdf", "_features.json")
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"[Pipeline] Done: {out_path}")
    return result
