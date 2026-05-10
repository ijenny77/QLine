# QLine — AI-Powered Queue Management System

> **"Transforming How Africa Waits"**

A complete, competition-ready interactive MVP demo for QLine — an AI-powered hybrid queue management system built for Africa.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root app with routing + page transitions
├── main.jsx                   # React entry point
├── index.css                  # Global styles, Tailwind layers, animations
│
├── store/
│   └── queueStore.js          # Zustand global state (queue, AI, offline mode)
│
├── data/
│   └── mockData.js            # All mock datasets (analytics, SMS, testimonials)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx         # Fixed top nav with offline toggle + dark mode
│   │   └── Footer.jsx         # Site footer
│   └── ui/
│       ├── Toast.jsx          # Animated toast notification system
│       └── Skeleton.jsx       # Loading skeleton components
│
└── pages/
    ├── Landing.jsx            # Full marketing homepage (10 sections)
    ├── UserQueue.jsx          # User queue experience (App / SMS / USSD / QR)
    ├── StaffDashboard.jsx     # Institutional staff management dashboard
    ├── Analytics.jsx          # Charts, heatmaps, institution leaderboard
    ├── AIEngine.jsx           # Live AI predictions, model cards, architecture
    └── Demo.jsx               # Investor pitch mode — animated story demo
```

---

## 🎯 Pages & Features

### 🏠 Landing Page (`/`)
- Animated hero with floating dashboard preview
- Problem → Solution → Features → Market Sectors → Impact
- Testimonials from 4 African institutions
- Pricing plans (Starter / Business / Enterprise)
- Scroll-triggered animations via Framer Motion

### 📱 User Queue (`/queue`)
- **Join Queue form** — get a real ticket with live tracking
- **SMS Simulator** — animated conversation showing the full SMS flow
- **USSD Simulator** — interactive phone keypad, menu navigation
- **QR Code mock** — realistic SVG QR code display
- Live queue list with position tracking

### 📊 Staff Dashboard (`/dashboard`)
- "Now Serving" banner with call-next action
- Walk-in registration panel
- Live queue with repositioning controls
- AI insight cards (4 rotating insights)
- Counter management (4 service counters)
- Mini area chart for today's flow
- Offline mode indicator + pending sync count

### 📈 Analytics (`/analytics`)
- Before vs After QLine area chart
- Channel distribution donut chart
- Weekly trends bar chart
- Monthly growth line chart
- Queue load heatmap (by hour × day)
- AI accuracy radar chart
- Institution performance leaderboard

### 🤖 AI Engine (`/ai`)
- 3 confidence meters (wait prediction, delay detection, surge forecast)
- 3 live real-time charts (wait time, efficiency, congestion)
- Live prediction feed with auto-rotating AI events
- 4 ML model cards with accuracy bars
- 3-layer AI architecture diagram

### 🎬 Demo / Pitch Mode (`/demo`)
- 6-scene automated story demo
- Animated visuals for each scene (problem, join, AI, reposition, offline, result)
- Progress bar + scene navigator
- Investor CTA section

---

## 🛠️ Tech Stack

| Technology       | Purpose                            |
|------------------|------------------------------------|
| React 18 + Vite  | UI framework + build tool          |
| Tailwind CSS 3   | Utility-first styling              |
| Framer Motion 11 | Page transitions + animations      |
| Recharts 2       | Charts and data visualization      |
| Lucide React     | Icon library                       |
| Zustand 4        | Global state management            |
| React Router 6   | Client-side routing                |

---

## 🎨 Design System

**Color Palette:**
- Primary Blue: `#2563eb` / `#1e3a8a`
- Purple: `#7c3aed` / `#8b5cf6`
- Cyan Accent: `#06b6d4`
- Dark Background: `#0f172a`
- Glass: `rgba(255,255,255,0.05)` + `backdrop-blur`

**Components:**
- `.glass` — glassmorphism cards
- `.gradient-text` — blue→purple→cyan gradient text
- `.btn-primary` / `.btn-secondary` / `.btn-ghost`
- `.badge-green/yellow/red/blue/purple/cyan`
- `.section-label` — pill-shaped section headers
- `.input-field` — dark-themed inputs

---

## 🔁 Key Interactions

