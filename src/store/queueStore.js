import { create } from 'zustand'

const estimateWait = (position, avgServiceTime = 4) =>
  Math.round(position * avgServiceTime * (0.8 + Math.random() * 0.4))

const generateTicketId = () =>
  `QL-${String(Math.floor(Math.random() * 9000) + 1000)}`

const INITIAL_QUEUE = [
  { id: 1,  ticketId: 'QL-4821', name: 'Amara Diallo',     position: 1,  status: 'serving',  channel: 'app',    waitTime: 0,  eta: '9:02 AM' },
  { id: 2,  ticketId: 'QL-4822', name: 'Kwame Asante',     position: 2,  status: 'waiting',  channel: 'sms',    waitTime: 4,  eta: '9:06 AM' },
  { id: 3,  ticketId: 'QL-4823', name: 'Fatima Al-Hassan', position: 3,  status: 'waiting',  channel: 'ussd',   waitTime: 8,  eta: '9:10 AM' },
  { id: 4,  ticketId: 'QL-4824', name: 'Chidi Okafor',     position: 4,  status: 'waiting',  channel: 'app',    waitTime: 12, eta: '9:14 AM' },
  { id: 5,  ticketId: 'QL-4825', name: 'Aisha Mensah',     position: 5,  status: 'waiting',  channel: 'walkin', waitTime: 16, eta: '9:18 AM' },
  { id: 6,  ticketId: 'QL-4826', name: 'Seun Adeleke',     position: 6,  status: 'waiting',  channel: 'qr',     waitTime: 20, eta: '9:22 AM' },
  { id: 7,  ticketId: 'QL-4827', name: 'Nadia Touré',      position: 7,  status: 'waiting',  channel: 'sms',    waitTime: 24, eta: '9:26 AM' },
  { id: 8,  ticketId: 'QL-4828', name: 'Emmanuel Boateng', position: 8,  status: 'delayed',  channel: 'app',    waitTime: 28, eta: '9:30 AM' },
  { id: 9,  ticketId: 'QL-4829', name: 'Zainab Traoré',    position: 9,  status: 'waiting',  channel: 'ussd',   waitTime: 32, eta: '9:34 AM' },
  { id: 10, ticketId: 'QL-4830', name: 'Kofi Acheampong',  position: 10, status: 'waiting',  channel: 'walkin', waitTime: 36, eta: '9:38 AM' },
]

const AI_INSIGHTS_POOL = [
  { id: 1, type: 'warning', icon: 'TrendingUp',   title: 'Peak Traffic Incoming',    message: 'AI predicts 47% queue surge in 18 minutes. Recommend opening Counter 3.',      confidence: 91 },
  { id: 2, type: 'info',    icon: 'Users',         title: 'Optimal Staff Allocation', message: 'Suggest adding 2 more agents to reduce average wait by ~6 minutes.',          confidence: 87 },
  { id: 3, type: 'warning', icon: 'Clock',         title: 'Late Arrival Detected',    message: 'User QL-4828 (Emmanuel) has 72% probability of delay. Smart repositioned.',   confidence: 72 },
  { id: 4, type: 'success', icon: 'Zap',           title: 'Efficiency Improved',      message: 'Queue throughput increased 23% since 8 AM. AI scheduling is working.',        confidence: 95 },
  { id: 5, type: 'info',    icon: 'MapPin',        title: 'Geographic Cluster Alert', message: '8 users in Westlands area. SMS batch notification sent to stagger arrivals.', confidence: 83 },
  { id: 6, type: 'warning', icon: 'AlertTriangle', title: 'Counter 2 Bottleneck',     message: 'Counter 2 processing 40% slower than average. Consider rebalancing.',         confidence: 89 },
]

