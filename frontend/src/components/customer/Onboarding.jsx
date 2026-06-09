import { useState } from 'react'
import { ChevronRight, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react'
import ProgressBar from '../shared/ProgressBar'

const QUESTIONS = [
  {
    id: 'q1',
    text: "What's your main goal with this plan?",
    icon: '🎯',
    options: [
      { key: 'A', label: 'Protect my family financially if I\'m no longer around', tags: ['term', 'protection'] },
      { key: 'B', label: 'Grow my money over the long term', tags: ['ulip', 'growth'] },
      { key: 'C', label: 'Build a steady income for my retirement', tags: ['pension', 'annuity'] },
      { key: 'D', label: "Save for my child's education or future milestone", tags: ['child', 'savings'] },
    ],
  },
  {
    id: 'q2',
    text: 'How comfortable are you with investment risk?',
    icon: '📊',
    options: [
      { key: 'A', label: 'I want guaranteed returns — no surprises', tags: ['guaranteed', 'traditional'] },
      { key: 'B', label: 'Some risk is fine if it means better returns', tags: ['balanced', 'moderate'] },
      { key: 'C', label: "I'm comfortable with stock market ups and downs", tags: ['equity', 'aggressive'] },
      { key: 'D', label: 'I want market-linked growth but with my capital protected', tags: ['ulip', 'capital-guarantee'] },
    ],
  },
  {
    id: 'q3',
    text: 'How long can you stay invested without touching this money?',
    icon: '⏳',
    options: [
      { key: 'A', label: 'Less than 5 years', tags: ['short-term'] },
      { key: 'B', label: '5 to 10 years', tags: ['medium-term'] },
      { key: 'C', label: '10 to 20 years', tags: ['long-term'] },
      { key: 'D', label: '20 years or more — I\'m in it for the long run', tags: ['very-long-term', 'retirement'] },
    ],
  },
  {
    id: 'q4',
    text: 'Who financially depends on you?',
    icon: '👨‍👩‍👧‍👦',
    options: [
      { key: 'A', label: 'No one — just myself', tags: ['individual'] },
      { key: 'B', label: 'My spouse or partner', tags: ['couple'] },
      { key: 'C', label: 'My young children', tags: ['family', 'child-plan'] },
      { key: 'D', label: 'My aging parents and/or my family', tags: ['family', 'dependents'] },
    ],
  },
  {
    id: 'q5',
    text: 'Would you want the option to access your money before maturity?',
    icon: '💰',
    options: [
      { key: 'A', label: 'Yes — I may need funds at any time', tags: ['liquidity', 'flexible'] },
      { key: 'B', label: 'Maybe — but only after the first few years', tags: ['partial-withdrawal'] },
      { key: 'C', label: 'No — I will stay committed until the end', tags: ['committed', 'locked'] },
    ],
  },
  {
    id: 'q6',
    text: 'Are you concerned about any of these health situations?',
    icon: '🏥',
    multi: true,
    options: [
      { key: 'A', label: 'A serious illness like cancer, heart disease, or a stroke', tags: ['critical-illness'] },
      { key: 'B', label: 'An accident causing death or permanent disability', tags: ['accident', 'disability'] },
      { key: 'C', label: 'Both of the above', tags: ['critical-illness', 'accident', 'disability'] },
      { key: 'D', label: 'Neither — I only need life cover', tags: ['basic-life'] },
    ],
  },
  {
    id: 'q7',
    text: 'How would you prefer to pay your premiums?',
    icon: '💳',
    options: [
      { key: 'A', label: 'One large amount upfront, done', tags: ['single-premium'] },
      { key: 'B', label: 'For a fixed number of years, then stop paying', tags: ['limited-pay'] },
      { key: 'C', label: 'Every year for the full policy duration', tags: ['regular-pay', 'annual'] },
      { key: 'D', label: 'Every month in smaller amounts', tags: ['monthly', 'regular-pay'] },
    ],
  },
  {
    id: 'q8',
    text: 'When this plan matures or ends, what outcome matters most to you?',
    icon: '🏆',
    options: [
      { key: 'A', label: 'Get all my premiums back — I paid in, I want it returned', tags: ['rop', 'return-of-premium'] },
      { key: 'B', label: 'Receive a regular monthly or annual income', tags: ['income', 'annuity'] },
      { key: 'C', label: 'Receive the maximum possible lump sum payout', tags: ['lump-sum', 'maturity'] },
      { key: 'D', label: 'Leave behind a financial legacy for my family', tags: ['legacy', 'whole-life'] },
    ],
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState([])

  const q = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1

  const toggleOption = (key) => {
    if (q.multi) {
      setSelected(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      )
    } else {
      setSelected([key])
    }
  }

  const handleNext = () => {
    if (!selected.length) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)

    if (isLast) {
      onComplete(newAnswers, QUESTIONS)
    } else {
      setStep(s => s + 1)
      setSelected([])
    }
  }

  const handleBack = () => {
    if (step === 0) return
    setStep(s => s - 1)
    setSelected(answers[QUESTIONS[step - 1].id] || [])
  }

  return (
    <div className="min-h-screen bg-ipru-gray flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-ipru-blue">
              Question {step + 1} of {QUESTIONS.length}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              ~{Math.round((QUESTIONS.length - step) * 11)}s remaining
            </span>
          </div>
          <ProgressBar current={step + 1} total={QUESTIONS.length} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl page-enter" key={step}>
          {/* Question card */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{q.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">{q.text}</h2>
            {q.multi && (
              <p className="text-sm text-gray-500 mt-2">Select all that apply</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isChosen = selected.includes(opt.key)
              return (
                <button
                  key={opt.key}
                  onClick={() => toggleOption(opt.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
                    ${isChosen
                      ? 'border-ipru-orange bg-orange-50 shadow-md scale-[1.01]'
                      : 'border-gray-200 bg-white hover:border-ipru-blue/40 hover:shadow-sm hover:scale-[1.005]'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
                    ${isChosen ? 'bg-ipru-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {isChosen ? <CheckCircle2 className="w-5 h-5" /> : opt.key}
                  </div>
                  <span className={`text-sm font-medium leading-snug ${isChosen ? 'text-ipru-orange' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-ipru-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!selected.length}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${selected.length
                  ? 'bg-ipru-orange text-white hover:bg-ipru-orange-light shadow-lg hover:shadow-xl active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isLast ? 'Find My Plans' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
