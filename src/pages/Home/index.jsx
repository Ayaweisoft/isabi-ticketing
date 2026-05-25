import React, { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import getData from '../../utils/getData'
import { fetchEvents } from '../../adapters/CommonAdapter'
import Logo from '../../assets/logo.png'
import { useSEO } from '../../hooks/useSEO'
import { DotGrid, StageLights, SoundWave, Sparkle, SparkleSmall, StarField, SpinRings, ScanLine, NoiseLayer } from '../../components/Decor'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PER_PAGE = 12
const NOW = () => Date.now()
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const ImgFallback = ({ label }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0d2215] via-[#0f1a0f] to-[#111111] gap-2 p-4">
    <img src={Logo} alt="i-Sabi" className="w-9 h-9 object-contain opacity-20" />
    {label && <span className="text-white/15 text-xs text-center line-clamp-2">{label}</span>}
  </div>
)

const EventImg = ({ src, alt }) => {
  const [err, setErr] = useState(!src)
  return err
    ? <ImgFallback label={alt} />
    : <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setErr(true)} />
}

const EventCard = ({ event }) => {
  const date = formatDate(event.startDate)
  return (
    <Link
      to={`/${event._id}`}
      className="group flex flex-col rounded-2xl overflow-hidden ring-1 ring-white/[0.07] hover:ring-[#22c55e]/40 hover:shadow-xl hover:shadow-black/40 bg-gradient-to-b from-[#161616] to-[#111111] transition-all duration-300 hover:scale-[1.015] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
      aria-label={`View tickets for ${event.eventName}`}
    >
      <div className="relative w-full h-44 overflow-hidden flex-shrink-0">
        <EventImg src={event.image_url} alt={event.eventName} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-white font-black text-sm leading-snug line-clamp-2">{event.eventName}</h3>
        {event.companyName && (
          <p className="text-white/35 text-xs font-medium truncate">by {event.companyName}</p>
        )}

        <div className="flex flex-col gap-1 mt-0.5">
          {date && (
            <span className="flex items-center gap-1.5 text-[11px] text-white/40">
              <svg className="w-3 h-3 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-1.5 text-[11px] text-white/40">
              <svg className="w-3 h-3 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.venue}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.05]">
          {event.total_amount != null ? (
            <span className="text-[#22c55e] font-black text-sm">
              {event.total_amount === 0 ? 'Free' : `From ₦${Number(event.total_amount).toLocaleString()}`}
            </span>
          ) : <span />}
          <span className="flex items-center gap-1 text-[11px] font-bold text-white/40 group-hover:text-[#22c55e] transition-colors">
            Tickets
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl overflow-hidden ring-1 ring-white/[0.07] bg-gradient-to-b from-[#161616] to-[#111111]">
    <div className="w-full h-44 bg-white/[0.04] animate-pulse" />
    <div className="p-4 space-y-2.5">
      <div className="h-3.5 bg-white/[0.06] rounded-full animate-pulse w-4/5" />
      <div className="h-2.5 bg-white/[0.04] rounded-full animate-pulse w-2/5" />
      <div className="h-2 bg-white/[0.03] rounded-full animate-pulse w-3/5 mt-2" />
      <div className="h-2 bg-white/[0.03] rounded-full animate-pulse w-1/2" />
      <div className="flex justify-between pt-2 mt-1 border-t border-white/[0.04]">
        <div className="h-3.5 bg-white/[0.05] rounded-full animate-pulse w-16" />
        <div className="h-3.5 bg-white/[0.04] rounded-full animate-pulse w-12" />
      </div>
    </div>
  </div>
)

const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null
  const pages = []
  const delta = 1
  const left = page - delta
  const right = page + delta
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i)
  }
  const rendered = []
  let prev = null
  for (const p of pages) {
    if (prev && p - prev > 1) rendered.push('...')
    rendered.push(p)
    prev = p
  }
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Previous page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      {rendered.map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} className="text-white/25 px-1 text-sm">…</span>
          : (
            <button key={p} onClick={() => onPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/25' : 'bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08]'}`}
              aria-current={p === page ? 'page' : undefined}>
              {p}
            </button>
          )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Next page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}

// Near Me geolocation states: idle | loading | loaded | denied | error
const useNearMe = () => {
  const [state, setState] = useState('idle')
  const [city, setCity] = useState(null)

  const request = useCallback(() => {
    if (!navigator.geolocation) { setState('error'); return }
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { 'User-Agent': 'i-Sabi/1.0' } }
          )
          const json = await res.json()
          const detected = json.address?.city || json.address?.town || json.address?.county || json.address?.state || null
          setCity(detected)
          setState('loaded')
        } catch {
          setState('error')
        }
      },
      () => setState('denied')
    )
  }, [])

  return { state, city, request }
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'past', label: 'Past' },
  { id: 'near', label: 'Near Me' },
]

