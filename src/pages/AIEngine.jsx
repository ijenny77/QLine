import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Zap, TrendingUp, Clock, Users, AlertTriangle, CheckCircle,
  Activity, Cpu, Database, BarChart3, ArrowRight, RefreshCw, Shuffle
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ── Live prediction ticker ────────────────────────────────────────────────────
const predictionFeed = [
  { type: 'delay',    user: 'QL-4831', prob: 74, msg: 'User QL-4831 has 74% chance of being late' },
  { type: 'surge',    user: null,      prob: 91, msg: 'Peak surge predicted in 12 minutes (+47 users)' },
  { type: 'staff',    user: null,      prob: 88, msg: 'Recommend opening Counter D immediately' },
  { type: 'reroute',  user: 'QL-4839', prob: 82, msg: 'Rerouting QL-4839 to Counter B for faster service' },
  { type: 'accuracy', user: null,      prob: 94, msg: 'Wait time prediction accuracy: 94.2% this hour' },
  { type: 'delay',    user: 'QL-4845', prob: 68, msg: 'User QL-4845 (SMS) — 68% late probability. Notified.' },
  { type: 'surge',    user: null,      prob: 79, msg: 'Traffic clearing — queue will drop in 8 minutes' },
  { type: 'staff',    user: null,      prob: 85, msg: 'Counter A efficiency drop 12%. Supervisor alerted.' },
]

const typeConfig = {
  delay:    { color: '#f59e0b', bg: 'bg-yellow-500/10 border-yellow-500/20', badge: 'badge-yellow', icon: Clock },
  surge:    { color: '#ef4444', bg: 'bg-red-500/10 border-red-500/20',       badge: 'badge-red',    icon: TrendingUp },
  staff:    { color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20',     badge: 'badge-blue',   icon: Users },
  reroute:  { color: '#8b5cf6', bg: 'bg-purple-500/10 border-purple-500/20', badge: 'badge-purple', icon: Shuffle },
  accuracy: { color: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20',badge: 'badge-green', icon: CheckCircle },
}


function useRealtimeData(base, spread = 10, interval = 1500) {
  const [data, setData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      t: i,
      value: base + (Math.random() - 0.5) * spread,
    }))
  )
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => [
        ...prev.slice(1),
        { t: (prev[prev.length - 1]?.t || 0) + 1, value: base + (Math.random() - 0.5) * spread },
      ])
    }, interval)
    return () => clearInterval(timer)
  }, [base, spread, interval])
  return data
}

