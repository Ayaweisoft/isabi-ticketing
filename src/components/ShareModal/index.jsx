import React, { useState } from 'react'

const PLATFORMS = [
  {
    id: 'whatsapp', label: 'WhatsApp', color: '#25D366',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.003 2C6.477 2 2 6.477 2 12.003c0 1.885.52 3.65 1.427 5.169L2.016 22l4.93-1.404A9.954 9.954 0 0012.003 22C17.527 22 22 17.524 22 12.003 22 6.477 17.527 2 12.003 2z',
    getUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: 'facebook', label: 'Facebook', color: '#1877F2',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    getUrl: (_t, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'twitter', label: 'X (Twitter)', color: '#e4e4e7',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    getUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=isabi_ng`,
  },
  {
    id: 'telegram', label: 'Telegram', color: '#26A5E4',
    icon: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
    getUrl: (text, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'linkedin', label: 'LinkedIn', color: '#0A66C2',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    getUrl: (_t, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'threads', label: 'Threads', color: '#e4e4e7',
    icon: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.524.85-6.396 2.525-8.544C5.875 1.218 8.63.036 12.193 0h.012c2.866.021 5.34.762 7.354 2.2a11.5 11.5 0 0 1 2.034 1.862l-2.21 2.21a8.36 8.36 0 0 0-1.456-1.336c-1.554-1.11-3.487-1.681-5.744-1.697-2.704.024-4.784.793-6.185 2.286-1.374 1.462-2.07 3.594-2.07 6.543 0 2.952.696 5.086 2.07 6.549 1.4 1.493 3.481 2.262 6.185 2.283 2.04-.016 3.786-.466 5.191-1.338 1.579-.98 2.464-2.44 2.711-4.294h-7.87V14.18h10.833c.11.643.165 1.304.165 1.981C24.913 19.594 22.076 24 12.186 24z',
    getUrl: (text, url) => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: 'email', label: 'Email', color: '#a1a1aa',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    stroke: true,
    getUrl: (text, url) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\nBook here: ${url}`)}`,
  },
  {
    id: 'sms', label: 'SMS', color: '#a1a1aa',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    stroke: true,
    getUrl: (text, url) => `sms:?body=${encodeURIComponent(`${text} ${url}`)}`,
  },
]

const ShareModal = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('share')
  const [downloading, setDownloading] = useState(false)

  // Canonical URL — always uses event ID so QR and share links are identical
  const url = event?._id
    ? `${window.location.origin}/ticket/${event._id}`
    : window.location.href
  const text = `🎟️ ${event?.eventName || 'Check out this event'} — get your tickets now on i-Sabi!`
  const eventSlug = (event?.eventName || 'event').replace(/\s+/g, '-').toLowerCase()

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}&color=22c55e&bgcolor=111111&margin=12&format=png`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownloadQR = async () => {
    setDownloading(true)
    try {
      const res = await fetch(qrUrl)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${eventSlug}-qrcode.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {}
    setDownloading(false)
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: event?.eventName, text, url })
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-sm animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="bg-[#111111] sm:rounded-2xl rounded-t-3xl border border-white/[0.08] shadow-2xl overflow-hidden">
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 pb-0 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-white/15" />
          </div>

          <div className="p-5 pt-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-white font-black text-base">Share Event</h3>
                {event?.eventName && (
                  <p className="text-white/35 text-xs mt-0.5 line-clamp-1">{event.eventName}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setTab('share')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${tab === 'share' ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/25' : 'text-white/40 hover:text-white/70'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Link
              </button>
              <button
                onClick={() => setTab('qr')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${tab === 'qr' ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/25' : 'text-white/40 hover:text-white/70'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QR Code
              </button>
            </div>

            {tab === 'share' ? (
              <>
                {/* Platform grid */}
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map(({ id, label, color, icon, stroke, getUrl }) => (
                    <a
                      key={id}
                      href={getUrl(text, url)}
                      target={id === 'sms' ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200 active:scale-95"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill={stroke ? 'none' : 'currentColor'}
                        stroke={stroke ? 'currentColor' : 'none'}
                        strokeWidth={stroke ? 1.8 : 0}
                        style={{ color }}
                      >
                        <path
                          d={icon}
                          strokeLinecap={stroke ? 'round' : undefined}
                          strokeLinejoin={stroke ? 'round' : undefined}
                        />
                      </svg>
                      <span className="text-white/40 text-[9px] font-semibold text-center leading-tight">{label}</span>
                    </a>
                  ))}
                </div>

                {/* Copy + native share */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-[0.99]
                      ${copied
                        ? 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-white/[0.08] bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.07]'
                      }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>

                  {typeof navigator !== 'undefined' && navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold border border-white/[0.08] bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.07] transition-all active:scale-[0.99]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      More
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ── QR Code tab ── */
              <div className="flex flex-col items-center gap-4">
                {/* QR code */}
                <div className="relative p-3 rounded-2xl bg-[#0a0a0a] border border-[#22c55e]/20 shadow-lg shadow-green-500/5">
                  <img
                    src={qrUrl}
                    alt={`QR code for ${event?.eventName || 'this event'}`}
                    width={220}
                    height={220}
                    className="rounded-lg block"
                    loading="lazy"
                  />
                  {/* Corner accent dots */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#22c55e]/40" />
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22c55e]/40" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#22c55e]/40" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#22c55e]/40" />
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-white/50 text-xs font-semibold">Scan with any camera to open</p>
                  <p className="text-white/25 text-[10px]">Links directly to ticket purchase</p>
                </div>

                {/* URL preview */}
                <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <svg className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-white/35 text-[10px] font-mono truncate flex-1">{url}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-[0.99]
                      ${copied
                        ? 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-white/[0.08] bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.07]'
                      }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadQR}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold
                      border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]
                      hover:bg-[#22c55e]/20 hover:border-[#22c55e]/50
                      transition-all duration-200 active:scale-[0.99]
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {downloading ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download QR
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
