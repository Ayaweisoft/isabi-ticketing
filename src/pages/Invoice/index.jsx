import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import getData from '../../utils/getData'
import { fetchTicketInvoice } from '../../adapters/CommonAdapter'
import Header from '../../components/Header'
import { useSEO } from '../../hooks/useSEO'
import { DotGrid, QRPattern, TicketOutline } from '../../components/Decor'

const Invoice = () => {
  useSEO({ title: 'Ticket Invoice', description: 'View and download your QR code ticket for entry at the event.' })
  const { ticketId } = useParams()

  const { isLoading, error, data } = useQuery({
    queryKey: ['invoice', ticketId],
    queryFn: () => getData(fetchTicketInvoice, ticketId),
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const invoice = data?.invoice || data?.data || data
  const qrCode = invoice?.qrCode || invoice?.qr_code || invoice?.qrcode

  const handleDownload = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`
    link.download = `ticket-${ticketId}.png`
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      <div
        className="relative flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.05) 0%, transparent 55%), #0a0a0a' }}
      >
        <DotGrid opacity={0.03} size={26} />
        <TicketOutline className="absolute -left-16 top-1/2 -translate-y-1/2 w-72 text-white opacity-[0.04] -rotate-6 pointer-events-none" />
        <QRPattern className="absolute right-6 bottom-10 w-28 h-28 text-[#22c55e] opacity-[0.07]" />
        <div className="w-full max-w-sm space-y-5">
          {/* Back link */}
          <Link
            to={-1}
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
              <p className="text-white/30 text-sm">Loading ticket…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 text-sm">{error?.response?.data?.error || error?.message || 'Could not load ticket'}</p>
            </div>
          )}

          {!isLoading && !error && invoice && (
            <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="h-[3px] w-full bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#22c55e]" />

              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="text-center space-y-1">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Ticket Invoice</p>
                  <h2 className="text-white font-black text-xl">{invoice.eventName || invoice.ticketType || 'Your Ticket'}</h2>
                  {invoice.ticketId && (
                    <p className="text-[#22c55e] font-mono font-bold tracking-widest text-sm">#{invoice.ticketId}</p>
                  )}
                </div>

                {/* QR Code */}
                {qrCode && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img
                        src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                        alt="Ticket QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <p className="text-white/30 text-[11px] text-center">Scan at the gate to enter</p>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2">
                  {[
                    { label: 'Name', value: invoice.name },
                    { label: 'Email', value: invoice.email },
                    { label: 'Ticket Type', value: invoice.ticketType },
                    { label: 'Quantity', value: invoice.numberOfTicket },
                    { label: 'Amount Paid', value: invoice.amount ? `₦${Number(invoice.amount).toLocaleString()}` : null },
                    { label: 'Status', value: invoice.status },
                  ].filter(f => f.value).map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/35 text-xs">{label}</span>
                      <span className={`text-sm font-semibold ${label === 'Status' ? 'text-[#22c55e] capitalize' : 'text-white'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 pt-1">
                  {qrCode && (
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 rounded-xl font-bold text-white text-sm
                        bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                        shadow-lg shadow-green-500/20 transition-all duration-200 active:scale-[0.99]
                        flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download QR Ticket
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-xl font-bold text-white/50 hover:text-white text-sm
                      bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07]
                      transition-all duration-200 active:scale-[0.99]
                      flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Invoice
