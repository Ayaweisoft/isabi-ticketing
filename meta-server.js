'use strict'
/**
 * Lightweight meta-tag server.
 * Nginx proxies every /:eventId request here (see nginx.conf) and passes
 * X-Is-Bot: 0|1.
 * - Bots  → return server-rendered HTML with correct og:image (event photo
 *           composited with the i-Sabi watermark, Instagram-style)
 * - Users → return the SPA index.html so React takes over
 */
const http = require('http')
const fs   = require('fs')

const API  = 'https://api.i-sabi.com.ng/api'
const SITE = 'https://ticketing.i-sabi.com.ng'

// Read once at startup; served from memory for all regular users
let INDEX = ''
try { INDEX = fs.readFileSync('/usr/share/nginx/html/index.html', 'utf8') } catch (e) {
  console.error('meta-server: could not read index.html', e.message)
}

const serveIndex = (res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(INDEX)
}

// HTML-escape to prevent XSS in meta tag values
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]))

http.createServer(async (req, res) => {
  // Nginx passes header 1 = social bot, 0 = regular user
  const isBot = req.headers['x-is-bot'] === '1'

  if (!isBot) return serveIndex(res)

  // Extract the event id/slug from the URL path — the real route (and the
  // link sent to event owners in the approval email, see event_control.js in
  // the server repo) is bare /:id, NOT /ticket/:id. Nginx (see nginx.conf)
  // only proxies here for a single top-level segment that isn't one of this
  // app's own routes, so no extra exclusion is needed here — accepts both
  // legacy 24-char ObjectId links and current slug links.
  const m = (req.url ?? '').match(/^\/([a-z0-9-]{1,80})(?:[/?#]|$)/i)
  if (!m) return serveIndex(res)

  const id = m[1]

  try {
    // /v2/get-event-by-id/:id resolves either shape (event_model.js's slug
    // field / utils/resolve-event.js on the server).
    const apiRes = await fetch(`${API}/v2/get-event-by-id/${id}`, {
      signal: AbortSignal.timeout(6000),
    })
    const data = await apiRes.json()
    const ev   = data.eventData ?? data.event ?? {}

    const title = esc(ev.eventName ? `${ev.eventName} | i-Sabi` : 'i-Sabi | Buy Event Tickets in Nigeria')
    const desc  = esc(ev.aboutEvent ?? `Get tickets for ${ev.eventName ?? 'this event'} on i-Sabi — Nigeria's trusted event platform.`)
    const url   = esc(`${SITE}/${ev.slug || id}`)

    // Composite the event's own cover photo with the i-Sabi watermark
    // (Instagram-style: the real content, with small platform branding
    // underneath) instead of showing the raw photo with no branding at all.
    // Falls back to the plain event photo (or the generic logo) if the
    // compositor is slow/unreachable — never let this block the preview.
    // Most real event photos are on Firebase Storage, not Cloudinary (a DB
    // survey found 73% on Firebase) — gating on Cloudinary only was
    // silently skipping compositing for most real events.
    let img = ev.image_url ?? `${SITE}/logo.png`
    if (ev.image_url && /^https:\/\/(res\.cloudinary\.com|firebasestorage\.googleapis\.com)\//.test(ev.image_url)) {
      try {
        const ogRes = await fetch(
          `${API}/og-image?source=${encodeURIComponent(ev.image_url)}&key=ticket_${id}`,
          { signal: AbortSignal.timeout(6000) },
        )
        if (ogRes.ok) {
          const ogData = await ogRes.json()
          if (ogData.url) img = ogData.url
        }
      } catch (composeErr) {
        console.error('meta-server: og-image compose failed for', id, composeErr.message)
      }
    }
    img = esc(img)

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${desc}">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="i-Sabi">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image"       content="${img}">
  <meta property="og:image:width"  content="1080">
  <meta property="og:image:height" content="1350">
  <meta property="og:url"         content="${url}">

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@isabi_ng">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image"       content="${img}">

  <!-- Redirect real browsers to the SPA immediately -->
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
  <p>Loading <a href="${url}">${esc(ev.eventName ?? 'event')} →</a></p>
</body>
</html>`)
  } catch (err) {
    // API failed — serve the SPA; client-side SEO is better than a broken page
    console.error('meta-server: API error for', id, err.message)
    serveIndex(res)
  }
}).listen(3001, '127.0.0.1', () => {
  console.log('meta-server listening on 127.0.0.1:3001')
})
