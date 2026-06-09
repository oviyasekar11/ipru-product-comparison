import { useState } from 'react'
import { Globe, RefreshCw, CheckCircle2, AlertCircle, Clock, Play, Pause, ExternalLink, Calendar } from 'lucide-react'

const SCRAPERS = [
  {
    id: 1, insurer: 'ICICI Prudential', url: 'iciciprulife.com/products',
    lastRun: '2025-10-28 09:00', status: 'success', docs: 24, nextRun: 'Nov 28 09:00',
  },
  {
    id: 2, insurer: 'HDFC Life', url: 'hdfclife.com/insurance-plans',
    lastRun: '2025-10-28 09:05', status: 'success', docs: 18, nextRun: 'Nov 28 09:05',
  },
  {
    id: 3, insurer: 'Max Life', url: 'maxlifeinsurance.com/all-products',
    lastRun: '2025-10-27 22:00', status: 'warning', docs: 12, nextRun: 'Nov 27 22:00',
  },
  {
    id: 4, insurer: 'SBI Life', url: 'sbilife.co.in/web/guest/products',
    lastRun: '2025-10-26 18:00', status: 'error', docs: 0, nextRun: 'Retry pending',
  },
  {
    id: 5, insurer: 'Tata AIA', url: 'tataaia.com/life-insurance-plans',
    lastRun: '2025-10-28 10:00', status: 'success', docs: 15, nextRun: 'Nov 28 10:00',
  },
]

const statusStyle = {
  success: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Success' },
  warning: { icon: AlertCircle,  color: 'text-amber-600',  bg: 'bg-amber-100',  label: 'Partial' },
  error:   { icon: AlertCircle,  color: 'text-red-600',    bg: 'bg-red-100',    label: 'Failed' },
  running: { icon: RefreshCw,    color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Running' },
}

export default function ScraperDashboard() {
  const [scrapers, setScrapers] = useState(SCRAPERS)
  const [running, setRunning] = useState(new Set())

  const runScraper = (id) => {
    setRunning(prev => new Set([...prev, id]))
    setScrapers(prev => prev.map(s => s.id === id ? { ...s, status: 'running' } : s))
    setTimeout(() => {
      setRunning(prev => { const n = new Set(prev); n.delete(id); return n })
      setScrapers(prev => prev.map(s => s.id === id
        ? { ...s, status: 'success', lastRun: new Date().toISOString().slice(0, 16).replace('T', ' '), docs: s.docs + 2 }
        : s))
    }, 3000)
  }

  const runAll = () => SCRAPERS.forEach(s => runScraper(s.id))

  const totalDocs = scrapers.reduce((sum, s) => sum + s.docs, 0)
  const successCount = scrapers.filter(s => s.status === 'success').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Web Scraper Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and trigger automated PDF scraping from insurer websites.</p>
        </div>
        <button
          onClick={runAll}
          className="flex items-center gap-2 btn-primary text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Run All Scrapers
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Docs Indexed', val: totalDocs, color: 'text-ipru-blue' },
          { label: 'Sources Active', val: `${successCount}/${scrapers.length}`, color: 'text-green-600' },
          { label: 'Last Refresh', val: 'Today 10:00', color: 'text-gray-700' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-extrabold ${color}`}>{val}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Scraper list */}
      <div className="space-y-3">
        {scrapers.map(s => {
          const st = statusStyle[s.status] || statusStyle.error
          const Icon = st.icon
          const isRunning = s.status === 'running'

          return (
            <div key={s.id} className="card flex items-center gap-4 flex-wrap">
              {/* Globe icon */}
              <div className="w-10 h-10 bg-ipru-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-ipru-blue" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm">{s.insurer}</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                    <Icon className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    {st.label}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{s.docs} docs</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last: {s.lastRun}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Next: {s.nextRun}</span>
                </div>
                <div className="text-[11px] text-blue-500 mt-0.5 truncate">{s.url}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runScraper(s.id)}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 text-xs bg-ipru-blue text-white px-3 py-2 rounded-lg hover:bg-ipru-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isRunning
                    ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running</>
                    : <><Play className="w-3.5 h-3.5" /> Run Now</>
                  }
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Schedule note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-blue-800">Auto-Refresh Schedule</div>
          <div className="text-xs text-blue-600 mt-0.5">
            All scrapers are configured to run on the 28th of each month at their respective times.
            Configure via <code className="bg-blue-100 px-1 rounded">backend/scraper/scheduler.py</code>
          </div>
        </div>
      </div>
    </div>
  )
}
