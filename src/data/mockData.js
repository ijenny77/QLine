// ==============================================================
// QLine Public Service Queue Management System — Kigali Hospital Demo
// Realistic Rwandan public healthcare operational data
// ==============================================================

export const HOSPITAL_INFO = {
  name: 'Kigali Hospital',
  division: 'Outpatient & Diagnostic Center',
  location: 'KN 4 Ave, Nyarugenge, Kigali, Rwanda',
  systemStatus: 'Operational',
  environment: 'DEMO ENVIRONMENT',
  currency: 'RWF',
  helpline: 'Toll-free: 912 | SMS: 384',
}

// 5 Core Public Services at Kigali Hospital
export const HOSPITAL_SERVICES = [
  {
    id: 'lab',
    code: 'LAB',
    name: 'Laboratory',
    nameRw: 'Laboratwari',
    description: 'Blood draw, clinical tests, specimen drop-off, test results',
    waitingCount: 12,
    avgWaitMin: 38,
    activeWindow: 'Window 2',
    icon: 'FlaskConical',
    color: '#0A6A6C',
  },
  {
    id: 'opd',
    code: 'OPD',
    name: 'Outpatient Department',
    nameRw: 'Icyumba cya Muganga',
    description: 'General consultations, triage assessment, doctor reviews',
    waitingCount: 18,
    avgWaitMin: 45,
    activeWindow: 'Room 104',
    icon: 'Stethoscope',
    color: '#132A32',
  },
  {
    id: 'pharmacy',
    code: 'PHARM',
    name: 'Pharmacy',
    nameRw: 'Farumasi',
    description: 'Prescription collection, RAMA/Mutuelle de Santé validation',
    waitingCount: 8,
    avgWaitMin: 20,
    activeWindow: 'Counter 3',
    icon: 'Pill',
    color: '#167A5B',
  },
  {
    id: 'registration',
    code: 'REG',
    name: 'Registration & Triage',
    nameRw: 'Kwandika Abarwayi',
    description: 'Patient check-in, national ID verification, file retrieval',
    waitingCount: 5,
    avgWaitMin: 14,
    activeWindow: 'Desk 1',
    icon: 'FileText',
    color: '#B7791F',
  },
  {
    id: 'billing',
    code: 'BILL',
    name: 'Billing & Cashier',
    nameRw: 'Kwishyura & Ubwishingizi',
    description: 'Mutuelle de Santé co-pay, private insurance, MoMo payment',
    waitingCount: 3,
    avgWaitMin: 10,
    activeWindow: 'Window 4',
    icon: 'Receipt',
    color: '#66757A',
  },
]

// Service Counters / Windows
export const SERVICE_WINDOWS = [
  { id: 'win-1', number: 'Window 1', service: 'Laboratory', staff: 'Dr. Claudine M.', status: 'Active', currentTicket: 'LAB-023' },
  { id: 'win-2', number: 'Window 2', service: 'Laboratory', staff: 'Eric Ndayisaba', status: 'Active', currentTicket: 'LAB-022' },
  { id: 'win-3', number: 'Window 3', service: 'Laboratory', staff: 'Florence Umutoni', status: 'Standby', currentTicket: '—' },
  { id: 'win-4', number: 'Room 101', service: 'Outpatient', staff: 'Dr. Jean-Luc Habimana', status: 'Active', currentTicket: 'OPD-041' },
  { id: 'win-5', number: 'Counter 3', service: 'Pharmacy', staff: 'Alice Mukamana', status: 'Active', currentTicket: 'PHARM-019' },
]

// Realistic initial queue for Laboratory (focus of live pitch)
export const INITIAL_LAB_QUEUE = [
  { id: 1,  ticketId: 'LAB-023', name: 'Alphonse Mugisha', position: 1,  status: 'serving', channel: 'USSD',    waitTime: 0,  service: 'Laboratory', joinedAt: '08:42 AM', window: 'Window 2' },
  { id: 2,  ticketId: 'LAB-012', name: 'Chantal Uwamahoro', position: 2,  status: 'waiting', channel: 'SMS',     waitTime: 4,  service: 'Laboratory', joinedAt: '08:45 AM' },
  { id: 3,  ticketId: 'LAB-013', name: 'Aimable Nkurunziza', position: 3,  status: 'waiting', channel: 'Walk-in', waitTime: 7,  service: 'Laboratory', joinedAt: '08:47 AM' },
  { id: 4,  ticketId: 'LAB-014', name: 'Diane Keza',        position: 4,  status: 'waiting', channel: 'USSD',    waitTime: 10, service: 'Laboratory', joinedAt: '08:50 AM' },
  { id: 5,  ticketId: 'LAB-015', name: 'Patrick Uwimana',   position: 5,  status: 'waiting', channel: 'QR/Web',  waitTime: 13, service: 'Laboratory', joinedAt: '08:52 AM' },
  { id: 6,  ticketId: 'LAB-016', name: 'Esperance Mukarwego', position: 6, status: 'waiting', channel: 'Walk-in', waitTime: 16, service: 'Laboratory', joinedAt: '08:55 AM' },
  { id: 7,  ticketId: 'LAB-017', name: 'Thierry Gasana',    position: 7,  status: 'waiting', channel: 'SMS',     waitTime: 19, service: 'Laboratory', joinedAt: '08:58 AM' },
  { id: 8,  ticketId: 'LAB-018', name: 'Nadine Ingabire',   position: 8,  status: 'waiting', channel: 'USSD',    waitTime: 22, service: 'Laboratory', joinedAt: '09:01 AM' },
  { id: 9,  ticketId: 'LAB-019', name: 'Emmanuel Bizimana', position: 9,  status: 'waiting', channel: 'Walk-in', waitTime: 26, service: 'Laboratory', joinedAt: '09:05 AM' },
  { id: 10, ticketId: 'LAB-020', name: 'Beata Mukamana',    position: 10, status: 'waiting', channel: 'USSD',    waitTime: 29, service: 'Laboratory', joinedAt: '09:08 AM' },
  { id: 11, ticketId: 'LAB-021', name: 'Innocent Kwizera',  position: 11, status: 'waiting', channel: 'SMS',     waitTime: 32, service: 'Laboratory', joinedAt: '09:11 AM' },
  { id: 12, ticketId: 'LAB-022', name: 'Solange Kayitesi',  position: 12, status: 'waiting', channel: 'QR/Web',  waitTime: 35, service: 'Laboratory', joinedAt: '09:14 AM' },
  { id: 13, ticketId: 'LAB-026', name: 'Grace Mutoni',      position: 13, status: 'delayed', channel: 'USSD',    waitTime: 42, service: 'Laboratory', joinedAt: '09:18 AM', delayReason: 'Patient requested 20 extra minutes via USSD' },
]

