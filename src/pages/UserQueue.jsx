import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode, MessageSquare, Hash, Users, Smartphone, Clock, CheckCircle,
  ArrowRight, ArrowLeft, Bell, MapPin, RotateCcw, Navigation, Search,
  ChevronRight, Building2, Cross, Landmark, Wifi, ShoppingBag,
  UserPlus, Banknote, TrendingUp, Globe, CreditCard, HelpCircle,
  FileText, Package, Receipt, Pill, ScanLine, Siren, Baby, Car,
  Bookmark, ShieldCheck, FlaskConical, Filter, X
} from 'lucide-react'
import { useQueueStore } from '../store/queueStore'
import { smsConversation, ussdFlow, serviceInstitutions } from '../data/mockData'

// ── Icon resolver (service icons are stored as strings in data) ───────────────
const ICON_MAP = {
  UserPlus, Banknote, TrendingUp, Globe, CreditCard, HelpCircle,
  Smartphone, FileText, Package, Receipt, Pill, ScanLine, Siren,
  Baby, Car, Bookmark, ShieldCheck, FlaskConical, Building2,
  RotateCcw, Hash, Clock, Cross, Wifi, Search,
  // fallback aliases used in data
  HeadphonesIcon: HelpCircle,
  Stethoscope: Cross,
  UserCog: Users,
}
const resolveIcon = (name) => ICON_MAP[name] || HelpCircle

