import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertTriangle, Lightbulb,
  BarChart3, ArrowRightLeft, Info, TrendingUp, TrendingDown, Minus
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend
} from 'recharts'

// ─── Mock product catalogue ────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  {
    id: 'ipru-iprotect',
    name: 'ICICI Pru iProtect Smart',
    insurer: 'ICICI Prudential',
    type: 'Term',
    isIPru: true,
    premium: '₹8,500/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '97.9%',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': true,
      'Income Benefit Option': true,
      'Joint Life Cover': false,
      'Premium Flexibility': false,
      'Terminal Illness Benefit': true,
      'Monthly Income Option': true,
    },
  },
  {
    id: 'ipru-gift-pro',
    name: 'ICICI Pru GIFT Pro',
    insurer: 'ICICI Prudential',
    type: 'Endowment',
    isIPru: true,
    premium: '₹50,000/yr',
    cover: '₹10 L',
    tenure: '15 yrs',
    claimRatio: '97.9%',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': false,
      'Accidental Death Benefit': false,
      'Waiver of Premium': true,
      'Income Benefit Option': true,
      'Joint Life Cover': false,
      'Premium Flexibility': false,
      'Terminal Illness Benefit': false,
      'Monthly Income Option': true,
    },
  },
  {
    id: 'hdfc-click2protect',
    name: 'HDFC Click 2 Protect Super',
    insurer: 'HDFC Life',
    type: 'Term',
    isIPru: false,
    premium: '₹9,200/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '99.4%',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': false,
      'Income Benefit Option': true,
      'Joint Life Cover': true,
      'Premium Flexibility': false,
      'Terminal Illness Benefit': true,
      'Monthly Income Option': false,
    },
  },
  {
    id: 'max-smart-secure',
    name: 'Max Life Smart Secure Plus',
    insurer: 'Max Life',
    type: 'Term',
    isIPru: false,
    premium: '₹8,900/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '99.5%',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': false,
      'Accidental Death Benefit': true,
      'Waiver of Premium': true,
      'Income Benefit Option': false,
      'Joint Life Cover': true,
      'Premium Flexibility': true,
      'Terminal Illness Benefit': false,
      'Monthly Income Option': false,
    },
  },
  {
    id: 'tata-sampoorna',
    name: 'Tata AIA Sampoorna Raksha',
    insurer: 'Tata AIA',
    type: 'Term',
    isIPru: false,
    premium: '₹10,100/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '98.5%',
    features: {
      'Return of Premium': false,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': false,
      'Income Benefit Option': false,
      'Joint Life Cover': false,
      'Premium Flexibility': true,
      'Terminal Illness Benefit': true,
      'Monthly Income Option': false,
    },
  },
  {
    id: 'sbi-eshield',
    name: 'SBI Life eShield Next',
    insurer: 'SBI Life',
    type: 'Term',
    isIPru: false,
    premium: '₹7,900/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '97.1%',
    features: {
      'Return of Premium': false,
      'Critical Illness Cover': false,
      'Accidental Death Benefit': true,
      'Waiver of Premium': false,
      'Income Benefit Option': true,
      'Joint Life Cover': false,
      'Premium Flexibility': false,
      'Terminal Illness Benefit': false,
      'Monthly Income Option': true,
    },
  },
  {
    id: 'bajaj-esmart',
    name: 'Bajaj Allianz eSmart Term',
    insurer: 'Bajaj Allianz',
    type: 'Term',
    isIPru: false,
    premium: '₹8,200/yr',
    cover: '₹1 Cr',
    tenure: '30 yrs',
    claimRatio: '98.0%',
    features: {
      'Return of Premium': true,
      'Critical Illness Cover': true,
      'Accidental Death Benefit': true,
      'Waiver of Premium': true,
      'Income Benefit Option': false,
      'Joint Life Cover': false,
      'Premium Flexibility': true,
      'Terminal Illness Benefit': false,
      'Monthly Income Option': false,
    },
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
  'Terminal Illness Benefit',
  'Monthly Income Option',
]

const IPRU_PRODUCTS = ALL_PRODUCTS.filter(p => p.isIPru)
const COMPETITOR_PRODUCTS = ALL_PRODUCTS.filter(p => !p.isIPru)

// Compute a similarity score (0-100) between two products
function computeSimilarity(a, b) {
  const feats = Object.keys(a.features)
  const matches = feats.filter(f => a.features[f] === b.features[f]).length
  return Math.round((matches / feats.length) * 100)
}

// Radar axes derived from feature groups
function buildRadarData(products) {
  const groups = {
    'Protection': ['Critical Illness Cover', 'Terminal Illness Benefit', 'Accidental Death Benefit'],
    'Flexibility': ['Premium Flexibility', 'Income Benefit Option', 'Monthly Income Option'],
    'Returns': ['Return of Premium'],
    'Riders': ['Waiver of Premium', 'Accidental Death Benefit'],
    'Coverage': ['Joint Life Cover', 'Terminal Illness Benefit'],
  }
  return Object.entries(groups).map(([label, feats]) => {
    const row = { feature: label }
    products.forEach(p => {
      const score = Math.round((feats.filter(f => p.features[f]).length / feats.length) * 100)
      row[p.id] = score
    })
    return row
  })
}