const Discover = () => {
  useSEO({ title: 'Discover Events', description: 'Browse upcoming concerts, festivals, and events across Nigeria. Secure your spot with i-Sabi.' })

  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  const nearMe = useNearMe()

  const { isLoading, error, data } = useQuery({
    queryKey: ['allEvents'],
    queryFn: () => getData(fetchEvents),
  })

  const allTicketing = useMemo(() => {
    const all = data?.event || data?.events || (Array.isArray(data) ? data : [])
    return all
      .filter(e => (e.type || e.eventType || '').toUpperCase() === 'TICKETING')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }, [data])

  const events = useMemo(() => {
    const now = NOW()
    return allTicketing.filter(e => {
      const start = e.startDate ? new Date(e.startDate).getTime() : null
      const end = e.endDate ? new Date(e.endDate).getTime() : null

      if (category === 'ongoing') {
        if (!start) return false
        if (end) return start <= now && end >= now
        return start <= now && now - start <= THREE_DAYS_MS
      }
      if (category === 'past') {
        if (!start) return false
        if (end) return end < now
        return now - start > THREE_DAYS_MS
      }
      if (category === 'near') {
        if (!nearMe.city) return false
        const cityLower = nearMe.city.toLowerCase()
        const venue = (e.venue || '').toLowerCase()
        const evCity = (e.city || '').toLowerCase()
        return venue.includes(cityLower) || evCity.includes(cityLower) || cityLower.includes(evCity.split(' ')[0])
      }
      return true
    })
  }, [allTicketing, category, nearMe.city])

  const totalPages = Math.ceil(events.length / PER_PAGE)
  const paged = events.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handlePage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (id) => {
    if (id === 'near') {
      if (nearMe.state === 'idle' || nearMe.state === 'error') nearMe.request()
    }
    setCategory(id)
    setPage(1)
  }

  const nearMeLabel = nearMe.state === 'loading'
    ? 'Locating…'
    : nearMe.state === 'loaded' && nearMe.city
      ? nearMe.city
      : 'Near Me'

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero */}
      <div
        className="relative flex flex-col items-center text-center px-5 pt-28 sm:pt-32 pb-10 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 60%), #0a0a0a' }}
      >
        {/* ── Layer 1: texture & depth ── */}
        <NoiseLayer />
        <DotGrid opacity={0.035} size={26} />
        <StarField count={50} />

        {/* ── Layer 2: atmospheric light ── */}
        <StageLights className="absolute inset-x-0 top-0 w-full h-[240px] opacity-80" />
        <ScanLine />
        <SpinRings className="w-[400px] h-[400px] -top-20 -right-32 text-[#22c55e] opacity-60" />

        {/* ── Layer 3: accent sparkles ── */}
        <SoundWave className="absolute bottom-0 inset-x-0 w-full h-10 text-[#22c55e] opacity-[0.07]" />
        <Sparkle className="absolute top-24 right-1/4 w-4 h-4 text-[#22c55e] opacity-30 animate-[sparkle_2s_ease-in-out_infinite]" />
        <SparkleSmall className="absolute top-36 left-[30%] w-3 h-3 text-[#4ade80] opacity-25 animate-[sparkle_2.8s_ease-in-out_0.6s_infinite]" />
        <SparkleSmall className="absolute top-16 left-1/4 w-2.5 h-2.5 text-[#22c55e] opacity-20 animate-[sparkle_3.2s_ease-in-out_1.2s_infinite]" />
        <Sparkle className="absolute bottom-12 right-[18%] w-3.5 h-3.5 text-[#86efac] opacity-20 animate-[sparkle_3.5s_ease-in-out_0.3s_infinite]" />
        <SparkleSmall className="absolute top-28 right-[38%] w-2 h-2 text-[#22c55e] opacity-18 animate-[sparkle_2.2s_ease-in-out_1.8s_infinite]" />

        <Link to="/discover" className="relative z-10 mb-5">
          <img src={Logo} alt="i-Sabi" className="h-14 sm:h-16 w-auto object-contain mx-auto drop-shadow-[0_0_16px_rgba(34,197,94,0.3)]" />
        </Link>
        <h1 className="relative z-10 text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight max-w-xl mb-3">
          Discover <span className="text-gradient-green">Events</span>
        </h1>
        <p className="relative z-10 text-white/40 text-sm sm:text-base max-w-sm">
          Find live concerts, shows and festivals across Nigeria. Book your ticket in seconds.
        </p>
      </div>

      {/* Category tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ id }) => {
            const label = id === 'near' ? nearMeLabel : CATEGORIES.find(c => c.id === id)?.label
            const isActive = category === id
            return (
              <button
                key={id}
                onClick={() => handleCategoryChange(id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200
                  ${isActive
                    ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/25'
                    : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.09]'
                  }`}
              >
                {id === 'near' && nearMe.state === 'loading' && (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {id === 'near' && nearMe.state !== 'loading' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {label}
                {isActive && events.length > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/[0.06]'}`}>
                    {events.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Near Me denied/error notice */}
        {category === 'near' && (nearMe.state === 'denied' || nearMe.state === 'error') && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {nearMe.state === 'denied'
              ? 'Location access denied. Enable it in your browser settings.'
              : 'Could not detect your location. Try again.'}
            <button onClick={nearMe.request} className="ml-auto underline hover:no-underline flex-shrink-0">Retry</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm font-medium">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <img src={Logo} alt="i-Sabi" className="w-14 h-14 object-contain opacity-20" />
            <p className="text-white/25 text-sm">
              {category === 'near' && nearMe.state === 'loaded'
                ? `No events found near ${nearMe.city}.`
                : category === 'ongoing'
                  ? 'No ongoing events right now.'
                  : category === 'past'
                    ? 'No past events found.'
                    : 'No ticketing events available right now.'}
            </p>
            <p className="text-white/15 text-xs">Check back soon!</p>
          </div>
        )}

        {!isLoading && !error && paged.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paged.map((event, i) => (
                <div
                  key={event._id}
                  className="animate-[slideInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: `${Math.min(i, 7) * 55}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] py-5">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <img src={Logo} alt="i-Sabi" className="h-7 w-auto object-contain opacity-60" />
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} i-Sabi · All rights reserved</p>
          <div className="flex items-center gap-3 text-white/20">
            {[
              { href: 'https://instagram.com/isabi_ng', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { href: 'https://twitter.com/isabi_ng', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { href: 'https://facebook.com/isabi', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { href: 'https://tiktok.com/@isabi_ng', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" aria-label={href}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={icon} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discover
