import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Logo from '../../assets/logo.png'
import { useSEO } from '../../hooks/useSEO'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { DotGrid, Sunburst, TicketOutline, Sparkle, SparkleSmall, Waveform, FloatingParticles, StarField, SpinRings, GlowRings, ScanLine, NoiseLayer } from '../../components/Decor'

// Animated counter
const CountUp = ({ target, suffix = '', prefix = '' }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1400
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setValue(Math.floor(ease * target))
          if (progress < 1) requestAnimationFrame(tick)
          else setValue(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="stat-number">
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  )
}

const ECOSYSTEM = [
  {
    id: 'ticketing',
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    label: 'Event Ticketing',
    color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.1)',
    badge: 'You are here',
    desc: 'Discover concerts, shows, and festivals across Nigeria. Book tickets in seconds, get QR codes instantly, and scan to enter.',
    cta: { label: 'Browse Events', to: '/discover', internal: true },
  },
  {
    id: 'bills',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    label: 'Bill Payments',
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,0.1)',
    desc: 'Top up airtime and data for MTN, Airtel, Glo, 9mobile. Pay electricity bills, cable TV (DSTV, GOtv), and exam fees (JAMB, WAEC, NECO).',
    cta: { label: 'Pay Bills on i-Sabi', href: 'https://i-sabi.com.ng' },
  },
  {
    id: 'voting',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    label: 'Digital Voting',
    color: '#c084fc',
    colorBg: 'rgba(192,132,252,0.1)',
    desc: "Vote for your favourite contestants in talent shows, beauty pageants, and reality competitions. Your vote counts — and it's secure.",
    cta: { label: 'Vote Now', href: 'https://i-sabi.com.ng' },
  },
  {
    id: 'trivia',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    label: 'Trivia & Gaming',
    color: '#fb923c',
    colorBg: 'rgba(251,146,60,0.1)',
    desc: 'Challenge friends to 1v1 trivia battles and win real cash prizes. Test your knowledge across sports, entertainment, pop culture, and more.',
    cta: { label: 'Play & Win', href: 'https://i-sabi.com.ng' },
  },
  {
    id: 'social',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    label: 'Social & Community',
    color: '#34d399',
    colorBg: 'rgba(52,211,153,0.1)',
    desc: 'Connect with people, join group chats, make video and audio calls, and share your life with a growing Nigerian community — all inside i-Sabi.',
    cta: { label: 'Join the Community', href: 'https://i-sabi.com.ng' },
  },
  {
    id: 'rewards',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Rewards & Cashback',
    color: '#fbbf24',
    colorBg: 'rgba(251,191,36,0.1)',
    desc: 'Earn 0.5% cashback on every transaction. Refer friends and earn 0.25% from their activity. Climb the leaderboard and win monthly cash prizes.',
    cta: { label: 'Start Earning', href: 'https://i-sabi.com.ng' },
  },
]

const STATS = [
  { value: 50, suffix: 'K+', label: 'App Users' },
  { value: 500, suffix: '+', label: 'Events Hosted' },
  { value: 1, suffix: 'M+', prefix: '₦', label: 'Tickets Sold' },
  { value: 36, suffix: ' States', label: 'Nigeria-Wide' },
]

const CASHBACK_TIERS = [
  { label: 'Your Transactions', rate: '0.5%', icon: '💳', color: 'text-[#22c55e]' },
  { label: 'Level 1 Referrals', rate: '0.25%', icon: '👥', color: 'text-[#60a5fa]' },
  { label: 'Level 2 Referrals', rate: '0.125%', icon: '🌐', color: 'text-[#c084fc]' },
]

