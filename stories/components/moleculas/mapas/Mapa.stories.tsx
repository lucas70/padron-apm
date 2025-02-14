import { MutableRefObject, createRef, useEffect, useRef, useState } from 'react'

import { Meta, StoryFn } from '@storybook/react'
import { DragEndEvent, DragEndEventHandlerFn, Map, icon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Box, Typography } from '@mui/material'
import Mapa from '@/components/mapas/Mapa'
import { calcularZoom, getCentro } from '@/components/mapas/GeoUtils'

const ICON = icon({
  iconRetinaUrl: '/leaflet/marker-icon.png',

  iconUrl: '/leaflet/marker-icon.png',

  shadowUrl: '/leaflet/marker-shadow.png',
  // iconSize: [40, 40],
  iconAnchor: [12.5, 41],
})

const puntosExample: Array<Array<string>> = [
  ['-16.5000', ' -68.1500'],
  ['-17.7833', '-63.1833'],
  ['-17.3895', '-66.1568'],
  ['-19.0333', '-65.2627'],
  ['-19.5833', '-65.7500'],
  ['-17.9833', '-67.1500'],
  ['-21.5355', '-64.7296'],
  ['-14.8333', '-64.9000'],
  ['-10.9833', '-66.1000'],
  ['-21.9600', '-63.6500'],
]

export default {
  title: 'Moléculas/Mapas/Mapa',
  component: Mapa,
  argTypes: {},
  parameters: {
    docs: {
      status: {
        type: 'beta',
      },
      description: {
        component:
          'Componente que utiliza la biblioteca Leaflet para mostrar un mapa interactivo en una aplicación web. El componente acepta una serie de propiedades, como la ubicación central del mapa, los marcadores y la función de devolución de llamada para manejar los eventos del mapa. También se pueden utilizar las propiedades para personalizar la apariencia y el comportamiento del mapa. El componente utiliza diferentes componentes de Leaflet, como MapContainer, Marker, Popup, TileLayer, Tooltip y ZoomControl para construir el mapa y los marcadores.',
      },
    },
  },
} as Meta

