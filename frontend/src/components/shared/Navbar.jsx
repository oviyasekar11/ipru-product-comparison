import { Link, useLocation } from 'react-router-dom'
import { Shield, Settings, ChevronRight } from 'lucide-react'

export default function Navbar({ variant = 'customer' }) {
  const location = useLocation()
  const isAdmin = variant === 'admin'

  return (
    <nav className="bg-ipru-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-ipru-blue" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm tracking-wide">ICICI Prudential</div>
              <div className="text-[10px] text-blue-200 tracking-widest uppercase">Life Insurance</div>
            </div>
          </Link>

          {/* Center title */}
          <div className="hidden md:block text-center">
            <div className="text-sm font-semibold text-blue-100">
              {isAdmin ? 'Admin Portal — Product Data Management' : 'Intelligent Product Comparison Engine'}
            </div>
            <div className="text-[10px] text-blue-300">
              {isAdmin ? 'Team Kappa · IIT Madras' : 'Powered by GenAI · SolveX'}
            </div>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link to="/customer" className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                <span>Customer View</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link to="/admin" className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
            <div className="w-8 h-8 bg-ipru-orange rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
              {isAdmin ? 'KT' : 'U'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