export const useQueueStore = create((set, get) => ({
  queue:          INITIAL_QUEUE,
  currentServing: 1,
  totalToday:     127,
  avgWaitTime:    14,
  aiEfficiency:   87,
  isOffline:      false,
  isDemoMode:     false,
  isDarkMode:     true,
  aiInsights:     AI_INSIGHTS_POOL,
  activeCounters: [
    { id: 1, name: 'Counter A', staff: 'Grace Mutua', status: 'active', serving: 'QL-4821', avgTime: 4 },
    { id: 2, name: 'Counter B', staff: 'Ibrahim Sow', status: 'active', serving: null,       avgTime: 6 },
    { id: 3, name: 'Counter C', staff: 'Priya Nair',  status: 'idle',   serving: null,       avgTime: 4 },
    { id: 4, name: 'Counter D', staff: '—',           status: 'closed', serving: null,       avgTime: 0 },
  ],
  notifications: [],
  userTicket:    null,
  pendingSync:   0,
  demoInterval:  null,

  callNext: () => set((state) => {
    const queue = state.queue.filter(u => u.status !== 'serving')
    if (!queue.length) return {}
    const next = queue.find(u => u.status === 'waiting' || u.status === 'delayed')
    if (!next) return {}
    const updated = state.queue.map(u => {
      if (u.id === state.currentServing && u.status === 'serving') return { ...u, status: 'served' }
      if (u.id === next.id) return { ...u, status: 'serving', position: 1 }
      if (u.status === 'waiting' || u.status === 'delayed') return { ...u, position: u.position - 1 }
      return u
    }).filter(u => u.status !== 'served')
    return {
      queue:          updated,
      currentServing: next.id,
      totalToday:     state.totalToday + 1,
      avgWaitTime:    Math.max(8, state.avgWaitTime - 1),
    }
  }),

  addWalkIn: (name) => set((state) => {
    const newUser = {
      id:       Date.now(),
      ticketId: generateTicketId(),
      name,
      position: state.queue.length + 1,
      status:   'waiting',
      channel:  'walkin',
      waitTime: estimateWait(state.queue.length + 1),
      eta:      '—',
    }
    return {
      queue: [...state.queue, newUser],
      notifications: [
        { id: Date.now(), type: 'success', message: `Walk-in added: ${name} → ${newUser.ticketId}` },
        ...state.notifications,
      ],
    }
  }),

  joinQueue: (name, channel = 'app') => {
    const state = get()
    const newUser = {
      id:       Date.now(),
      ticketId: generateTicketId(),
      name,
      position: state.queue.length + 1,
      status:   'waiting',
      channel,
      waitTime: estimateWait(state.queue.length + 1),
      eta:      '—',
    }
    set(s => ({
      queue: [...s.queue, newUser],
      userTicket: newUser,
      notifications: [
        { id: Date.now(), type: 'success', message: `You joined the queue! Ticket: ${newUser.ticketId}` },
        ...s.notifications,
      ],
    }))
    return newUser
  },

  repositionDelayed: (userId) => set((state) => ({
    queue: state.queue.map(u =>
      u.id === userId
        ? { ...u, status: 'waiting', position: Math.min(u.position + 3, state.queue.length) }
        : u
    ),
    notifications: [
      { id: Date.now(), type: 'info', message: 'AI smart-repositioned delayed user' },
      ...state.notifications,
    ],
  })),

  toggleOffline: () => set((state) => {
    const offline = !state.isOffline
    return {
      isOffline:    offline,
      pendingSync:  offline ? 0 : state.pendingSync,
      notifications: [
        {
          id:      Date.now(),
          type:    offline ? 'warning' : 'success',
          message: offline
            ? 'Offline mode activated. Queue cached locally.'
            : `Back online. Syncing ${state.pendingSync} records…`,
        },
        ...state.notifications,
      ],
    }
  }),

  simulateOfflineChange: () => set((state) => ({
    pendingSync: state.isOffline ? state.pendingSync + 1 : state.pendingSync,
  })),

  toggleDarkMode: () => set((state) => {
    const dark = !state.isDarkMode
    if (dark) document.documentElement.classList.add('dark')
    else      document.documentElement.classList.remove('dark')
    return { isDarkMode: dark }
  }),

  startDemo: () => {
    const names = [
      'Ama Owusu',      'Tariq Hassan',   'Lindiwe Dlamini', 'Olumide Bello',
      'Mariama Diallo', 'Yaw Boateng',    'Ngozi Adeyemi',   'Sione Tuilagi',
    ]
    let i = 0
    const interval = setInterval(() => {
      get().callNext()
      if (i < names.length) {
        get().addWalkIn(names[i++])
      }
    }, 2500)
    set({ isDemoMode: true, demoInterval: interval })
  },

  stopDemo: () => {
    const { demoInterval } = get()
    if (demoInterval) clearInterval(demoInterval)
    set({ isDemoMode: false, demoInterval: null })
  },

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),
}))