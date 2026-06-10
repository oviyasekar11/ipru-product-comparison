import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Onboarding from '../components/customer/Onboarding'
import FeatureSearch from '../components/customer/FeatureSearch'
import ProductResults from '../components/customer/ProductResults'
import GapAnalysis from '../components/customer/GapAnalysis'
import PeerComparison from '../components/customer/PeerComparison'
import ChatAssistant from '../components/customer/ChatAssistant'
import InsuranceCatalog from '../components/customer/InsuranceCatalog'
import { ClipboardList, Search, BarChart3, ArrowRightLeft, MessageCircle, ListFilter } from 'lucide-react'

const TABS = [
  { id: 'onboard',  label: 'Profile Quiz',    icon: ClipboardList },
  { id: 'search',   label: 'Feature Search',  icon: Search },
  { id: 'results',  label: 'Results',          icon: BarChart3 },
  { id: 'gap',      label: 'Gap Analysis',     icon: BarChart3 },
  { id: 'compare',  label: 'Peer Compare',     icon: ArrowRightLeft },
  { id: 'chat',     label: 'AI Chat',          icon: MessageCircle },
  { id: 'catalog',  label: 'All Plans',        icon: ListFilter },
]

// Tabs always reachable from anywhere, regardless of onboarding progress
const QUICK_ACCESS = ['chat', 'catalog', 'compare']

export default function CustomerPortal() {
  const location = useLocation()
  const [flow, setFlow] = useState(location.state?.initialFlow || 'onboard')
  const [quizAnswers, setQuizAnswers] = useState(null)
  const [products, setProducts] = useState([])
  const [features, setFeatures] = useState([])

  const stepIndex = TABS.findIndex(s => s.id === flow)

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

  // Tabs shown in the step bar (exclude onboard once flow has started)
  const visibleTabs = flow === 'onboard'
    ? []
    : TABS.filter(t => t.id !== 'onboard')

  return (
    <div className="min-h-screen flex flex-col bg-ipru-gray">
      <Navbar variant="customer" />

      {/* Tab bar (shown after onboarding starts) */}
      {flow !== 'onboard' && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-16 z-40">
          <div className="max-w-5xl mx-auto flex items-center gap-1 flex-wrap">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon
              const active = tab.id === flow
              const done = stepIndex > TABS.findIndex(s => s.id === tab.id)
              const reachable = done || active || QUICK_ACCESS.includes(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => reachable && setFlow(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                    ${active
                      ? 'bg-ipru-blue text-white'
                      : reachable
                        ? 'text-ipru-blue hover:bg-blue-50'
                        : 'text-gray-400 cursor-default'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1" key={flow}>
        {flow === 'onboard'  && <Onboarding onComplete={handleOnboardingComplete} />}
        {flow === 'search'   && <FeatureSearch onSearch={handleFeatureSearch} />}
        {flow === 'results'  && <ProductResults answers={quizAnswers} onCompare={handleCompare} />}
        {flow === 'gap'      && <GapAnalysis products={products} features={features} />}
        {flow === 'compare'  && <PeerComparison />}
        {flow === 'chat'     && <ChatAssistant />}
        {flow === 'catalog'  && <InsuranceCatalog />}
      </div>
    </div>
  )
}
