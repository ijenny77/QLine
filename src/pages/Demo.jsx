import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Play, Square, Zap, Users, Clock, TrendingUp, Brain, CheckCircle,
  MessageSquare, Smartphone, Hash, QrCode, WifiOff, Wifi,
  ChevronRight, ArrowRight, Star, Globe, BarChart3, AlertTriangle
} from 'lucide-react'
import { useQueueStore } from '../store/queueStore'


const STORY = [
  {
    id: 0,
    title: 'The Problem',
    subtitle: 'Before QLine',
    narrative: '08:00 AM — Equity Bank opens. 200 people rush in. Chaos ensues. Average wait: 3.5 hours.',
    visual: 'problem',
    duration: 4000,
  },
  {
    id: 1,
    title: 'Users Join Remotely',
    subtitle: 'Multiple Channels',
    narrative: 'Amara joins via app. Kwame texts JOIN to 384. Fatima dials *384#. Emmanuel scans the QR code at his desk.',
    visual: 'join',
    duration: 5000,
  },
  {
    id: 2,
    title: 'AI Begins Predicting',
    subtitle: 'Intelligence Layer Active',
    narrative: 'QLine\'s ML engine analyzes 127 queue signals — predicting wait times, detecting delays, optimizing flow.',
    visual: 'ai',
    duration: 5000,
  },
  {
    id: 3,
    title: 'Smart Repositioning',
    subtitle: 'No One Gets Removed',
    narrative: 'Emmanuel is running 18 minutes late. Instead of losing his spot, AI moves him back 3 positions. He gets an SMS.',
    visual: 'reposition',
    duration: 5000,
  },
  {
    id: 4,
    title: 'Offline Mode Activated',
    subtitle: 'Internet Drops — Queue Continues',
    narrative: 'Internet outage at 10:15 AM. QLine switches to offline mode instantly. All data cached locally. Zero disruption.',
    visual: 'offline',
    duration: 4500,
  },
  {
    id: 5,
    title: 'The Result',
    subtitle: 'After QLine',
    narrative: '50% shorter waits. 40% efficiency gain. Zero frustration dropouts. Customers actually love coming to the bank.',
    visual: 'result',
    duration: 6000,
  },
]


function VisualProblem() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3 max-w-lg">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-lg"
          >
            <Clock size={20} className="text-red-400" />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
        className="glass border border-red-500/30 px-6 py-3 rounded-full"
      >
        <span className="text-red-400 font-bold text-2xl">3.5 hrs</span>
        <span className="text-slate-400 ml-2">average wait</span>
      </motion.div>
    </div>
  )
}

function VisualJoin() {
  const channels = [
    { icon: Smartphone,    name: 'Amara — App',    delay: 0 },
    { icon: MessageSquare, name: 'Kwame — SMS',     delay: 0.6 },
    { icon: Hash,          name: 'Fatima — USSD',  delay: 1.2 },
    { icon: QrCode,        name: 'Emmanuel — QR',  delay: 1.8 },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {channels.map(({ icon: Icon, name, delay }) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, type: 'spring', stiffness: 200 }}
          className="glass p-4 rounded-2xl text-center border border-blue-500/20"
        >
          <Icon size={24} className="text-blue-400 mx-auto mb-2" />
          <p className="text-slate-300 text-xs">{name}</p>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.4 }}
          >
            <span className="badge badge-green text-[10px] mt-2">Joined ✓</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

