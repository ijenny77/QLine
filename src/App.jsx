import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar    from './components/layout/Navbar'
import Toast     from './components/ui/Toast'
import Landing   from './pages/Landing'
import UserQueue from './pages/UserQueue'
import StaffDashboard from './pages/StaffDashboard'
import Analytics from './pages/Analytics'
import AIEngine  from './pages/AIEngine'
import Demo      from './pages/Demo'
import { useQueueStore } from './store/queueStore'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isOffline    = useQueueStore(s => s.isOffline)

  return (
    <>
      <ScrollReset />
      <Navbar />
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-30 flex items-center justify-center"
          >
            <div className="mt-2 px-5 py-2 bg-red-900/90 backdrop-blur-sm border border-red-500/40 rounded-full text-red-300 text-sm font-medium shadow-xl">
              Offline Mode — Queue running locally. Data will sync on reconnect.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={pathname} key={pathname}>
          <Route path="/"          element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/queue"     element={<PageWrapper><UserQueue /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><StaffDashboard /></PageWrapper>} />
          <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
          <Route path="/ai"        element={<PageWrapper><AIEngine /></PageWrapper>} />
          <Route path="/demo"      element={<PageWrapper><Demo /></PageWrapper>} />
          <Route path="*"          element={
            <PageWrapper>
              <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-6">
                <div className="font-display font-black text-8xl gradient-text mb-4">404</div>
                <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
                <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">← Back to Home</a>
              </div>
            </PageWrapper>
          } />
        </Routes>
      </AnimatePresence>

      <Toast />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
