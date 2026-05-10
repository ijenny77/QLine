import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Wifi, WifiOff, Zap } from 'lucide-react'
import { useQueueStore } from '../../store/queueStore'
import clsx from 'clsx'

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'My Queue',  to: '/queue' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'AI Engine', to: '/ai' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isDarkMode   = useQueueStore(s => s.isDarkMode)
  const isOffline    = useQueueStore(s => s.isOffline)
  const isDemoMode   = useQueueStore(s => s.isDemoMode)
  const toggleDark   = useQueueStore(s => s.toggleDarkMode)
  const toggleOffline= useQueueStore(s => s.toggleOffline)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-colors duration-300" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-black text-sm">Q</span>
              </div>
              {isDemoMode && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-lg gradient-text">QLine</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">AI Queue</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={
                  pathname === link.to
                    ? { color: 'var(--text-primary)', background: 'var(--glass-border)' }
                    : { color: 'var(--text-secondary)' }
                }
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Offline toggle */}
            <button
              onClick={toggleOffline}
              title={isOffline ? 'Go online' : 'Simulate offline'}
              className={clsx(
                'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                isOffline
                  ? 'border-red-500/40 bg-red-500/10 text-red-500'
                  : 'border-slate-300/30 dark:border-white/10 bg-white/5'
              )}
            >
              {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
              {isOffline ? 'Offline' : 'Online'}
            </button>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              style={{ color: 'var(--text-secondary)' }}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/demo"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
            >
              <Zap size={14} />
              Live Demo
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--glass-border)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  style={
                    pathname === link.to
                      ? { color: 'var(--text-primary)', background: 'var(--glass-border)' }
                      : { color: 'var(--text-secondary)' }
                  }
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/demo"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 mt-2"
              >
                <Zap size={14} /> Live Demo
              </Link>
              <button
                onClick={toggleOffline}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isOffline ? 'text-red-400' : 'text-slate-400'
                )}
              >
                {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
                {isOffline ? 'Offline Mode On' : 'Simulate Offline'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
