import { create } from 'zustand'
import { INITIAL_LAB_QUEUE, INITIAL_SERVED_HISTORY } from '../data/mockData'

const cloneInitialQueue = () => JSON.parse(JSON.stringify(INITIAL_LAB_QUEUE))
const cloneInitialHistory = () => JSON.parse(JSON.stringify(INITIAL_SERVED_HISTORY))

export const useQueueStore = create((set, get) => ({
  // Core Queue State
  queue: cloneInitialQueue(),
  servedHistory: cloneInitialHistory(),
  servedToday: 86,
  avgWaitTime: 31,
  activeWindow: 'Window 2',
  selectedService: 'Laboratory',

  // Citizen-specific State
  userTicket: null, // e.g. { ticketId: 'LAB-024', position: 13, waitTime: 38, status: 'waiting', service: 'Laboratory' }
  citizenStep: 1, // 1: Choose Service, 2: Join Method, 3: USSD Dial, 4: My Queue, 5: Served
  turnApproachingNotified: false,
  isAwayFromClinic: false,
  citizenDelayRequested: null, // null | 10 | 20
  citizenStatusMessage: '',

  // System & Offline State
  isOffline: false,
  pendingOfflineChanges: 0,
  syncMessage: null,

  // Staff Needs Attention / Audit
  needsAttention: [
    {
      id: 'att-1',
      ticketId: 'LAB-026',
      patientName: 'Grace Mutoni',
      channel: 'USSD',
      currentPosition: 13,
      requestedExtraMin: 20,
      reason: 'Patient requested 20 extra minutes via USSD',
      status: 'pending',
    }
  ],
  auditLogs: [
    { id: 1, time: '09:18 AM', text: 'Patient LAB-026 requested 20 min extension via USSD (*384#).' }
  ],

  // In-app Notifications
  notifications: [],

  // --------------------------------------------------------------------------
  // CITIZEN ACTIONS
  // --------------------------------------------------------------------------
  setCitizenStep: (step) => set({ citizenStep: step }),

  setSelectedService: (service) => set({ selectedService: service }),

  // Citizen joins via USSD (or other channels)
  joinQueueAsCitizen: (channel = 'USSD', name = 'Citizen (You)') => {
    const state = get()
    // Specifically produce LAB-024 with position #13 if first time in pitch scenario
    const existingIndex = state.queue.findIndex(t => t.ticketId === 'LAB-024')
    let ticket
    if (existingIndex >= 0) {
      ticket = state.queue[existingIndex]
    } else {
      const newPos = state.queue.length + 1
      ticket = {
        id: Date.now(),
        ticketId: 'LAB-024',
        name,
        position: 13, // Explicit pitch requirement: LAB-024, Position #13, ~38 min
        status: 'waiting',
        channel,
        service: state.selectedService || 'Laboratory',
        waitTime: 38,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      
      const newQueue = [...state.queue, ticket].sort((a, b) => a.position - b.position)
      set({
        queue: newQueue,
        userTicket: ticket,
        citizenStep: 4,
        notifications: [
          {
            id: Date.now(),
            type: 'success',
            message: `Ticket issued: ${ticket.ticketId}. Position #${ticket.position} in ${ticket.service}.`,
          },
          ...state.notifications,
        ],
      })
      return ticket
    }

    set({ userTicket: ticket, citizenStep: 4 })
    return ticket
  },

  toggleAwayFromClinic: () => set((state) => ({
    isAwayFromClinic: !state.isAwayFromClinic,
    notifications: [
      {
        id: Date.now(),
        type: 'info',
        message: !state.isAwayFromClinic
          ? 'You indicated you are leaving the waiting room. We will SMS you when 3 people remain.'
          : 'You are back in the waiting area.',
      },
      ...state.notifications,
    ],
  })),

  // Citizen requests delay (Fair-Late rule)
  citizenRequestDelay: (extraMinutes = 20) => {
    const state = get()
    if (!state.userTicket) return

    const ticketId = state.userTicket.ticketId
    // Position shift by rule (+3 positions or to position 15)
    const newPosition = Math.min(state.queue.length, (state.userTicket.position || 2) + 3)
    
    // Update queue
    const updatedQueue = state.queue.map(t => {
      if (t.ticketId === ticketId) {
        return {
          ...t,
          status: 'delayed',
          position: newPosition,
          waitTime: (t.waitTime || 8) + extraMinutes,
          delayReason: `Patient requested ${extraMinutes} extra minutes`,
        }
      }
      return t
    }).sort((a, b) => a.position - b.position)

    const updatedUserTicket = updatedQueue.find(t => t.ticketId === ticketId)

    // Add to staff attention queue
    const attentionItem = {
      id: `att-${Date.now()}`,
      ticketId,
      patientName: state.userTicket.name || 'Citizen (You)',
      channel: state.userTicket.channel || 'USSD',
      currentPosition: newPosition,
      requestedExtraMin: extraMinutes,
      reason: `Patient requested ${extraMinutes} extra minutes via ${state.userTicket.channel || 'USSD'}`,
      status: 'pending',
    }

    const auditEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Position adjusted by staff fairness rule: ${ticketId} shifted from #${state.userTicket.position} to #${newPosition} (+${extraMinutes}m).`,
    }

    set({
      queue: updatedQueue,
      userTicket: updatedUserTicket,
      citizenDelayRequested: extraMinutes,
      turnApproachingNotified: false,
      needsAttention: [attentionItem, ...state.needsAttention.filter(a => a.ticketId !== ticketId)],
      auditLogs: [auditEntry, ...state.auditLogs],
      notifications: [
        {
          id: Date.now(),
          type: 'warning',
          message: `Your place has been adjusted. New position: #${newPosition}. Estimated wait extended by ${extraMinutes} min.`,
        },
        ...state.notifications,
      ],
    })
  },

  // Citizen acknowledges return
  citizenReturning: () => {
    const state = get()
    if (!state.userTicket) return
    const ticketId = state.userTicket.ticketId

    const updatedQueue = state.queue.map(t => {
      if (t.ticketId === ticketId) {
        return { ...t, status: 'returning' }
      }
      return t
    })

    set({
      queue: updatedQueue,
      userTicket: { ...state.userTicket, status: 'returning' },
      notifications: [
        {
          id: Date.now(),
          type: 'success',
          message: 'Status updated: Returning to Laboratory Window 2. Staff notified.',
        },
        ...state.notifications,
      ],
    })
  },

  // --------------------------------------------------------------------------
  // STAFF ACTIONS
  // --------------------------------------------------------------------------
  callNext: () => {
    const state = get()
    const activeQueue = [...state.queue]
    const currentServing = activeQueue.find(t => t.status === 'serving')

    // Find next ticket to serve: first waiting or returning ticket
    const nextToServeIndex = activeQueue.findIndex(t => t.status === 'waiting' || t.status === 'delayed' || t.status === 'returning')
    if (nextToServeIndex === -1 && !currentServing) return

    let updatedHistory = [...state.servedHistory]
    let newServedCount = state.servedToday

    // Archive current serving
    if (currentServing) {
      updatedHistory.unshift({
        ticketId: currentServing.ticketId,
        name: currentServing.name,
        service: currentServing.service,
        channel: currentServing.channel,
        waitTime: `${currentServing.waitTime || 28} min`,
        servedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        window: state.activeWindow,
      })
      newServedCount += 1
    }

    // Remove old serving ticket from active queue
    let remainingQueue = activeQueue.filter(t => t.status !== 'serving')

    // Promote next ticket to serving
    if (remainingQueue.length > 0) {
      const nextTicket = remainingQueue[0]
      remainingQueue[0] = {
        ...nextTicket,
        status: 'serving',
        position: 1,
        window: state.activeWindow,
      }

      // Re-index remaining tickets
      for (let i = 1; i < remainingQueue.length; i++) {
        remainingQueue[i] = {
          ...remainingQueue[i],
          position: i + 1,
          waitTime: Math.max(2, (remainingQueue[i].waitTime || 10) - 3),
        }
      }
    }

    // Check citizen ticket updates
    let updatedUserTicket = state.userTicket
    let turnApproaching = state.turnApproachingNotified

    if (state.userTicket) {
      const foundInQueue = remainingQueue.find(t => t.ticketId === state.userTicket.ticketId)
      if (foundInQueue) {
        updatedUserTicket = { ...foundInQueue }
        // Trigger approach notification if position <= 2 and not yet notified
        if (foundInQueue.position <= 2 && foundInQueue.status !== 'serving') {
          turnApproaching = true
        }
      } else {
        // Was it the one just served?
        if (currentServing && currentServing.ticketId === state.userTicket.ticketId) {
          updatedUserTicket = { ...currentServing, status: 'served' }
        }
      }
    }

    const offlineInc = state.isOffline ? state.pendingOfflineChanges + 1 : state.pendingOfflineChanges

    set({
      queue: remainingQueue,
      servedHistory: updatedHistory,
      servedToday: newServedCount,
      userTicket: updatedUserTicket,
      turnApproachingNotified: turnApproaching,
      pendingOfflineChanges: offlineInc,
      avgWaitTime: Math.max(12, Math.round(remainingQueue.length * 2.8)),
      notifications: [
        {
          id: Date.now(),
          type: 'info',
          message: remainingQueue[0]
            ? `Now Serving: ${remainingQueue[0].ticketId} at ${state.activeWindow}`
            : 'All queued patients have been served.',
        },
        ...state.notifications,
      ],
    })
  },

  completeCurrentServing: () => {
    const state = get()
    const current = state.queue.find(t => t.status === 'serving')
    if (!current) return

    const newHistory = [
      {
        ticketId: current.ticketId,
        name: current.name,
        service: current.service,
        channel: current.channel,
        waitTime: `${current.waitTime || 30} min`,
        servedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        window: state.activeWindow,
      },
      ...state.servedHistory,
    ]

    const remaining = state.queue.filter(t => t.id !== current.id)
    let updatedUserTicket = state.userTicket
    if (state.userTicket && state.userTicket.ticketId === current.ticketId) {
      updatedUserTicket = { ...current, status: 'served' }
    }

    const offlineInc = state.isOffline ? state.pendingOfflineChanges + 1 : state.pendingOfflineChanges

    set({
      queue: remaining,
      servedHistory: newHistory,
      servedToday: state.servedToday + 1,
      userTicket: updatedUserTicket,
      pendingOfflineChanges: offlineInc,
      notifications: [
        {
          id: Date.now(),
          type: 'success',
          message: `Ticket ${current.ticketId} marked as completed.`,
        },
        ...state.notifications,
      ],
    })
  },

  // Register Walk-in (staff desk)
  addWalkIn: (name, phone = '', service = 'Laboratory') => {
    const state = get()
    const ticketNumber = `LAB-0${String(state.servedToday + state.queue.length + 1).slice(-2)}` || `LAB-027`
    const position = state.queue.length + 1
    const newPatient = {
      id: Date.now(),
      ticketId: ticketNumber,
      name: name.trim() || `Walk-in Patient #${position}`,
      phone: phone.trim() || 'No phone registered',
      position,
      status: 'waiting',
      channel: 'Walk-in',
      service,
      waitTime: Math.max(5, position * 3),
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const offlineInc = state.isOffline ? state.pendingOfflineChanges + 1 : state.pendingOfflineChanges

    set({
      queue: [...state.queue, newPatient],
      pendingOfflineChanges: offlineInc,
      notifications: [
        {
          id: Date.now(),
          type: 'success',
          message: `Walk-in registered: ${newPatient.ticketId} (#${position}) printed for ${newPatient.name}.`,
        },
        ...state.notifications,
      ],
    })
    return newPatient
  },

  // Staff resolves late arrival attention
  adjustLatePosition: (ticketId, shift = 3) => {
    const state = get()
    const target = state.queue.find(t => t.ticketId === ticketId)
    if (!target) return

    const oldPos = target.position
    const newPos = Math.min(state.queue.length, oldPos + shift)

    const updatedQueue = state.queue.map(t => {
      if (t.ticketId === ticketId) {
        return { ...t, position: newPos, status: 'waiting' }
      }
      return t
    }).sort((a, b) => a.position - b.position)

    const auditEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Position adjusted by staff rule: ${ticketId} moved from #${oldPos} to #${newPos}.`,
    }

    set({
      queue: updatedQueue,
      needsAttention: state.needsAttention.filter(a => a.ticketId !== ticketId),
      auditLogs: [auditEntry, ...state.auditLogs],
      notifications: [
        {
          id: Date.now(),
          type: 'info',
          message: `Position adjusted by staff rule: ${ticketId} shifted to #${newPos}.`,
        },
        ...state.notifications,
      ],
    })
  },

  keepLatePosition: (ticketId) => {
    const state = get()
    const auditEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Staff approved retaining position for ${ticketId}.`,
    }

    set({
      needsAttention: state.needsAttention.filter(a => a.ticketId !== ticketId),
      auditLogs: [auditEntry, ...state.auditLogs],
      notifications: [
        {
          id: Date.now(),
          type: 'info',
          message: `Retained existing queue position for ${ticketId}.`,
        },
        ...state.notifications,
      ],
    })
  },

  // --------------------------------------------------------------------------
  // OFFLINE & CONNECTIVITY
  // --------------------------------------------------------------------------
  toggleOffline: () => {
    const state = get()
    const nextOffline = !state.isOffline
    if (!nextOffline && state.pendingOfflineChanges > 0) {
      // Reconnected and syncing
      const syncCount = state.pendingOfflineChanges
      set({
        isOffline: false,
        pendingOfflineChanges: 0,
        syncMessage: `Connection restored — ${syncCount} changes synchronized with Kigali Hospital core server.`,
        notifications: [
          {
            id: Date.now(),
            type: 'success',
            message: `Connection restored — ${syncCount} changes synchronized.`,
          },
          ...state.notifications,
        ],
      })
      setTimeout(() => set({ syncMessage: null }), 6000)
    } else {
      set({
        isOffline: nextOffline,
        notifications: [
          {
            id: Date.now(),
            type: nextOffline ? 'warning' : 'info',
            message: nextOffline
              ? 'Offline mode active — Local queue engine operating on device cache.'
              : 'Connection online. Edge gateway synchronized.',
          },
          ...state.notifications,
        ],
      })
    }
  },

  restoreConnection: () => {
    const state = get()
    const count = state.pendingOfflineChanges
    set({
      isOffline: false,
      pendingOfflineChanges: 0,
      syncMessage: `Connection restored — ${count} changes synchronized.`,
      notifications: [
        {
          id: Date.now(),
          type: 'success',
          message: `Connection restored — ${count} changes synchronized.`,
        },
        ...state.notifications,
      ],
    })
    setTimeout(() => set({ syncMessage: null }), 6000)
  },

  // --------------------------------------------------------------------------
  // PITCH / DEMO CONTROLS
  // --------------------------------------------------------------------------
  resetDemo: () => {
    set({
      queue: cloneInitialQueue(),
      servedHistory: cloneInitialHistory(),
      servedToday: 86,
      avgWaitTime: 31,
      userTicket: null,
      citizenStep: 1,
      turnApproachingNotified: false,
      isAwayFromClinic: false,
      citizenDelayRequested: null,
      citizenStatusMessage: '',
      isOffline: false,
      pendingOfflineChanges: 0,
      syncMessage: null,
      needsAttention: [
        {
          id: 'att-1',
          ticketId: 'LAB-026',
          patientName: 'Grace Mutoni',
          channel: 'USSD',
          currentPosition: 13,
          requestedExtraMin: 20,
          reason: 'Patient requested 20 extra minutes via USSD',
          status: 'pending',
        }
      ],
      auditLogs: [
        { id: 1, time: '09:18 AM', text: 'Patient LAB-026 requested 20 min extension via USSD (*384#).' }
      ],
      notifications: [
        {
          id: Date.now(),
          type: 'info',
          message: 'Demo state reset to clean scenario (Kigali Hospital — Laboratory).',
        }
      ],
    })
  },

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),
}))