const COLORS = ['#003087', '#F47920', '#6366f1', '#10b981', '#f59e0b']

function FeaturePill({ value }) {
  if (value) return <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
  return <XCircle className="w-4 h-4 text-red-400 mx-auto" />
}

function GapBadge({ ipruHas, peerHas }) {
  if (ipruHas && !peerHas) return (
    <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
      <TrendingUp className="w-2.5 h-2.5" /> IPru ahead
    </span>
  )
  if (!ipruHas && peerHas) return (
    <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
      <TrendingDown className="w-2.5 h-2.5" /> Gap
    </span>
  )
  return null
}

export default function PeerComparison() {
  const [ipruId, setIpruId] = useState(IPRU_PRODUCTS[0].id)
  const [peerIds, setPeerIds] = useState([COMPETITOR_PRODUCTS[0].id])

  const ipruProduct = ALL_PRODUCTS.find(p => p.id === ipruId)
  const peerProducts = peerIds.map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean)
  const compared = [ipruProduct, ...peerProducts]

  const togglePeer = (id) => {
    setPeerIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev   // max 3 peers
    )
  }

  const radarData = buildRadarData(compared)

  const barData = peerProducts.map((p, i) => ({
    name: p.insurer,
    similarity: computeSimilarity(ipruProduct, p),
    fill: COLORS[i + 1] || COLORS[1],
  }))

  const ipruGaps = ALL_FEATURES.filter(f => !ipruProduct.features[f] && peerProducts.some(p => p.features[f]))
  const ipruLeads = ALL_FEATURES.filter(f => ipruProduct.features[f] && peerProducts.some(p => !p.features[f]))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 page-enter">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Peer-to-Peer Product Comparison</h2>
        <p className="text-gray-500 text-sm mt-1">
          Select an IPru product and up to 3 competitor products to see a detailed side-by-side gap analysis.
        </p>
      </div>

      {/* Selector row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* IPru selector */}
        <div className="card border-l-4 border-l-ipru-orange">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold bg-ipru-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wide">IPru</span>
            <span className="text-sm font-semibold text-gray-700">Select ICICI Prudential Product</span>
          </div>
          <select
            value={ipruId}
            onChange={e => setIpruId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-ipru-gray focus:outline-none focus:ring-2 focus:ring-ipru-orange/40"
          >
            {IPRU_PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
            ))}
          </select>
          {ipruProduct && (
            <div className="mt-3 flex gap-3 flex-wrap text-xs text-gray-500">
              <span>Premium: <strong className="text-gray-700">{ipruProduct.premium}</strong></span>
              <span>Cover: <strong className="text-gray-700">{ipruProduct.cover}</strong></span>
              <span>Claim Ratio: <strong className="text-green-600">{ipruProduct.claimRatio}</strong></span>
            </div>
          )}
        </div>

        {/* Competitor selector */}
        <div className="card border-l-4 border-l-gray-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700">Select Competitor Products</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">up to 3</span>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {COMPETITOR_PRODUCTS.map(p => {
              const sel = peerIds.includes(p.id)
              const disabled = !sel && peerIds.length >= 3
              return (
                <button
                  key={p.id}
                  onClick={() => !disabled && togglePeer(p.id)}
                  disabled={disabled}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all
                    ${sel
                      ? 'border-ipru-blue bg-blue-50'
                      : disabled
                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 hover:border-ipru-blue/40 hover:bg-blue-50/30'
                    }`}
                >
                  <div className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors
                    ${sel ? 'bg-ipru-blue border-ipru-blue' : 'border-gray-300'}`}>
                    {sel && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.insurer} · {p.type} · {p.premium} · Claim: {p.claimRatio}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {peerProducts.length === 0 && (
        <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Select at least one competitor product to begin comparison</p>
        </div>
      )}

      {peerProducts.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-extrabold text-ipru-orange">{ipruLeads.length}</div>
              <div className="text-xs text-gray-500 mt-1">Features IPru leads on</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-extrabold text-red-500">{ipruGaps.length}</div>
              <div className="text-xs text-gray-500 mt-1">Gaps vs competitors</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-extrabold text-ipru-blue">
                {Math.round(barData.reduce((s, d) => s + d.similarity, 0) / barData.length)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Avg similarity score</div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="card">
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Feature Coverage Radar</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  {compared.map((p, i) => (
                    <Radar
                      key={p.id}
                      name={p.isIPru ? 'IPru' : p.insurer}
                      dataKey={p.id}
                      stroke={COLORS[i]}
                      fill={COLORS[i]}
                      fillOpacity={i === 0 ? 0.25 : 0.1}
                      strokeWidth={i === 0 ? 2.5 : 1.5}
                      strokeDasharray={i === 0 ? undefined : '5 3'}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Similarity bar */}
            <div className="card">
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Similarity Score vs IPru Product</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#374151' }} />
                  <Tooltip formatter={v => [`${v}%`, 'Similarity']} />
                  <Bar dataKey="similarity" radius={[0, 6, 6, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                Higher = more features in common with {ipruProduct.name}
              </p>
            </div>
          </div>

          {/* Feature matrix */}
          <div className="card overflow-x-auto">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Side-by-Side Feature Matrix</h3>
            <table className="w-full text-sm" style={{ minWidth: 480 + peerProducts.length * 120 }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2.5 pr-4 font-semibold text-gray-600 w-52">Feature</th>
                  {/* IPru col */}
                  <th className="text-center py-2.5 px-4 font-semibold text-gray-700 min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] bg-ipru-orange text-white px-1.5 py-0.5 rounded-full font-bold uppercase">IPru</span>
                      <span className="text-xs leading-tight text-center">{ipruProduct.name.split(' ').slice(0, 3).join(' ')}</span>
                    </div>
                  </th>
                  {/* Peer cols */}
                  {peerProducts.map((p, i) => (
                    <th key={p.id} className="text-center py-2.5 px-4 font-semibold text-gray-700 min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i + 1] }} />
                        <span className="text-xs leading-tight text-center">{p.name.split(' ').slice(0, 3).join(' ')}</span>
                        <span className="text-[10px] text-gray-400">{p.insurer}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-2.5 px-4 font-semibold text-gray-600 min-w-[80px] text-xs">Gap Status</th>
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feat, rowIdx) => {
                  const ipruHas = ipruProduct.features[feat]
                  const anyPeerHas = peerProducts.some(p => p.features[feat])
                  const allPeerHas = peerProducts.every(p => p.features[feat])

                  let rowBg = rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  if (!ipruHas && anyPeerHas) rowBg = 'bg-red-50'
                  if (ipruHas && !allPeerHas) rowBg = 'bg-green-50/60'

                  return (
                    <tr key={feat} className={rowBg}>
                      <td className="py-3 pr-4 text-gray-700 font-medium text-sm">{feat}</td>
                      <td className="text-center py-3 px-4">
                        <FeaturePill value={ipruHas} />
                      </td>
                      {peerProducts.map(p => (
                        <td key={p.id} className="text-center py-3 px-4">
                          <FeaturePill value={p.features[feat]} />
                        </td>
                      ))}
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          {!ipruHas && anyPeerHas ? (
                            <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <TrendingDown className="w-2.5 h-2.5" /> Gap
                            </span>
                          ) : ipruHas && !allPeerHas ? (
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <TrendingUp className="w-2.5 h-2.5" /> IPru ahead
                            </span>
                          ) : (
                            <Minus className="w-3 h-3 text-gray-300" />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Gap summary */}
          {(ipruGaps.length > 0 || ipruLeads.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gaps */}
              {ipruGaps.length > 0 && (
                <div className="card border border-red-100">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">IPru Gaps to Address</h3>
                  </div>
                  <div className="space-y-2">
                    {ipruGaps.map(feat => {
                      const peersWithFeature = peerProducts.filter(p => p.features[feat]).map(p => p.insurer)
                      return (
                        <div key={feat} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                          <div className="text-sm font-semibold text-red-800">{feat}</div>
                          <div className="text-xs text-red-600 mt-0.5">
                            Available at: {peersWithFeature.join(', ')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Advantages */}
              {ipruLeads.length > 0 && (
                <div className="card border border-green-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">IPru Competitive Advantages</h3>
                  </div>
                  <div className="space-y-2">
                    {ipruLeads.map(feat => {
                      const peersLacking = peerProducts.filter(p => !p.features[feat]).map(p => p.insurer)
                      return (
                        <div key={feat} className="p-3 bg-green-50 border border-green-100 rounded-xl">
                          <div className="text-sm font-semibold text-green-800">{feat}</div>
                          <div className="text-xs text-green-600 mt-0.5">
                            Not at: {peersLacking.join(', ')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* White space insight */}
          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-ipru-orange" />
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Market White Spaces</h3>
            </div>
            <div className="space-y-3">
              {ipruGaps.slice(0, 3).map((feat, i) => (
                <div key={feat} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Opportunity: Add <span className="text-ipru-orange">{feat}</span> to {ipruProduct.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {peerProducts.filter(p => p.features[feat]).length} of {peerProducts.length} competitors already offer this — high demand signal.
                    </div>
                  </div>
                </div>
              ))}
              {ipruGaps.length === 0 && (
                <div className="text-sm text-gray-600 text-center py-2">
                  No white spaces detected — {ipruProduct.name} is competitive across all compared features.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
