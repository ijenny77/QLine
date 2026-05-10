import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/qline-logo.png" alt="QLine Logo" className="w-9 h-9 object-contain" />
              <span className="font-display font-black text-xl gradient-text">QLine</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI-powered queue management built for Africa. Transforming how people wait — one queue at a time.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <MapPin size={13} />KN 4 Ave, Nyarugenge, Kigali
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Mail size={13} /> partners@qline.rw
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Features', 'AI Engine', 'Pricing', 'Changelog', 'Roadmap', 'Status'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Solutions</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Healthcare', 'Banking', 'Government', 'Education', 'Retail', 'Enterprise'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['About Us', 'Careers', 'Blog', 'Press Kit', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2025 QLine Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Twitter,  href: '#' },
              { Icon: Linkedin, href: '#' },
              { Icon: Github,   href: '#' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
