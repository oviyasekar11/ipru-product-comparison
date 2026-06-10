import { useState } from 'react'
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Star, Shield, X } from 'lucide-react'
import { PRODUCT_CATALOGUE, INSURERS, TYPES } from '../../data/products'

const insurerInitials = (name) => {
  if (name === 'ICICI Prudential') return 'IP'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('')
}

function ProductCard({ product, expanded, onToggle }) {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
      ${product.isIPru ? 'border-ipru-orange/30 shadow-sm' : 'border-gray-100'}
      ${expanded ? 'shadow-md' : ''}`}
    >
      <button onClick={onToggle} className="w-full flex items-start gap-3 p-4 text-left active:bg-gray-50">
        {/* Insurer badge */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm
          ${product.isIPru ? 'bg-ipru-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
          {insurerInitials(product.insurer)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            {product.isIPru && (
              <span className="text-[9px] font-bold bg-ipru-orange text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                IPru
              </span>
            )}
            <span className="text-[10px] font-semibold bg-blue-50 text-ipru-blue px-1.5 py-0.5 rounded-full">
              {product.type}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{product.insurer}</p>

          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="text-gray-600"><strong className="text-gray-800">{product.premium}</strong></span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">Cover <strong className="text-gray-800">{product.cover}</strong></span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-0.5 text-[11px] text-green-600 font-semibold">
            <Star className="w-3 h-3 fill-green-500 text-green-500" />
            {product.claimRatio}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-300 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-300 mt-1" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 page-enter">
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{product.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Premium', val: product.premium },
                { label: 'Cover', val: product.cover },
                { label: 'Tenure', val: product.tenure },
              ].map(({ label, val }) => (
                <div key={label} className="bg-ipru-gray rounded-xl p-2 text-center">
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">{val}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-orange-50 text-ipru-orange px-2 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <button className="w-full bg-ipru-blue text-white text-xs font-semibold py-2.5 rounded-xl active:scale-[0.98] transition-transform">
              View Full Brochure
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InsuranceCatalog() {
  const [search, setSearch] = useState('')
  const [insurer, setInsurer] = useState('All')
  const [type, setType] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = PRODUCT_CATALOGUE.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchInsurer = insurer === 'All' || p.insurer === insurer
    const matchType = type === 'All' || p.type === type
    return matchSearch && matchInsurer && matchType
  })

  const activeFilterCount = (insurer !== 'All' ? 1 : 0) + (type !== 'All' ? 1 : 0)

  return (
    <div className="min-h-screen bg-ipru-gray">
      {/* Sticky search header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 py-3 space-y-3">
        <div>
          <h1 className="text-lg font-extrabold text-gray-800">All Insurance Plans</h1>
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length} of {PRODUCT_CATALOGUE.length} products · IPru & competitors</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plans, features..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-ipru-gray focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
            />
          </div>
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl border flex-shrink-0 transition-colors
              ${showFilters || activeFilterCount > 0 ? 'bg-ipru-blue border-ipru-blue text-white' : 'border-gray-200 text-gray-500'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-ipru-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="space-y-3 pt-1 page-enter">
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Insurer</div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {INSURERS.map(i => (
                  <button
                    key={i}
                    onClick={() => setInsurer(i)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors whitespace-nowrap
                      ${insurer === i ? 'bg-ipru-blue text-white border-ipru-blue' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Plan Type</div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors whitespace-nowrap
                      ${type === t ? 'bg-ipru-orange text-white border-ipru-orange' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setInsurer('All'); setType('All') }}
                className="flex items-center gap-1 text-xs text-red-500 font-semibold"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product list */}
      <div className="px-4 py-4 space-y-3 max-w-md mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Shield className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No plans match your filters</p>
          </div>
        ) : filtered.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            expanded={expandedId === p.id}
            onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
          />
        ))}
      </div>
    </div>
  )
}
