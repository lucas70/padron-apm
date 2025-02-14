'use client'
import { useEffect } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { delay, guardarCookie, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Box } from '@mui/material'
import { ParsedUrlQuery } from 'querystring'
import { useAlerts } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import url from 'url'

export default function CiudadaniaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { cargarUsuarioManual } = useAuth()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const autorizarCiudadania = async (parametros: ParsedUrlQuery) => {
    try {
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/ciudadania-autorizar`,
        body: {},
        params: parametros,
        headers: {
          accept: 'application/json',
        },
      })

      if (respuesta?.url) {
        const error = url.parse(respuesta.url, true)
        Alerta({
          mensaje: `${error?.query?.mensaje || 'Error en autenticación'}`,
          variant: 'error',
        })
        await delay(2000)
        window.location.href = respuesta?.url
      }

      imprimir(`Sesión Autorizada`, respuesta)
      guardarCookie('token', respuesta.access_token)
      await cargarUsuarioManual()
    } catch (e) {
      imprimir(`Error al autorizar sesión`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })

      mostrarFullScreen()
      await delay(1000)
      router.replace('/login')
      ocultarFullScreen()
    }
  }

  const validar = async () => {
    const parametros = Object.fromEntries(searchParams.entries())
    imprimir(`parámetros: `, parametros)

    if (Object.keys(parametros).length == 0 || searchParams.has('error')) {
      router.replace('/login')
      return
    }

    await delay(1000)
    await autorizarCiudadania(parametros)
  }

  useEffect(() => {
    validar().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box minHeight="100vh">
      <FullScreenLoading mensaje={'Ingresando con Ciudadanía'} />
    </Box>
  )
}
