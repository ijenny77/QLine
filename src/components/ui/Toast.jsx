import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X, XCircle, WifiOff } from 'lucide-react'
import { useQueueStore } from '../../store/queueStore'

const icons = {
  success: <CheckCircle size={15} className="text-[#167A5B]" />,
  warning: <AlertTriangle size={15} className="text-[#B7791F]" />,
  error:   <XCircle size={15} className="text-[#B83A3A]" />,
  info:    <Info size={15} className="text-[#0A6A6C]" />,
}

const borderStyles = {
  success: 'border-[#B6E3D4] bg-[#E8F5F1] text-[#132A32]',
  warning: 'border-[#FCE4B6] bg-[#FEF7E8] text-[#132A32]',
  error:   'border-[#F5C6C6] bg-[#FDEEEE] text-[#132A32]',
  info:    'border-[#D5DFDE] bg-white text-[#132A32]',
}

function ToastItem({ notification }) {
  const dismiss = useQueueStore(s => s.dismissNotification)

  useEffect(() => {
    const t = setTimeout(() => dismiss(notification.id), 4500)
    return () => clearTimeout(t)
  }, [notification.id, dismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2.5 p-3 border rounded shadow-panel max-w-sm w-full text-xs ${
        borderStyles[notification.type] || borderStyles.info
      }`}
    >
      <span className="mt-0.5 shrink-0">{icons[notification.type] || icons.info}</span>
      <p className="flex-1 font-medium leading-relaxed">{notification.message}</p>
      <button
        onClick={() => dismiss(notification.id)}
        className="shrink-0 p-0.5 text-[#66757A] hover:text-[#172126] transition-colors"
      >
        <X size={13} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const notifications = useQueueStore(s => s.notifications)
  const isOffline = useQueueStore(s => s.isOffline)
  const syncMessage = useQueueStore(s => s.syncMessage)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {/* Offline sticky warning banner if offline */}
      {isOffline && (
        <div className="pointer-events-auto flex items-center gap-2 p-2.5 bg-[#132A32] text-white border border-[#374E56] rounded shadow-panel text-xs">
          <WifiOff size={14} className="text-[#B83A3A] shrink-0 animate-pulse" />
          <div className="flex-1">
            <span className="font-semibold text-white">Local Queue Active: </span>
            <span className="text-slate-300">Operating offline. Changes will sync on reconnection.</span>
          </div>
        </div>
      )}

      {/* Sync restore banner */}
      {syncMessage && (
        <div className="pointer-events-auto flex items-center gap-2 p-2.5 bg-[#E8F5F1] text-[#132A32] border border-[#167A5B] rounded shadow-panel text-xs">
          <CheckCircle size={14} className="text-[#167A5B] shrink-0" />
          <span className="font-medium">{syncMessage}</span>
        </div>
      )}

      {/* Individual dismissible toasts */}
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 4).map(n => (
          <div key={n.id} className="pointer-events-auto">
            <ToastItem notification={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