const About = () => {
  useSEO({
    title: "About i-Sabi — Nigeria's All-in-One Super App",
    description: "i-Sabi is Nigeria's all-in-one super app — pay bills, buy event tickets, vote in competitions, play trivia, chat with friends, and earn cashback on every transaction.",
  })

  const revealRef = useScrollReveal()

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden" ref={revealRef}>
      <Header />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
        {/* Ambient orbs */}
        <div className="orb orb-green w-[600px] h-[600px] -top-32 left-1/2 -translate-x-1/2 opacity-60" />
        <div className="orb orb-green-dim w-[400px] h-[400px] top-40 -left-20" />
        <div className="orb orb-green-dim w-[300px] h-[300px] top-20 -right-10" />
        {/* Texture */}
        <NoiseLayer />
        <DotGrid opacity={0.03} size={28} />
        <StarField count={40} />

        {/* Atmospheric */}
        <GlowRings />
        <ScanLine />
        <Sunburst className="absolute inset-0 w-full h-full text-[#22c55e] opacity-[0.05] pointer-events-none" />
        <SpinRings className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#22c55e] opacity-40" />

        {/* Floating shapes */}
        <TicketOutline className="absolute -right-20 top-20 w-72 text-white opacity-[0.04] rotate-12 pointer-events-none animate-[driftY_11s_ease-in-out_infinite]" />
        <TicketOutline className="absolute -left-24 bottom-10 w-60 text-white opacity-[0.03] -rotate-6 pointer-events-none animate-[driftY_15s_ease-in-out_2s_infinite]" />

        {/* Particles */}
        <FloatingParticles count={18} />

        {/* Accents */}
        <Waveform className="absolute bottom-0 inset-x-0 w-full text-[#22c55e] opacity-[0.06] pointer-events-none" />
        <Sparkle className="absolute top-40 right-[15%] w-5 h-5 text-[#22c55e] opacity-25 animate-[sparkle_2s_ease-in-out_infinite] pointer-events-none" />
        <SparkleSmall className="absolute top-24 left-[20%] w-3 h-3 text-[#4ade80] opacity-20 animate-[sparkle_3s_ease-in-out_0.8s_infinite] pointer-events-none" />
        <Sparkle className="absolute bottom-20 left-[35%] w-4 h-4 text-[#22c55e] opacity-18 animate-[sparkle_2.7s_ease-in-out_1.5s_infinite] pointer-events-none" />
        <SparkleSmall className="absolute top-1/2 right-[22%] w-2.5 h-2.5 text-[#86efac] opacity-18 animate-[sparkle_3.2s_ease-in-out_0.3s_infinite] pointer-events-none" />

        <div className="relative z-10 reveal stagger-1">
          <img
            src={Logo}
            alt="i-Sabi"
            className="h-16 sm:h-20 w-auto object-contain mb-6 mx-auto drop-shadow-[0_0_32px_rgba(34,197,94,0.4)] animate-float"
          />
        </div>

        <div className="relative z-10 reveal stagger-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-xs font-bold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[pulseDot_2s_ease-in-out_infinite]" />
            Nigeria's All-in-One Super App
          </div>
        </div>

        <div className="relative z-10 reveal stagger-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.88] tracking-tight max-w-3xl mb-4">
            Pay Bills. Buy Tickets.<br />
            <span className="text-gradient-green">Vote. Earn Cashback.</span>
          </h1>
        </div>

        <div className="relative z-10 reveal stagger-4">
          <p className="text-white/45 text-base sm:text-xl max-w-xl leading-relaxed mb-10 mt-2">
            i-Sabi consolidates everything Nigerians do online — from paying bills to attending events — into one seamless, rewarding experience.
          </p>
        </div>

        <div className="relative z-10 reveal stagger-5">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://i-sabi.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer flex items-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm text-white shadow-xl shadow-green-500/30 transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Get the i-Sabi App
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <Link
              to="/discover"
              className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-sm text-white/70 hover:text-white bg-white/[0.06] border border-white/[0.09] hover:bg-white/[0.1] transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ value, suffix, prefix, label }, i) => (
            <div
              key={label}
              className={`reveal stagger-${i + 1} feature-card flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl bg-[#111111] border border-white/[0.06] text-center`}
            >
              <p className="text-2xl sm:text-3xl font-black text-[#22c55e]">
                <CountUp target={value} suffix={suffix} prefix={prefix || ''} />
              </p>
              <p className="text-white/35 text-xs font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="py-16 sm:py-24" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 55%), #0d0d0d' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-3">One App, Everything</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">The i-Sabi Ecosystem</h2>
            <p className="text-white/35 text-sm max-w-md mx-auto">Six powerful services, one seamless platform. Everything you need as a modern Nigerian.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ECOSYSTEM.map(({ id, icon, label, color, colorBg, badge, desc, cta }, i) => (
              <div
                key={id}
                className={`reveal stagger-${(i % 3) + 1} ticket-shine feature-card relative flex flex-col gap-4 p-5 rounded-2xl bg-[#111111] border border-white/[0.06]`}
              >
                {badge && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-black text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20">
                    {badge}
                  </div>
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colorBg }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-black text-sm mb-1.5">{label}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
                </div>
                {cta.internal ? (
                  <Link
                    to={cta.to}
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color }}
                  >
                    {cta.label}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color }}
                  >
                    {cta.label}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cashback Programme ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="reveal">
          <div className="relative rounded-3xl overflow-hidden border border-yellow-500/20 p-8 sm:p-12"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.06) 0%, transparent 55%), #111111' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold mb-5">
                  <span className="text-sm">💰</span>
                  Rewards Programme
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Earn Cashback on<br />
                  <span className="text-gradient-gold">Every Transaction</span>
                </h2>
                <p className="text-white/45 text-sm leading-relaxed mb-6">
                  Every naira you spend on i-Sabi works for you. Get instant cashback on your own transactions, and keep earning as your referrals transact.
                </p>
                <a
                  href="https://i-sabi.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-black
                    bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400
                    shadow-lg shadow-yellow-500/20 transition-all duration-200 active:scale-[0.98]"
                >
                  Start Earning Today
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <div className="space-y-3">
                {CASHBACK_TIERS.map(({ label, rate, icon, color }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-white/60 text-sm font-medium">{label}</span>
                    </div>
                    <span className={`font-black text-xl ${color}`}>{rate}</span>
                  </div>
                ))}
                <p className="text-white/20 text-xs text-center pt-1">+ Monthly leaderboard competitions with cash prizes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Download App ── */}
      <section
        className="py-16 sm:py-20"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 60%), #0d0d0d' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-bold mb-5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Available Everywhere
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Download i-Sabi Today
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
              Available on Android and iOS. Or use the web version — no download needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.isabi"
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge w-full sm:w-auto"
              >
                <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l11.65-11.65L12.17 9.6l-9 9-.01.01c-.01 1.72-.01 3.44 0 5.15zm11.64-12.06L3.17.3A1.28 1.28 0 002 .5C1.4.85 1 1.56 1 2.42v19.16c0 .86.4 1.57 1 1.91l11.82-11.79zM20.36 10.5l-2.38-1.37L15.4 12l2.58 2.87 2.38-1.37c.68-.39 1.12-1.03 1.12-1.77 0-.65-.33-1.24-.94-1.63h-.18zM4.17.23l11.65 11.65-2.65 2.65L1.52.88c.3-.36.73-.6 1.2-.65.5-.04.99.14 1.45.4z" />
                </svg>
                <div className="text-left">
                  <p className="text-white/40 text-[9px] font-medium leading-none mb-0.5">GET IT ON</p>
                  <p className="text-white font-black text-sm leading-none">Google Play</p>
                </div>
              </a>

              <a
                href="https://apps.apple.com/app/isabi"
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge w-full sm:w-auto"
              >
                <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                <div className="text-left">
                  <p className="text-white/40 text-[9px] font-medium leading-none mb-0.5">DOWNLOAD ON THE</p>
                  <p className="text-white font-black text-sm leading-none">App Store</p>
                </div>
              </a>

              <a
                href="https://i-sabi.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge w-full sm:w-auto"
              >
                <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="text-left">
                  <p className="text-white/40 text-[9px] font-medium leading-none mb-0.5">USE ON WEB</p>
                  <p className="text-white font-black text-sm leading-none">i-sabi.com.ng</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Organizer CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="reveal">
          <div className="relative rounded-3xl overflow-hidden border border-[#22c55e]/20 p-8 sm:p-14 text-center gradient-border"
            style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.12) 0%, transparent 65%), #111111' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e]/60 to-transparent" />
            <div className="orb orb-green w-72 h-72 -top-10 -right-10 opacity-30" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-bold mb-5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                For Event Organizers
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
                Sell Out Your Event<br />
                <span className="text-gradient-green">With i-Sabi</span>
              </h2>

              <p className="text-white/45 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                List your event and reach thousands of fans instantly. Get real-time sales tracking, multiple ticket tiers, attendee management, and instant payouts — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://i-sabi.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm text-white
                    bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                    shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02]
                    transition-all duration-200 active:scale-[0.98]"
                >
                  List Your Event on i-Sabi
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@i-sabi.com.ng"
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm text-white/60 hover:text-white bg-white/[0.05] border border-white/[0.09] hover:bg-white/[0.09] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="border-t border-white/[0.04] py-7">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="i-Sabi" className="h-7 w-auto opacity-70" />
            <a href="https://i-sabi.com.ng" target="_blank" rel="noopener noreferrer" className="text-[#22c55e]/70 hover:text-[#22c55e] text-xs font-bold transition-colors">
              i-sabi.com.ng ↗
            </a>
          </div>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} i-Sabi · All rights reserved</p>
          <Link to="/discover" className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors">
            Browse Events →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
