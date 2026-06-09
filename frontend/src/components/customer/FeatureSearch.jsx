import { useState } from 'react'
import { Search, Mic, Sparkles, ArrowRight, Tag } from 'lucide-react'

const EXAMPLE_QUERIES = [
  'I am 30 years old and looking for term plan with Return of Premium',
  'I want a ULIP with capital protection and 10 year lock-in',
  'Looking for child education plan with waiver of premium',
  'Need a retirement plan with monthly income after 60',
  'Term insurance with critical illness for a 35-year-old smoker',
]

const QUICK_TAGS = [
  'Term + ROP', 'ULIP Growth', 'Child Plan', 'Retirement Income',
  'Critical Illness', 'Joint Life', 'Single Premium', 'Monthly Payout'
]

export default function FeatureSearch({ onSearch }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q = query) => {
    if (!q.trim()) return
    setLoading(true)
    setQuery(q)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    onSearch(q)
  }

  return (
    <div className="min-h-screen bg-ipru-gray flex flex-col items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-ipru-blue/10 text-ipru-blue text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            GenAI-Powered Feature Search
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
            What are you looking for<br />in a life insurance plan?
          </h1>
          <p className="text-gray-500 text-sm">
            Describe in plain English — our engine will match you to the best IPru & competitor products.
          </p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mb-4">
          <div className="flex items-start gap-3 p-2">
            <Search className="w-5 h-5 text-gray-400 mt-3 flex-shrink-0" />
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
              placeholder='e.g. "I am 30 years old and looking for a term plan with Return of Premium..."'
              className="flex-1 resize-none border-0 outline-none text-gray-800 text-sm leading-relaxed min-h-[80px] bg-transparent"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-xs text-gray-400">Press Enter to search · Shift+Enter for new line</span>
            <button
              onClick={() => handleSearch()}
              disabled={!query.trim() || loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${query.trim() && !loading
                  ? 'bg-ipru-orange text-white hover:bg-ipru-orange-light shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>Search <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Quick tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Quick select</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(`Show me products with ${tag}`)}
                className="text-xs bg-white border border-gray-200 text-gray-600 hover:border-ipru-orange hover:text-ipru-orange px-3 py-1.5 rounded-full transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Example queries */}
        <div className="card">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Example searches</div>
          <div className="space-y-2">
            {EXAMPLE_QUERIES.map(eq => (
              <button
                key={eq}
                onClick={() => handleSearch(eq)}
                className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-ipru-gray transition-colors group"
              >
                <Sparkles className="w-4 h-4 text-ipru-orange flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 leading-snug">{eq}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