// ── Sector config ─────────────────────────────────────────────────────────────
const SECTORS = ['All', 'Banking', 'Healthcare', 'Government', 'Telecoms']
const SECTOR_COLORS = {
  Banking:    '#3b82f6',
  Healthcare: '#0891b2',
  Government: '#7c3aed',
  Telecoms:   '#16a34a',
  Retail:     '#f59e0b',
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Institution picker
// ─────────────────────────────────────────────────────────────────────────────
function StepInstitution({ onSelect }) {
  const [search,      setSearch]      = useState('')
  const [sector,      setSector]      = useState('All')
  const [highlighted, setHighlighted] = useState(null)

  const filtered = useMemo(() =>
    serviceInstitutions.filter(inst =>
      (sector === 'All' || inst.sector === sector) &&
      inst.name.toLowerCase().includes(search.toLowerCase())
    ), [search, sector]
  )

  return (
    <motion.div
      key="step-institution"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search institution…"
            className="input-field pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORS.map(s => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={
                sector === s
                  ? { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#3b82f6' }
                  : { background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Institution grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p>No institutions found for "{search}"</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(inst => (
            <motion.button
              key={inst.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(inst)}
              onMouseEnter={() => setHighlighted(inst.id)}
              onMouseLeave={() => setHighlighted(null)}
              className="glass text-left p-5 rounded-2xl transition-all duration-200 group w-full"
              style={highlighted === inst.id ? { borderColor: inst.color + '60', background: inst.color + '08' } : {}}
            >
              {/* Logo + sector */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm text-white shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${inst.color}, ${inst.color}bb)` }}
                >
                  {inst.shortName}
                </div>
                <span
                  className="badge text-[10px]"
                  style={{
                    background: (SECTOR_COLORS[inst.sector] || '#3b82f6') + '18',
                    color:       SECTOR_COLORS[inst.sector] || '#3b82f6',
                    borderColor:(SECTOR_COLORS[inst.sector] || '#3b82f6') + '35',
                  }}
                >
                  {inst.sector}
                </span>
              </div>

              {/* Name & location */}
              <h3 className="font-display font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{inst.name}</h3>
              <div className="flex items-center gap-1 mb-4" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={11} />
                <span className="text-xs">{inst.city}, {inst.country}</span>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass p-2.5 rounded-xl text-center">
                  <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{inst.queueSize}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>in queue</div>
                </div>
                <div className="glass p-2.5 rounded-xl text-center">
                  <div
                    className="font-bold text-base"
                    style={{ color: inst.avgWait < 20 ? '#10b981' : inst.avgWait < 40 ? '#f59e0b' : '#ef4444' }}
                  >
                    ~{inst.avgWait}m
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>avg wait</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{inst.services.length} services available</span>
                <ChevronRight size={15} style={{ color: inst.color }} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Service picker
// ─────────────────────────────────────────────────────────────────────────────
function StepService({ institution, onSelect, onBack }) {
  const [hovered, setHovered] = useState(null)

  return (
    <motion.div
      key="step-service"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      {/* Institution header */}
      <div className="glass p-4 rounded-2xl mb-6 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${institution.color}, ${institution.color}bb)` }}
        >
          {institution.shortName}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{institution.name}</h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={10} /> {institution.city}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={10} className="inline mr-1" />{institution.openHours}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div
            className="font-bold text-lg"
            style={{ color: institution.avgWait < 20 ? '#10b981' : institution.avgWait < 40 ? '#f59e0b' : '#ef4444' }}
          >
            ~{institution.avgWait} min
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>avg wait today</div>
        </div>
      </div>

      <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
        What service do you need?
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {institution.services.map(svc => {
          const Icon = resolveIcon(svc.icon)
          return (
            <motion.button
              key={svc.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(svc)}
              onMouseEnter={() => setHovered(svc.id)}
              onMouseLeave={() => setHovered(null)}
              className="glass text-left p-4 rounded-xl transition-all duration-200 group"
              style={hovered === svc.id ? { borderColor: institution.color + '50', background: institution.color + '06' } : {}}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: institution.color + '15', color: institution.color }}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{svc.name}</div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{svc.description}</p>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={10} />
                    <span>~{svc.avgTime} min per person</span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
                  style={{ color: institution.color }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Details form
// ─────────────────────────────────────────────────────────────────────────────
function StepDetails({ institution, service, onJoined, onBack }) {
  const [name,    setName]    = useState('')
  const [channel, setChannel] = useState('app')
  const joinQueue             = useQueueStore(s => s.joinQueue)

  const channels = [
    { id: 'app',    label: 'App',    icon: Smartphone },
    { id: 'sms',    label: 'SMS',    icon: MessageSquare },
    { id: 'ussd',   label: 'USSD',   icon: Hash },
    { id: 'walkin', label: 'Walk-in',icon: Users },
    { id: 'qr',     label: 'QR',     icon: QrCode },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const ticket = joinQueue(name.trim(), channel)
    // attach institution + service metadata to ticket
    onJoined({ ...ticket, institution, service })
  }

  const Icon = resolveIcon(service.icon)

  return (
    <motion.div
      key="step-details"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      {/* Summary card */}
      <div className="glass p-4 rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
            style={{ background: institution.color }}
          >
            {institution.shortName}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{institution.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className="w-4 h-4 rounded flex items-center justify-center"
                style={{ background: institution.color + '20', color: institution.color }}
              >
                <Icon size={10} />
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{service.name}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>~{service.avgTime}m</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>per person</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-5">
        <div>
          <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Your Details</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>We'll send your ticket and updates to your phone.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amara Diallo"
            className="input-field"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>How are you joining?</label>
          <div className="grid grid-cols-5 gap-2">
            {channels.map(({ id, label, icon: CIcon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setChannel(id)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all border"
                style={
                  channel === id
                    ? { background: institution.color + '18', borderColor: institution.color + '55', color: institution.color }
                    : { background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }
                }
              >
                <CIcon size={15} />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full justify-center py-3.5"
          style={{ background: `linear-gradient(135deg, ${institution.color}, #7c3aed)` }}
        >
          <CheckCircle size={17} /> Get My Ticket <ArrowRight size={15} />
        </button>
      </form>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Ticket display
// ─────────────────────────────────────────────────────────────────────────────
function StepTicket({ ticket, position, onReset }) {
  const [showNotif, setShowNotif] = useState(false)
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100))
  const Icon = resolveIcon(ticket.service?.icon || 'HelpCircle')

  return (
    <motion.div
      key="step-ticket"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="max-w-sm mx-auto"
    >
      {/* Ticket card */}
      <div
        className="glass rounded-3xl overflow-hidden shadow-xl"
        style={{ borderColor: (ticket.institution?.color || '#3b82f6') + '40' }}
      >
        {/* Top colour strip */}
        <div
          className="h-2"
          style={{ background: `linear-gradient(to right, ${ticket.institution?.color || '#3b82f6'}, #7c3aed, #06b6d4)` }}
        />

        <div className="p-7">
          {/* Institution + service */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ background: ticket.institution?.color || '#3b82f6' }}
              >
                {ticket.institution?.shortName || 'QL'}
              </div>
              <div>
                <div className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                  {ticket.institution?.name || 'Institution'}
                </div>
                <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  <Icon size={10} />
                  <span className="text-[10px]">{ticket.service?.name || 'General'}</span>
                </div>
              </div>
            </div>
            <span className="badge badge-green text-[10px]">Active</span>
          </div>

          {/* Ticket number */}
          <div className="text-center mb-5">
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Your Ticket</div>
            <div className="font-display font-black text-6xl queue-number">{ticket.ticketId}</div>
          </div>

          {/* Position */}
          <div className="text-center mb-5">
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Queue Position</div>
            <div className="font-display font-black text-5xl" style={{ color: 'var(--text-primary)' }}>#{position}</div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <span>Progress to front</span><span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${ticket.institution?.color || '#3b82f6'}, #7c3aed)` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Est. Wait',   value: `${ticket.waitTime}m` },
              { label: 'Service',     value: ticket.service?.avgTime ? `${ticket.service.avgTime}m` : '—' },
              { label: 'Channel',     value: ticket.channel === 'walkin' ? 'Walk-in' : ticket.channel.toUpperCase() },
            ].map(s => (
              <div key={s.label} className="glass p-2.5 rounded-xl text-center">
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowNotif(true)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border"
              style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }}
            >
              <Clock size={14} /> Need More Time
            </button>
            <button
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: `linear-gradient(135deg, #059669, #0d9488)` }}
            >
              <Navigation size={14} /> I'm Arriving
            </button>
          </div>
        </div>

        {/* Ticket tear line */}
        <div className="relative flex items-center mx-6 my-0">
          <div className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--glass-border)' }} />
        </div>

        {/* Footer / barcode */}
        <div className="px-7 py-4 flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>QLine v2 · AF-KE</span>
          <div className="flex gap-px">
            {Array(22).fill(0).map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{
                  width: 2,
                  height: Math.random() > 0.5 ? 18 : 10,
                  background: 'var(--text-muted)',
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI reposition notification */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="mt-4 glass rounded-xl p-4 flex items-center gap-3"
            style={{ borderColor: 'rgba(245,158,11,0.35)' }}
          >
            <Bell size={15} className="text-yellow-500 shrink-0" />
            <p className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold text-yellow-500">AI repositioned</span> — moved to #{position + 3}.
              New wait: ~{ticket.waitTime + 12} min. SMS sent.
            </p>
            <button onClick={() => setShowNotif(false)} style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start over */}
      <button
        onClick={onReset}
        className="btn-ghost w-full justify-center mt-4 text-sm"
      >
        <ArrowLeft size={14} /> Join a different queue
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SMS Simulator (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function SMSSimulator() {
  const [messages, setMessages] = useState([smsConversation[0]])
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (step < smsConversation.length) {
      const delay = smsConversation[step].from === 'system' ? 800 : 1500
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, smsConversation[step]])
        setStep(s => s + 1)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [step])

  const restart = () => { setMessages([smsConversation[0]]); setStep(1) }

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-slate-900 rounded-[2.5rem] border-2 border-slate-700 p-4 shadow-2xl">
        <div className="flex items-center justify-between px-4 mb-4">
          <span className="text-slate-400 text-xs">10:30</span>
          <div className="flex gap-1">
            {[1,2,3].map(b => <div key={b} className="w-1.5 rounded-sm bg-slate-400" style={{ height: `${b * 4}px` }} />)}
            <div className="w-3 h-3 ml-1 border border-slate-400 rounded-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-2xl mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">Q</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">QLine</p>
            <p className="text-green-400 text-xs">● Active</p>
          </div>
        </div>
        <div className="h-72 overflow-y-auto space-y-3 px-1 no-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line
                  ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-700 text-slate-200 rounded-bl-sm'}`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>{msg.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 mt-3 p-2 bg-slate-800 rounded-2xl">
          <input type="text" placeholder="Type a message…" className="flex-1 bg-transparent text-slate-300 text-xs outline-none px-2 placeholder-slate-600" readOnly />
          <button onClick={restart} className="p-1.5 bg-blue-600 rounded-full" title="Restart">
            <RotateCcw size={12} className="text-white" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>SMS simulation — auto-plays from start</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// USSD Simulator (fixed exit)
// ─────────────────────────────────────────────────────────────────────────────
function USSDSimulator() {
  const [screen, setScreen] = useState('main')
  const [input,  setInput]  = useState('')

  const currentScreen = screen === 'main' ? ussdFlow.main
    : screen === 'join' ? ussdFlow.join
    : ussdFlow.confirm

  const handleOption = (raw) => {
    const num = raw.charAt(0)
    if (num === '0') { setScreen('main'); setInput(''); return }
    if (screen === 'main' && num === '1') setScreen('join')
    else if (screen === 'join' && ['1','2','3','4'].includes(num)) setScreen('confirm')
    setInput('')
  }

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-slate-900 rounded-3xl border-2 border-slate-700 p-4 shadow-2xl">
        <div className="bg-slate-800 rounded-xl p-1 mb-3">
          <div className="bg-green-950 rounded-lg p-4 min-h-36 font-mono text-green-400 text-xs">
            <div className="text-green-300 font-bold mb-2">{currentScreen.title}</div>
            {currentScreen.options ? (
              currentScreen.options.map((opt, i) => (
                <button key={i} onClick={() => handleOption(opt)}
                  className="block w-full text-left hover:text-green-200 py-0.5 transition-colors">
                  {opt}
                </button>
              ))
            ) : (
              <pre className="text-xs whitespace-pre-wrap">{currentScreen.body}</pre>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
            <button key={k} onClick={() => handleOption(k)}
              className="py-2.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-bold hover:bg-slate-600 active:bg-slate-500 transition-colors">
              {k}
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        Dial <span className="text-blue-400 font-mono">*384#</span> on any phone
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QR Code mock
// ─────────────────────────────────────────────────────────────────────────────
function QRMock({ institution }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 glass rounded-2xl w-fit mx-auto">
      <div className="w-48 h-48 bg-white rounded-xl p-3 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="0"  y="0"  width="30" height="30" fill="#000" rx="2"/>
          <rect x="3"  y="3"  width="24" height="24" fill="#fff" rx="1"/>
          <rect x="7"  y="7"  width="16" height="16" fill="#000" rx="1"/>
          <rect x="70" y="0"  width="30" height="30" fill="#000" rx="2"/>
          <rect x="73" y="3"  width="24" height="24" fill="#fff" rx="1"/>
          <rect x="77" y="7"  width="16" height="16" fill="#000" rx="1"/>
          <rect x="0"  y="70" width="30" height="30" fill="#000" rx="2"/>
          <rect x="3"  y="73" width="24" height="24" fill="#fff" rx="1"/>
          <rect x="7"  y="77" width="16" height="16" fill="#000" rx="1"/>
          <rect x="35" y="35" width="30" height="30" fill="#000" rx="2"/>
          <rect x="38" y="38" width="24" height="24" fill="#fff" rx="1"/>
          <rect x="41" y="41" width="18" height="18" fill="#1d4ed8" rx="2"/>
          <text x="50" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Q</text>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Scan to Join Queue</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {institution ? `${institution.name} — ${institution.city}` : 'Scan at any QLine-enabled location'}
        </p>
      </div>
      <span className="badge badge-blue"><QrCode size={11} /> QLine QR</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step progress bar
// ─────────────────────────────────────────────────────────────────────────────
const STEP_LABELS = ['Choose Place', 'Choose Service', 'Your Details', 'Your Ticket']

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar">
      {STEP_LABELS.map((label, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={
                  done   ? { background: '#10b981', color: '#fff' } :
                  active ? { background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff' } :
                           { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }
                }
              >
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: active ? 'var(--text-primary)' : done ? '#10b981' : 'var(--text-muted)' }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="w-6 h-px shrink-0" style={{ background: done ? '#10b981' : 'var(--glass-border)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function UserQueue() {
  const [step,        setStep]        = useState(0) // 0=institution 1=service 2=details 3=ticket
  const [institution, setInstitution] = useState(null)
  const [service,     setService]     = useState(null)
  const [ticket,      setTicket]      = useState(null)
  const [demoTab,     setDemoTab]     = useState(null) // 'sms'|'ussd'|'qr'|null
  const queue = useQueueStore(s => s.queue)

  const position = ticket
    ? queue.find(u => u.id === ticket.id)?.position ?? ticket.position
    : null

  const handleSelectInstitution = (inst) => { setInstitution(inst); setStep(1) }
  const handleSelectService      = (svc)  => { setService(svc);     setStep(2) }
  const handleJoined             = (t)    => { setTicket(t);        setStep(3) }
  const handleReset              = ()     => { setStep(0); setInstitution(null); setService(null); setTicket(null) }

  const handleBack = () => {
    if (step === 1) { setStep(0); setInstitution(null) }
    if (step === 2) { setStep(1); setService(null) }
  }

  const demotabs = [
    { id: 'sms',  label: 'SMS Demo',   icon: MessageSquare },
    { id: 'ussd', label: 'USSD Demo',  icon: Hash },
    { id: 'qr',   label: 'QR Code',    icon: QrCode },
  ]

  return (
    <div className="min-h-screen pt-24 px-4 md:px-6 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="section-label mx-auto w-fit mb-4">User Experience</div>
          <h1 className="font-display font-black text-3xl lg:text-5xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Queue your way.{' '}
            <span className="gradient-text">Any channel.</span>
          </h1>
          <p className="max-w-lg mx-auto text-sm" style={{ color: 'var(--text-secondary)' }}>
            Pick your institution, choose a service, and get a ticket — then arrive exactly when you're called.
          </p>
        </div>

        {/* Alternative channel demos */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {demotabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setDemoTab(demoTab === id ? null : id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={
                demoTab === id
                  ? { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#3b82f6' }
                  : { background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }
              }
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Demo panel */}
        <AnimatePresence>
          {demoTab && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="glass p-6 rounded-2xl">
                {demoTab === 'sms'  && <SMSSimulator />}
                {demoTab === 'ussd' && <USSDSimulator />}
                {demoTab === 'qr'   && <QRMock institution={institution} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step flow */}
        <div className="glass p-6 md:p-8 rounded-3xl">
          {/* Step bar — only show for main flow (steps 0–3) */}
          {step < 3 || ticket ? <StepBar current={step} /> : null}

          {/* Back button */}
          {(step === 1 || step === 2) && (
            <button onClick={handleBack} className="btn-ghost text-sm mb-6 px-0">
              <ArrowLeft size={15} /> Back
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepInstitution key="s0" onSelect={handleSelectInstitution} />
            )}
            {step === 1 && institution && (
              <StepService key="s1" institution={institution} onSelect={handleSelectService} onBack={handleBack} />
            )}
            {step === 2 && institution && service && (
              <StepDetails key="s2" institution={institution} service={service} onJoined={handleJoined} onBack={handleBack} />
            )}
            {step === 3 && ticket && (
              <StepTicket key="s3" ticket={ticket} position={position} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>

        {/* Live queue strip */}
        {queue.length > 0 && (
          <div className="mt-10 glass p-5 rounded-2xl">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live Queue Preview
            </h3>
            <div className="space-y-2">
              {queue.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: user.id === ticket?.id ? 'rgba(59,130,246,0.08)' : 'var(--glass-bg)',
                    border:     user.id === ticket?.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--glass-border)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={
                      user.status === 'serving' ? { background: '#10b981', color: '#fff' } :
                      user.status === 'delayed' ? { background: '#f59e0b', color: '#0f172a' } :
                      { background: 'var(--glass-border)', color: 'var(--text-secondary)' }
                    }
                  >
                    {user.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {user.id === ticket?.id ? `${user.name} (You)` : user.name}
                      </span>
                      {user.id === ticket?.id && <span className="badge badge-blue text-[10px]">YOU</span>}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {user.channel} · ~{user.waitTime} min
                    </span>
                  </div>
                  <span className={`badge text-[10px] ${
                    user.status === 'serving' ? 'badge-green' :
                    user.status === 'delayed' ? 'badge-yellow' : 'badge-blue'
                  }`}>{user.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
