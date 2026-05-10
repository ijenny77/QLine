import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { BarChart3, TrendingUp, Users, Clock, Download, Filter, Calendar, Globe } from 'lucide-react'
import {
  waitTimeData, weeklyTrends, channelData, monthlyData, aiAccuracy, institutions
} from '../data/mockData'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function ChartCard({ title, badge, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        {badge && <span className="badge badge-blue text-[10px]">{badge}</span>}
      </div>
      {children}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass p-3 rounded-xl border border-white/10 text-xs">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}{typeof p.value === 'number' && p.name?.includes('min') ? ' min' : ''}
        </p>
      ))}
    </div>
  )
}

// ── Heatmap component ─────────────────────────────────────────────────────────
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = ['7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM']
const heatData = hours.map(h => ({
  hour: h,
  values: days.map((_, di) => Math.floor(Math.random() * 90 + 10)),
}))

function Heatmap() {
  const getColor = (val) => {
    if (val > 80) return '#ef4444'
    if (val > 60) return '#f59e0b'
    if (val > 40) return '#3b82f6'
    if (val > 20) return '#1d4ed8'
    return '#1e3a8a'
  }
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div />
          {days.map(d => <div key={d} className="text-center text-xs text-slate-500 font-medium">{d}</div>)}
        </div>
        {heatData.map((row) => (
          <div key={row.hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-slate-500 text-right pr-2 flex items-center justify-end">{row.hour}</div>
            {row.values.map((val, j) => (
              <div
                key={j}
                title={`${days[j]} ${row.hour}: ${val}% load`}
                className="h-7 rounded-md transition-all hover:scale-110 cursor-default"
                style={{ backgroundColor: getColor(val), opacity: 0.7 + val / 300 }}
              />
            ))}
          </div>
        ))}
        <div className="flex items-center gap-3 mt-4 justify-end">
          <span className="text-xs text-slate-500">Low</span>
          {['#1e3a8a','#1d4ed8','#3b82f6','#f59e0b','#ef4444'].map(c => (
            <div key={c} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-slate-500">High</span>
        </div>
      </div>
    </div>
  )
}

// ── Institutions table ────────────────────────────────────────────────────────
function InstitutionsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-slate-500 text-xs font-medium pb-3 pr-4">Institution</th>
            <th className="text-left text-slate-500 text-xs font-medium pb-3 pr-4">Sector</th>
            <th className="text-left text-slate-500 text-xs font-medium pb-3 pr-4">Country</th>
            <th className="text-right text-slate-500 text-xs font-medium pb-3 pr-4">Users/day</th>
            <th className="text-right text-slate-500 text-xs font-medium pb-3 pr-4">Avg Wait</th>
            <th className="text-right text-slate-500 text-xs font-medium pb-3">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((inst, i) => (
            <tr key={inst.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
              <td className="py-3 pr-4 font-medium text-white text-xs">{inst.name}</td>
              <td className="py-3 pr-4">
                <span className={`badge text-[10px] ${
                  inst.sector === 'Healthcare' ? 'badge-red' :
                  inst.sector === 'Banking'    ? 'badge-blue' : 'badge-purple'
                }`}>{inst.sector}</span>
              </td>
              <td className="py-3 pr-4 text-slate-400 text-xs flex items-center gap-1.5">
                <Globe size={10} /> {inst.country}
              </td>
              <td className="py-3 pr-4 text-right text-slate-300 text-xs font-mono">{inst.users}</td>
              <td className="py-3 pr-4 text-right text-xs">
                <span className={inst.avgWait < 15 ? 'text-emerald-400' : inst.avgWait < 25 ? 'text-yellow-400' : 'text-red-400'}>
                  {inst.avgWait} min
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      style={{ width: `${inst.efficiency}%` }}
                    />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold w-8 text-right">{inst.efficiency}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── AI Accuracy radar ─────────────────────────────────────────────────────────
const radarData = [
  { subject: 'Wait Pred.', A: 94 },
  { subject: 'Arrival',    A: 89 },
  { subject: 'Delay Det.', A: 91 },
  { subject: 'Peak Fcst',  A: 86 },
  { subject: 'Staff Opt.', A: 88 },
  { subject: 'Rerouting',  A: 92 },
]

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [period, setPeriod] = useState('week')

  return (
    <div className="min-h-screen pt-24 px-4 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="section-label mb-2">Analytics</div>
            <h1 className="font-display font-black text-3xl text-white">Performance Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time metrics and AI-driven insights across all institutions</p>
          </div>
          <div className="flex items-center gap-3">
            {['day','week','month','year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                  ${period === p ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
            <button className="btn-secondary px-4 py-2 text-xs">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users',     value: '5,247',  delta: '+18%', color: '#3b82f6' },
            { label: 'Avg Wait Time',   value: '14 min', delta: '-32%', color: '#10b981' },
            { label: 'Efficiency Score',value: '87%',    delta: '+5%',  color: '#8b5cf6' },
            { label: 'AI Predictions',  value: '12,841', delta: '+41%', color: '#06b6d4' },
          ].map(kpi => (
            <div key={kpi.label} className="glass p-5 rounded-2xl">
              <div className="text-slate-500 text-xs mb-2">{kpi.label}</div>
              <div className="font-display font-black text-3xl text-white mb-1">{kpi.value}</div>
              <div className={`text-xs font-semibold ${kpi.delta.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.delta} vs last period
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">

          {/* Wait time comparison */}
          <ChartCard title="Wait Time: Before vs After QLine" badge="AI Powered" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={waitTimeData}>
                <defs>
                  <linearGradient id="before" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="afterG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit=" min" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Area type="monotone" dataKey="before" stroke="#ef4444" fill="url(#before)" strokeWidth={2} name="Before QLine (min)" />
                <Area type="monotone" dataKey="after"  stroke="#3b82f6" fill="url(#afterG)" strokeWidth={2} name="With QLine (min)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Channel distribution */}
          <ChartCard title="Queue Channels" badge="This Week">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {channelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {channelData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-400">{d.name}</span>
                  </div>
                  <span className="text-white font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Weekly trends */}
          <ChartCard title="Weekly Queue Trends">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="users"       fill="#3b82f6" radius={[4,4,0,0]} name="Users" />
                <Bar dataKey="satisfaction" fill="#10b981" radius={[4,4,0,0]} name="Satisfaction %" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Monthly growth */}
          <ChartCard title="Monthly Growth" badge="8-Month Trend">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="users"        stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
                <Line type="monotone" dataKey="efficiency"   stroke="#10b981" strokeWidth={2} dot={false} name="Efficiency %" />
                <Line type="monotone" dataKey="waitReduction" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Wait Reduction %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Heatmap + radar */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Queue Load Heatmap — Weekly" badge="By Hour & Day" className="lg:col-span-2">
            <Heatmap />
          </ChartCard>

          <ChartCard title="AI Model Accuracy" badge="Multi-Metric">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar name="Accuracy" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {aiAccuracy.map(a => (
                <div key={a.metric} className="flex items-center gap-3 text-xs">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400">{a.metric}</span>
                      <span className="text-purple-400 font-semibold">{a.accuracy}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${a.accuracy}%` }} />
                    </div>
                  </div>
                  <span className="text-emerald-400 shrink-0">{a.trend}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Institutions table */}
        <ChartCard title="Institution Performance Leaderboard" badge="Pan-African">
          <InstitutionsTable />
        </ChartCard>
      </div>
    </div>
  )
}
