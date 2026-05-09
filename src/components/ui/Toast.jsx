import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { useQueueStore } from '../../store/queueStore'

const icons = {
  success: <CheckCircle  size={16} className="text-emerald-400" />,
  warning: <AlertTriangle size={16} className="text-yellow-400" />,
  error:   <XCircle     size={16} className="text-red-400" />,
  info:    <Info         size={16} className="text-blue-400" />,
}

const borders = {
  success: 'border-emerald-500/40',
  warning: 'border-yellow-500/40',
  error:   'border-red-500/40',
  info:    'border-blue-500/40',
}

function ToastItem({ notification }) {
  const dismiss = useQueueStore(s => s.dismissNotification)

  useEffect(() => {
    const t = setTimeout(() => dismiss(notification.id), 5000)
    return () => clearTimeout(t)
  }, [notification.id, dismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      className={`flex items-start gap-3 p-4 glass border ${borders[notification.type] || 'border-white/10'} rounded-xl shadow-xl max-w-sm w-full`}
    >
      <span className="mt-0.5 shrink-0">{icons[notification.type] || icons.info}</span>
      <p className="text-sm text-slate-200 flex-1 leading-relaxed">{notification.message}</p>
      <button
        onClick={() => dismiss(notification.id)}
        className="shrink-0 p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const notifications = useQueueStore(s => s.notifications)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 5).map(n => (
          <div key={n.id} className="pointer-events-auto">
            <ToastItem notification={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
