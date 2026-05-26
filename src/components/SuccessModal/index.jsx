import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Canvas confetti burst
const Confetti = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#22c55e', '#16a34a', '#4ade80', '#fbbf24', '#f59e0b', '#ffffff', '#a7f3d0', '#86efac']
    const pieces = Array.from({ length: 130 }, () => ({
      x: canvas.width * (0.3 + Math.random() * 0.4),
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 12 + 6),
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      alpha: 1,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      pieces.forEach(p => {
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin
        p.alpha = Math.max(0, p.alpha - 0.008)
        if (p.alpha > 0 && p.y < canvas.height + 20) alive = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle * Math.PI / 180)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive) animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />
}

const fmtICS = (d) => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

const CalendarSection = ({ event }) => {
  const [added, setAdded] = useState(null)
  if (!event?.startDate) return null

  const start = new Date(event.startDate)
  const end = event.endDate
    ? new Date(event.endDate)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000)

  const location = [event.venue, event.city || event.eventOwner, 'Nigeria'].filter(Boolean).join(', ')
  const title = event.eventName || 'Event'
  const description = `Your i-Sabi ticket is confirmed! Discover more events at https://i-sabi.com.ng`

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmtICS(start)}/${fmtICS(end)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`

  const downloadICS = (type) => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//i-Sabi//Ticketing//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${fmtICS(start)}`,
      `DTEND:${fmtICS(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:Your i-Sabi ticket is confirmed!\\nDiscover more events at https://i-sabi.com.ng`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`
    a.click()
    URL.revokeObjectURL(url)
    setAdded(type)
    setTimeout(() => setAdded(null), 2500)
  }

  const calOptions = [
    {
      id: 'google', label: 'Google',
      color: '#EA4335',
      icon: 'M21.805 10.023H12v3.955h5.637c-.246 1.38-1.008 2.554-2.147 3.334v2.77h3.476c2.035-1.875 3.209-4.636 3.209-7.91 0-.643-.057-1.264-.37-2.149zM12 22c2.762 0 5.079-.916 6.773-2.477l-3.476-2.77c-.916.614-2.088.977-3.297.977-2.538 0-4.685-1.715-5.453-4.019H2.96v2.859A10.002 10.002 0 0012 22zM6.547 13.711A6.005 6.005 0 016.2 12c0-.592.082-1.166.347-1.711V7.43H2.96A10.002 10.002 0 002 12c0 1.614.389 3.14 1.072 4.57l3.475-2.859zM12 5.978c1.43 0 2.715.491 3.727 1.459l2.798-2.798C16.846 3.07 14.596 2 12 2A10.002 10.002 0 002.96 7.43l3.587 2.859C7.315 7.692 9.462 5.978 12 5.978z',
      action: () => { window.open(googleUrl, '_blank'); setAdded('google'); setTimeout(() => setAdded(null), 2500) },
    },
    {
      id: 'apple', label: 'Apple',
      color: '#e4e4e7',
      icon: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
      action: () => downloadICS('apple'),
    },
    {
      id: 'outlook', label: 'Outlook',
      color: '#0078D4',
      icon: 'M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.1V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3l-3-3zM8.5 19.5v-5.88l-3.84 4.5q.56.3 1.07.3.52 0 1.06-.13.53-.12 1.04-.37.52-.24.94-.42h.01zm-3.5-4.98H4.87v-6H3.5v6h.68v.01l1.32 1.29v-1.3zm10.5-5.52H9v1.5h6.5v-1.5zm.5 3H9v1.5h7v-1.5zm.5 3H9v1.5h7.5v-1.5z',
      action: () => { window.open(outlookUrl, '_blank'); setAdded('outlook'); setTimeout(() => setAdded(null), 2500) },
    },
    {
      id: 'ics', label: 'iCal / Other',
      color: '#a1a1aa',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      stroke: true,
      action: () => downloadICS('ics'),
    },
  ]

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-white/[0.05]" />
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest flex-shrink-0">Add to Calendar</p>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {calOptions.map(({ id, label, color, icon, stroke, action }) => {
          const isAdded = added === id
          return (
            <button
              key={id}
              onClick={action}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border transition-all duration-200 active:scale-95
                ${isAdded
                  ? 'bg-[#22c55e]/10 border-[#22c55e]/30'
                  : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.14]'
                }`}
            >
              {isAdded ? (
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill={stroke ? 'none' : 'currentColor'}
                  stroke={stroke ? 'currentColor' : 'none'}
                  strokeWidth={stroke ? 1.8 : 0}
                  style={{ color }}
                >
                  <path d={icon} strokeLinecap={stroke ? 'round' : undefined} strokeLinejoin={stroke ? 'round' : undefined} />
                </svg>
              )}
              <span className={`text-[9px] font-semibold text-center leading-tight ${isAdded ? 'text-[#22c55e]' : 'text-white/40'}`}>
                {isAdded ? 'Added!' : label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const SuccessModal = ({ setSuccessModal, ticketId, mongoId, eventId, event }) => {
  return (
    <>
      <Confetti />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={() => setSuccessModal(false)}
      />

      <div className="relative z-10 w-full max-w-sm animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden text-center">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#22c55e] to-transparent" />

          <div className="px-6 py-7 space-y-5">
            {/* Success icon */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-[#22c55e]/15 animate-ping-slow scale-[1.6]" />
                <div className="w-[72px] h-[72px] rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center relative z-10">
                  <svg className="w-9 h-9 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-white/40 text-sm">Your ticket has been secured 🎉</p>
            </div>

            {/* Ticket ID */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Your Ticket ID</span>
              <p className="text-[#22c55e] font-mono font-black text-2xl tracking-widest">{ticketId}</p>
            </div>

            <p className="text-white/30 text-xs leading-relaxed">
              A confirmation email has been sent. Use the buttons below to view or retrieve your ticket.
            </p>

            {/* Calendar reminder */}
            <CalendarSection event={event} />

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              {eventId && (
                <Link
                  to={`/find-ticket/${eventId}`}
                  onClick={() => setSuccessModal(false)}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm
                    bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                    shadow-lg shadow-green-500/20 transition-all duration-200 active:scale-[0.99]
                    flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Find My Ticket
                </Link>
              )}

              {mongoId && (
                <Link
                  to={`/invoice/${mongoId}`}
                  onClick={() => setSuccessModal(false)}
                  className="w-full py-2.5 rounded-xl font-bold text-white/60 hover:text-white text-sm
                    bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07]
                    transition-all duration-200 active:scale-[0.99]
                    flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  View QR Invoice
                </Link>
              )}

              <button
                onClick={() => setSuccessModal(false)}
                className="text-white/25 hover:text-white/50 text-xs font-medium transition-colors py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SuccessModal
