import React, { createRef, useEffect, useRef, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Meta, StoryFn } from '@storybook/react'

import { FeatureGroup, Map } from 'leaflet'
import { optionType } from '@/components/form'
import Mapa from '@/components/mapas/Mapa'
import { useForm } from 'react-hook-form'
import { useAlerts } from '@/hooks'
import { useDebouncedCallback } from 'use-debounce'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { InterpreteMensajes } from '@/utils'
import { FormInputAutocomplete } from '@/components/form/FormInputAutocomplete'
import MapaDibujar from '@/components/mapas/MapaDibujar'

interface AddressLeaflet {
  city: string
  county: string
  state: string
  country: string
  country_code: string
  tourism: string
  road: string
  village?: string
  neighbourhood: string
  city_district: string
  postcode: string
}

interface LeafletUbicacionType {
  place_id: string
  licence?: string
  osm_type?: string
  osm_id?: number
  boundingbox?: string[]
  lat: string
  lon: string
  display_name: string
  class?: string
  type?: string
  importance?: number
  icon?: string
  address?: AddressLeaflet
}

interface SearchType {
  zona: optionType
}

export default {
  title: 'Organismos/Mapas/Polígonos',
  component: Mapa,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          'Ejemplo de componente Mapa que utiliza la API de OpenStreetMaps para buscar y mostrar una ubicación de referencia en un mapa Leaflet. El componente incluye un campo de búsqueda de ubicación, permite agregar puntos de referencia haciendo clic en el mapa y utiliza varios paquetes y servicios de terceros para su implementación. También proporciona una opción para imprimir mensajes de alerta en caso de errores.',
      },
    },
  },
} as Meta

const Template: StoryFn = (args) => {
  const [zoom, setZoom] = useState<number | undefined>(15)
  const [centro, setCentro] = useState<number[] | undefined>()

  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = createRef<Map>()

  const { control, watch } = useForm<SearchType>({
    defaultValues: {},
  })

  const watchZona = watch('zona')

  const defaultOption = { key: '', value: '', label: '' }

  const [loadingAutoComplete, setLoadingAutoComplete] = useState<boolean>(false)
  const { Alerta } = useAlerts()
  const [defaultCategoriaOption, setDefaultCategoriaOption] =
    useState<optionType>(defaultOption)

  const [puntosMapaLeaflet, setPuntoMapaLeafletData] = useState<
    LeafletUbicacionType[]
  >([])

  const debounced = useDebouncedCallback(async (direccion: string) => {
    await obtenerUbicacionMapa(direccion)
  }, 1000)

  const actualizacionDireccion = (direccion: string) => {
    debounced(direccion)
  }

  const obtenerUbicacionMapa = async (
    direccion?: string,
    updateMapa: boolean = true
  ) => {
    try {
      setLoadingAutoComplete(true)
      const referencia = `Bolivia`

      const parametros = [referencia, direccion ?? '']

      const respuesta = await Servicios.peticionHTTP({
        url: `${Constantes.apiOpenStreetMap}/search`,
        params: {
          q: parametros.join(' '),
          format: 'json',
          addressdetails: '1',
          limit: '10',
        },
        headers: {
          'Accept-Language': 'es',
        },
        withCredentials: false,
      })
      if (updateMapa) setPuntoMapaLeafletData(respuesta.data)
    } catch (e) {
      imprimir(`Error al obtener puntos mapa: ${e}`)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingAutoComplete(false)
    }
  }

  const actualizarUbicacion = (select: optionType) => {
    try {
      const ubicacion: LeafletUbicacionType = JSON.parse(
        select.value != undefined ? select.value + '' : ''
      )
      const current = puntosMapaLeaflet.find((punto) =>
        `${select.key}`.includes(punto.place_id.toString())
      )
      if (current) {
        setDefaultCategoriaOption({
          key: `${current.place_id.toString()}`,
          value: current.display_name,
          label: `${current.display_name}`,
        })
      }
      setCentro([Number(ubicacion.lat), Number(ubicacion.lon)])
      setZoom(15)
    } catch (e) {
      imprimir('Error al actualizar ubicación', e)
    }
  }

  useEffect(
    () => {
      imprimir(typeof watchZona, watchZona)
      if (watchZona) {
        actualizarUbicacion(watchZona)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchZona]
  )

  /*
  -------------------- buscador de MAPA ------------------
  */

  return (
    <>
      <Grid container direction={'column'}>
        <Grid item>
          <FormInputAutocomplete
            id={'zona'}
            control={control}
            name={'zona'}
            label="Buscar zona de referencia"
            disabled={false}
            loading={loadingAutoComplete}
            options={puntosMapaLeaflet.map((punto) => ({
              key: `${punto.place_id.toString()}`,
              value: JSON.stringify(punto),
              label: `${punto.display_name}`,
            }))}
            onInputChange={(event, value) => {
              actualizacionDireccion(value)
            }}
            freeSolo
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <>{option.label}</>}
            isOptionEqualToValue={(option, value) =>
              option.value == value.value
            }
          />
        </Grid>
        <Box height={10} />
        <Grid item>
          <MapaDibujar
            mapRef={mapRef}
            featureGroupRef={featureGroupRef}
            onlyread={args.onlyRead}
            id={`mapa-poligonos-dibujar`}
            key={`mapa-poligonos-dibujar`}
            height={500}
            zoom={zoom}
            centro={centro}
            poligono={null}
          />
        </Grid>
        <Typography>{defaultCategoriaOption.value}</Typography>
      </Grid>
    </>
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  readonly: false,
}
