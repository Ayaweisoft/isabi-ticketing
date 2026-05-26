import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import getData from '../../utils/getData'
import { fetchTicketDetails, checkTicket } from '../../adapters/CommonAdapter'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import TicketData from '../../components/TicketData'
import { useSEO } from '../../hooks/useSEO'
import { DotGrid, QRPattern, TicketOutline } from '../../components/Decor'

const CheckTicket = () => {
  useSEO({ title: 'Verify Ticket', description: 'Verify the authenticity of your event ticket on i-Sabi.' })
  const { id } = useParams()
  const [input, setInput] = useState('')
  const [submittedId, setSubmittedId] = useState('')
  const [enableFetch, setEnableFetch] = useState(false)

  const { data: eventData } = useQuery({
    queryKey: ['eventData', id],
    queryFn: () => getData(fetchTicketDetails, id),
  })

  const { isLoading: loading, error: err, data: ticketData } = useQuery({
    queryKey: ['checkTicketData', submittedId],
    queryFn: () => getData(checkTicket, { ticketId: submittedId, eventId: id }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: enableFetch && !!submittedId,
  })

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    setSubmittedId(input.trim())
    setEnableFetch(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      {/* Background */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 25%, rgba(34,197,94,0.05) 0%, transparent 60%), #0a0a0a',
        }}
      >
        <DotGrid opacity={0.03} size={26} />
        <TicketOutline className="absolute -right-16 top-1/2 -translate-y-1/2 w-72 text-white opacity-[0.04] rotate-6 pointer-events-none" />
        <QRPattern className="absolute left-4 bottom-8 w-32 h-32 text-[#22c55e] opacity-[0.06]" />
        <div className="w-full max-w-md space-y-5">
          {/* Icon + heading */}
          <div className="text-center space-y-3 mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 mx-auto">
              <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-white font-black text-3xl">Verify Ticket</h1>
            <p className="text-white/35 text-sm">Enter your ticket ID to confirm authenticity</p>
          </div>

          {/* Search card */}
          <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Ticket ID</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setEnableFetch(false)
                    }}
                    placeholder="e.g. TK-123456"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full py-3 rounded-xl font-bold text-white text-sm
                  bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                  shadow-lg shadow-green-500/20 hover:shadow-green-500/30
                  transition-all duration-200 active:scale-[0.99]
                  flex items-center justify-center gap-2
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Ticket
                  </>
                )}
              </button>

              {err && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-[fadeIn_0.2s_ease-out]">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {err?.response?.data?.error || err?.message || 'Ticket not found'}
                </div>
              )}
            </form>
          </div>

          {/* Result card */}
          {ticketData && !loading && (
            <TicketData data={ticketData} />
          )}

          {/* Not found state */}
          {submittedId && !loading && !err && !ticketData && (
            <div className="text-center py-6 text-white/25 text-sm">
              No ticket found with that ID.
            </div>
          )}
        </div>
      </div>

      <Footer data={eventData?.event} />
    </div>
  )
}

export default CheckTicket
