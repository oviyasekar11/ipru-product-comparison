import { useNavigate } from 'react-router-dom'
import { Shield, Users, BarChart3, Search, Upload, ArrowRight, Sparkles, Target, TrendingUp, MessageCircle, ListFilter } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-ipru-blue via-ipru-blue-dark to-[#001240] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-ipru-blue" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wide">ICICI Prudential</div>
            <div className="text-blue-300 text-[10px] tracking-widest uppercase">Life Insurance</div>
          </div>
        </div>
        <div className="text-blue-300 text-xs bg-white/10 px-3 py-1.5 rounded-full">
          Team Kappa · IIT Madras · SolveX
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center page-enter">
        <div className="inline-flex items-center gap-2 bg-ipru-orange/20 border border-ipru-orange/30 text-ipru-orange-light text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligent Product Comparison & Gap Analysis Tool
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 max-w-4xl">
          Find the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipru-orange to-yellow-300">
            Perfect Insurance
          </span>{' '}
          Plan for Every Need
        </h1>

        <p className="text-blue-200 text-lg max-w-2xl mb-12 leading-relaxed">
          Powered by GenAI — compare IPru products against competitors, identify market gaps,
          and match customers to the right plan in seconds.
        </p>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full mb-16">
          {/* Customer */}
          <button
            onClick={() => navigate('/customer')}
            className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-ipru-orange/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-ipru-orange rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Customer Portal</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Answer a few questions and discover the best life insurance plans matched to your needs, with side-by-side gap analysis.
            </p>
            <div className="flex items-center gap-2 text-ipru-orange text-sm font-semibold group-hover:gap-3 transition-all">
              Find My Plan <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => navigate('/admin')}
            className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-blue-400/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-ipru-blue-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Admin Portal</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Upload product brochures, manage competitor PDFs, run the scraper pipeline, and monitor the knowledge base.
            </p>
            <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold group-hover:gap-3 transition-all">
              Manage Data <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Quick access — chat & catalog */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => navigate('/customer', { state: { initialFlow: 'chat' } })}
            className="flex items-center gap-2 bg-ipru-orange/15 hover:bg-ipru-orange/25 border border-ipru-orange/30 text-ipru-orange-light text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Try AI Chat Assistant
          </button>
          <button
            onClick={() => navigate('/customer', { state: { initialFlow: 'catalog' } })}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <ListFilter className="w-4 h-4" />
            Browse All Plans
          </button>
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl w-full">
          {[
            { icon: Search, label: 'Feature Matching', desc: 'Natural language search' },
            { icon: BarChart3, label: 'Gap Analysis', desc: 'Visual comparison charts' },
            { icon: Target, label: 'White Spaces', desc: 'Market opportunity finder' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-blue-300" />
              </div>
              <div className="text-white text-sm font-semibold">{label}</div>
              <div className="text-blue-400 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-blue-400 text-xs py-6">
        © 2025 ICICI Prudential Life Insurance · Built by Team Kappa · IIT Madras Hackathon
      </footer>
    </div>
  )
}
