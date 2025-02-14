'use client'

import { imprimir } from '@/utils/imprimir'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Suspense } from 'react'

declare global {
  interface Window {
    _paq: any
  }
}

// variables de entorno de matomo
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

const isExcludedUrl = (url: string, patterns: string[]): boolean => {
  let excluded = false
  patterns.forEach((pattern) => {
    if (new RegExp(pattern).exec(url) !== null) {
      excluded = true
    }
  })
  return excluded
}

interface InitSettings {
  url?: string
  siteId?: string
  jsTrackerFile?: string
  phpTrackerFile?: string
  excludeUrlsPatterns?: string[]
  onRouteChangeStart?: (path: string) => void
  onRouteChangeComplete?: (path: string) => void
  onInitialization?: () => void
}

interface Dimensions {
  dimension1?: string
  dimension2?: string
  dimension3?: string
  dimension4?: string
  dimension5?: string
  dimension6?: string
  dimension7?: string
  dimension8?: string
  dimension9?: string
  dimension10?: string
}

// to push custom events
export function push(
  args: (
    | Dimensions
    | number[]
    | string[]
    | number
    | string
    | null
    | undefined
  )[]
): void {
  if (!window._paq) {
    window._paq = []
  }
  window._paq.push(args)
}


function Tracker({
  url = MATOMO_URL,
  siteId = MATOMO_SITE_ID,
  jsTrackerFile = 'matomo.js',
  phpTrackerFile = 'matomo.php',
  excludeUrlsPatterns = [],
  onRouteChangeStart = undefined,
  onRouteChangeComplete = undefined,
  onInitialization = undefined,
}: InitSettings) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    window._paq = window._paq !== null ? window._paq : []
    if (!url) {
      return
    }
    // order is important -_- so campaign are detected
    const excludedUrl =
      typeof window !== 'undefined' &&
      isExcludedUrl(window.location.pathname, excludeUrlsPatterns)

    if (onInitialization) onInitialization()

    push(['enableHeartBeatTimer'])
    push(['disableQueueRequest'])
    push(['enableLinkTracking'])
    push(['setTrackerUrl', `${url}/${phpTrackerFile}`])
    push(['setSiteId', siteId])

    if (excludedUrl) {
      if (typeof window !== 'undefined') {
        imprimir(`matomo: exclude track ${window.location.pathname}`)
      }
    } else {
      push(['trackPageView'])
    }

    /**
     * for initial loading we use the location.pathname
     * as the first url visited.
     * Once user navigate across the site,
     * we rely on Router.pathname
     */
    const scriptElement = document.createElement('script')
    const refElement = document.getElementsByTagName('script')[0]
    scriptElement.type = 'text/javascript'
    scriptElement.async = true
    scriptElement.defer = true
    scriptElement.src = `${url}/${jsTrackerFile}`
    if (refElement.parentNode) {
      refElement.parentNode.insertBefore(scriptElement, refElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!pathname) {
      return
    }

    if (!prevPath) {
      return setPrevPath(pathname)
    }

    push(['setReferrerUrl', `${prevPath}`])
    push(['setCustomUrl', pathname])
    push(['deleteCustomVariables', 'page'])
    setPrevPath(pathname)
    if (onRouteChangeStart) onRouteChangeStart(pathname)
    // In order to ensure that the page title had been updated,
    // we delayed pushing the tracking to the next tick.
    setTimeout(() => {
      push(['setDocumentTitle', document.title])
      if (!!searchParams) {
        push(['trackSiteSearch', searchParams.get('keyword') ?? ''])
      } else {
        push(['trackPageView'])
      }
    }, 0)

    if (onRouteChangeComplete) onRouteChangeComplete(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

const MatomoTracker = (props: InitSettings) => {
  return (
    <Suspense fallback={null}>
      <Tracker {...props} />
    </Suspense>
  )
}

export default MatomoTracker
