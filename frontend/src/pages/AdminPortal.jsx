import { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import PDFUploader from '../components/admin/PDFUploader'
import ScraperDashboard from '../components/admin/ScraperDashboard'
import KnowledgeBase from '../components/admin/KnowledgeBase'
import { Upload, Globe, Database, BarChart3, Settings, Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const TABS = [
  { id: 'upload',   label: 'Upload PDFs',      icon: Upload },
  { id: 'scraper',  label: 'Web Scraper',      icon: Globe },
  { id: 'kb',       label: 'Knowledge Base',   icon: Database },
]

const SYSTEM_STATS = [
  { label: 'Documents Indexed', val: '69', delta: '+3 today', icon: Database, color: 'text-blue-600' },
  { label: 'Products Tracked', val: '5', delta: 'Insurers', icon: BarChart3, color: 'text-purple-600' },
  { label: 'Last Pipeline Run', val: '2h ago', delta: 'All success', icon: Activity, color: 'text-green-600' },
  { label: 'Workers Active', val: '3/3', delta: 'Healthy', icon: CheckCircle2, color: 'text-emerald-600' },
]

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div className="min-h-screen bg-ipru-gray flex flex-col">
      <Navbar variant="admin" />

      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
        {/* Page header */}
        <div className="mb-8 page-enter">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product data, run scrapers, and monitor the AI knowledge base.</p>
        </div>

        {/* System stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {SYSTEM_STATS.map(({ label, val, delta, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className={`text-2xl font-extrabold ${color}`}>{val}</div>
              <div className="text-xs text-gray-400 mt-1">{delta}</div>
            </div>
          ))}
        </div>

        {/* Tabs + content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="flex md:flex-col gap-2 md:w-48 flex-shrink-0">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left
                    ${activeTab === tab.id
                      ? 'bg-ipru-blue text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              )
            })}

            {/* Pipeline status mini-card */}
            <div className="hidden md:block card mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-xs font-bold text-green-700 mb-2">Pipeline Status</div>
              {[
                { label: 'Scraper', ok: true },
                { label: 'Classifier', ok: true },
                { label: 'Embedder', ok: true },
                { label: 'Vector DB', ok: false },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-600">{label}</span>
                  {ok
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 card page-enter" key={activeTab}>
            {activeTab === 'upload'  && <PDFUploader />}
            {activeTab === 'scraper' && <ScraperDashboard />}
            {activeTab === 'kb'      && <KnowledgeBase />}
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-400 text-xs py-4 border-t border-gray-200 bg-white">
        ICICI Prudential · Intelligent Product Comparison System · Team Kappa · IIT Madras · SolveX 2025
      </footer>
    </div>
  )
}
