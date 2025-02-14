import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet'
import { Map } from 'leaflet'
import { ReactNode, RefObject, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

export interface MapaProps {
  mapRef: RefObject<Map>
  centro?: number[]
  onZoomed?: (zoom: number, center: number[]) => void
  onClick?: (center: number[], zoom: number) => void
  height?: number | string
  width?: number | string
  zoom?: number
  id: string
  children?: ReactNode
  markers?: ReactNode
  zoomControl?: boolean
  scrollWheelZoom?: boolean
  maxZoom?: number
}

const Mapa = ({
  mapRef,
  markers,
  centro = [-17.405356227442883, -66.15823659326952],
  height = 400,
  width = '100%',
  onClick,
  id,
  zoom = 6,
  maxZoom = 19,
  scrollWheelZoom = false,
  zoomControl = false,
}: MapaProps) => {
  const ChangeMapView = () => {
    const map = useMap()
    map.flyTo([centro[0], centro[1]], zoom)
    const mapEvents = useMapEvents({
      click: (e) => {
        if (onClick) {
          onClick([e.latlng.lat, e.latlng.lng], mapEvents.getZoom())
        }
      },
    })
    return null
  }

  useEffect(() => {
    if (mapRef?.current) {
      mapRef?.current.flyTo([centro[0], centro[1]], zoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  return (
    <>
      <div>
        <MapContainer
          id={id}
          ref={mapRef}
          maxZoom={maxZoom}
          center={[Number(centro[0]), Number(centro[1])]}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          zoomControl={zoomControl}
          style={{ height: height, width: width }}
        >
          <ChangeMapView />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomControl
            zoomInTitle="Acercar"
            zoomOutTitle="Alejar"
            position={'bottomright'}
          />
          {markers}
        </MapContainer>
        {/* <Typography>{`${[Number(centro[0]), Number(centro[1])]}`}</Typography> */}
      </div>
    </>
  )
}
export default Mapa
