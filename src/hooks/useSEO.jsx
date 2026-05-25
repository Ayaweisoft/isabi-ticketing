import { useEffect } from 'react'

const DEFAULT_TITLE = 'i-Sabi | Discover Events & Buy Tickets in Nigeria'
const DEFAULT_DESC = "Discover concerts, festivals, and events in Nigeria. Buy tickets securely on i-Sabi — Nigeria's trusted event ticketing platform."
const DEFAULT_IMAGE = 'https://ticketing.i-sabi.com.ng/logo.png'

const setMeta = (attr, key, value) => {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

const setLink = (rel, href) => {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export const useSEO = ({ title, description, image, url, type = 'website' } = {}) => {
  useEffect(() => {
    const t = title ? `${title} | i-Sabi` : DEFAULT_TITLE
    const d = description || DEFAULT_DESC
    const img = image || DEFAULT_IMAGE
    const u = url || window.location.href

    document.title = t

    // Standard meta
    setMeta('name', 'description', d)
    setMeta('name', 'robots', 'index, follow')

    // Open Graph
    setMeta('property', 'og:title', t)
    setMeta('property', 'og:description', d)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:url', u)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'i-Sabi')

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', t)
    setMeta('name', 'twitter:description', d)
    setMeta('name', 'twitter:image', img)
    setMeta('name', 'twitter:site', '@isabi_ng')

    // Canonical
    setLink('canonical', u)
  }, [title, description, image, url, type])
}
