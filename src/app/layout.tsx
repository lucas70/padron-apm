import React, { ReactNode, Suspense } from 'react'
import ThemeRegistry from '@/themes/ThemeRegistry'
import { FullScreenLoadingProvider } from '@/context/FullScreenLoadingProvider'
import AlertProvider from '@/context/AlertProvider'
import DebugBanner from '@/components/utils/DebugBanner'
import { AuthProvider } from '@/context/AuthProvider'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import MatomoTracker from '@/context/MatomoTracker'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MatomoTracker />
        <ThemeRegistry>
          <FullScreenLoadingProvider>
            <AlertProvider>
              <DebugBanner />
              <AuthProvider>
                <Suspense
                  fallback={<FullScreenLoading mensaje={'Cargando...'} />}
                >
                  {children}
                </Suspense>
              </AuthProvider>
            </AlertProvider>
          </FullScreenLoadingProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
