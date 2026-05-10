import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Zap, Clock, Smartphone, MessageSquare, Hash, Users, TrendingUp,
  CheckCircle, ChevronRight, ArrowRight, Star, Globe, Wifi, Brain,
  BarChart3, Shield, Building2, Cross, Landmark, GraduationCap,
  ShoppingBag, MapPin, Timer, UserMinus, Banknote, PhoneOff,
  Radio, Navigation
} from 'lucide-react'
import { testimonials, pricingPlans, marketSectors } from '../data/mockData'
import Footer from '../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ── Floating dashboard card mock ──────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-3xl" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative glass border border-white/15 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">NOW SERVING</div>
            <div className="text-4xl font-display font-black queue-number">042</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">QUEUE LENGTH</div>
            <div className="text-3xl font-display font-bold text-white">127</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">AI EFFICIENCY</div>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-3xl font-display font-bold text-emerald-400">87%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {[
            { name: 'Amara D.',  wait: '0 min',   status: 'serving', w: '100%' },
            { name: 'Kwame A.',  wait: '4 min',   status: 'waiting', w: '82%'  },
            { name: 'Fatima H.', wait: '8 min',   status: 'waiting', w: '65%'  },
            { name: 'Chidi O.',  wait: '12 min',  status: 'waiting', w: '48%'  },
            { name: 'Aisha M.',  wait: 'AI→18m',  status: 'delayed', w: '32%'  },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${row.status === 'serving' ? 'bg-emerald-500 text-white' :
                  row.status === 'delayed' ? 'bg-yellow-500 text-dark-900' : 'bg-white/10 text-slate-300'}`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-300 truncate">{row.name}</span>
                  <span className="text-xs text-slate-500 ml-2 shrink-0">{row.wait}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: row.w }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      row.status === 'serving' ? 'bg-emerald-500' :
                      row.status === 'delayed' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <Brain size={16} className="text-purple-400 shrink-0" />
          <p className="text-xs text-slate-300">
            <span className="text-purple-400 font-semibold">AI Alert: </span>
            Peak traffic predicted in 18 min. Opening Counter C recommended.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-6 -left-8 hidden lg:block"
      >
        <div className="glass border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-xl">
          <div className="text-emerald-400 text-xs font-semibold mb-1">Wait Reduced</div>
          <div className="text-white font-display font-bold text-2xl">-50%</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-6 -right-8 hidden lg:block"
      >
        <div className="glass border border-cyan-500/30 rounded-2xl px-4 py-3 shadow-xl">
          <div className="text-cyan-400 text-xs font-semibold mb-1">Users Served</div>
          <div className="text-white font-display font-bold text-2xl">2.4M+</div>
        </div>
      </motion.div>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              AI-Powered Queue Management for Africa
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display font-black text-5xl lg:text-7xl leading-[1.05] mb-6" style={{ color: 'var(--text-primary)' }}>
              Transform
              <br />
              <span className="gradient-text">How Africa</span>
              <br />
              Waits
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              QLine eliminates the endless queue. Join remotely via SMS, USSD, QR code, or app  and arrive exactly when you're needed. No more wasted hours.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link to="/demo" className="btn-primary text-base px-8 py-4">
                <Zap size={18} /> Start Live Demo
              </Link>
              <Link to="/queue" className="btn-secondary text-base px-8 py-4">
                Join a Queue <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
              {[
                { value: '50%', label: 'Less Waiting' },
                { value: '40%', label: 'More Efficient' },
                { value: '2.4M', label: 'Users Served' },
                { value: '18+', label: 'Countries' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display font-black text-2xl text-white">{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <DashboardPreview />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-3 mt-20"
        >
          {[
            { icon: Smartphone,    label: 'Mobile App' },
            { icon: MessageSquare, label: 'SMS' },
            { icon: Hash,          label: 'USSD *384#' },
            { icon: Users,         label: 'Walk-in' },
            { icon: CheckCircle,   label: 'QR Code' },
            { icon: Wifi,          label: 'Works Offline' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-slate-300 border border-white/10">
              <Icon size={14} className="text-blue-400" /> {label}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function Problem() {
  const problems = [
    { icon: Timer,     stat: '3–5 hrs', desc: 'Average queue wait in African hospitals and government offices' },
    { icon: UserMinus, stat: '68%',     desc: 'Of people abandon queues before being served — lost trust, lost revenue' },
    { icon: Banknote,  stat: '$14B',    desc: 'Lost productivity annually due to inefficient queuing across sub-Saharan Africa' },
    { icon: PhoneOff,  stat: '52%',     desc: 'Existing queue systems require a smartphone — excluding half the continent' },
  ]

  return (
    <Section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">The Problem</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Africa is waiting.{' '}
            <span className="gradient-text">Hours at a time.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Inefficient queues cost lives in hospitals, money in banks, and dignity everywhere. The status quo is broken.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => (
            <motion.div key={i} variants={fadeUp} className="glass p-6 text-center hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                <p.icon size={22} className="text-red-500" />
              </div>
              <div className="font-display font-black text-4xl text-red-500 mb-3">{p.stat}</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Solution() {
  const steps = [
    { n: '01', title: 'Join Remotely',  desc: 'Via app, SMS, USSD *384#, QR code, or staff-assisted — whichever works for you.',   icon: Smartphone },
    { n: '02', title: 'AI Calculates',  desc: 'Our model analyzes traffic patterns and predicts your wait time with 94% accuracy.', icon: Brain },
    { n: '03', title: 'Live Updates',   desc: 'You receive real-time SMS and push notifications. Track your position from anywhere.',icon: Radio },
    { n: '04', title: 'Arrive on Time', desc: 'Show up exactly when it\'s your turn. No waiting around. No wasted hours.',          icon: Navigation },
  ]

  return (
    <Section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">How It Works</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Queue from anywhere.{' '}
            <span className="gradient-text">Arrive when ready.</span>
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-4 gap-8">
          <div className="absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="relative text-center">
              <div className="inline-flex w-20 h-20 items-center justify-center mb-5 glass rounded-2xl relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <step.icon size={26} className="text-blue-500" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Features() {
  const features = [
    { icon: Brain,     title: 'AI Wait Prediction',       desc: 'Machine learning model trained on 2M+ queue events predicts wait times with 94% accuracy.',         badge: 'AI Core'   },
    { icon: Wifi,      title: 'Works Without Internet',   desc: 'Full offline functionality with local caching. Syncs automatically when connection is restored.',    badge: 'Offline'   },
    { icon: MessageSquare, title: 'SMS & USSD Access',    desc: 'Any phone, any network. Users join and track queues via SMS or USSD — no smartphone needed.',       badge: 'Inclusive' },
    { icon: TrendingUp, title: 'Smart Repositioning',     desc: 'Instead of removing late users, AI intelligently repositions them — reducing dropout by 68%.',      badge: 'AI'        },
    { icon: BarChart3, title: 'Real-Time Analytics',      desc: 'Live dashboards, heatmaps, and predictive insights for staff managers and administrators.',          badge: 'Insights'  },
    { icon: Shield,    title: 'Enterprise Security',       desc: 'End-to-end encryption, role-based access, GDPR-compliant data handling, and ISO 27001 ready.',      badge: 'Secure'    },
    { icon: Globe,     title: 'Multi-Language Support',   desc: 'Supports Swahili, French, Hausa, Amharic, Arabic, Portuguese, and 12 more African languages.',      badge: 'Local'     },
    { icon: Users,     title: 'Unified Queue',            desc: 'One queue for walk-ins, SMS users, and app users. Staff sees everything in a single dashboard.',    badge: 'Unified'   },
  ]

  return (
    <Section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">Features</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Everything you need. <span className="gradient-text">Nothing you don't.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp}
              className="glass p-5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <f.icon size={20} className="text-blue-400" />
                </div>
                <span className="badge badge-blue text-[10px]">{f.badge}</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function MarketSectors() {
  const sectorIcons = { Cross, Building2, Landmark, GraduationCap, ShoppingBag, Wifi }

  return (
    <Section className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">Market Sectors</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Built for every <span className="gradient-text">African institution</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketSectors.map((sector, i) => {
            const Icon = sectorIcons[sector.icon] || Users
            return (
              <motion.div key={i} variants={fadeUp}
                className="glass p-5 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all"
                  style={{ backgroundColor: `${sector.color}20`, color: sector.color }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{sector.name}</h3>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{sector.desc}</p>
                <span className="text-xs font-semibold" style={{ color: sector.color }}>{sector.count}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function Impact() {
  const stats = [
    { value: '2.4M+', label: 'Users Served',        sub: 'across 6 countries',        color: 'text-blue-400' },
    { value: '50%',   label: 'Wait Time Reduced',    sub: 'average across all sectors', color: 'text-emerald-400' },
    { value: '40%',   label: 'Efficiency Gain',      sub: 'for service providers',      color: 'text-purple-400' },
    { value: '94%',   label: 'AI Accuracy',          sub: 'in wait time prediction',    color: 'text-cyan-400' },
    { value: '99.2%', label: 'System Uptime',        sub: 'including offline mode',     color: 'text-yellow-400' },
    { value: '18+',   label: 'Countries Expanding',  sub: 'Pan-African rollout 2025',   color: 'text-pink-400' },
  ]

  return (
    <Section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">Our Impact</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Measurable results.{' '}
            <span className="gradient-text">Proven impact.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="glass p-8 text-center hover:translate-y-[-4px] transition-all duration-300">
              <div className={`font-display font-black text-5xl mb-2 ${s.color}`}>{s.value}</div>
              <div className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Testimonials() {
  return (
    <Section className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">Testimonials</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Trusted across <span className="gradient-text">the continent</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="glass p-6 hover:bg-white/8 transition-all">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={11} /> {t.country}
                </div>
              </div>
              {/* Metric badge */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span className="badge badge-green">{t.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
function Pricing() {
  return (
    <Section className="py-24 px-6" id="pricing">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="section-label">Pricing</div>
          <h2 className="font-display font-black text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Simple, <span className="gradient-text">transparent pricing</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Start free. Scale as you grow. Cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {pricingPlans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`relative glass p-7 flex flex-col gap-5 transition-all hover:-translate-y-1
                ${plan.highlighted ? 'border-purple-500/40 bg-purple-500/5 shadow-xl shadow-purple-500/10' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-purple px-4 py-1.5 text-xs font-bold shadow-lg">{plan.badge}</span>
                </div>
              )}

              <div>
                <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-display font-black text-4xl" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button className={plan.highlighted ? 'btn-primary justify-center' : 'btn-secondary justify-center'}>
                {plan.cta} {plan.highlighted && <ChevronRight size={16} />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <Section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeUp} className="relative glass p-12 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="section-label mx-auto w-fit mb-6">Get Started Today</div>
            <h2 className="font-display font-black text-4xl lg:text-6xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Ready to transform <br /><span className="gradient-text">your queue?</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join 120+ institutions across Africa already using QLine. 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/demo" className="btn-primary text-lg px-10 py-4">
                <Zap size={20} /> See Live Demo
              </Link>
              <a href="mailto:hello@qline.africa" className="btn-secondary text-lg px-10 py-4">
                Contact Sales
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// ── LANDING PAGE EXPORT ───────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <MarketSectors />
      <Impact />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
