import { createRef, useEffect, useRef, useState } from 'react'

import { Meta, StoryFn } from '@storybook/react'

import G from 'geojson'
import { FeatureGroup, Map } from 'leaflet'
import MapaDibujar from '@/components/mapas/MapaDibujar'
import { calcularZoom, getCentro } from '@/components/mapas/GeoUtils'

const poligonoEjemplo: G.Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-66.172371, -17.359486],
        [-66.133232, -17.369316],
        [-66.142845, -17.380784],
        [-66.136665, -17.3952],
        [-66.147308, -17.399459],
        [-66.142159, -17.418787],
        [-66.126366, -17.434511],
        [-66.129799, -17.450232],
        [-66.154518, -17.430252],
        [-66.164131, -17.428287],
        [-66.169968, -17.409615],
        [-66.187134, -17.400442],
        [-66.178207, -17.382095],
        [-66.172371, -17.359486],
      ],
    ],
  },
}

export default {
  title: 'Moléculas/Mapas/Polígonos',
  component: MapaDibujar,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          'Componente que utiliza la biblioteca Leaflet para mostrar un mapa interactivo en una aplicación web. El componente acepta una serie de propiedades, como la ubicación central del mapa, los marcadores y la función de devolución de llamada para manejar los eventos del mapa. También se pueden utilizar las propiedades para personalizar la apariencia y el comportamiento del mapa. El componente utiliza diferentes componentes de Leaflet, como MapContainer, Marker, Popup, TileLayer, Tooltip y ZoomControl para construir el mapa y los marcadores.',
      },
    },
  },
} as Meta

const Template: StoryFn<typeof MapaDibujar> = (args) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<number[] | undefined>()
  const [puntos, setPuntos] = useState<Array<string[]>>([])

  const featureGroupRef = useRef<FeatureGroup | null>(null)
  const mapRef = createRef<Map>()

  useEffect(() => {
    if (
      args.poligono &&
      args.poligono.geometry &&
      args.poligono.geometry.type === 'Polygon' &&
      args.poligono.geometry.coordinates
    ) {
      const points = args.poligono.geometry.coordinates[0].map((coordinate) => [
        `${coordinate[0]}`,
        `${coordinate[1]}`,
      ])
      setPuntos([...points])
      const zoom: number = calcularZoom([
        ...args.poligono.geometry.coordinates[0],
      ])
      setZoom(zoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCentro(getCentro(puntos))
  }, [puntos])

  return (
    <>
      <MapaDibujar
        mapRef={mapRef}
        featureGroupRef={featureGroupRef}
        onlyread={args.onlyread}
        id={`mapa-poligonos-dibujar`}
        key={`mapa-poligonos-dibujar`}
        height={500}
        zoom={zoom}
        centro={centro}
        poligono={args.poligono}
      />
    </>
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  poligono: undefined,
  onlyread: false,
}

export const SoloLectura = Template.bind({})
SoloLectura.storyName = 'Solo lectura'
SoloLectura.args = {
  poligono: poligonoEjemplo,
  onlyread: true,
}
