import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Clock, TrendingUp, Zap, ChevronRight, Plus, Bell,
  WifiOff, RefreshCw, Brain, AlertTriangle, CheckCircle,
  ArrowUpRight, ArrowDownRight, Monitor, UserPlus, Settings,
  Shuffle, SkipForward, BarChart3, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useQueueStore } from '../store/queueStore'
import { waitTimeData } from '../data/mockData'

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-5 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl`} style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-display font-black text-3xl text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-1">{sub}</div>}
    </motion.div>
  )
}

function AIInsightCard({ insight }) {
  const colors = {
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'badge-yellow' },
    info:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   badge: 'badge-blue' },
    success: { bg: 'bg-emerald-500/10',border: 'border-emerald-500/30',text: 'text-emerald-400',badge: 'badge-green' },
  }
  const c = colors[insight.type] || colors.info

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border ${c.bg} ${c.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Brain size={16} className={`${c.text} mt-0.5 shrink-0`} />
          <div>
            <div className="text-sm font-semibold text-white mb-1">{insight.title}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{insight.message}</p>
          </div>
        </div>
        <div className="shrink-0">
          <span className={`badge ${c.badge} text-[10px]`}>{insight.confidence}%</span>
        </div>
      </div>
    </motion.div>
  )
}

function QueueRow({ user, onReposition }) {
  const channelColors = {
    app:    { color: '#3b82f6', label: 'App' },
    sms:    { color: '#8b5cf6', label: 'SMS' },
    ussd:   { color: '#06b6d4', label: 'USSD' },
    walkin: { color: '#10b981', label: 'Walk-in' },
    qr:     { color: '#f59e0b', label: 'QR' },
  }
  const ch = channelColors[user.channel] || channelColors.app

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all
        ${user.status === 'serving' ? 'bg-emerald-500/10 border border-emerald-500/20' :
          user.status === 'delayed' ? 'bg-yellow-500/10 border border-yellow-500/20' :
          'bg-white/3 hover:bg-white/6 border border-transparent'}`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
        ${user.status === 'serving' ? 'bg-emerald-500 text-white' :
          user.status === 'delayed' ? 'bg-yellow-500 text-dark-900' :
          'bg-white/10 text-slate-300'}`}>
        {user.position}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-white text-sm truncate">{user.name}</span>
          {user.status === 'serving' && <span className="badge badge-green text-[10px]">Serving</span>}
          {user.status === 'delayed' && <span className="badge badge-yellow text-[10px]">Delayed</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono">{user.ticketId}</span>
          <span>·</span>
          <span style={{ color: ch.color }}>{ch.label}</span>
          <span>·</span>
          <Clock size={10} /> <span>~{user.waitTime} min</span>
        </div>
      </div>

      {user.status === 'delayed' && (
        <button
          onClick={() => onReposition(user.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition-all"
        >
          <Shuffle size={12} /> Reposition
        </button>
      )}
    </motion.div>
  )
}

function CounterCard({ counter }) {
  const statusConfig = {
    active: { color: '#10b981', label: 'Active',  bg: 'bg-emerald-500/10 border-emerald-500/30' },
    idle:   { color: '#f59e0b', label: 'Idle',    bg: 'bg-yellow-500/10 border-yellow-500/30' },
    closed: { color: '#6b7280', label: 'Closed',  bg: 'bg-white/5 border-white/10' },
  }
  const cfg = statusConfig[counter.status]

  return (
    <div className={`glass p-4 rounded-xl border ${cfg.bg} flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-sm">{counter.name}</span>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cfg.color }} />
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Staff</div>
        <div className="text-slate-300 text-sm font-medium">{counter.staff}</div>
      </div>
      {counter.serving && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Now Serving</div>
          <div className="font-mono text-blue-400 text-sm font-bold">{counter.serving}</div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="badge text-[10px]" style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
          {cfg.label}
        </span>
        {counter.avgTime > 0 && (
          <span className="text-xs text-slate-500">~{counter.avgTime} min/user</span>
        )}
      </div>
    </div>
  )
}

