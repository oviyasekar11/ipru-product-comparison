/**
 * IPRU Product Comparison — API Service Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Scraper/Classifier repo (Rutvik): https://github.com/Rutvik0003/IPRU_Chatbot
 *
 * HOW TO SWITCH FROM MOCK → REAL BACKEND
 * ----------------------------------------
 * 1. Set USE_MOCK = false  (line below)
 * 2. Set VITE_API_URL=http://localhost:8000 in frontend/.env
 * 3. Make sure the FastAPI backend is running
 * That's it — all UI components stay the same.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const USE_MOCK = true   // ← flip to false when backend is ready

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const ALL_FEATURES = [
  'Return of Premium',
  'Critical Illness Cover',
  'Accidental Death Benefit',
  'Waiver of Premium',
  'Income Benefit Option',
  'Joint Life Cover',
  'Premium Flexibility',
]

const MOCK_PRODUCTS = [
  {
    id: 1, name: 'ICICI Pru iProtect Smart', insurer: 'ICICI Prudential',
    type: 'Term', matchScore: 96, premium: '₹8,500/yr', cover: '₹1 Cr',
    tenure: '30 years', isIPru: true,
    strengths: ['Comprehensive critical illness rider', 'Flexible payout options', 'Low premium for high cover'],
    gap: [],
    features: {
      'Return of Premium': true, 'Critical Illness Cover': true,
      'Accidental Death Benefit': true, 'Waiver of Premium': true,
      'Income Benefit Option': true, 'Joint Life Cover': false, 'Premium Flexibility': false,
    },
  },
  {
    id: 2, name: 'HDFC Click 2 Protect Super', insurer: 'HDFC Life',
    type: 'Term', matchScore: 88, premium: '₹9,200/yr', cover: '₹1 Cr',
    tenure: '30 years', isIPru: false,
    strengths: ['Joint life cover', 'Larger critical illness list'],
    gap: ['Waiver of Premium not available'],
    features: {
      'Return of Premium': true, 'Critical Illness Cover': true,
      'Accidental Death Benefit': true, 'Waiver of Premium': false,
      'Income Benefit Option': true, 'Joint Life Cover': true, 'Premium Flexibility': false,
    },
  },
  {
    id: 3, name: 'Max Life Smart Secure Plus', insurer: 'Max Life',
    type: 'Term', matchScore: 82, premium: '₹8,900/yr', cover: '₹1 Cr',
    tenure: '30 years', isIPru: false,
    strengths: ['Premium flexibility', 'Joint life cover'],
    gap: ['No critical illness cover', 'No income benefit option'],
    features: {
      'Return of Premium': true, 'Critical Illness Cover': false,
      'Accidental Death Benefit': true, 'Waiver of Premium': true,
      'Income Benefit Option': false, 'Joint Life Cover': true, 'Premium Flexibility': true,
    },
  },
  {
    id: 4, name: 'Tata AIA Sampoorna Raksha', insurer: 'Tata AIA',
    type: 'Term', matchScore: 75, premium: '₹10,100/yr', cover: '₹1 Cr',
    tenure: '30 years', isIPru: false,
    strengths: ['Comprehensive CI cover'],
    gap: ['No return of premium', 'No waiver of premium', 'No income option'],
    features: {
      'Return of Premium': false, 'Critical Illness Cover': true,
      'Accidental Death Benefit': true, 'Waiver of Premium': false,
      'Income Benefit Option': false, 'Joint Life Cover': false, 'Premium Flexibility': true,
    },
  },
]

const MOCK_DOCUMENTS = [
  { id: 1, name: 'IPru iProtect Smart Brochure v3.pdf', insurer: 'ICICI Prudential', type: 'Term', pages: 28, indexed: '2025-10-28', size: '1.2 MB', features: ['ROP', 'CI Rider', 'Waiver of Premium'] },
  { id: 2, name: 'IPru Guaranteed Income for Tomorrow.pdf', insurer: 'ICICI Prudential', type: 'Endowment', pages: 24, indexed: '2025-10-28', size: '0.9 MB', features: ['Guaranteed Returns', 'Monthly Income'] },
  { id: 3, name: 'HDFC Click 2 Protect Super 2024.pdf', insurer: 'HDFC Life', type: 'Term', pages: 32, indexed: '2025-10-28', size: '1.5 MB', features: ['ROP', 'CI Rider', 'Joint Life'] },
  { id: 4, name: 'Max Smart Secure Plus Product Note.pdf', insurer: 'Max Life', type: 'Term', pages: 20, indexed: '2025-10-27', size: '0.8 MB', features: ['ROP', 'Accident Benefit'] },
  { id: 5, name: 'Tata AIA Sampoorna Raksha Brochure.pdf', insurer: 'Tata AIA', type: 'Term', pages: 26, indexed: '2025-10-28', size: '1.1 MB', features: ['CI Rider', 'Premium Flexibility'] },
  { id: 6, name: 'SBI eShield Next Product Brochure.pdf', insurer: 'SBI Life', type: 'Term', pages: 18, indexed: '2025-10-26', size: '0.7 MB', features: ['Accident Benefit', 'Monthly Income'] },
  { id: 7, name: 'IPru Wealth Builder ULIP 2024.pdf', insurer: 'ICICI Prudential', type: 'ULIP', pages: 40, indexed: '2025-10-25', size: '2.1 MB', features: ['Market Linked', 'Partial Withdrawal', 'Loyalty Additions'] },
]

const MOCK_SCRAPERS = [
  { id: 1, insurer: 'ICICI Prudential', url: 'iciciprulife.com/products',            lastRun: '2025-10-28 09:00', status: 'success', docs: 24, nextRun: 'Nov 28 09:00' },
  { id: 2, insurer: 'HDFC Life',        url: 'hdfclife.com/insurance-plans',          lastRun: '2025-10-28 09:05', status: 'success', docs: 18, nextRun: 'Nov 28 09:05' },
  { id: 3, insurer: 'Max Life',         url: 'maxlifeinsurance.com/all-products',     lastRun: '2025-10-27 22:00', status: 'warning', docs: 12, nextRun: 'Nov 27 22:00' },
  { id: 4, insurer: 'SBI Life',         url: 'sbilife.co.in/web/guest/products',      lastRun: '2025-10-26 18:00', status: 'error',   docs: 0,  nextRun: 'Retry pending' },
  { id: 5, insurer: 'Tata AIA',         url: 'tataaia.com/life-insurance-plans',      lastRun: '2025-10-28 10:00', status: 'success', docs: 15, nextRun: 'Nov 28 10:00' },
]

// ─── PUBLIC API FUNCTIONS ─────────────────────────────────────────────────────
// Each function has two paths: mock (instant, no server) and real (fetch to backend).

/**
 * Match products from onboarding quiz answers.
 * Backend endpoint: POST /api/onboarding/match
 * Body: { answers: { q1: ["A"], q2: ["B"], ... } }
 * Response: { products: Product[], top_pick: string }
 */