const Template: StoryFn = (args) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<number[] | undefined>()
  const [puntos, setPuntos] = useState<Array<string[]>>([])

  const mapRef = createRef<Map>()
  const markerRefs: MutableRefObject<never[]> = useRef([])

  const agregarPunto = (latlng: number[]) => {
    setPuntos([[latlng[0].toString(), latlng[1].toString()]])
  }

  const dragEvent: DragEndEventHandlerFn = (e: DragEndEvent) => {
    const marker = e.target
    if (marker != null) {
      const lat = marker.getLatLng().lat
      const lng = marker.getLatLng().lng
      agregarPunto([lat, lng])
    }
  }

  const clickMarker = (index: number) => {
    const marker = puntos[index]
    mapRef.current?.flyTo([Number(marker[0]) + 0.005, Number(marker[1])], 15)
  }

  if (markerRefs.current.length !== puntos.length) {
    markerRefs.current = puntos.map(
      (_, i) => markerRefs.current[i] || createRef()
    )
  }

  const Markers = () =>
    puntos
      .filter((punto) => !isNaN(Number(punto[0])) && !isNaN(Number(punto[1])))
      .map((punto, index) => (
        <Marker
          key={`${index}-marker`}
          icon={ICON}
          draggable={puntos.length < 2}
          ref={markerRefs.current[index]}
          eventHandlers={{
            dragend: (e) => dragEvent(e),
            click: () => clickMarker(index),
          }}
          position={[Number(punto[0]), Number(punto[1])]}
        />
      ))

  useEffect(() => {
    if (args.puntos) {
      setPuntos([...args.puntos])
      const zoom: number = calcularZoom([...args.puntos])
      setZoom(zoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCentro(getCentro(puntos))
  }, [puntos])

  return (
    <>
      <Mapa
        mapRef={mapRef}
        id="mapa"
        key={'mapa'}
        zoom={zoom}
        centro={centro}
        onClick={puntos.length < 2 ? agregarPunto : undefined}
        markers={<Markers />}
      />
    </>
  )
}

const Template2: StoryFn = (args) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<number[] | undefined>()
  const [puntos, setPuntos] = useState<Array<string[]>>([])

  const mapRef = createRef<Map>()
  const markerRefs: MutableRefObject<never[]> = useRef([])

  const agregarPunto = (latlng: number[]) => {
    setPuntos([[latlng[0].toString(), latlng[1].toString()]])
  }

  const dragEvent: DragEndEventHandlerFn = (e: DragEndEvent) => {
    const marker = e.target
    if (marker != null) {
      const lat = marker.getLatLng().lat
      const lng = marker.getLatLng().lng
      agregarPunto([lat, lng])
    }
  }

  if (markerRefs.current.length !== puntos.length) {
    markerRefs.current = puntos.map(
      (_, i) => markerRefs.current[i] || createRef()
    )
  }

  const Markers = () =>
    puntos
      .filter((punto) => !isNaN(Number(punto[0])) && !isNaN(Number(punto[1])))
      .map((punto, index) => (
        <Marker
          key={`${index}-marker`}
          icon={ICON}
          draggable={puntos.length < 2}
          ref={markerRefs.current[index]}
          eventHandlers={{
            dragend: (e) => dragEvent(e),
          }}
          position={[Number(punto[0]), Number(punto[1])]}
        >
          <Box sx={{ p: 10 }}>
            <Popup offset={[0, -40]}>
              <Typography>Marcador de ejemplo</Typography>
            </Popup>
          </Box>
        </Marker>
      ))

  useEffect(() => {
    if (args.puntos) {
      setPuntos([...args.puntos])
      const zoom: number = calcularZoom([...args.puntos])
      setZoom(zoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCentro(getCentro(puntos))
  }, [puntos])

  return (
    <>
      <Mapa
        mapRef={mapRef}
        id="mapa"
        key={'mapa'}
        zoom={zoom}
        centro={centro}
        onClick={puntos.length < 2 ? agregarPunto : undefined}
        markers={<Markers />}
      />
    </>
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  puntos: [],
}

export const SoloLectura = Template.bind({})
SoloLectura.storyName = 'Solo lectura'
SoloLectura.args = {
  puntos: puntosExample,
}

export const SoloLecturaConTooltip = Template2.bind({})
SoloLecturaConTooltip.storyName = 'Solo lectura con tooltip'
SoloLecturaConTooltip.args = {
  puntos: puntosExample,
}

const Template3: StoryFn = (args) => {
  const [zoom, setZoom] = useState<number | undefined>()
  const [centro, setCentro] = useState<number[] | undefined>()
  const [puntos, setPuntos] = useState<Array<string[]>>([])

  const mapRef = createRef<Map>()
  const markerRefs: MutableRefObject<never[]> = useRef([])

  const agregarPunto = (latlng: number[]) => {
    setPuntos([[latlng[0].toString(), latlng[1].toString()]])
  }

  const dragEvent: DragEndEventHandlerFn = (e: DragEndEvent) => {
    const marker = e.target
    if (marker != null) {
      const lat = marker.getLatLng().lat
      const lng = marker.getLatLng().lng
      agregarPunto([lat, lng])
    }
  }

  if (markerRefs.current.length !== puntos.length) {
    markerRefs.current = puntos.map(
      (_, i) => markerRefs.current[i] || createRef()
    )
  }

  const Markers = () =>
    puntos
      .filter((punto) => !isNaN(Number(punto[0])) && !isNaN(Number(punto[1])))
      .map((punto, index) => (
        <Marker
          key={`${index}-marker`}
          icon={ICON}
          draggable={puntos.length < 2}
          ref={markerRefs.current[index]}
          eventHandlers={{
            dragend: (e) => dragEvent(e),
          }}
          position={[Number(punto[0]), Number(punto[1])]}
        >
          <Box sx={{ p: 10 }}>
            <Popup offset={[0, -40]}>
              <Typography>{punto[2]}</Typography>
            </Popup>
          </Box>
        </Marker>
      ))

  useEffect(() => {
    if (args.puntos) {
      setPuntos([...args.puntos])
      const zoom: number = calcularZoom([...args.puntos])
      setZoom(zoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCentro(getCentro(puntos))
  }, [puntos])

  return (
    <>
      <Mapa
        mapRef={mapRef}
        id="mapa"
        key={'mapa'}
        zoom={zoom}
        centro={centro}
        onClick={puntos.length < 2 ? agregarPunto : undefined}
        markers={<Markers />}
      />
    </>
  )
}

const puntosTuristicosBolivia: Array<Array<string>> = [
  //La Paz
  ['-15.8133', ' -69.0930', 'lago titicaca - La Paz'], //lago titicaca
  ['-15.8328', ' -67.5647', 'Coroico - La Paz'], //coroico
  ['-16.0418', ' -69.0689', 'Isla de la Luna - La Paz'], //Isla de la Luna
  ['-16.0189', ' -69.1723', 'Isla del Sol - La Paz'], //Isla del Sol
  //Santa Cruz
  ['-17.7841', ' -63.1816', 'Catedral Metropolitana - Santa Cruz'], //Catedral Metropolitana Basílica Menor de San Lorenzo de Santa Cruz
  ['-17.77', ' -63.069', 'Jardín Botánico de Santa Cruz de la Sierra'], //Jardín Botánico de Santa Cruz de la Sierra
  ['-17.7672', ' -63.2508', 'Biocentro Güembé - Santa Cruz'], //Biocentro Güembé
  ['-17.9519', '-63.1525', 'Parque Regional Lomas de Arena - Santa Cruz'], //Parque Regional Lomas de Arena,
  ['-17.7755', '-63.235219', 'Centro cultural casa Melchor Pinto - Santa Cruz'], //Centro cultural casa Melchor Pinto
  ['-18.179444444444', ' -63.875555555556', 'Samaipata - Santa Cruz'], //Samaipata
  ['-17.78333333', '-63.98333333', 'Parque Nacional Amboró - Santa Cruz'], //
  ['-17.75', '-63.433333', 'Porongo - Santa Cruz'], //Porongo Santa Cruz
  ['-17.753888888889', '-62.996944444444', 'Cotoca - Santa Cruz'], //Cotoca de Santa Cruz
  [
    '-17.7547226',
    '-62.9990978',
    'Catedral de la Purísima Concepción de la Virgen De Cotoca Santa Cruz',
  ], //Catedral de la Purísima Concepción de la Virgen De Cotoca Santa Cruz
  //Beni
  ['-14.8868986', '-64.8966014', 'Laguna Suárez - Beni'], //Laguna Suárez - Beni
  ['-14.2991261', '-67.2347544', 'Laguna Copaiba Reyes - Beni'], //Laguna Copaiba Reyes - Beni
  ['-14.442222222222', '-67.528333333333', 'Rurrenabaque - Beni'], //Rurrenabaque - Beni
  ['-14.833333333333', '-64.9', 'Trinidad - Beni'], //Trinidad - Beni
  ['-11.005', '-66.066111111111', 'Riberalta - Beni'], //Riberalta - Beni
  ['-10.826666666667', '-65.356666666667', 'Guayaramerin - Beni'], //Guayaramerin - Beni
  ['-14.994444444444', '-65.640277777778', 'San Ignacio de Moxos - Beni'], //San Ignacio de Moxos - Beni
  ['-14.7616551', '-64.9645078', 'Loma Suárez - Beni'], //Loma Suárez - Beni
  ['-13.744444444444', '-65.426944444444', 'Santa Ana del Yacuma dep.Beni'], //Santa Ana del Yacuma dep.Beni
  ['-14.8117352', '-64.8960481', 'Museo Ictícola del Beni'], //Museo Ictícola del Beni
  ['-14.8165058', '-64.9041018', 'Museo Kenneth Lee - Beni'], //Museo Kenneth Lee - Beni
  //Pando
  ['11.91666667', '-68.08333333', 'Reserva Nacional Manuripi - Pando'], //Reserva Nacional Manuripi - Pando
  ['-11.0314933', '-68.7639441', 'Monumento a los Héroes de Bahía - Pando'], //Monumento a los Héroes de Bahía - Pando
  ['-11.0308847', '-68.7633691', 'Monumento "El Carretón - Pando'], //Monumento "El Carretón - Pando
  ['-11.0174966', '-68.7528374', 'Iglesia Catedral de Pando - Pando'], //Iglesia Catedral de Pando - Pando
  ['-11.0302683', '-68.7635216', 'Parque Piñata - Pando'], //Parque Piñata - Pando
  ['-11.036697', '-66.1341333', 'Las Piedras - Pando'], //Las Piedras - Pando
  //Tarija
  ['-21.5324879', '-64.7340014', 'Casa Dorada - Tarija'], //Casa Dorada - Tarija
  ['-21.5354576', '-64.7321286', 'Plazuela Sucre - La Madrid - Tarija'], //Plazuela Sucre - La Madrid - Tarija
  [
    '-21.986',
    '-64.34',
    'Reserva Nacional de flora y fauna de Tariquía - Tarija',
  ], //Reserva Nacional de flora y fauna de Tariquía - Tarija
  ['-21.534271', '-64.7438985', 'Mirador de los Sueños - Tarija'], //Mirador de los Sueños - Tarija
  ['-21.585', '-64.6602778', 'Bodega de Campos de Solana - Tarija'], //Bodega de Campos de Solana - Tarija
  ['-21.5330556', '-64.7355556', 'Catedral de San Bernardo de Tarija - Tarija'], //Catedral de San Bernardo de Tarija - Tarija
  ['-21.4980851', '-64.7935932', 'Coimata - Tarija'], //Coimata - Tarija
  ['-21.5992892', '-64.7384676', 'Lago San Jacinto - Tarija'], //Lago San Jacinto - Tarija
  ['-21.4004501', '-64.8591404', 'Chorros de Marquiri - Tarija'], //Chorros de Marquiri - Tarija
  ['-21.5374102', '-64.736708', 'Parque La Costanera - Tarija'], //Parque La Costanera - Tarija
  ['-21.5344444', '-64.7269444', 'Castillo Azul Moises Navajas - Tarija'], //Castillo Azul Moises Navajas - Tarija
  ['-21.5964686', '-64.741213', 'Represa San Jacinto - Tarija'], //Represa San Jacinto - Tarija
  //cochabamba
  [
    '-17.38425',
    '-66.134955555556',
    'Monumento Cristo de la Concordia - Cochabamba',
  ], //Monumento Cristo de la Concordia - Cochabamba
  ['-17.3937', '-66.157', 'Plaza Metropolitana 14 de Septiembre - Cachabamba'], //Plaza Metropolitana 14 de Septiembre - Cachabamba
  ['-17.3748328', '-66.1531461', 'Centro "Simon I. Patiño" - Cochabamba'], //Centro "Simon I. Patiño" - Cochabamba
  ['-17.3865082', '-66.1628702', 'Parque De la Familia - Cochabamba'], //Parque De la Familia - Cochabamba
  ['-17.3764078', '-66.2737282', 'Parque de Aves Agroflori - Cochabamba'], //Parque de Aves Agroflori - Cochabamba
  ['-17.3898763', '-66.1580801', 'Museo Convento Santa Teresa - Cochabamba'], //Museo Convento Santa Teresa - Cochabamba
  [
    '-17.39453333',
    '-66.15713889',
    'Catedral Metropolitana Basílica de San Sebastián - Cochabamba',
  ], //Catedral Metropolitana Basílica de San Sebastián - Cochabamba
  ['-17.55', '-66.066666666667', 'Laguna La Angostura - Cochabamba'], //Laguna La Angostura - Cochabamba
  ['-17.2861721', '-66.3933554', 'Tunari Peak dep.Cochabamba'], //Tunari Peak dep.Cochabamba
  ['-17.605', '-65.415833', 'Incallajta - Cochabamba'], //Incallajta - Cochabamba
  ['-17.266666666667', '-65.9', 'Laguna Corani - Cochabamba'], //Laguna Corani - Cochabamba
  [
    '-17.3954319',
    '-66.1572975',
    'Museo Arqueológico de la Universidad - Cochabamba',
  ], //Museo Arqueológico de la Universidad - Cochabamba
  //oruro
  ['-20.2030', ' -67.5164', 'salar de uyuni - Oruro'], //salar de uyuni - Oruro
  ['-17.9666', '-67.1191', 'Monumento a la Virgen del Socavón - Oruro'], //Monumento a la Virgen del Socavon - Oruro
  ['-18.08333333', '-68.91666667', 'Parque Natural Sajama - Oruro'], //Sajama National Park and Natural Integrated Management Area - Oruro
  ['-17.9674594', '-67.1189644', 'SANTUARIO DE LA VIRGEN DEL SOCAVÓN - Oruro'], //SANTUARIO DE LA VIRGEN DEL SOCAVÓN - Oruro
  ['-17.9514146', '-67.1108584', 'Plaza Sebastian Pagador - Oruro'], //Plaza Sebastian Pagador - Oruro
  ['-17.9269127', '-67.1184916', 'Casco del Minero - Oruro'], //Casco del Minero - Oruro
  ['-17.9616239', '-67.1102039', 'Parque de la Unión Nacional - Oruro'], //Parque de la Unión Nacional - Oruro
  [
    '-17.9813632',
    '-67.1225227',
    'Museo Nacional Antropológico Eduardo López Rivas - Oruro',
  ], //Museo Nacional Antropológico Eduardo López Rivas - Oruro
  ['-17.9603904', '-67.1101212', 'Iglesia de San Gerardo - Oruro'], //Iglesia de San Gerardo - Oruro
  ['-18.17194444', '-67.01972222', 'Machacamarca - Oruro'], //Machacamarca - Oruro
  ['-19.1952689', '-67.0503544', 'Pampa Aullagas - Oruro'], //Pampa Aullagas - Oruro
  ['-17.8833327', '-67.033333', 'Capachos - Oruro'], //Capachos - Oruro
  ['-17.9671898', '-67.1188659', 'Museo del Socavón - Oruro'], //Museo del Socavón - Oruro
  //Potosí
  [
    '-19.58861111',
    '-65.75416667',
    'Casa Nacional de Moneda de Bolivia, - Potosí',
  ], //Casa Nacional de Moneda de Bolivia, - Potosí
  ['-18.1', '-65.7667', 'Parque Nacional Torotoro - Potosí'], //Parque Nacional Torotoro - Potosí
  [
    '-19.5865442',
    '-65.7548738',
    'Iglesia de "San Lorenzo de Carangas" - Potosí',
  ], //Iglesia de "San Lorenzo de Carangas" - Potosí
  [
    '-19.58845833',
    '-65.75269444',
    'Catedral Basílica de Nuestra Señora de La Paz, Potosí - Potosí',
  ], //Catedral Basílica de Nuestra Señora de la Paz, Potosí - Potosí
  ['-19.618901', '-65.749687', 'Cerro Rico - Potosí'], //Cerro Rico - Potosí
  ['-19.4674166', '-65.7945857', 'Ojo del Inca - Potosí'], //Ojo del Inca - Potosí
  ['-17.8833327', '-67.033333', 'Capachos - Oruro'], //Capachos - Oruro
  ['-17.9671898', '-67.1188659', 'Museo del Socavón - Oruro'], //Museo del Socavón - Oruro
  //Sucre
  ['-19.0476001', '-65.2602402', 'Casa de la Libertad - Sucre'], //Casa de la Libertad - Sucre
  ['-19.0490073', '-65.2564978', 'Convento santa clara de Asis - Sucre'], //Convento santa clara de Asis - Sucre
  [
    '-19.0488211',
    '-65.2599672',
    'Catedral de nuestra señora de Guadalupe - Sucre',
  ], //Catedral de nuestra señora de Guadalupe - Sucre
  [
    '-18.6085867',
    '-64.8952961',
    'Área natural de manejo integrado El Palmar - Sucre',
  ], //Área natural de manejo integrado El Palmar - Sucre
  ['-19.006464', '-65.2362161', 'Parque Cretácico - Sucre'], //Parque Cretácico - Sucre
]
export const LugaresTuristicosBolivia = Template3.bind({})
LugaresTuristicosBolivia.storyName = 'Lugares Turísticos'
LugaresTuristicosBolivia.args = {
  puntos: puntosTuristicosBolivia,
}
