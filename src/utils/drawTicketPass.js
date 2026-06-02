import logoUrl from '../assets/logo.png'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

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

function wrapText(ctx, text, x, y, maxWidth, lineH, maxLines = 2) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word }
    else line = test
  }
  lines.push(line)
  lines.slice(0, maxLines).forEach((l, i) => ctx.fillText(l, x, y + i * lineH))
  return Math.min(lines.length, maxLines) * lineH
}

function drawBrackets(ctx, x, y, w, h, arm = 20, thick = 2.5, color = '#22c55e') {
  ctx.strokeStyle = color
  ctx.lineWidth = thick
  ctx.lineCap = 'square'
  ;[
    [[x, y + arm], [x, y], [x + arm, y]],
    [[x + w - arm, y], [x + w, y], [x + w, y + arm]],
    [[x + w, y + h - arm], [x + w, y + h], [x + w - arm, y + h]],
    [[x + arm, y + h], [x, y + h], [x, y + h - arm]],
  ].forEach(([a, b, c]) => {
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.stroke()
  })
}

export async function drawTicketPass(invoice, qrSrc, fallbackId, eventImageUrl = '') {
  const SCALE = 2
  const W = 400
  const H = 1000

  const canvas = document.createElement('canvas')
  canvas.width  = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(SCALE, SCALE)

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)

  // ─── HEADER: full-bleed event image (0 → 490) ────────────────────────
  const HEADER_H = 490
  const imgSrc = eventImageUrl || invoice.eventImage || invoice.image_url || invoice.imageUrl || ''

  if (imgSrc) {
    const evImg = new Image()
    evImg.crossOrigin = 'anonymous'
    evImg.src = imgSrc
    await new Promise(r => { evImg.onload = r; evImg.onerror = r })
    if (evImg.complete && evImg.naturalWidth) {
      ctx.save()
      ctx.beginPath(); ctx.rect(0, 0, W, HEADER_H); ctx.clip()
      const s = Math.max(W / evImg.naturalWidth, HEADER_H / evImg.naturalHeight)
      ctx.drawImage(evImg,
        (W - evImg.naturalWidth  * s) / 2,
        (HEADER_H - evImg.naturalHeight * s) / 2,
        evImg.naturalWidth * s, evImg.naturalHeight * s)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = '#141414'
    ctx.fillRect(0, 0, W, HEADER_H)
    const g = ctx.createRadialGradient(W / 2, HEADER_H * 0.4, 0, W / 2, HEADER_H * 0.4, 260)
    g.addColorStop(0, 'rgba(34,197,94,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, HEADER_H)
  }

  // Overlay: heavy at top + bottom, lighter in the middle
  const ov = ctx.createLinearGradient(0, 0, 0, HEADER_H)
  ov.addColorStop(0,    'rgba(0,0,0,0.60)')
  ov.addColorStop(0.40, 'rgba(0,0,0,0.22)')
  ov.addColorStop(1,    'rgba(0,0,0,0.92)')
  ctx.fillStyle = ov; ctx.fillRect(0, 0, W, HEADER_H)

  // ── Brand: green circle + logo + wordmark (centered, top) ────────────
  const logo = new Image()
  logo.src = logoUrl
  await new Promise(r => { logo.onload = r; logo.onerror = r })

  const BRD_CY = 38

  if (logo.complete && logo.naturalWidth) {
    const LS = 24
    ctx.drawImage(logo, W/2 - 48 - LS/2, BRD_CY - LS/2, LS, LS)
  }

  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 17px system-ui, sans-serif'
  ctx.fillText('i-sabi', W/2 - 22, BRD_CY - 2)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = 'bold 8px system-ui, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText('TICKETING', W/2 - 22, BRD_CY + 12)
  ctx.letterSpacing = '0px'

  // ── Event name: large, bold, centered ────────────────────────────────
  const eventName = (invoice.event || invoice.eventName || 'EVENT').toUpperCase()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 40px system-ui, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 12
  wrapText(ctx, eventName, W / 2, 116, W - 56, 46, 2)
  ctx.shadowBlur = 0

  // ── Bottom of header: date (left) | separator | ticket info (right) ──
  const dt = invoice.eventDate ? new Date(invoice.eventDate) : null
  const DATE_Y = HEADER_H - 126

  if (dt && !isNaN(dt)) {
    // Day label (green, small caps)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 10px system-ui, sans-serif'
    ctx.letterSpacing = '1.5px'
    ctx.fillText(DAYS[dt.getDay()].toUpperCase(), 28, DATE_Y)
    ctx.letterSpacing = '0px'
    // Day number (huge)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 62px system-ui, sans-serif'
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 6
    ctx.fillText(dt.getDate().toString(), 24, DATE_Y + 62)
    ctx.shadowBlur = 0
    // Month (green)
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 13px system-ui, sans-serif'
    ctx.letterSpacing = '1px'
    ctx.fillText(MONTHS[dt.getMonth()].toUpperCase(), 28, DATE_Y + 78)
    ctx.letterSpacing = '0px'
    // Year
    ctx.fillStyle = 'rgba(255,255,255,0.60)'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText(dt.getFullYear().toString(), 28, DATE_Y + 95)
  }

  // Vertical separator (dashed, green dots at ends)
  ctx.strokeStyle = 'rgba(34,197,94,0.35)'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 5])
  ctx.beginPath()
  ctx.moveTo(W / 2, DATE_Y - 6); ctx.lineTo(W / 2, DATE_Y + 102)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#22c55e'
  ctx.beginPath(); ctx.arc(W / 2, DATE_Y - 6, 3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W / 2, DATE_Y + 102, 3, 0, Math.PI * 2); ctx.fill()

  // Right side: ticket type + quantity
  const ticketType = invoice.ticketType || 'General Admission'
  const qty = invoice.numberOfTicket || 1
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.40)'
  ctx.font = 'bold 9px system-ui, sans-serif'
  ctx.letterSpacing = '1.5px'
  ctx.fillText('TICKET TYPE', W - 28, DATE_Y + 2)
  ctx.letterSpacing = '0px'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 15px system-ui, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 4
  ctx.fillText(ticketType, W - 28, DATE_Y + 22)
  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(255,255,255,0.50)'
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText(`${qty} Seat${qty !== 1 ? 's' : ''}`, W - 28, DATE_Y + 42)

  // ─── TICKET BODY (490 → 1000) ────────────────────────────────────────
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, HEADER_H, W, H - HEADER_H)

  // QR layout constants
  const QR_SIZE    = 162
  const QR_PAD     = 10
  const QR_CARD_DIM = QR_SIZE + QR_PAD * 2   // 182
  const qrCardX    = W / 2 - QR_CARD_DIM / 2
  const qrCardY    = HEADER_H + 48

  // "SCAN AT THE GATE" label (above QR)
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = 'bold 10px system-ui, sans-serif'
  ctx.letterSpacing = '3px'
  ctx.fillText('SCAN AT THE GATE', W / 2, HEADER_H + 28)
  ctx.letterSpacing = '0px'

  // Corner brackets (surround QR card)
  const BP = 8
  drawBrackets(ctx,
    qrCardX - BP, qrCardY - BP,
    QR_CARD_DIM + BP * 2, QR_CARD_DIM + BP * 2,
    18, 2.5, '#22c55e')

  // QR white card + glow shadow
  ctx.shadowColor = 'rgba(34,197,94,0.28)'
  ctx.shadowBlur  = 24
  rrPath(ctx, qrCardX, qrCardY, QR_CARD_DIM, QR_CARD_DIM, 12)
  ctx.fillStyle = '#ffffff'; ctx.fill()
  ctx.shadowBlur = 0

  if (qrSrc) {
    const src = qrSrc.startsWith('data:') ? qrSrc : `data:image/png;base64,${qrSrc}`
    const qrImg = new Image()
    qrImg.src = src
    await new Promise(r => { qrImg.onload = r; qrImg.onerror = r })
    ctx.drawImage(qrImg, qrCardX + QR_PAD, qrCardY + QR_PAD, QR_SIZE, QR_SIZE)
  }

  // ── Dashed divider + semicircle notches ──────────────────────────────
  const DIVIDER_Y = qrCardY + QR_CARD_DIM + 24   // 754
  ctx.save()
  ctx.setLineDash([5, 5])
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(28, DIVIDER_Y); ctx.lineTo(W - 28, DIVIDER_Y)
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#0a0a0a'
  ctx.beginPath(); ctx.arc(0, DIVIDER_Y, 14, -Math.PI / 2, Math.PI / 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W, DIVIDER_Y, 14, Math.PI / 2, -Math.PI / 2); ctx.fill()

  // ── Ticket number pill ───────────────────────────────────────────────
  const displayNum = invoice.ticketNumber || invoice.ticketId || fallbackId
  const PILL_H = 28
  const PILL_Y = DIVIDER_Y + 16            // 770
  const pillLabel = `#${displayNum}`
  ctx.font = 'bold 13px "Courier New", monospace'
  const PILL_W = ctx.measureText(pillLabel).width + 52
  const pillX = W / 2 - PILL_W / 2

  rrPath(ctx, pillX, PILL_Y, PILL_W, PILL_H, PILL_H / 2)
  ctx.fillStyle = '#191919'; ctx.fill()
  ctx.strokeStyle = 'rgba(34,197,94,0.42)'; ctx.lineWidth = 1.5; ctx.stroke()

  // Small ticket icon inside pill (left side)
  ctx.save()
  ctx.translate(pillX + 16, PILL_Y + PILL_H / 2)
  ctx.rotate(-Math.PI / 8)
  rrPath(ctx, -6, -4, 12, 8, 2); ctx.fillStyle = '#22c55e'; ctx.fill()
  ctx.fillStyle = '#191919'
  ctx.beginPath(); ctx.arc(-6, 0, 2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(6, 0, 2, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // Pill text
  ctx.fillStyle = '#22c55e'
  ctx.font = 'bold 13px "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(pillLabel, W / 2 + 8, PILL_Y + PILL_H / 2 + 5)

  // ── Detail rows (icon box | label | value) ───────────────────────────
  const ROWS_Y   = PILL_Y + PILL_H + 20    // 818
  const ROW_H    = 44
  const BOX_SIZE = 34
  const rows = [
    { label: 'ATTENDEE',    value: invoice.buyer || invoice.name || '—',  icon: 'person' },
    { label: 'TICKET',      value: `${invoice.ticketType || '—'}  ×  ${invoice.numberOfTicket || 1}`, icon: 'ticket' },
    { label: 'AMOUNT PAID', value: `₦${Number(invoice.total || invoice.amount || 0).toLocaleString()}`, icon: 'wallet' },
  ]

  rows.forEach(({ label, value, icon }, i) => {
    const ry = ROWS_Y + i * ROW_H
    const cy = ry + ROW_H / 2

    // Row divider (not before first row)
    if (i > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.055)'
      ctx.fillRect(28, ry, W - 56, 1)
    }

    // Icon box
    rrPath(ctx, 28, cy - BOX_SIZE / 2, BOX_SIZE, BOX_SIZE, 8)
    ctx.fillStyle = '#1d1d1d'; ctx.fill()

    const ix = 28 + BOX_SIZE / 2
    const iy = cy
    ctx.fillStyle = 'rgba(255,255,255,0.38)'

    if (icon === 'person') {
      ctx.beginPath(); ctx.arc(ix, iy - 5, 4, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(ix, iy + 7.5, 6, Math.PI, 0); ctx.fill()
    } else if (icon === 'ticket') {
      ctx.save(); ctx.translate(ix, iy); ctx.rotate(-Math.PI / 7)
      rrPath(ctx, -7, -4.5, 14, 9, 2.5); ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.fill()
      ctx.fillStyle = '#1d1d1d'
      ctx.beginPath(); ctx.arc(-7, 0, 2.5, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(7, 0, 2.5, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    } else {
      // Wallet
      rrPath(ctx, ix - 7, iy - 5.5, 14, 11, 2.5)
      ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.fill()
      rrPath(ctx, ix - 3, iy - 1, 10, 6, 2)
      ctx.fillStyle = '#1d1d1d'; ctx.fill()
      ctx.beginPath(); ctx.arc(ix + 3, iy + 2, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.50)'; ctx.fill()
    }

    // Label (dim, small caps, left-aligned after box)
    ctx.fillStyle = 'rgba(255,255,255,0.32)'
    ctx.font = 'bold 8.5px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.letterSpacing = '1px'
    ctx.fillText(label, 72, cy - 6)
    ctx.letterSpacing = '0px'

    // Value (bold white, right-aligned)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(value, W - 28, cy + 10)
  })

  // ── Footer ───────────────────────────────────────────────────────────
  const FOOTER_LINE_Y = H - 50
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(0, FOOTER_LINE_Y, W, 1)

  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.font = '9px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('i-sabi.com.ng  ·  Powered by i-Sabi Ticketing', W / 2, H - 22)

  // Green gradient bar at very bottom
  const barGrad = ctx.createLinearGradient(0, 0, W, 0)
  barGrad.addColorStop(0, '#22c55e'); barGrad.addColorStop(1, '#16a34a')
  ctx.fillStyle = barGrad
  ctx.fillRect(0, H - 7, W, 7)

  // ── Trigger download ─────────────────────────────────────────────────
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `isabi-ticket-${displayNum}.png`
  link.click()
}
