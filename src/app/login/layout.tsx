'use client'
import React, { ReactNode, Suspense } from 'react'
import { NavbarLogin } from '@/components/navbars/NavbarLogin'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { siteName } from '@/utils'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <title>{`${siteName()}`}</title>
      <Box sx={{ display: 'flex' }}>
        <NavbarLogin />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar />
          <Suspense fallback={<FullScreenLoading mensaje={'Cargando...'} />}>
            {children}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}
