import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet'

import { Map } from 'leaflet'
import { RefObject, useEffect } from 'react'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'
import { FeatureCollection, Feature } from 'geojson'

export interface DibujarMapaProps {
  mapRef: RefObject<Map>
  featureGroupRef: RefObject<L.FeatureGroup>
  onlyread?: boolean
  centro?: number[]
  poligono: Feature | null
  areaPermitida?: Feature | null
  onClick?: (center: number[], zoom: number) => void
  getPoligonos?: (poligonos: Feature[]) => void
  height?: number
  zoom?: number
  id: string
}

const MapaDibujar = ({
  mapRef,
  featureGroupRef,
  centro = [-17.405356227442883, -66.15823659326952],
  onlyread = false,
  areaPermitida,
  poligono,
  height = 500,
  onClick,
  getPoligonos,
  id,
  zoom = 8,
}: DibujarMapaProps) => {
  function ChangeMapView() {
    const map = useMap()
    map.setView([centro[0], centro[1]], zoom)

    const mapEvents = useMapEvents({
      click: (e) => {
        if (onClick) {
          onClick([e.latlng.lat, e.latlng.lng], mapEvents.getZoom())
        }
      },
    })
    return null
  }

  const retornarPoligonos = () => {
    // Obtener todas las capas de características dentro del FeatureGroup
    const featureGroup = featureGroupRef.current
    if (featureGroup?.getLayers()) {
      const layers = featureGroup.toGeoJSON() as FeatureCollection
      const poligonos = layers.features.map((layer: Feature) => layer)

      if (getPoligonos) {
        getPoligonos(poligonos)
      }
    }
  }

  useEffect(() => {
    //botones
    L.drawLocal.draw.toolbar.buttons.polygon = 'Dibujar polígono'
    L.drawLocal.draw.toolbar.buttons.rectangle = 'Dibujar rectángulo'
    L.drawLocal.edit.toolbar.buttons.edit = 'editando'
    L.drawLocal.edit.toolbar.buttons.remove = 'Borrar'

    L.drawLocal.draw.toolbar.actions.title = 'Cancelar dibujo'
    L.drawLocal.draw.toolbar.actions.text = 'Cancelar '

    L.drawLocal.draw.toolbar.finish.title = 'Terminar de dibujar'
    L.drawLocal.draw.toolbar.finish.text = 'Guardar'

    L.drawLocal.draw.toolbar.undo.title = 'Eliminar el último punto dibujado'
    L.drawLocal.draw.toolbar.undo.text = 'Eliminar el último punto'

    L.drawLocal.edit.toolbar.actions.cancel.text = 'Cancelar'
    L.drawLocal.edit.toolbar.actions.cancel.title = 'Cancelar editado'

    L.drawLocal.edit.toolbar.actions.save.text = 'Guardar'
    L.drawLocal.edit.toolbar.actions.save.title = 'Guardar'

    L.drawLocal.edit.toolbar.actions.clearAll.text = 'Limpiar todo'
    L.drawLocal.edit.toolbar.actions.clearAll.title = 'Borrar todas las figuras'

    //tooltip dibujar
    L.drawLocal.draw.handlers.polygon.tooltip.start =
      'Haga clic para comenzar a dibujar el polígono.'
    L.drawLocal.draw.handlers.polygon.tooltip.cont =
      'Haga clic para continuar dibujando el polígono.'
    L.drawLocal.draw.handlers.polygon.tooltip.end =
      'Haga clic en el último punto para terminar el polígono.'

    L.drawLocal.draw.handlers.rectangle.tooltip.start =
      'Haga clic para comenzar a dibujar el rectángulo.'

    L.drawLocal.draw.handlers.simpleshape.tooltip.end =
      'Suelta el ratón para finalizar el dibujo.'

    L.drawLocal.draw.handlers.marker.tooltip.start =
      'haga clic para Colocar el Marcador.'

    L.drawLocal.edit.handlers.edit.tooltip.text =
      'Arrastre los marcadores para editando la figura.'

    L.drawLocal.edit.handlers.edit.tooltip.subtext =
      'Haga clic en cancelar para deshacer los cambios.'

    L.drawLocal.edit.handlers.remove.tooltip.text =
      'Clic en una figura para eliminarla.'
  }, [])

  return (
    <>
      <div>
        <MapContainer
          id={id}
          ref={mapRef}
          maxZoom={16}
          center={[Number(centro[0]), Number(centro[1])]}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: height, width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl
            zoomInTitle="Acercar"
            zoomOutTitle="Alejar"
            position={'bottomright'}
          ></ZoomControl>
          <ChangeMapView />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {areaPermitida && (
            <GeoJSON
              data={areaPermitida}
              style={{
                lineCap: 'butt',
                weight: 3,
                opacity: 1,
                color: 'green',
                dashArray: '5',
                fillOpacity: 0,
              }}
            />
          )}
          {!onlyread ? (
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topright"
                onCreated={retornarPoligonos}
                onDeleted={retornarPoligonos}
                onEdited={retornarPoligonos}
                draw={{
                  marker: false,
                  circle: !onlyread,
                  rectangle: !onlyread,
                  polyline: !onlyread,
                  polygon: !onlyread,
                  circlemarker: false,
                }}
                edit={{
                  remove: !onlyread,
                  edit: !onlyread,
                }}
              />
            </FeatureGroup>
          ) : (
            <>{poligono && <GeoJSON data={poligono} />}</>
          )}
        </MapContainer>
      </div>
    </>
  )
}
export default MapaDibujar
