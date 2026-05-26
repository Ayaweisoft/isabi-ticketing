// Encode text safely for Cloudinary URL overlay params
// Rules: strip non-word chars, replace spaces with underscore, cap length
const ct = (s) =>
  (s || '')
    .replace(/[^\w\s\-\.]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50)

/**
 * Returns a Cloudinary URL with event details baked into the image as overlays.
 * Falls back to the raw image URL if the image is not hosted on Cloudinary.
 *
 * @param {object} event   - event object with eventName, startDate, image_url
 * @param {array}  tickets - ticket tier list for price range (optional)
 */
export const buildEventOgImage = (event, tickets = []) => {
  const src = event?.image_url
  const FALLBACK = 'https://ticketing.i-sabi.com.ng/logo.png'
  if (!src?.includes('res.cloudinary.com')) return src || FALLBACK

  // Parse: https://res.cloudinary.com/{cloud}/image/upload/{transforms?}/{version?}/{public_id}
  const m = src.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)$/)
  if (!m) return src

  const [, cloud, rest] = m

  // Strip any existing transformations / version prefix to get raw public ID
  const segs = rest.split('/')
  let start = 0
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i]
    if (/^v\d{5,}$/.test(seg) || seg.includes(',') || /^[cfwhtqelgjxybso]_/.test(seg)) {
      start = i + 1
    } else break
  }
  const publicId = segs.slice(start).join('/')
  if (!publicId) return src

  // ── Text content ──────────────────────────────────────────────────────────
  const name = ct(event.eventName)

  const date = ct(
    event.startDate
      ? new Date(event.startDate).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : ''
  )

  // Price range — no special chars, no ₦ (non-ASCII breaks Cloudinary URL)
  let price = ''
  const amounts = (tickets || []).map((t) => Number(t.amount)).filter((n) => n > 0)
  if (amounts.length) {
    const min = Math.min(...amounts)
    const max = Math.max(...amounts)
    price = ct(
      min === max
        ? `From NGN ${min.toLocaleString()}`
        : `NGN ${min.toLocaleString()} to ${max.toLocaleString()}`
    )
  }

  // ── Vertical stacking positions (bottom-up) ───────────────────────────────
  const lineCount = [price, date, name].filter(Boolean).length
  const nameY  = lineCount === 3 ? 160 : lineCount === 2 ? 106 : 50
  const dateY  = price ? 96 : 48
  const priceY = 48

  // ── Cloudinary transformation chain ──────────────────────────────────────
  const trs = [
    // 1. Crop to standard 1200×630 OG size, smart gravity, best quality
    'w_1200,h_630,c_fill,g_auto,f_jpg,q_auto',
    // 2. Event name — white bold, bottom-left, word-wrap to 780px
    name  && `l_text:Arial_52_bold:${name},co_white,g_south_west,x_36,y_${nameY},w_780,c_fit`,
    // 3. Date — green accent
    date  && `l_text:Arial_32:${date},co_rgb:22c55e,g_south_west,x_38,y_${dateY}`,
    // 4. Price range — white, slightly muted
    price && `l_text:Arial_28:${price},co_white,o_75,g_south_west,x_38,y_${priceY}`,
    // 5. i-Sabi brand watermark — top-right, small
    'l_text:Arial_22_bold:i-Sabi,co_white,o_75,g_north_east,x_16,y_18',
  ].filter(Boolean).join('/')

  return `https://res.cloudinary.com/${cloud}/image/upload/${trs}/${publicId}`
}
