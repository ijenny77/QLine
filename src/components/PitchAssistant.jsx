import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles, ChevronRight, ChevronDown, CheckCircle,
  Play, RotateCcw, Smartphone, Users, WifiOff, Wifi,
  ArrowRight, ShieldCheck, X
} from 'lucide-react'
import { useQueueStore } from '../store/queueStore'

export default function PitchAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const queue = useQueueStore(s => s.queue)
  const userTicket = useQueueStore(s => s.userTicket)
  const isOffline = useQueueStore(s => s.isOffline)
  const pendingOfflineChanges = useQueueStore(s => s.pendingOfflineChanges)
  const joinQueueAsCitizen = useQueueStore(s => s.joinQueueAsCitizen)
  const callNext = useQueueStore(s => s.callNext)
  const citizenRequestDelay = useQueueStore(s => s.citizenRequestDelay)
  const toggleOffline = useQueueStore(s => s.toggleOffline)
  const resetDemo = useQueueStore(s => s.resetDemo)

  // Current scenario stage detection
  const hasJoined = Boolean(userTicket)
  const isServingUser = userTicket && queue[0]?.ticketId === userTicket.ticketId
  const isServed = userTicket && userTicket.status === 'served'

  const steps = [
    {
      num: 1,
      title: 'Citizen Joins via USSD',
      desc: 'Citizen dials *384#, selects Laboratory, receives ticket LAB-024 at position #13 (~38 min wait).',
      actionLabel: 'Go to Citizen USSD',
      action: () => {
        navigate('/queue')
      },
      done: hasJoined,
    },
    {
      num: 2,
      title: 'Staff Calls Next (Shared State)',
      desc: 'Switch to Staff Operations and click CALL NEXT. Notice positions decrement in real-time.',
      actionLabel: 'Go to Staff Queue',
      action: () => {
        navigate('/dashboard')
      },
      done: hasJoined && userTicket.position < 13,
    },
    {
      num: 3,
      title: 'Fair-Late Delay (+20 min)',
      desc: 'Citizen clicks "I need more time" (20 min). Queue moves position back rules-first to #15.',
      actionLabel: 'Simulate Delay',
      action: () => {
        navigate('/queue')
        if (hasJoined) citizenRequestDelay(20)
      },
      done: Boolean(userTicket?.status === 'delayed' || userTicket?.delayReason),
    },
    {
      num: 4,
      title: 'Call LAB-024 & Complete',
      desc: 'Staff calls LAB-024 to Window 2 and clicks Complete Service. Citizen sees completed state.',
      actionLabel: 'Call Next in Staff',
      action: () => {
        navigate('/dashboard')
        callNext()
      },
      done: isServed || isServingUser,
    },
    {
      num: 5,
      title: 'Offline Resilience & Walk-in',
      desc: 'Simulate internet outage. Local queue still registers walk-ins and calls patients with zero disruption.',
      actionLabel: isOffline ? 'Restore Connection' : 'Toggle Offline Mode',
      action: () => {
        toggleOffline()
        navigate('/dashboard')
      },
      done: isOffline || pendingOfflineChanges > 0,
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 z-40 text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#132A32] text-white rounded border border-[#374E56] shadow-panel hover:bg-[#1E3C47] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#0A6A6C] animate-pulse"></span>
          <span className="font-semibold">Pitch Walkthrough Guide</span>
          <ChevronRight size={13} className="text-slate-400" />
        </button>
      ) : (
        <div className="w-80 md:w-96 bg-white border border-[#DDE3E2] rounded shadow-dropdown p-4 text-[#172126]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE3E2] mb-3">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-[#E6F1F1] text-[#0A6A6C] font-mono text-[10px] font-bold">
                COMPETITION
              </span>
              <span className="font-semibold text-sm text-[#132A32]">2-Minute Pitch Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={resetDemo}
                title="Reset all demo state"
                className="p-1 rounded text-[#66757A] hover:text-[#172126] hover:bg-[#F6F7F5]"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#66757A] hover:text-[#172126] hover:bg-[#F6F7F5]"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#66757A] mb-3 leading-relaxed">
            Follow this 5-stage script to prove shared state, USSD inclusion, Fair-Late queue rules, and offline edge resilience to judges:
          </p>

          {/* Steps List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {steps.map((st) => (
              <div
                key={st.num}
                className={`p-2.5 rounded border transition-colors ${
                  st.done
                    ? 'border-[#B6E3D4] bg-[#F4FAF7]'
                    : 'border-[#DDE3E2] bg-[#FAFBF9]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      st.done ? 'bg-[#167A5B] text-white' : 'bg-[#132A32] text-white'
                    }`}>
                      {st.done ? '✓' : st.num}
                    </span>
                    <span className="font-semibold text-xs text-[#132A32]">{st.title}</span>
                  </div>
                  <button
                    onClick={st.action}
                    className="text-[11px] font-semibold text-[#0A6A6C] hover:underline shrink-0"
                  >
                    {st.actionLabel} →
                  </button>
                </div>
                <p className="text-[11px] text-[#66757A] leading-relaxed pl-5.5">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick switcher buttons at bottom */}
          <div className="mt-3 pt-2.5 border-t border-[#DDE3E2] flex items-center justify-between text-[11px]">
            <span className="text-[#66757A]">Quick View Switcher:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate('/queue')}
                className={`px-2 py-1 rounded font-medium ${
                  pathname === '/queue' ? 'bg-[#0A6A6C] text-white' : 'bg-[#F6F7F5] text-[#172126]'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-2 py-1 rounded font-medium ${
                  pathname === '/dashboard' ? 'bg-[#132A32] text-white' : 'bg-[#F6F7F5] text-[#172126]'
                }`}
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
