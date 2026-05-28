import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchTicketInvoice, fetchEventById } from '../../adapters/CommonAdapter'
import { drawTicketPass } from '../../utils/drawTicketPass'

const FIELDS = [
  { key: 'name', label: 'Name', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'phone', label: 'Phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { key: 'ticketType', label: 'Ticket Type', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { key: 'amount', label: 'Amount Paid', format: (v) => `₦${parseFloat(v || 0).toLocaleString()}`, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { key: 'numberOfTicket', label: 'Tickets', format: (v, d) => `${v} total · ${d.numberOfTicketUsed || 0} used`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

const statusStyle = (status = '') => {
  const s = status.toLowerCase()
  if (s === 'active' || s === 'valid') return 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20'
  if (s === 'used') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-red-400 bg-red-500/10 border-red-500/20'
}

const TicketData = ({ data }) => {
  const [downloading, setDownloading] = useState(false)
  const [dlError, setDlError] = useState('')
  const [eventImage, setEventImage] = useState('')

  const mongoId = data?._id

  useEffect(() => {
    const eventId = data?.eventId
    if (!eventId) return
    fetchEventById(eventId)
      .then(res => {
        const ev = res?.data?.eventData || res?.data?.event || res?.data
        setEventImage(ev?.image_url || ev?.imageUrl || '')
      })
      .catch(() => {})
  }, [data?.eventId])

  const handleDownload = async () => {
    if (!mongoId) return
    setDownloading(true)
    setDlError('')
    try {
      const res = await fetchTicketInvoice(mongoId)
      const invoice = res?.data?.invoice || res?.data?.data || res?.data
      const qrSrc = invoice?.qrCode || invoice?.qr_code || invoice?.qrcode

      // Fetch event image from event data using the eventId on the ticket
      let eventImageUrl = ''
      const eventId = data?.eventId
      if (eventId) {
        try {
          const evRes = await fetchEventById(eventId)
          const evData = evRes?.data?.eventData || evRes?.data?.event || evRes?.data
          eventImageUrl = evData?.image_url || evData?.imageUrl || ''
        } catch { /* non-fatal — draw without image */ }
      }

      await drawTicketPass(invoice, qrSrc, mongoId, eventImageUrl || eventImage)
    } catch (err) {
      setDlError(err?.response?.data?.error || err?.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">

      {/* Event cover photo */}
      {eventImage ? (
        <div className="relative h-32 overflow-hidden">
          <img src={eventImage} alt="Event" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#111111]" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p className="text-white font-black text-sm leading-tight line-clamp-1">
              {data.ticketType && <span className="text-[#22c55e]">{data.ticketType} · </span>}Ticket Details
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[3px] w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" />
      )}

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-base">Ticket Details</h3>
          {data.status && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${statusStyle(data.status)}`}>
              {data.status}
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-1">
          {FIELDS.map(({ key, label, icon, format }) => {
            const val = format ? format(data[key], data) : data[key]
            if (!val) return null
            return (
              <div key={key} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] font-medium">{label}</p>
                  <p className="text-white font-semibold text-sm truncate">{val}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={downloading || !mongoId}
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm
              bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
              shadow-lg shadow-green-500/15 transition-all duration-200 active:scale-[0.99]
              flex items-center justify-center gap-2
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket Pass
              </>
            )}
          </button>

          {mongoId && (
            <Link
              to={`/invoice/${mongoId}${data?.eventId ? `?eid=${data.eventId}` : ''}`}
              className="w-full py-2.5 rounded-xl font-bold text-white/50 hover:text-white text-sm
                bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07]
                transition-all duration-200 active:scale-[0.99]
                flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              View Full Invoice
            </Link>
          )}

          {dlError && (
            <p className="text-red-400 text-xs text-center">{dlError}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketData
