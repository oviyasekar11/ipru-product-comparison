import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Onboarding from '../components/customer/Onboarding'
import FeatureSearch from '../components/customer/FeatureSearch'
import ProductResults from '../components/customer/ProductResults'
import GapAnalysis from '../components/customer/GapAnalysis'
import { Home, ClipboardList, Search, BarChart3, ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 'onboard', label: 'Profile', icon: ClipboardList },
  { id: 'search',  label: 'Search',  icon: Search },
  { id: 'results', label: 'Results', icon: Home },
  { id: 'gap',     label: 'Analysis', icon: BarChart3 },
]

export default function CustomerPortal() {
  const navigate = useNavigate()
  const [flow, setFlow] = useState('onboard')   // onboard | search | results | gap
  const [quizAnswers, setQuizAnswers] = useState(null)
  const [products, setProducts] = useState([])
  const [features, setFeatures] = useState([])

  const stepIndex = STEPS.findIndex(s => s.id === flow)

  const handleOnboardingComplete = (answers, questions) => {
    setQuizAnswers({ answers, questions })
    setFlow('results')
  }

  const handleFeatureSearch = (query) => {
    setFlow('results')
  }

  const handleCompare = (prods, feats) => {
    setProducts(prods)
    setFeatures(feats)
    setFlow('gap')
  }

  return (
    <div className="min-h-screen flex flex-col bg-ipru-gray">
      <Navbar variant="customer" />

      {/* Step indicator */}
      {flow !== 'onboard' && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const done = i < stepIndex
              const active = i === stepIndex
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => done && setFlow(step.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${active ? 'bg-ipru-blue text-white' : done ? 'text-ipru-blue hover:bg-blue-50' : 'text-gray-400'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {step.label}
                  </button>
                  {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-1" />}
                </div>
              )
            })}

            {/* Search toggle */}
            {flow !== 'search' && (
              <button
                onClick={() => setFlow('search')}
                className="ml-auto flex items-center gap-1.5 text-xs text-ipru-orange font-semibold hover:underline"
              >
                <Search className="w-3.5 h-3.5" />
                Custom Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {flow === 'onboard' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        {flow === 'search' && (
          <FeatureSearch onSearch={handleFeatureSearch} />
        )}
        {flow === 'results' && (
          <ProductResults answers={quizAnswers} onCompare={handleCompare} />
        )}
        {flow === 'gap' && (
          <GapAnalysis products={products} features={features} />
        )}
      </div>
    </div>
  )
}