function VisualAI() {
  const [active, setActive] = useState(0)
  const predictions = [
    { text: 'Wait time prediction: 14 min', conf: 94, color: '#3b82f6' },
    { text: 'Peak surge in 18 min (+47 users)', conf: 91, color: '#ef4444' },
    { text: 'Delay probability QL-4835: 72%', conf: 72, color: '#f59e0b' },
    { text: 'Recommend: open Counter C now', conf: 88, color: '#8b5cf6' },
  ]
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % predictions.length), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="max-w-sm mx-auto space-y-3">
      {predictions.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: i <= active ? 1 : 0.2, x: 0 }}
          transition={{ delay: i * 0.3 }}
          className={`glass p-4 rounded-xl border transition-all ${i === active ? 'border-purple-500/40 bg-purple-500/5' : 'border-white/5'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Brain size={13} style={{ color: p.color }} />
              <span className="text-xs text-slate-300">{p.text}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: p.color }}>{p.conf}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function VisualReposition() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 1500)
    const t2 = setTimeout(() => setStep(2), 3000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  return (
    <div className="max-w-xs mx-auto">
      <div className="glass p-5 rounded-2xl space-y-2">
        {[
          { pos: 5, name: 'Aisha M.',      status: 'waiting' },
          { pos: step < 1 ? 6 : 9, name: 'Emmanuel B.', status: step >= 1 ? 'repositioned' : 'waiting', highlight: true },
          { pos: step < 1 ? 7 : 6, name: 'Seun A.',     status: 'waiting' },
          { pos: step < 1 ? 8 : 7, name: 'Nadia T.',    status: 'waiting' },
          { pos: step < 1 ? 9 : 8, name: 'Zainab T.',   status: 'waiting' },
        ].sort((a,b) => a.pos - b.pos).map(u => (
          <motion.div
            key={u.name}
            layout
            className={`flex items-center gap-3 p-3 rounded-xl text-xs
              ${u.highlight && step >= 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/3'}`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold shrink-0
              ${u.highlight && step >= 1 ? 'bg-yellow-500 text-dark-900' : 'bg-white/10 text-slate-300'}`}>
              {u.pos}
            </span>
            <span className="text-slate-300 flex-1">{u.name}</span>
            {u.highlight && step >= 1 && <span className="badge badge-yellow text-[9px]">AI moved</span>}
          </motion.div>
        ))}
      </div>
      {step >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3 glass border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2"
        >
          <MessageSquare size={12} /> SMS sent to Emmanuel: "You've been repositioned. New wait: ~32 min."
        </motion.div>
      )}
    </div>
  )
}

function VisualOffline() {
  const [offline, setOffline] = useState(false)
  const [synced, setSynced]   = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setOffline(true),  1000)
    const t2 = setInterval(() => setSynced(s => s < 12 ? s + 1 : s), 400)
    const t3 = setTimeout(() => setOffline(false), 3500)
    return () => { clearTimeout(t1); clearInterval(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="max-w-xs mx-auto text-center">
      <motion.div
        animate={{ scale: offline ? 1.05 : 1 }}
        className={`glass p-8 rounded-2xl border mb-4 transition-all duration-500
          ${offline ? 'border-red-500/40 bg-red-500/5' : 'border-emerald-500/40 bg-emerald-500/5'}`}
      >
        {offline
          ? <WifiOff size={48} className="text-red-400 mx-auto mb-3" />
          : <Wifi    size={48} className="text-emerald-400 mx-auto mb-3" />}
        <div className={`font-bold text-2xl mb-1 ${offline ? 'text-red-400' : 'text-emerald-400'}`}>
          {offline ? 'Offline' : 'Online'}
        </div>
        <p className="text-slate-400 text-sm">
          {offline ? 'Queue cached locally — fully operational' : 'Synced. 0 disruptions.'}
        </p>
      </motion.div>
      {offline && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="badge badge-yellow mx-auto"
        >
          {synced} events cached locally
        </motion.div>
      )}
    </div>
  )
}

function VisualResult() {
  const metrics = [
    { value: '50%', label: 'Wait Time Reduced', color: '#10b981', icon: <Clock size={28} color="#10b981" /> },
    { value: '40%', label: 'Efficiency Gained',  color: '#3b82f6', icon: <TrendingUp size={28} color="#3b82f6" /> },
    { value: '0',   label: 'Frustration Dropouts', color: '#8b5cf6', icon: <CheckCircle size={28} color="#8b5cf6" /> },
    { value: '4.9/5', label: 'User Satisfaction',  color: '#f59e0b', icon: <Star size={28} color="#f59e0b" /> },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2, type: 'spring' }}
          className="glass p-4 rounded-2xl text-center"
        >
          <div className="text-3xl mb-2">{m.icon}</div>
          <div className="font-display font-black text-2xl mb-1" style={{ color: m.color }}>{m.value}</div>
          <div className="text-slate-500 text-xs">{m.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

const VisualComponents = {
  problem:    VisualProblem,
  join:       VisualJoin,
  ai:         VisualAI,
  reposition: VisualReposition,
  offline:    VisualOffline,
  result:     VisualResult,
}

// ── MAIN DEMO PAGE ─────────────────────────────────────────────────────────────
export default function Demo() {
  const [running, setRunning]   = useState(false)
  const [storyIdx, setStoryIdx] = useState(0)
  const [elapsed, setElapsed]   = useState(0)
  const timerRef                = useRef(null)
  const elapsedRef              = useRef(null)
  const startDemo               = useQueueStore(s => s.startDemo)
  const stopDemo                = useQueueStore(s => s.stopDemo)

  const current = STORY[storyIdx]
  const VisualComponent = VisualComponents[current.visual]

  const start = () => {
    setRunning(true)
    setStoryIdx(0)
    setElapsed(0)
    startDemo()
  }

  const stop = () => {
    setRunning(false)
    clearTimeout(timerRef.current)
    clearInterval(elapsedRef.current)
    stopDemo()
  }

  useEffect(() => {
    if (!running) return
    setElapsed(0)

    elapsedRef.current = setInterval(() => setElapsed(e => e + 50), 50)

    timerRef.current = setTimeout(() => {
      if (storyIdx < STORY.length - 1) {
        setStoryIdx(s => s + 1)
      } else {
        stop()
      }
    }, current.duration)

    return () => {
      clearTimeout(timerRef.current)
      clearInterval(elapsedRef.current)
    }
  }, [running, storyIdx])

  const progress = running ? Math.min((elapsed / current.duration) * 100, 100) : 0

  return (
    <div className="min-h-screen pt-20 px-4 lg:px-8 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 pt-6">
          <div className="section-label mx-auto w-fit mb-4">
            <Zap size={13} /> Investor Demo Mode
          </div>
          <h1 className="font-display font-black text-4xl lg:text-6xl text-white mb-4">
            See QLine <span className="gradient-text">in Action</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Watch an automated 30-second walkthrough showing exactly how QLine transforms queue management.
          </p>
        </div>

        <div className="glass border border-white/10 rounded-3xl overflow-hidden mb-8">

          <div className="h-1 bg-white/5">
            <motion.div
              className="h-full bg-blue-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 overflow-x-auto">
            {STORY.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { if (running) { setStoryIdx(i); setElapsed(0) } }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                  ${i === storyIdx ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' :
                    i < storyIdx ? 'text-slate-400' : 'text-slate-600'}`}
              >
                {i < storyIdx && <CheckCircle size={11} className="text-emerald-400" />}
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          <div className="p-8 min-h-72 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={storyIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-8"
              >
                {/* Story text */}
                <div className="text-center max-w-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{current.subtitle}</div>
                  <h2 className="font-display font-black text-3xl lg:text-4xl text-white mb-3">{current.title}</h2>
                  <p className="text-slate-400 leading-relaxed">{current.narrative}</p>
                </div>

                {running && <VisualComponent />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 py-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!running ? (
                <button
                  onClick={start}
                  className="btn-primary px-8 py-3 text-base"
                >
                  <Play size={18} /> Start Live Demo
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-400 font-semibold text-sm hover:bg-red-600/30 transition-all"
                >
                  <Square size={16} /> Stop Demo
                </button>
              )}

              {running && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Live · Scene {storyIdx + 1} of {STORY.length}
                </div>
              )}
            </div>

            {!running && storyIdx === STORY.length - 1 && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <CheckCircle size={16} /> Demo Complete!
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: Users,    title: 'Live Queue Simulation', desc: 'Watch users join from app, SMS, USSD, and QR code in real time.',        link: '/queue',     cta: 'Try Queue' },
            { icon: BarChart3, title: 'Staff Dashboard',       desc: 'Explore the full management dashboard with AI alerts and counters.',        link: '/dashboard', cta: 'Open Dashboard' },
            { icon: Brain,    title: 'Analytics & AI',         desc: 'Deep dive into wait time charts, AI accuracy metrics, and heatmaps.',       link: '/analytics', cta: 'See Analytics' },
          ].map(card => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl hover:bg-white/8 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 w-fit mb-4">
                <card.icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{card.desc}</p>
              <Link to={card.link} className="btn-ghost text-sm px-0">
                {card.cta} <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="glass border border-purple-500/30 bg-purple-500/5 p-8 rounded-3xl text-center">
          <Star size={32} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl text-white mb-3">
            Interested in QLine?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            We're raising our Seed round and expanding to 18+ African markets. Join us in transforming how 1.4 billion people wait.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:invest@qline.africa" className="btn-primary px-8 py-3">
              Talk to Founders <ArrowRight size={16} />
            </a>
            <a href="mailto:hello@qline.africa" className="btn-secondary px-8 py-3">
              Request Pitch Deck
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
