import React, { useMemo, useState, useEffect, useContext } from 'react'
import PaystackPop from '@paystack/inline-js'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useParams, Link } from 'react-router-dom'
import getData from '../../utils/getData'
import { fetchEventById, fetchTicketDetails, verifyPayment, submitTicket } from '../../adapters/CommonAdapter'
import TicketCard from '../../components/TicketCard'
import InputModal from '../../components/InputModal'
import SuccessModal from '../../components/SuccessModal'
import { TicketContext } from '../../contexts/TicketContext'
import appConfig from '../../configs/app.config'
import generateTicketId from '../../utils/generateTicketId'
import { buildEventOgImage } from '../../utils/buildOgImage'
import GentleLoader from '../../components/GentleLoader'
import { toast } from 'react-toastify'
import { useSEO } from '../../hooks/useSEO'
import Logo from '../../assets/logo.png'
import ShareModal from '../../components/ShareModal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { DotGrid, ConfettiScatter, SoundWave, Sparkle, SparkleSmall, TicketOutline, FloatingParticles, StarField, SpinRings, ScanLine, Meteors, GlowRings, Waveform, StageLights } from '../../components/Decor'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const TRUST_BADGES = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: '100% Secure', sub: 'Payments encrypted' },
  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Instant Delivery', sub: 'Sent to your email' },
  { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', label: '24/7 Support', sub: "We're here to help" },
  { icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z', label: 'Easy Refunds', sub: 'If event is cancelled' },
]

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
    <div className="w-14 h-14 sm:w-[68px] sm:h-[68px] bg-black/50 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
      <span className="text-white font-black text-xl sm:text-2xl tabular-nums">{String(value).padStart(2, '0')}</span>
    </div>
    <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{label}</span>
  </div>
)

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    if (!targetDate || isNaN(targetDate.getTime())) return
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])
  return timeLeft
}

// Share button — opens ShareModal
const ShareButton = ({ event }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] text-xs font-semibold transition-all duration-200 active:scale-95"
        title="Share event"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
      {open && <ShareModal event={event} onClose={() => setOpen(false)} />}
    </>
  )
}

// Google Maps embed (no API key needed for basic embed)
const MapEmbed = ({ venue, city }) => {
  if (!venue) return null
  const query = encodeURIComponent(`${venue}${city ? ', ' + city : ''}, Nigeria`)
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/[0.07] mt-6">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
        <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-white/60 text-xs font-semibold truncate">{venue}</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex-shrink-0 text-[#22c55e] text-xs font-bold hover:underline"
        >
          Open in Maps ↗
        </a>
      </div>
      <div className="relative w-full h-[220px] sm:h-[280px]">
        <iframe
          title={`Map: ${venue}`}
          src={`https://maps.google.com/maps?q=${query}&output=embed&z=15`}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}

const Pill = ({ icon, children }) => (
  <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium">
    <svg className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
    <span className="truncate">{children}</span>
  </div>
)

