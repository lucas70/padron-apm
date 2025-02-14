import { icon, Map } from 'leaflet'
import { Marker } from 'react-leaflet'
import { createRef } from 'react'
import { calcularZoom, getCentro } from '@/components/mapas/GeoUtils'
import Mapa from '@/components/mapas/Mapa'

export default function MyMap({
  height,
  width,
}: {
  height: number | string
  width: number | string
}) {
  const ICON = icon({
    iconRetinaUrl: '/leaflet/marker-icon.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    // iconSize: [40, 40],
    iconAnchor: [12.5, 41],
  })

  //mapa
  const mapRef = createRef<Map>()
  const zoom = calcularZoom([[-16.515953195512402, -68.13549041748048]])
  const centro = getCentro([[-16.515953195512402, -68.13549041748048]])

  return (
    <Mapa
      mapRef={mapRef}
      id="mapa"
      key={'mapa'}
      zoom={zoom}
      centro={centro}
      onClick={undefined}
      height={height}
      width={width}
      markers={
        <Marker
          key={'marker-queso'}
          icon={ICON}
          draggable={false}
          position={[-16.515953195512402, -68.13549041748048]}
        />
      }
    />
  )
}
