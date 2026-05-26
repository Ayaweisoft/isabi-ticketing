import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import getData from '../../utils/getData'
import { fetchTicketDetails, findMyTicket } from '../../adapters/CommonAdapter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useSEO } from '../../hooks/useSEO'
import { DotGrid, TicketOutline, Sparkle } from '../../components/Decor'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const TicketResult = ({ data, eventId }) => {
  const raw = data?.tickets ?? data
  const tickets = Array.isArray(raw) ? raw : (raw ? [raw] : [])

  if (!tickets.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white/50 text-sm">No tickets found for this email.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 w-full animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">
        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
      </p>
      {tickets.map((ticket, i) => (
        <div key={ticket._id || ticket.ticketId || i} className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" />
          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-black text-base">{ticket.ticketType || 'Ticket'}</p>
                <p className="text-white/40 text-xs mt-0.5">{ticket.name}</p>
              </div>
              {ticket.ticketId && (
                <span className="text-[#22c55e] font-mono font-bold text-sm tracking-wider flex-shrink-0">
                  #{ticket.ticketId}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {ticket.numberOfTicket != null && (
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <p className="text-white/30 mb-1">Tickets</p>
                  <p className="text-white font-bold">{ticket.numberOfTicket} total · {ticket.numberOfTicketUsed || 0} used</p>
                </div>
              )}
              {ticket.amount != null && (
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <p className="text-white/30 mb-1">Amount</p>
                  <p className="text-white font-bold">₦{Number(ticket.amount || 0).toLocaleString()}</p>
                </div>
              )}
              {ticket.status && (
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <p className="text-white/30 mb-1">Status</p>
                  <span className={`font-bold capitalize ${
                    ticket.status === 'active' || ticket.status === 'valid'
                      ? 'text-[#22c55e]'
                      : 'text-yellow-400'
                  }`}>{ticket.status}</span>
                </div>
              )}
            </div>

            {/* Invoice link */}
            {(ticket._id || ticket.ticketId) && (
              <Link
                to={`/invoice/${ticket._id || ticket.ticketId}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs text-white
                  bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                  shadow-lg shadow-green-500/15 transition-all duration-200 active:scale-[0.99]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                View QR Ticket
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const FindMyTicket = () => {
  useSEO({ title: 'Find My Ticket', description: 'Retrieve your event ticket using the email address you used at checkout.' })
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [enableFetch, setEnableFetch] = useState(false)

  const { data: eventData } = useQuery({
    queryKey: ['eventData', id],
    queryFn: () => getData(fetchTicketDetails, id),
  })

  const { isLoading, error, data: ticketData } = useQuery({
    queryKey: ['findMyTicket', id, submittedEmail],
    queryFn: () => getData(findMyTicket, { eventId: id, email: submittedEmail }),
    enabled: enableFetch && !!submittedEmail,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!email.trim()) return
    setSubmittedEmail(email.trim())
    setEnableFetch(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      <div
        className="relative flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(34,197,94,0.05) 0%, transparent 55%), #0a0a0a' }}
      >
        <DotGrid opacity={0.03} size={26} />
        <TicketOutline className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 text-white opacity-[0.035] rotate-6 pointer-events-none" />
        <TicketOutline className="absolute -left-16 bottom-8 w-48 text-white opacity-[0.025] -rotate-3 pointer-events-none" />
        <Sparkle className="absolute top-32 left-[20%] w-4 h-4 text-[#22c55e] opacity-20 animate-[sparkle_2.5s_ease-in-out_0.4s_infinite] pointer-events-none" />
        <div className="w-full max-w-md space-y-5">
          {/* Heading */}
          <div className="text-center space-y-3 mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 mx-auto">
              <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-white font-black text-3xl">Find My Ticket</h1>
            <p className="text-white/35 text-sm">Enter the email you used when purchasing</p>
          </div>

          {/* Search card */}
          <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEnableFetch(false)
                    }}
                    placeholder="buyer@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3 rounded-xl font-bold text-white text-sm
                  bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                  shadow-lg shadow-green-500/20 hover:shadow-green-500/30
                  transition-all duration-200 active:scale-[0.99]
                  flex items-center justify-center gap-2
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find My Ticket
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error?.response?.data?.error || error?.message || 'No ticket found for this email'}
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {!isLoading && !error && ticketData && (
            <TicketResult data={ticketData} eventId={id} />
          )}
        </div>
      </div>

      <Footer data={eventData?.event} />
    </div>
  )
}

export default FindMyTicket
