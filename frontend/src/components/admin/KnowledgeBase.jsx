import { useState } from 'react'
import { FileText, Search, Tag, Trash2, Eye, Download, Filter } from 'lucide-react'

const MOCK_DOCS = [
  { id: 1, name: 'IPru iProtect Smart Brochure v3.pdf', insurer: 'ICICI Prudential', type: 'Term', pages: 28, indexed: '2025-10-28', size: '1.2 MB', features: ['ROP', 'CI Rider', 'Waiver of Premium'] },
  { id: 2, name: 'IPru Guaranteed Income for Tomorrow.pdf', insurer: 'ICICI Prudential', type: 'Endowment', pages: 24, indexed: '2025-10-28', size: '0.9 MB', features: ['Guaranteed Returns', 'Monthly Income'] },
  { id: 3, name: 'HDFC Click 2 Protect Super 2024.pdf', insurer: 'HDFC Life', type: 'Term', pages: 32, indexed: '2025-10-28', size: '1.5 MB', features: ['ROP', 'CI Rider', 'Joint Life'] },
  { id: 4, name: 'Max Smart Secure Plus Product Note.pdf', insurer: 'Max Life', type: 'Term', pages: 20, indexed: '2025-10-27', size: '0.8 MB', features: ['ROP', 'Accident Benefit'] },
  { id: 5, name: 'Tata AIA Sampoorna Raksha Brochure.pdf', insurer: 'Tata AIA', type: 'Term', pages: 26, indexed: '2025-10-28', size: '1.1 MB', features: ['CI Rider', 'Premium Flexibility'] },
  { id: 6, name: 'SBI eShield Next Product Brochure.pdf', insurer: 'SBI Life', type: 'Term', pages: 18, indexed: '2025-10-26', size: '0.7 MB', features: ['Accident Benefit', 'Monthly Income'] },
  { id: 7, name: 'IPru Wealth Builder ULIP 2024.pdf', insurer: 'ICICI Prudential', type: 'ULIP', pages: 40, indexed: '2025-10-25', size: '2.1 MB', features: ['Market Linked', 'Partial Withdrawal', 'Loyalty Additions'] },
]

const INSURERS_FILTER = ['All', 'ICICI Prudential', 'HDFC Life', 'Max Life', 'SBI Life', 'Tata AIA']
const TYPES_FILTER = ['All', 'Term', 'ULIP', 'Endowment', 'Child Plan', 'Retirement']

export default function KnowledgeBase() {
  const [search, setSearch] = useState('')
  const [insurerFilter, setInsurerFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = MOCK_DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.features.some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchInsurer = insurerFilter === 'All' || d.insurer === insurerFilter
    const matchType = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchInsurer && matchType
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
        <p className="text-sm text-gray-500 mt-1">All indexed product brochures. Search by name, insurer, or feature keyword.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Documents', val: MOCK_DOCS.length },
          { label: 'IPru Products', val: MOCK_DOCS.filter(d => d.insurer === 'ICICI Prudential').length },
          { label: 'Competitor Docs', val: MOCK_DOCS.filter(d => d.insurer !== 'ICICI Prudential').length },
        ].map(({ label, val }) => (
          <div key={label} className="card text-center">
            <div className="text-2xl font-extrabold text-ipru-blue">{val}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents or features..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
          />
        </div>
        <select
          value={insurerFilter}
          onChange={e => setInsurerFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
        >
          {INSURERS_FILTER.map(i => <option key={i}>{i}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
        >
          {TYPES_FILTER.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents match your filters</p>
          </div>
        ) : filtered.map(doc => (
          <div key={doc.id} className="card flex items-start gap-3 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${doc.insurer === 'ICICI Prudential' ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <FileText className={`w-5 h-5 ${doc.insurer === 'ICICI Prudential' ? 'text-ipru-orange' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-800 truncate">{doc.name}</span>
                {doc.insurer === 'ICICI Prudential' && (
                  <span className="text-[9px] font-bold bg-ipru-orange text-white px-1.5 py-0.5 rounded-full uppercase flex-shrink-0">IPru</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                <span>{doc.insurer}</span>
                <span>·</span>
                <span>{doc.type}</span>
                <span>·</span>
                <span>{doc.pages} pages</span>
                <span>·</span>
                <span>{doc.size}</span>
                <span>·</span>
                <span>Indexed {doc.indexed}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {doc.features.map(f => (
                  <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />{f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="p-2 text-gray-400 hover:text-ipru-blue hover:bg-blue-50 rounded-lg transition-colors" title="View">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
