import logoUrl from '../assets/logo.png'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function fmtDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return ''
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`
}

function rrPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxWidth, lineH, maxLines = 3) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  lines.push(line)
  lines.slice(0, maxLines).forEach((l, i) => ctx.fillText(l, x, y + i * lineH))
  return Math.min(lines.length, maxLines) * lineH
}

export async function drawTicketPass(invoice, qrSrc, fallbackId, eventImageUrl = '') {
  const SCALE = 2
  const W = 400
  const H = 760

  const canvas = document.createElement('canvas')
  canvas.width = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(SCALE, SCALE)

  // Background
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  // ── Header: event image (if available) or dark gradient fallback ──
  const HEADER_H = 200
  const eventImgSrc = eventImageUrl || invoice.imageUrl || invoice.image_url || invoice.eventImage || ''

  if (eventImgSrc) {
    // Load and draw event image as cover, then overlay gradient for readability
    const evImg = new Image()
    evImg.crossOrigin = 'anonymous'
    evImg.src = eventImgSrc
    await new Promise((res) => { evImg.onload = res; evImg.onerror = res })

    if (evImg.complete && evImg.naturalWidth) {
      // Cover-fit: scale so the shortest side fills the header width
      const scale = Math.max(W / evImg.naturalWidth, HEADER_H / evImg.naturalHeight)
      const sw = evImg.naturalWidth * scale
      const sh = evImg.naturalHeight * scale
      ctx.drawImage(evImg, (W - sw) / 2, (HEADER_H - sh) / 2, sw, sh)
    }

    // Dark gradient overlay (bottom-heavy for text)
    const imgOverlay = ctx.createLinearGradient(0, 0, 0, HEADER_H)
    imgOverlay.addColorStop(0, 'rgba(0,0,0,0.55)')
    imgOverlay.addColorStop(1, 'rgba(0,0,0,0.82)')
    ctx.fillStyle = imgOverlay
    ctx.fillRect(0, 0, W, HEADER_H)
  } else {
    // Fallback: dark panel with green glow
    ctx.fillStyle = '#141414'
    ctx.fillRect(0, 0, W, HEADER_H)
    const glow = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 80, 220)
    glow.addColorStop(0, 'rgba(34,197,94,0.07)')
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, HEADER_H)
  }

  // Green top bar (always on top of image or fallback)
  const topGrad = ctx.createLinearGradient(0, 0, W, 0)
  topGrad.addColorStop(0, '#22c55e')
  topGrad.addColorStop(1, '#16a34a')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, W, 5)

  // Brand: logo + wordmark
  const logo = new Image()
  logo.src = logoUrl
  await new Promise((res) => { logo.onload = res; logo.onerror = res })

  const LOGO_SIZE = 22
  const brandY = 18
  if (logo.complete && logo.naturalWidth) {
    const lx = W / 2 - LOGO_SIZE / 2 - 38
    ctx.drawImage(logo, lx, brandY - LOGO_SIZE + 4, LOGO_SIZE, LOGO_SIZE)
  }
  ctx.fillStyle = '#22c55e'
  ctx.font = 'bold 10px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('i-SABI  TICKETING', W / 2 + 6, brandY)

  // Event name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 17px system-ui, sans-serif'
  const eventName = (invoice.event || invoice.eventName || 'Event').toUpperCase()
  const nameLines = wrapText(ctx, eventName, W / 2, 55, W - 52, 22, 3)

  // Event date
  const dateY = 55 + nameLines + 8
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText(fmtDate(invoice.eventDate), W / 2, dateY)

  // Ticket type badge
  const badge = invoice.ticketType || 'General Admission'
  ctx.font = 'bold 10px system-ui, sans-serif'
  const bw = ctx.measureText(badge).width + 22
  const bx = W / 2 - bw / 2
  const by = dateY + 14
  rrPath(ctx, bx, by, bw, 20, 10)
  ctx.fillStyle = 'rgba(34,197,94,0.25)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(34,197,94,0.5)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = '#22c55e'
  ctx.fillText(badge, W / 2, by + 13.5)

  // Perforation 1
  const perf1 = 202
  ctx.save()
  ctx.setLineDash([5, 5])
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(22, perf1); ctx.lineTo(W - 22, perf1)
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#0d0d0d'
  ctx.beginPath(); ctx.arc(0, perf1, 14, -Math.PI / 2, Math.PI / 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W, perf1, 14, Math.PI / 2, -Math.PI / 2); ctx.fill()

  // QR section background
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, perf1, W, 270)

  // QR white card with green glow
  const qrSize = 184
  const qrX = W / 2 - qrSize / 2 - 8
  const qrY = perf1 + 22
  ctx.shadowColor = 'rgba(34,197,94,0.25)'
  ctx.shadowBlur = 20
  rrPath(ctx, qrX, qrY, qrSize + 16, qrSize + 16, 14)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.shadowBlur = 0

  if (qrSrc) {
    const src = qrSrc.startsWith('data:') ? qrSrc : `data:image/png;base64,${qrSrc}`
    const img = new Image()
    img.src = src
    await new Promise((res) => { img.onload = res; img.onerror = res })
    ctx.drawImage(img, qrX + 8, qrY + 8, qrSize, qrSize)
  }

  // Scan label
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.font = 'bold 9px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SCAN AT THE GATE', W / 2, perf1 + 22 + qrSize + 16 + 20)

  // Perforation 2
  const perf2 = perf1 + 270
  ctx.save()
  ctx.setLineDash([5, 5])
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(22, perf2); ctx.lineTo(W - 22, perf2)
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#0d0d0d'
  ctx.beginPath(); ctx.arc(0, perf2, 14, -Math.PI / 2, Math.PI / 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W, perf2, 14, Math.PI / 2, -Math.PI / 2); ctx.fill()

  // Stub panel
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, perf2, W, H - perf2)

  // Ticket number
  const displayNum = invoice.ticketNumber || invoice.ticketId || fallbackId
  ctx.fillStyle = '#22c55e'
  ctx.font = 'bold 24px "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`#${displayNum}`, W / 2, perf2 + 46)

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(36, perf2 + 58, W - 72, 1)

  // Detail rows
  const rows = [
    ['ATTENDEE',    invoice.buyer || invoice.name || '—'],
    ['TICKET',      `${invoice.ticketType || '—'}  ×  ${invoice.numberOfTicket || 1}`],
    ['AMOUNT PAID', `₦${Number(invoice.total || invoice.amount || 0).toLocaleString()}`],
  ]
  rows.forEach(([label, value], i) => {
    const ry = perf2 + 82 + i * 54
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.font = 'bold 9px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(label, 40, ry)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(value, W - 40, ry + 19)
  })

  // Footer
  ctx.fillStyle = 'rgba(34,197,94,0.12)'
  ctx.fillRect(0, H - 38, W, 1)
  ctx.fillStyle = 'rgba(34,197,94,0.5)'
  ctx.font = '10px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('i-sabi.com.ng  ·  Powered by Ayaweisoft', W / 2, H - 16)

  // Download
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `isabi-ticket-${displayNum}.png`
  link.click()
}