// ── Confidence meter ──────────────────────────────────────────────────────────
function ConfidenceMeter({ value, label, color }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0">
        <svg viewBox="0 0 36 36" className="rotate-[-90deg] w-full h-full">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <motion.circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${value} ${100 - value}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 100' }}
            animate={{ strokeDasharray: `${value} ${100 - value}` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {value}%
        </span>
      </div>
      <div>
        <div className="text-white text-sm font-semibold">{label}</div>
        <div className="text-slate-500 text-xs">Confidence score</div>
      </div>
    </div>
  )
}


function ModelCard({ name, type, accuracy, status, trained, params }) {
  return (
    <div className="glass p-5 rounded hover:bg-white/8 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-purple-500/10">
          <Brain size={18} className="text-purple-400" />
        </div>
        <span className={`badge text-[10px] ${status === 'production' ? 'badge-green' : 'badge-yellow'}`}>
          {status}
        </span>
      </div>
      <h4 className="font-bold text-white text-sm mb-1">{name}</h4>
      <p className="text-slate-500 text-xs mb-4">{type}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Accuracy</span>
          <span className="text-emerald-400 font-semibold">{accuracy}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 pt-1">
          <span>Trained on {trained}</span>
          <span>{params}</span>
        </div>
      </div>
    </div>
  )
}

export default function AIEngine() {
  const [feedItems, setFeedItems] = useState(predictionFeed.slice(0, 3))
  const [feedIdx, setFeedIdx]     = useState(3)
  const [isRunning, setIsRunning] = useState(true)

  const waitData       = useRealtimeData(18, 8)
  const efficiencyData = useRealtimeData(87, 5, 2000)
  const congestionData = useRealtimeData(42, 15, 1800)

  // Ticker: add a new prediction every 3s
  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setFeedItems(prev => [
        predictionFeed[feedIdx % predictionFeed.length],
        ...prev.slice(0, 4),
      ])
      setFeedIdx(i => i + 1)
    }, 3000)
    return () => clearInterval(timer)
  }, [isRunning, feedIdx])

  return (
    <div className="min-h-screen pt-24 px-4 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="section-label mb-2">AI Engine</div>
            <h1 className="font-display font-black text-3xl text-white">
              QLine <span className="gradient-text">Intelligence Layer</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Live ML predictions, congestion modeling, and smart queue optimization
            </p>
          </div>
          <button
            onClick={() => setIsRunning(r => !r)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all
              ${isRunning
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            {isRunning ? 'AI Running' : 'AI Paused'}
          </button>
        </div>

        {/* Confidence meters */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Wait Time Prediction',  value: 94, color: '#3b82f6' },
            { label: 'Delay Detection',        value: 91, color: '#8b5cf6' },
            { label: 'Peak Traffic Forecast',  value: 86, color: '#06b6d4' },
          ].map(m => (
            <div key={m.label} className="glass p-5 rounded">
              <ConfidenceMeter {...m} />
            </div>
          ))}
        </div>

        {/* Live charts + feed */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Real-time charts */}
          <div className="lg:col-span-2 space-y-5">

            <div className="glass p-5 rounded">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-blue-400" />
                  <span className="font-semibold text-white text-sm">Live Wait Time Prediction</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <RefreshCw size={10} className="animate-spin" /> Real-time
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={waitData}>
                  <defs>
                    <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#wt)" strokeWidth={2} dot={false} />
                  <XAxis hide /> <YAxis hide />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={v => [`${v.toFixed(1)} min`, 'Est. Wait']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="glass p-5 rounded">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-emerald-400" />
                  <span className="font-semibold text-white text-sm">Efficiency Score</span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={efficiencyData}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    <XAxis hide /> <YAxis hide domain={[70, 100]} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={v => [`${v.toFixed(1)}%`, 'Efficiency']} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="glass p-5 rounded">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="font-semibold text-white text-sm">Congestion Index</span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={congestionData}>
                    <defs>
                      <linearGradient id="cong" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#cong)" strokeWidth={2} dot={false} />
                    <XAxis hide /> <YAxis hide />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={v => [`${v.toFixed(0)}%`, 'Load']} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Brain size={16} className="text-purple-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
              </div>
              <span className="font-semibold text-white text-sm">Live Prediction Feed</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-72">
              <AnimatePresence>
                {feedItems.map((item, i) => {
                  const cfg = typeConfig[item.type] || typeConfig.accuracy
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={`${item.msg}-${i}`}
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-3 rounded-xl border ${cfg.bg} text-xs`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon size={13} style={{ color: cfg.color }} className="shrink-0 mt-0.5" />
                        <p className="text-slate-300 leading-relaxed">{item.msg}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`badge ${cfg.badge} text-[9px]`}>{item.prob}% confidence</span>
                        <span className="text-slate-600 text-[10px]">{new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-display font-bold text-xl text-white mb-5">Deployed ML Models</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'WaitPredict v3.2',    type: 'LSTM Time Series',        accuracy: 94, status: 'production', trained: '2.1M events', params: '4.2M params' },
              { name: 'DelayDetect v2.8',    type: 'Random Forest Classifier',accuracy: 91, status: 'production', trained: '890K events', params: '1.8M params' },
              { name: 'SurgeForcast v1.5',   type: 'XGBoost Regression',      accuracy: 86, status: 'production', trained: '3.4M events', params: '2.1M params' },
              { name: 'StaffOptim v2.1',     type: 'Reinforcement Learning',  accuracy: 88, status: 'staging',    trained: '650K events', params: '8.4M params' },
            ].map(m => <ModelCard key={m.name} {...m} />)}
          </div>
        </div>

        <div className="glass p-8 rounded">
          <h2 className="font-display font-bold text-xl text-white mb-6">AI Architecture</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database, color: '#3b82f6', title: 'Data Layer',
                items: ['Real-time queue events', 'Historical patterns', 'User behavior signals', 'Geolocation data', 'SMS/USSD logs'],
              },
              {
                icon: Cpu, color: '#8b5cf6', title: 'Intelligence Layer',
                items: ['LSTM for time series', 'Random Forest for delay', 'XGBoost for surges', 'RL for staff optimization', 'NLP for SMS parsing'],
              },
              {
                icon: Zap, color: '#10b981', title: 'Action Layer',
                items: ['Real-time repositioning', 'SMS/USSD notifications', 'Staff recommendations', 'Counter rebalancing', 'ETA broadcasting'],
              },
            ].map(layer => (
              <div key={layer.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${layer.color}20` }}>
                    <layer.icon size={18} style={{ color: layer.color }} />
                  </div>
                  <span className="font-bold text-white">{layer.title}</span>
                </div>
                <ul className="space-y-2.5">
                  {layer.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <ArrowRight size={12} style={{ color: layer.color }} className="shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