const Ticket = () => {
  const { id } = useParams()
  const revealRef = useScrollReveal()

  const [modal, setModal] = useState(false)
  const [trxRef, setTrxRef] = useState(Date.now().toString())
  const [successModal, setSuccessModal] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const { ticket } = useContext(TicketContext)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: 0 })

  const { isLoading: eventLoading, data: eventInfo } = useQuery({
    queryKey: ['eventById', id],
    queryFn: () => getData(fetchEventById, id),
    enabled: !!id,
  })

  const { isLoading: ticketLoading, error, data: ticketData } = useQuery({
    queryKey: ['ticketData', id],
    queryFn: () => getData(fetchTicketDetails, id),
    enabled: !!id,
  })

  const event = eventInfo?.eventData || eventInfo?.event || ticketData?.event
  const ticketList = ticketData?.ticketList || ticketData?.tickets || (Array.isArray(ticketData) ? ticketData : [])
  const isLoading = eventLoading || ticketLoading

  const date = useMemo(() => new Date(event?.startDate), [event?.startDate])
  const countdown = useCountdown(date)
  const isUpcoming = !isNaN(date?.getTime()) && date > new Date()

  const formattedDate = useMemo(() => {
    if (!event?.startDate || isNaN(date?.getTime())) return ''
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }, [date, event])

  // Build enriched OG image: event photo + name, date, price range, i-Sabi watermark
  const ogImage = buildEventOgImage(event, ticketList)

  // Dynamic SEO — uses event image for social sharing
  useSEO({
    title: event?.eventName,
    description: event?.aboutEvent || `Get tickets for ${event?.eventName}${event?.venue ? ` at ${event.venue}` : ''}. Secure your spot on i-Sabi.`,
    image: ogImage,
    type: 'event',
  })

  const handleClick = () => setModal(true)

  const submitVoteToDB = async (tx_ref, trans_id) => {
    // Generate ticket ID and use the local value directly — don't read stale state
    const tId = await generateTicketId(6, id)
    setTicketId(tId.toString())
    const requestData = {
      eventId: event._id,
      ticketId: ticket._id,
      email: formData.email,
      phone: formData.phone,
      name: formData.name,
      quantity: ticket.numberOfTicket,
      mobile: true,
      message: 'Payment successful',
      ref: tx_ref,
      trax: trans_id,
      ticketDatabaseId: ticket._id,
      parentTicket: tId.toString(), // use local var, not stale ticketId state
      amount: parseFloat(ticket?.numberOfTicket * ticket?.amount).toString(),
      ticketType: ticket.ticketType,
      imageUrl: ticket.imageUrl,
      numberOfTicket: ticket.numberOfTicket,
      amountPaid: parseFloat(ticket?.numberOfTicket * ticket?.amount).toString(),
    }
    const result = await submitTicket(requestData)
    const ok = result?.status === 200 || result?.status === 201 || result?.statusText === 'OK'
    if (ok) {
      setSuccessModal(true)
    } else {
      toast.error(`Ticket could not be saved. Quote ref ${tx_ref} when contacting support.`)
    }
  }

  const handlePaystackSuccess = async (transaction) => {
    setLoading(true)
    try {
      const verifyData = await verifyPayment({
        reference: transaction.reference,
        amount: (Number(ticket?.amount) * Number(ticket?.numberOfTicket) * 100).toString(),
      })
      // Handle both flat and nested Paystack verify response shapes
      const status =
        verifyData?.data?.status ||
        verifyData?.data?.data?.status ||
        (verifyData?.status === 200 ? 'success' : null)
      if (status === 'success') {
        await submitVoteToDB(transaction.reference, transaction.transaction || transaction.reference)
      } else if (status === 'pending') {
        // Async channels (bank_transfer) — payment initiated but not yet confirmed
        toast.info('Payment is being processed. Your ticket will be sent to your email once confirmed.')
        setSuccessModal(true)
      } else {
        toast.error(`Payment could not be confirmed. Quote ref ${transaction.reference} when contacting support.`)
      }
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || 'Error verifying payment')
    } finally {
      setLoading(false)
    }
  }

  const initiatePayment = (ref, amount) => {
    try {
      const popup = new PaystackPop()
      popup.newTransaction({
        key: appConfig.paystackPublicKey,
        email: formData.email,
        amount,
        ref,
        currency: 'NGN',
        firstname: formData.name,
        phone: formData.phone,
        channels: ['card', 'ussd', 'bank_transfer', 'bank', 'qr', 'mobile_money'],
        metadata: {
          custom_fields: [
            { display_name: 'Phone', variable_name: 'phone', value: formData.phone },
            { display_name: 'Ticket Type', variable_name: 'ticket_type', value: ticket?.ticketType || '' },
            { display_name: 'Quantity', variable_name: 'quantity', value: String(ticket?.numberOfTicket || 1) },
          ],
        },
        onSuccess: (transaction) => handlePaystackSuccess(transaction),
        onCancel: () => toast.info('Payment cancelled'),
      })
    } catch (err) {
      console.error('Paystack error:', err)
      toast.error('Could not open payment. Please refresh and try again.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ticket?._id) {
      toast.error('Please select a ticket type first.')
      return
    }
    const amount = Math.round(Number(ticket.numberOfTicket) * Number(ticket.amount) * 100)
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Invalid ticket amount. Please try again.')
      return
    }
    const ref = Date.now().toString()
    setTrxRef(ref)
    setModal(false) // close form before Paystack opens (avoids z-index conflict)
    initiatePayment(ref, amount)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      {modal && <InputModal setModal={setModal} setFormData={setFormData} formData={formData} handleSubmit={handleSubmit} />}
      {successModal && <SuccessModal setSuccessModal={setSuccessModal} ticketId={ticketId} eventId={id} event={event} />}

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] sm:min-h-[62vh] flex flex-col justify-end overflow-hidden">
        {event?.image_url ? (
          <div className="absolute inset-0">
            <img src={event.image_url} className="w-full h-full object-cover object-top" alt={event.eventName} loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 15% 60%, rgba(34,197,94,0.08) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(22,163,74,0.05) 0%, transparent 40%), #0a0a0a'
          }}>
            {/* Texture */}
            <DotGrid opacity={0.04} size={24} />
            <StarField count={55} />

            {/* Atmospheric */}
            <StageLights className="absolute inset-x-0 top-0 w-full h-full opacity-50" />
            <GlowRings />
            <ScanLine />

            {/* Shapes */}
            <TicketOutline className="absolute right-0 top-1/2 -translate-y-1/2 w-80 text-white opacity-[0.045] rotate-3 pointer-events-none animate-[driftY_11s_ease-in-out_infinite]" />
            <TicketOutline className="absolute -left-10 top-10 w-60 text-white opacity-[0.025] -rotate-6 pointer-events-none animate-[driftY_14s_ease-in-out_2s_infinite]" />
            <SpinRings className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#22c55e] opacity-50" />

            {/* Particles */}
            <FloatingParticles count={20} />
            <ConfettiScatter count={20} className="opacity-50" />
            <Meteors count={3} />

            {/* Accents */}
            <SoundWave className="absolute bottom-0 inset-x-0 w-full h-8 text-[#22c55e] opacity-[0.08]" />
            <Waveform className="absolute top-1/3 inset-x-0 w-full text-[#22c55e] opacity-[0.04] pointer-events-none" />
            <Sparkle className="absolute top-20 right-1/3 w-5 h-5 text-[#22c55e] opacity-25 animate-[sparkle_2.2s_ease-in-out_infinite] pointer-events-none" />
            <SparkleSmall className="absolute top-1/2 left-[15%] w-3 h-3 text-[#4ade80] opacity-20 animate-[sparkle_3s_ease-in-out_1s_infinite] pointer-events-none" />
            <SparkleSmall className="absolute bottom-20 right-[25%] w-2.5 h-2.5 text-[#22c55e] opacity-18 animate-[sparkle_2.5s_ease-in-out_0.5s_infinite] pointer-events-none" />

            {/* ── Centered event placeholder visual ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ paddingBottom: '10%' }}>
              <div className="flex flex-col items-center gap-3 opacity-[0.22]">
                {/* Big ticket icon with pulse */}
                <div className="relative">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 text-[#22c55e] animate-[glowPulse_3s_ease-in-out_infinite]" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      d="M8 26a4 4 0 0 1 0-8V12a4 4 0 0 1 4-4h56a4 4 0 0 1 4 4v6a4 4 0 0 1 0 8v6a4 4 0 0 1 0 8v6a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-6a4 4 0 0 1 0-8v-6z"
                    />
                    <line x1="52" y1="8" x2="52" y2="72" strokeDasharray="5 4" strokeWidth="1" opacity="0.6" />
                    <rect x="18" y="28" width="24" height="3" rx="1.5" opacity="0.5" fill="currentColor" stroke="none" />
                    <rect x="18" y="35" width="16" height="2" rx="1" opacity="0.35" fill="currentColor" stroke="none" />
                    <rect x="18" y="48" width="20" height="2" rx="1" opacity="0.3" fill="currentColor" stroke="none" />
                    <rect x="58" y="24" width="12" height="12" rx="2" opacity="0.3" fill="currentColor" stroke="none" />
                    <rect x="58" y="42" width="12" height="2" rx="1" opacity="0.25" fill="currentColor" stroke="none" />
                    <rect x="58" y="46" width="8" height="2" rx="1" opacity="0.25" fill="currentColor" stroke="none" />
                  </svg>
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full border border-[#22c55e]/30 scale-150 animate-[glowPulse_3s_ease-in-out_0.5s_infinite]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-[#22c55e]/40" />
                  <span className="text-[#22c55e] text-[9px] font-black uppercase tracking-[0.3em]">Live Event</span>
                  <div className="w-8 h-px bg-[#22c55e]/40" />
                </div>
              </div>
            </div>
          </div>
        )}

        {(isLoading || loading) && <GentleLoader />}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <p className="text-red-400 font-medium text-sm">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && event && (
          <div className="relative z-10 px-4 sm:px-8 lg:px-14 pt-28 sm:pt-32 pb-10 sm:pb-14 max-w-5xl mx-auto w-full">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/25 text-[#22c55e] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[pulseDot_2s_ease-in-out_infinite]" />
                {event.type || event.eventType || 'Live Event'} · {event.eventOwner || event.city || 'Nigeria'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.92] tracking-tight max-w-3xl mb-2 sm:mb-3">
              {event.eventName}
            </h1>
            <p className="text-white/40 text-xs sm:text-sm font-medium mb-5 sm:mb-7">by {event.companyName}</p>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8">
              {formattedDate && <Pill icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">{formattedDate}</Pill>}
              {event.startTime && <Pill icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">{event.startTime}</Pill>}
              {event.venue && <Pill icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z">{event.venue}</Pill>}
              <ShareButton event={event} />
            </div>

            {/* Countdown */}
            {isUpcoming && (
              <div>
                <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest mb-3">Event starts in</p>
                <div className="flex items-end gap-2 sm:gap-3">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <span className="text-white/20 font-black text-xl mb-5">:</span>
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <span className="text-white/20 font-black text-xl mb-5">:</span>
                  <CountdownUnit value={countdown.mins} label="Mins" />
                  <span className="text-white/20 font-black text-xl mb-5">:</span>
                  <CountdownUnit value={countdown.secs} label="Secs" />
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Content ── */}
      {!isLoading && !error && (event || ticketList.length > 0) && (
        <div className="px-4 sm:px-8 lg:px-14 pb-20 max-w-5xl mx-auto" ref={revealRef}>

          {/* Google Map */}
          {event?.venue && <MapEmbed venue={event.venue} city={event.eventOwner} />}

          {/* About event */}
          {event?.aboutEvent && (
            <div className="reveal mt-6 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">About This Event</p>
              <p className="text-white/65 text-sm leading-relaxed">{event.aboutEvent}</p>
            </div>
          )}

          {/* Tickets section */}
          {ticketList.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6 mt-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.05]" />
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-white font-black text-base sm:text-lg">Available Tickets</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.05]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ticketList.map((data, i) => (
                  <div
                    key={data._id}
                    className="animate-[ticketEnter_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <TicketCard data={data} handleClick={handleClick} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Trust badges */}
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {TRUST_BADGES.map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
                <div className="w-9 h-9 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xs">{label}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Find ticket link */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-white/25 text-xs">Already bought a ticket?</span>
            <Link to={`/find-ticket/${id}`} className="text-[#22c55e] text-xs font-bold hover:underline">
              Find My Ticket →
            </Link>
          </div>
        </div>
      )}

      <Footer data={event} />
    </div>
  )
}

export default Ticket
