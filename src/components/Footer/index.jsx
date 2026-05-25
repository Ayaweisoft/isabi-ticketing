import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'

const SOCIAL = [
  { href: 'https://instagram.com/isabi_ng', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: 'https://twitter.com/isabi_ng', label: 'X / Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { href: 'https://facebook.com/isabi', label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { href: 'https://tiktok.com/@isabi_ng', label: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
]

const QUICK_LINKS = [
  { to: '/discover', label: 'Discover Events', internal: true },
  { href: 'https://i-sabi.com.ng', label: 'Buy Airtime & Data', internal: false },
  { href: 'https://i-sabi.com.ng', label: 'Pay Electricity Bill', internal: false },
  { href: 'https://i-sabi.com.ng', label: 'Vote for Competitions', internal: false },
  { href: 'https://i-sabi.com.ng', label: 'Play Trivia & Win', internal: false },
  { to: '/about', label: 'About i-Sabi', internal: true },
]

const Footer = ({ data }) => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.05]">
      {/* Event info section (only on event pages when data is available) */}
      {data && data.aboutEvent && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-px bg-[#22c55e]" />
            <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-widest">About This Event</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {data.aboutEvent && (
              <p className="text-white/45 leading-relaxed text-sm">{data.aboutEvent}</p>
            )}
            {data.image_url && (
              <div className="relative overflow-hidden rounded-2xl aspect-video group">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={data.image_url} alt="Event" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main footer */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="i-Sabi" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-white/35 text-xs leading-relaxed max-w-xs">
              Nigeria's all-in-one super app. Pay bills, buy event tickets, vote in competitions, play trivia, chat with friends, and earn cashback — all in one place.
            </p>
            {/* App downloads */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a href="https://play.google.com/store/apps/details?id=com.isabi" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-all text-white/60 hover:text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l11.65-11.65L12.17 9.6l-9 9-.01.01c-.01 1.72-.01 3.44 0 5.15zm11.64-12.06L3.17.3A1.28 1.28 0 002 .5C1.4.85 1 1.56 1 2.42v19.16c0 .86.4 1.57 1 1.91l11.82-11.79zM20.36 10.5l-2.38-1.37L15.4 12l2.58 2.87 2.38-1.37c.68-.39 1.12-1.03 1.12-1.77 0-.65-.33-1.24-.94-1.63h-.18zM4.17.23l11.65 11.65-2.65 2.65L1.52.88c.3-.36.73-.6 1.2-.65.5-.04.99.14 1.45.4z" />
                </svg>
                <span className="text-[10px] font-bold">Google Play</span>
              </a>
              <a href="https://apps.apple.com/app/isabi" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-all text-white/60 hover:text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                <span className="text-[10px] font-bold">App Store</span>
              </a>
              <a href="https://i-sabi.com.ng" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 hover:bg-[#22c55e]/15 transition-all text-[#22c55e]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-[10px] font-bold">Use Web</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">Explore</p>
            {QUICK_LINKS.map(({ to, href, label, internal }) =>
              internal ? (
                <Link key={label} to={to} className="block text-white/40 hover:text-[#22c55e] text-xs font-medium transition-colors">
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-[#22c55e] text-xs font-medium transition-colors">
                  {label} ↗
                </a>
              )
            )}
          </div>

          {/* Contact + Social */}
          <div className="space-y-5">
            <div>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">Connect</p>
              <div className="flex gap-2.5">
                {SOCIAL.map(({ href, label, icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/30 hover:text-[#22c55e] hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-3">Contact</p>
              <a href="mailto:hello@i-sabi.com.ng" className="text-white/40 hover:text-[#22c55e] text-xs font-medium transition-colors block">
                hello@i-sabi.com.ng
              </a>
              <a href="https://i-sabi.com.ng" target="_blank" rel="noopener noreferrer" className="text-[#22c55e]/60 hover:text-[#22c55e] text-xs font-bold transition-colors mt-1 block">
                i-sabi.com.ng ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-5">
          <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs">© {new Date().getFullYear()} i-Sabi. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-white/15 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured by Interswitch
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
