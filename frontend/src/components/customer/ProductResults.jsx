import { useState } from 'react'
import { Star, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, ExternalLink, TrendingUp } from 'lucide-react'

// Mock data — in production this comes from the backend API
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'ICICI Pru iProtect Smart',
    insurer: 'ICICI Prudential',
    type: 'Term',
    matchScore: 96,
    premium: '₹8,500/yr',
    cover: '₹1 Cr',
    tenure: '30 years',
    isIPru: true,
    highlight: 'Best Match',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': true,
      'Income Benefit Option': true,
      'Joint Life Cover': false,
      'Premium Flexibility': false,
    },
    gap: [],
    strengths: ['Comprehensive critical illness rider', 'Flexible payout options', 'Low premium for high cover'],
  },
  {
    id: 2,
    name: 'HDFC Click 2 Protect Super',
    insurer: 'HDFC Life',
    type: 'Term',
    matchScore: 88,
    premium: '₹9,200/yr',
    cover: '₹1 Cr',
    tenure: '30 years',
    isIPru: false,
    highlight: 'Competitor',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': false,
      'Income Benefit Option': true,
      'Joint Life Cover': true,
      'Premium Flexibility': false,
    },
    gap: ['Waiver of Premium not available'],
    strengths: ['Joint life cover', 'Larger critical illness list'],
  },
  {
    id: 3,
    name: 'Max Life Smart Secure Plus',
    insurer: 'Max Life',
    type: 'Term',
    matchScore: 82,
    premium: '₹8,900/yr',
    cover: '₹1 Cr',
    tenure: '30 years',
    isIPru: false,
    highlight: 'Competitor',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': false,
      'Accidental Death Benefit': true,
      'Waiver of Premium': true,
      'Income Benefit Option': false,
      'Joint Life Cover': true,
      'Premium Flexibility': true,
    },
    gap: ['No critical illness cover', 'No income benefit option'],
    strengths: ['Premium flexibility', 'Joint life cover'],
  },
  {
    id: 4,
    name: 'Tata AIA Sampoorna Raksha',
    insurer: 'Tata AIA',
    type: 'Term',
    matchScore: 75,
    premium: '₹10,100/yr',
    cover: '₹1 Cr',
    tenure: '30 years',
    isIPru: false,
    highlight: 'Competitor',
    features: {
      'Return of Premium': false,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': false,
      'Income Benefit Option': false,
      'Joint Life Cover': false,
      'Premium Flexibility': true,
    },
    gap: ['No return of premium', 'No waiver of premium', 'No income option'],
    strengths: ['Comprehensive CI cover'],
  },
]

const ALL_FEATURES = [
  'Return of Premium',
  'Critical Illness Cover',
  'Accidental Death Benefit',
  'Waiver of Premium',
  'Income Benefit Option',
  'Joint Life Cover',
  'Premium Flexibility',
]

function ScoreBadge({ score, isIPru }) {
  const color = score >= 90 ? 'text-green-700 bg-green-100' : score >= 80 ? 'text-blue-700 bg-blue-100' : 'text-orange-700 bg-orange-100'
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${color}`}>
      <TrendingUp className="w-3.5 h-3.5" />
      {score}% match
    </div>
  )
}

function ProductCard({ product, onSelect, selected, features }) {
  const [expanded, setExpanded] = useState(false)
  const isSelected = selected === product.id

  return (
    <div className={`card transition-all duration-300 cursor-pointer
      ${product.isIPru ? 'border-l-4 border-l-ipru-orange' : 'border-l-4 border-l-gray-200'}
      ${isSelected ? 'ring-2 ring-ipru-blue shadow-lg' : 'hover:shadow-md'}`}
      onClick={() => onSelect(product.id)}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {product.isIPru && (
              <span className="text-[10px] font-bold bg-ipru-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                IPru
              </span>
            )}
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.type}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-base leading-tight">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{product.insurer}</p>
        </div>
        <ScoreBadge score={product.matchScore} isIPru={product.isIPru} />
      </div>

      {/* Key details */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: 'Premium', val: product.premium },
          { label: 'Cover', val: product.cover },
          { label: 'Tenure', val: product.tenure },
        ].map(({ label, val }) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">{label}</div>
            <div className="text-sm font-bold text-gray-800">{val}</div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.strengths.map(s => (
          <span key={s} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>

      {/* Gaps */}
      {product.gap.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.gap.map(g => (
            <span key={g} className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{g}</span>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
        className="mt-4 flex items-center gap-1 text-xs text-ipru-blue font-semibold hover:underline"
      >
        {expanded ? 'Hide features' : 'Show all features'}
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 page-enter">
          {features.map(f => (
            <div key={f} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{f}</span>
              {product.features[f]
                ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductResults({ answers, onCompare }) {
  const [selected, setSelected] = useState(null)
  const products = MOCK_PRODUCTS

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Matched Plans</h2>
        <p className="text-gray-500 text-sm mt-1">
          Based on your answers — ranked by fit score. IPru products are highlighted.
        </p>
      </div>

      {/* Alert box for top pick */}
      <div className="bg-gradient-to-r from-ipru-blue to-ipru-blue-light text-white rounded-2xl p-5 mb-6 flex items-start gap-4">
        <Star className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-base">Top Recommendation</div>
          <div className="text-blue-100 text-sm mt-0.5">
            <span className="text-white font-semibold">ICICI Pru iProtect Smart</span> is your best match at 96% —
            it covers all your requirements including critical illness and return of premium.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            features={ALL_FEATURES}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onCompare(products, ALL_FEATURES)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          View Gap Analysis & Comparison <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