### Simulate Offline Mode
Click the **Online** button in the navbar → dashboard enters offline mode with sync counter.

### Live Demo Mode
Navigate to `/demo` and click **Start Live Demo** → watch the 6-scene story unfold.

### Join a Queue
Go to `/queue` → fill the Join form → receive an animated ticket with live position tracking.

### Staff Actions
Go to `/dashboard` → **Call Next** advances the queue → **Add Walk-in** registers a customer.

---

## 🏗️ Suggested Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│  API Gateway (Kong / AWS API GW)                        │
├───────────┬─────────────┬───────────────┬───────────────┤
│ Queue     │ Auth        │ Notification  │ Analytics     │
│ Service   │ Service     │ Service       │ Service       │
│ (Node.js) │ (Node.js)   │ (Python)      │ (Python)      │
├───────────┴─────────────┴───────────────┴───────────────┤
│  Message Queue: Redis / RabbitMQ                        │
├─────────────────────────────────────────────────────────┤
│  Databases                                              │
│  PostgreSQL (queue state) + Redis (real-time cache)     │
│  TimescaleDB (analytics time-series)                    │
├─────────────────────────────────────────────────────────┤
│  SMS/USSD: Africa's Talking API                         │
│  Push: Firebase Cloud Messaging                         │
│  ML: Python FastAPI microservice                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 Suggested AI Architecture

```
Data Collection Layer:
  → Queue events, user behavior, GPS signals, SMS logs

Feature Engineering:
  → Time of day, day of week, institutional patterns,
    user history (lateness, channel preference)

Models:
  → WaitPredict:   LSTM (time series regression)
  → DelayDetect:   Random Forest (binary classification)
  → SurgeForcast:  XGBoost (regression)
  → StaffOptimizer: Proximal Policy Optimization (RL)

Deployment:
  → FastAPI inference endpoints
  → Model versioning: MLflow
  → Monitoring: Prometheus + Grafana
  → Retraining: weekly batch jobs on fresh data
```

---

## 📱 SMS / USSD Integration

```
Provider: Africa's Talking (afkanerd.com)

SMS Flow:
  User → "JOIN EQUITY" → Africa's Talking webhook → QLine API
  QLine → ticket created → SMS reply sent back

USSD Flow:
  User dials *384# → Telco → Africa's Talking → QLine API
  QLine responds with USSD menu strings
  User selects option → QLine creates ticket

Supported: MTN, Safaricom, Airtel, Orange, Vodacom, Glo
```

---

## 🗄️ Suggested Database Schema

```sql
-- Institutions
CREATE TABLE institutions (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  sector VARCHAR(50),   -- healthcare, banking, government
  country VARCHAR(50),
  city VARCHAR(100),
  created_at TIMESTAMP
);

-- Queues
CREATE TABLE queues (
  id UUID PRIMARY KEY,
  institution_id UUID REFERENCES institutions(id),
  name VARCHAR(100),
  service_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  queue_id UUID REFERENCES queues(id),
  ticket_code VARCHAR(20) UNIQUE,
  user_name VARCHAR(200),
  phone_number VARCHAR(20),
  channel VARCHAR(20),    -- app, sms, ussd, walkin, qr
  position INTEGER,
  status VARCHAR(20),     -- waiting, serving, served, delayed, cancelled
  joined_at TIMESTAMP,
  served_at TIMESTAMP,
  wait_minutes INTEGER,
  ai_predicted_wait INTEGER,
  ai_delay_probability DECIMAL(4,2)
);

-- AI Predictions
CREATE TABLE ai_predictions (
  id UUID PRIMARY KEY,
  queue_id UUID REFERENCES queues(id),
  prediction_type VARCHAR(50),
  predicted_value DECIMAL(10,2),
  confidence DECIMAL(4,2),
  actual_value DECIMAL(10,2),
  created_at TIMESTAMP
);
```

---

## 🌍 Countries Targeted (Phase 1)

Kenya · Nigeria · Ghana · Rwanda · Senegal · South Africa

---

## 📧 Contact

- Demo: sanoangella9@gmail.com
- Investment: invest@qline.africa
- Website: qline.africa

---

*Built with patriotis for Africa — QLine Technologies Ltd, 2025*
