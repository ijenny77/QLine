import { Link } from 'react-router-dom'
import { Building2, Shield, Wifi, Smartphone, Radio } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#DDE3E2] mt-20 text-[#66757A] text-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Product Purpose */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2.5">
              <img src="/qline-logo.png" alt="QLine" className="w-6 h-6 object-contain" />
              <span className="font-semibold text-sm text-[#132A32]">QLine Public Service Platform</span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-[#66757A] mb-3">
              "Your place in line, without standing in line." An inclusive queue management system designed for African hospitals, government centers, and banks, operating seamlessly with USSD, SMS, web, and offline-first local edge sync.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#66757A]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#167A5B]"></span>
              <span>Pilot Demo: Kigali Hospital Outpatient & Diagnostic Services</span>
            </div>
          </div>

          {/* Column 2: Supported Channels */}
          <div>
            <h4 className="font-semibold text-[#172126] text-xs uppercase tracking-wider mb-2.5">Inclusion Channels</h4>
            <ul className="space-y-1.5 text-xs text-[#66757A]">
              <li className="flex items-center gap-1.5">
                <Radio size={12} className="text-[#0A6A6C]" /> USSD Gateway (*384#)
              </li>
              <li className="flex items-center gap-1.5">
                <Smartphone size={12} className="text-[#0A6A6C]" /> Two-Way SMS Notifications
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 size={12} className="text-[#0A6A6C]" /> Walk-in Reception Desk
              </li>
              <li className="flex items-center gap-1.5">
                <Wifi size={12} className="text-[#0A6A6C]" /> Local Offline Cache Engine
              </li>
            </ul>
          </div>

          {/* Column 3: Fast Navigation */}
          <div>
            <h4 className="font-semibold text-[#172126] text-xs uppercase tracking-wider mb-2.5">Demo Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/queue" className="hover:text-[#0A6A6C] transition-colors">Citizen Mode (Join via USSD)</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#0A6A6C] transition-colors">Staff Operations (Live Queue)</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#0A6A6C] transition-colors">Hospital Windows & Counters</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-[#0A6A6C] transition-colors">Operational Insights & Stats</Link>
              </li>
              <li>
                <Link to="/connectivity" className="hover:text-[#0A6A6C] transition-colors">System Connectivity & Offline Sync</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EDF1F0] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#66757A]">
          <div>
            © 2026 QLine Rwanda Prototype · Student Entrepreneurship Demo · Kigali, Rwanda
          </div>
          <div className="flex items-center gap-4">
            <span>Rules-first Queue Fairness</span>
            <span>·</span>
            <span>Local SQLite Edge Sync</span>
            <span>·</span>
            <span>Zero Smartphone Dependency</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
