from pydantic import BaseModel
from typing import Optional


class ProductFeatures(BaseModel):
    return_of_premium: bool = False
    critical_illness: bool = False
    accidental_death: bool = False
    waiver_of_premium: bool = False
    income_benefit: bool = False
    joint_life: bool = False
    premium_flexibility: bool = False
    partial_withdrawal: bool = False
    guaranteed_returns: bool = False
    market_linked: bool = False
    loyalty_additions: bool = False


class Product(BaseModel):
    id: int
    name: str
    insurer: str
    category: str          # Term | ULIP | Endowment | Child | Retirement
    premium_annual: Optional[int] = None
    sum_assured: Optional[int] = None
    max_tenure: Optional[int] = None
    features: ProductFeatures
    source_pdf: Optional[str] = None
    match_score: Optional[float] = None
    gap_notes: list[str] = []


class SearchRequest(BaseModel):
    query: str
    filters: dict = {}


class CompareRequest(BaseModel):
    product_ids: list[int]
