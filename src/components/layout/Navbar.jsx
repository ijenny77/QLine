import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown, Wifi, WifiOff, RotateCcw,
  Users, Layers, Clock, Activity, ShieldCheck,
  UserCheck, Building2, Menu, X
} from 'lucide-react'
import { useQueueStore } from '../../store/queueStore'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [operationsOpen, setOperationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isOffline = useQueueStore(s => s.isOffline)
  const pendingOfflineChanges = useQueueStore(s => s.pendingOfflineChanges)
  const toggleOffline = useQueueStore(s => s.toggleOffline)
  const resetDemo = useQueueStore(s => s.resetDemo)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOperationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isOperationsActive = ['/dashboard', '/services', '/history'].some(p => pathname.startsWith(p))

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DDE3E2]">
      {/* Top institution & environment bar */}
      <div className="bg-[#132A32] text-white text-xs px-4 md:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={13} className="text-[#0A6A6C] text-emerald-400" />
          <span className="font-semibold text-slate-100">Kigali Hospital — Demo</span>
          <span className="text-[10px] tracking-wider uppercase bg-[#1E3C47] text-[#A2C2C6] px-1.5 py-0.5 rounded font-mono">
            DEMO ENVIRONMENT
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="hidden sm:inline text-[11px] text-slate-400">
            Rwanda Public Service Queue Platform
          </span>
          <button
            onClick={resetDemo}
            title="Reset queue and state to clean scenario for judges"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#1E3C47] hover:bg-[#0A6A6C] text-white transition-colors"
          >
            <RotateCcw size={11} />
            <span>RESET DEMO</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/qline-logo.png" alt="QLine" className="w-8 h-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-semibold text-lg tracking-tight text-[#132A32]">QLine</span>
                <span className="text-[9px] text-[#66757A] font-medium uppercase tracking-wider">Queue System</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-medium">
              {/* Operations Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOperationsOpen(!operationsOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                    isOperationsActive
                      ? 'text-[#0A6A6C] bg-[#E6F1F1] font-semibold'
                      : 'text-[#172126] hover:bg-[#F6F7F5]'
                  }`}
                >
                  <span>Operations</span>
                  <ChevronDown size={14} className={`transition-transform ${operationsOpen ? 'rotate-180' : ''}`} />
                </button>

                {operationsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#DDE3E2] rounded shadow-dropdown py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setOperationsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#172126] hover:bg-[#F6F7F5]"
                    >
                      <Users size={14} className="text-[#0A6A6C]" />
                      <div>
                        <div className="font-medium">Live Queue</div>
                        <div className="text-[10px] text-[#66757A]">Staff queue window</div>
                      </div>
                    </Link>
                    <Link
                      to="/services"
                      onClick={() => setOperationsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#172126] hover:bg-[#F6F7F5]"
                    >
                      <Layers size={14} className="text-[#0A6A6C]" />
                      <div>
                        <div className="font-medium">Services</div>
                        <div className="text-[10px] text-[#66757A]">Hospital counters</div>
                      </div>
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setOperationsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#172126] hover:bg-[#F6F7F5]"
                    >
                      <Clock size={14} className="text-[#0A6A6C]" />
                      <div>
                        <div className="font-medium">History</div>
                        <div className="text-[10px] text-[#66757A]">Served tickets log</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Insights */}
              <Link
                to="/analytics"
                className={`px-3 py-1.5 rounded transition-colors ${
                  pathname === '/analytics'
                    ? 'text-[#0A6A6C] bg-[#E6F1F1] font-semibold'
                    : 'text-[#172126] hover:bg-[#F6F7F5]'
                }`}
              >
                Insights
              </Link>

              {/* System */}
              <Link
                to="/connectivity"
                className={`px-3 py-1.5 rounded transition-colors ${
                  pathname === '/connectivity'
                    ? 'text-[#0A6A6C] bg-[#E6F1F1] font-semibold'
                    : 'text-[#172126] hover:bg-[#F6F7F5]'
                }`}
              >
                System
              </Link>
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Quick Experience Switcher: Citizen vs Staff */}
            <div className="hidden sm:flex items-center bg-[#F6F7F5] border border-[#DDE3E2] rounded p-0.5 text-xs font-medium">
              <Link
                to="/queue"
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathname === '/queue'
                    ? 'bg-[#0A6A6C] text-white shadow-subtle font-semibold'
                    : 'text-[#66757A] hover:text-[#172126]'
                }`}
              >
                Citizen Mode
              </Link>
              <Link
                to="/dashboard"
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-[#132A32] text-white shadow-subtle font-semibold'
                    : 'text-[#66757A] hover:text-[#172126]'
                }`}
              >
                Staff Mode
              </Link>
            </div>

            {/* Connectivity Simulation Pill */}
            <button
              onClick={toggleOffline}
              title={isOffline ? 'Click to restore online connectivity' : 'Click to simulate internet outage'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                isOffline
                  ? 'bg-[#FDEEEE] border-[#F5C6C6] text-[#B83A3A] animate-pulse'
                  : 'bg-[#E8F5F1] border-[#B6E3D4] text-[#167A5B]'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff size={13} />
                  <span>OFFLINE {pendingOfflineChanges > 0 ? `(${pendingOfflineChanges})` : ''}</span>
                </>
              ) : (
                <>
                  <Wifi size={13} />
                  <span>ONLINE</span>
                </>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#172126] hover:bg-[#F6F7F5] rounded"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE3E2] bg-white px-4 py-3 space-y-2">
          <div className="text-xs font-semibold text-[#66757A] uppercase tracking-wider mb-1">Navigation</div>
          <Link
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            Citizen Experience (Join & Track)
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            Staff Operations (Live Queue)
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            Hospital Service Windows
          </Link>
          <Link
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            Served Tickets History
          </Link>
          <Link
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            Operational Overview
          </Link>
          <Link
            to="/connectivity"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-[#172126] hover:bg-[#F6F7F5]"
          >
            System Connectivity & Sync
          </Link>
        </div>
      )}
    </header>
  )
}