export default function StaffDashboard() {
  const {
    queue, currentServing, totalToday, avgWaitTime, aiEfficiency,
    activeCounters, aiInsights, isOffline, pendingSync,
    callNext, addWalkIn, repositionDelayed, simulateOfflineChange,
  } = useQueueStore()

  const [walkInName, setWalkInName] = useState('')
  const [showWalkIn, setShowWalkIn] = useState(false)
  const [tab, setTab] = useState('queue')

  useEffect(() => {
    if (!isOffline) return
    const t = setInterval(() => simulateOfflineChange(), 3000)
    return () => clearInterval(t)
  }, [isOffline, simulateOfflineChange])

  const handleCallNext = () => callNext()
  const handleAddWalkIn = () => {
    if (!walkInName.trim()) return
    addWalkIn(walkInName.trim())
    setWalkInName('')
    setShowWalkIn(false)
  }

  const serving = queue.find(u => u.status === 'serving')
  const waiting = queue.filter(u => u.status === 'waiting' || u.status === 'delayed')
  const delayed = queue.filter(u => u.status === 'delayed')

  return (
    <div className="min-h-screen pt-20 px-4 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-white/5 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl lg:text-3xl text-white">Staff Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Equity Bank — Nairobi HQ &nbsp;·&nbsp;
              <span className="text-slate-400">Today, {new Date().toLocaleDateString('en-KE', { weekday:'long', month:'long', day:'numeric' })}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isOffline && (
              <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                <WifiOff size={14} />
                <span>Offline</span>
                {pendingSync > 0 && <span className="badge bg-red-500 text-white text-[10px] px-1.5">{pendingSync}</span>}
              </motion.div>
            )}

            <button onClick={handleCallNext} className="btn-primary px-5 py-2.5 text-sm">
              <SkipForward size={16} /> Call Next
            </button>

            <button
              onClick={() => setShowWalkIn(!showWalkIn)}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              <UserPlus size={16} /> Add Walk-in
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showWalkIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass p-5 rounded flex items-center gap-4">
                <UserPlus size={18} className="text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={walkInName}
                  onChange={e => setWalkInName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddWalkIn()}
                  placeholder="Customer name…"
                  className="input-field flex-1"
                  autoFocus
                />
                <button onClick={handleAddWalkIn} className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap">
                  Add to Queue
                </button>
                <button onClick={() => setShowWalkIn(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users}     label="Total Today"     value={totalToday}      color="#3b82f6" trend={12}  />
          <StatCard icon={Clock}     label="Avg Wait Time"   value={`${avgWaitTime}m`} sub="per user" color="#8b5cf6" trend={-8} />
          <StatCard icon={TrendingUp} label="Queue Size"     value={waiting.length}  color="#06b6d4" />
          <StatCard icon={Zap}       label="AI Efficiency"   value={`${aiEfficiency}%`} color="#10b981" trend={3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            {serving && (
              <motion.div
                key={serving.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass border border-emerald-500/30 bg-emerald-500/5 p-5 rounded"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded bg-emerald-500/20 flex items-center justify-center">
                        <Monitor size={24} className="text-emerald-400" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">Now Serving</div>
                      <div className="font-display font-black text-3xl text-white">{serving.ticketId}</div>
                      <div className="text-slate-400 text-sm">{serving.name}</div>
                    </div>
                  </div>
                  <button onClick={handleCallNext}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 rounded-xl text-white font-semibold text-sm hover:bg-emerald-500 transition-all">
                    <CheckCircle size={16} /> Done → Next
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              {[
                { id: 'queue',    label: 'Live Queue',   count: waiting.length },
                { id: 'counters', label: 'Counters',     count: activeCounters.length },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all
                    ${tab === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {t.label}
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{t.count}</span>
                </button>
              ))}

              {delayed.length > 0 && (
                <div className="ml-auto flex items-center gap-1.5 text-yellow-400 text-xs font-semibold">
                  <AlertTriangle size={13} /> {delayed.length} delayed
                </div>
              )}
            </div>

            {tab === 'queue' && (
              <div className="glass rounded overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Waiting Queue</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-500">Live</span>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {waiting.map(user => (
                      <QueueRow key={user.id} user={user} onReposition={repositionDelayed} />
                    ))}
                  </AnimatePresence>
                  {waiting.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle size={32} className="mx-auto mb-2 text-emerald-500/50" />
                      Queue is empty!
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'counters' && (
              <div className="grid grid-cols-2 gap-4">
                {activeCounters.map(counter => (
                  <CounterCard key={counter.id} counter={counter} />
                ))}
              </div>
            )}

            <div className="glass p-5 rounded">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white text-sm">Today's Queue Flow</span>
                <span className="badge badge-blue text-[10px]">Live</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={waitTimeData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="after" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="after" stroke="#3b82f6" fill="url(#after)" strokeWidth={2} name="Wait (min)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">

            <div className="glass p-5 rounded">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded bg-purple-500/20">
                  <Brain size={16} className="text-purple-400" />
                </div>
                <span className="font-semibold text-white text-sm">AI Insights</span>
                <span className="ml-auto badge badge-purple text-[10px]">Live</span>
              </div>
              <div className="space-y-3">
                {aiInsights.slice(0, 4).map(insight => (
                  <AIInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            {isOffline && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass border border-red-500/30 bg-red-500/5 p-5 rounded"
              >
                <div className="flex items-center gap-2 mb-3">
                  <WifiOff size={16} className="text-red-400" />
                  <span className="font-semibold text-white text-sm">Offline Mode Active</span>
                </div>
                <p className="text-slate-400 text-xs mb-3">Queue is running locally. All data will sync when connection is restored.</p>
                {pendingSync > 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <RefreshCw size={12} className="animate-spin" />
                    {pendingSync} changes pending sync
                  </div>
                )}
              </motion.div>
            )}

            <div className="glass p-5 rounded space-y-4">
              <span className="font-semibold text-white text-sm">Quick Stats</span>
              {[
                { label: 'Served today',    value: totalToday - waiting.length, color: '#10b981' },
                { label: 'Delayed users',   value: delayed.length,              color: '#f59e0b' },
                { label: 'Active counters', value: activeCounters.filter(c => c.status === 'active').length, color: '#3b82f6' },
                { label: 'SMS users',       value: queue.filter(u => u.channel === 'sms').length,  color: '#8b5cf6' },
                { label: 'USSD users',      value: queue.filter(u => u.channel === 'ussd').length, color: '#06b6d4' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{label}</span>
                  <span className="font-bold text-lg" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