// Realistic served history today (total 86 served at start)
export const INITIAL_SERVED_HISTORY = [
  { ticketId: 'LAB-022', name: 'Vestine Nyirahabimana', service: 'Laboratory', channel: 'USSD', waitTime: '28 min', servedTime: '09:20 AM', window: 'Window 2' },
  { ticketId: 'LAB-021', name: 'Jean Bosco Nshimiyimana', service: 'Laboratory', channel: 'Walk-in', waitTime: '31 min', servedTime: '09:14 AM', window: 'Window 1' },
  { ticketId: 'LAB-020', name: 'Clementine Mukagasana', service: 'Laboratory', channel: 'SMS', waitTime: '33 min', servedTime: '09:08 AM', window: 'Window 2' },
  { ticketId: 'LAB-019', name: 'Alexis Habineza', service: 'Laboratory', channel: 'USSD', waitTime: '30 min', servedTime: '09:01 AM', window: 'Window 1' },
  { ticketId: 'LAB-018', name: 'Clarisse Umwali', service: 'Laboratory', channel: 'QR/Web', waitTime: '29 min', servedTime: '08:54 AM', window: 'Window 2' },
  { ticketId: 'LAB-017', name: 'Faustin Manzi', service: 'Laboratory', channel: 'Walk-in', waitTime: '34 min', servedTime: '08:48 AM', window: 'Window 1' },
  { ticketId: 'LAB-016', name: 'Sandrine Uwamariya', service: 'Laboratory', channel: 'USSD', waitTime: '27 min', servedTime: '08:41 AM', window: 'Window 2' },
  { ticketId: 'LAB-015', name: 'Eric Sengondo', service: 'Laboratory', channel: 'SMS', waitTime: '32 min', servedTime: '08:35 AM', window: 'Window 1' },
]

// Today's hourly operational throughput at Kigali Hospital
export const HOURLY_OPERATIONS = [
  { hour: '07:00', arrivals: 14, served: 10, avgWait: 15 },
  { hour: '08:00', arrivals: 32, served: 24, avgWait: 22 },
  { hour: '09:00', arrivals: 48, served: 38, avgWait: 31 },
  { hour: '10:00', arrivals: 52, served: 41, avgWait: 36 },
  { hour: '11:00', arrivals: 45, served: 40, avgWait: 34 },
  { hour: '12:00', arrivals: 28, served: 30, avgWait: 28 },
  { hour: '13:00', arrivals: 22, served: 25, avgWait: 20 },
  { hour: '14:00', arrivals: 35, served: 32, avgWait: 25 },
  { hour: '15:00', arrivals: 29, served: 28, avgWait: 21 },
  { hour: '16:00', arrivals: 18, served: 20, avgWait: 16 },
]

// Channel breakdown for inclusive access
export const CHANNEL_BREAKDOWN = [
  { name: 'USSD (*384#)', count: 42, percentage: 49 },
  { name: 'SMS',          count: 21, percentage: 24 },
  { name: 'Walk-in Desk', count: 14, percentage: 16 },
  { name: 'QR / Web',     count: 9,  percentage: 11 },
]

// Operational Insights (Rules-first heuristics, NOT exaggerated AI)
export const OPERATIONAL_INSIGHTS = [
  {
    id: 1,
    type: 'recommendation',
    category: 'Window Allocation',
    title: 'Surge Pattern: Laboratory Peak Approaching',
    message: 'Queue volume in Laboratory currently has 12 patients with an average consultation time of 3.8 minutes. Opening Window 3 by 09:45 will prevent wait times exceeding 40 minutes.',
    rule: 'Rule #14: Queue length > 10 triggers standby counter alert',
  },
  {
    id: 2,
    type: 'fairness',
    category: 'Fair-Late Queue Engine',
    title: 'Fair-Late Delay Adjusted',
    message: 'Patient LAB-026 requested 20 minutes delay via USSD. Position shifted +3 slots behind current serving window. Next patient automatically notified.',
    rule: 'Rule #03: Max 1 delay per ticket, repositioned by (DelayMin / AvgServiceTime)',
  },
]