export async function matchFromOnboarding(answers) {
  if (USE_MOCK) {
    await delay(1000)
    return { products: MOCK_PRODUCTS, top_pick: MOCK_PRODUCTS[0].name }
  }
  const res = await fetch(`${BASE_URL}/api/onboarding/match`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  return res.json()
}

/**
 * Natural language product search.
 * Backend endpoint: POST /api/search
 * Body: { query: string }
 * Response: { results: Product[] }
 */
export async function searchProducts(query) {
  if (USE_MOCK) {
    await delay(900)
    return { results: MOCK_PRODUCTS }
  }
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  return res.json()
}

/**
 * Upload a product brochure PDF.
 * Backend endpoint: POST /api/upload  (multipart form)
 * Response: { message, path, queue_size }
 */
export async function uploadPDF(file, insurer, category) {
  if (USE_MOCK) {
    await delay(2000)
    return { message: 'Queued for processing', queue_size: 1 }
  }
  const form = new FormData()
  form.append('file', file)
  form.append('insurer', insurer)
  form.append('category', category)
  const res = await fetch(`${BASE_URL}/api/upload`, { method: 'POST', body: form })
  return res.json()
}

/**
 * Get scraper status for all insurers.
 * Backend endpoint: GET /api/scraper/status
 * Response: { sources: ScraperSource[] }
 */
export async function getScraperStatus() {
  if (USE_MOCK) {
    await delay(300)
    return { sources: MOCK_SCRAPERS }
  }
  const res = await fetch(`${BASE_URL}/api/scraper/status`)
  return res.json()
}

/**
 * Trigger web scraper.
 * Backend endpoint: POST /api/scraper/run?insurer=...
 * Scraper code: https://github.com/Rutvik0003/IPRU_Chatbot
 */
export async function runScraper(insurer = null) {
  if (USE_MOCK) {
    await delay(300)
    return { message: 'Scraper started (mock)' }
  }
  const url = `${BASE_URL}/api/scraper/run${insurer ? `?insurer=${encodeURIComponent(insurer)}` : ''}`
  const res = await fetch(url, { method: 'POST' })
  return res.json()
}

/**
 * List all indexed documents in knowledge base.
 * Backend endpoint: GET /api/kb/documents
 * Response: { documents: KBDocument[], total: number }
 */
export async function listDocuments() {
  if (USE_MOCK) {
    await delay(400)
    return { documents: MOCK_DOCUMENTS, total: MOCK_DOCUMENTS.length }
  }
  const res = await fetch(`${BASE_URL}/api/kb/documents`)
  return res.json()
}

// Export mock data for components that render it directly
export { MOCK_PRODUCTS, MOCK_DOCUMENTS, MOCK_SCRAPERS }
