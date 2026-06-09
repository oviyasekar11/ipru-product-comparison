import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts'
import { AlertTriangle, CheckCircle2, XCircle, Lightbulb, TrendingUp } from 'lucide-react'

const RADAR_DATA = [
  { feature: 'Protection', IPru: 95, Market: 78 },
  { feature: 'Flexibility', IPru: 72, Market: 85 },
  { feature: 'Returns', IPru: 88, Market: 80 },
  { feature: 'Riders', IPru: 90, Market: 70 },
  { feature: 'Affordability', IPru: 85, Market: 75 },
  { feature: 'Digital', IPru: 80, Market: 82 },
]

const BAR_DATA = [
  { name: 'IPru iProtect', score: 96, fill: '#003087' },
  { name: 'HDFC Click 2', score: 88, fill: '#6366f1' },
  { name: 'Max Smart', score: 82, fill: '#8b5cf6' },
  { name: 'Tata AIA', score: 75, fill: '#a78bfa' },
]

const WHITE_SPACES = [
  { opportunity: 'Joint Life Term Plan with CI Rider', demand: 'High', gap: 'IPru has no joint life + CI combo product' },
  { opportunity: 'Monthly Income + Lump Sum Combo Payout', demand: 'Medium', gap: 'Competitors offer staggered payout; IPru does not' },
  { opportunity: 'Premium Flexibility Mid-Policy', demand: 'High', gap: 'Market increasingly demands top-up/reduce options' },
]

const demandColor = { High: 'badge-red', Medium: 'badge-orange', Low: 'badge-green' }

export default function GapAnalysis({ products, features }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Gap Analysis & Market Comparison</h2>
        <p className="text-gray-500 text-sm mt-1">Strategic view of IPru vs. competitor offerings across your selected features.</p>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Feature Coverage Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Radar name="IPru" dataKey="IPru" stroke="#003087" fill="#003087" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Market Avg" dataKey="Market" stroke="#F47920" fill="#F47920" fillOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Match Score vs. Your Profile</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BAR_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#374151' }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Match Score']} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {BAR_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature matrix */}
      <div className="card overflow-x-auto">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Side-by-Side Feature Matrix</h3>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 font-semibold text-gray-600 w-48">Feature</th>
              {products.map(p => (
                <th key={p.id} className="text-center py-2 px-3 font-semibold text-gray-700">
                  <div className="flex flex-col items-center gap-1">
                    {p.isIPru && <span className="text-[9px] bg-ipru-orange text-white px-1.5 py-0.5 rounded-full uppercase font-bold">IPru</span>}
                    <span className="text-xs leading-tight">{p.name.split(' ').slice(0, 3).join(' ')}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feat, i) => (
              <tr key={feat} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2.5 pr-4 text-gray-700 font-medium">{feat}</td>
                {products.map(p => (
                  <td key={p.id} className="text-center py-2.5 px-3">
                    {p.features[feat]
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      : <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* White spaces */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-ipru-orange" />
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Market White Spaces — Opportunities for IPru</h3>
        </div>
        <div className="space-y-3">
          {WHITE_SPACES.map((ws, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{ws.opportunity}</span>
                  <span className={demandColor[ws.demand]}>{ws.demand} Demand</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{ws.gap}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IPru summary */}
      <div className="bg-gradient-to-r from-ipru-blue/5 to-ipru-orange/5 border border-ipru-blue/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-ipru-blue" />
          <h3 className="font-bold text-ipru-blue">IPru Advantage Summary</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { val: '96%', label: 'Best match for your profile' },
            { val: '4/7', label: 'Features uniquely strong vs competitors' },
            { val: '3', label: 'Market gaps IPru can fill' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-extrabold text-ipru-orange">{val}</div>
              <div className="text-xs text-gray-600 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
