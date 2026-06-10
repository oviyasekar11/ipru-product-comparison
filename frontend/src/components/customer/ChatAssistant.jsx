import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Star, Bot, User, Mic } from 'lucide-react'
import { PRODUCT_CATALOGUE } from '../../data/products'

const QUICK_REPLIES = [
  'Term plan with Return of Premium for a 30 year old',
  'ULIP for long term wealth growth',
  "Child education plan",
  'Retirement plan with monthly income',
]

const insurerInitials = (name) => {
  if (name === 'ICICI Prudential') return 'IP'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('')
}

// Very lightweight keyword-based "matching engine" for the demo
function matchProducts(query) {
  const q = query.toLowerCase()
  const scored = PRODUCT_CATALOGUE.map(p => {
    let score = 0
    const haystack = `${p.name} ${p.type} ${p.tags.join(' ')} ${p.description}`.toLowerCase()

    if (q.includes('term') && p.type === 'Term') score += 3
    if ((q.includes('ulip') || q.includes('wealth') || q.includes('growth')) && p.type === 'ULIP') score += 3
    if ((q.includes('child') || q.includes('kid') || q.includes('education')) && p.type === 'Child Plan') score += 3
    if ((q.includes('retire') || q.includes('pension') || q.includes('income')) && (p.type === 'Retirement' || p.type === 'Endowment')) score += 3
    if ((q.includes('return of premium') || q.includes('rop')) && haystack.includes('return of premium')) score += 2
    if ((q.includes('critical') || q.includes('illness')) && haystack.includes('critical illness')) score += 2
    if (q.includes('joint') && haystack.includes('joint life')) score += 2
    if (q.includes('guarantee') && haystack.includes('guaranteed')) score += 2
    if (p.isIPru) score += 1 // slight home-team boost for demo

    return { ...p, score }
  })
  const ranked = scored.sort((a, b) => b.score - a.score).filter(p => p.score > 0)
  return (ranked.length ? ranked : scored.sort((a, b) => b.score - a.score)).slice(0, 3)
}

function buildBotReply(query) {
  const products = matchProducts(query)
  const ipruCount = products.filter(p => p.isIPru).length
  let text
  if (ipruCount > 0) {
    text = `Based on "${query}", here ${products.length === 1 ? 'is' : 'are'} ${products.length} matching plan${products.length > 1 ? 's' : ''}. ${products[0].isIPru ? `${products[0].name} from IPru looks like your best fit.` : 'Here\'s how IPru compares with the top competitor option.'}`
  } else {
    text = `Here are some plans related to "${query}". Want me to run a deeper gap analysis against IPru's portfolio?`
  }
  return { text, products }
}

function ProductMiniCard({ product }) {
  return (
    <div className={`bg-white rounded-xl border p-3 ${product.isIPru ? 'border-ipru-orange/40' : 'border-gray-100'}`}>
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[10px]
          ${product.isIPru ? 'bg-ipru-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
          {insurerInitials(product.insurer)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            {product.isIPru && (
              <span className="text-[8px] font-bold bg-ipru-orange text-white px-1.5 py-0.5 rounded-full uppercase">IPru</span>
            )}
            <span className="text-[9px] font-semibold bg-blue-50 text-ipru-blue px-1.5 py-0.5 rounded-full">{product.type}</span>
          </div>
          <div className="text-xs font-bold text-gray-800 leading-tight mt-0.5">{product.name}</div>
          <div className="text-[10px] text-gray-400">{product.insurer}</div>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold flex-shrink-0">
          <Star className="w-2.5 h-2.5 fill-green-500 text-green-500" />
          {product.claimRatio}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-500">
        <span>Premium <strong className="text-gray-700">{product.premium}</strong></span>
        <span>Cover <strong className="text-gray-700">{product.cover}</strong></span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {product.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] bg-orange-50 text-ipru-orange px-1.5 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 bg-ipru-blue rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: "Hi! I'm the IPru product assistant. Tell me what you're looking for — e.g. \"I'm 30 and want a term plan with Return of Premium\" — and I'll match it against IPru and competitor plans.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: trimmed }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const { text: replyText, products } = buildBotReply(trimmed)
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, from: 'bot', text: replyText, products },
      ])
      setTyping(false)
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-ipru-gray flex justify-center">
      <div className="w-full max-w-md flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Chat header */}
        <div className="sticky top-16 z-30 bg-ipru-blue text-white px-4 py-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">IPru Product Assistant</div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-200">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online · GenAI powered
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-ipru-orange flex-shrink-0" />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                ${m.from === 'user' ? 'bg-ipru-orange' : 'bg-ipru-blue'}`}>
                {m.from === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[78%] space-y-2`}>
                <div className={`px-4 py-2.5 text-sm leading-relaxed
                  ${m.from === 'user'
                    ? 'bg-ipru-orange text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-bl-sm'
                  }`}>
                  {m.text}
                </div>
                {m.products && (
                  <div className="space-y-2">
                    {m.products.map(p => <ProductMiniCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && <TypingIndicator />}

          {/* Quick replies — only show after first bot message and no user msg yet */}
          {messages.length === 1 && !typing && (
            <div className="pl-9 flex flex-wrap gap-2 page-enter">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white border border-ipru-blue/20 text-ipru-blue px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-3 py-3 flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 flex-shrink-0">
            <Mic className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(input) }}
            placeholder="Describe what you're looking for..."
            className="flex-1 bg-ipru-gray rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
              ${input.trim() ? 'bg-ipru-orange text-white' : 'bg-gray-100 text-gray-300'}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
