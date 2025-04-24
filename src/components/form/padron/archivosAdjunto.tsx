'use client'
import { CustomToggleButton } from "@/components/botones/CustomToogleButton";
import { IconoTooltip } from "@/components/botones/IconoTooltip";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { CriterioOrdenType } from "@/components/datatable/ordenTypes";
import { Paginacion } from "@/components/datatable/Paginacion";
import { Constantes } from "@/config/Constantes";
import { useAuth } from "@/context/AuthProvider";
import { useAlerts, useSession } from "@/hooks";
import { useRouter } from 'next/navigation'
import { CasbinTypes } from "@/types";
import { delay, InterpreteMensajes } from "@/utils";
import { imprimir } from "@/utils/imprimir";
import { useMediaQuery, useTheme, Typography, Stack, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from 'react'
import { IconoBoton } from "@/components/botones/IconoBoton";
import { useDatoGralStore } from "@/lib/_store/datoGralStore";
import { ModalDireccion } from "./ui/modalDireccion";
import { CustomDialog } from "@/components/modales/CustomDialog";
import { AlertDialog } from "@/components/modales/AlertDialog";
import { AdjuntoCRUDType } from "./types/adjuntoCRUDType";
import { ModalDocumento } from "./ui/modalDocumento";

export default function ArchivosAdjuntoPage () {
  // router para conocer la ruta actual
  const pathname = usePathname()
  const [errorData, setErrorData] = useState<any>()
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [modalAdjunto, setModalAdjunto] = useState(false)
  const [adjuntoEdicion, setAdjuntoEdicion] = useState<AdjuntoCRUDType | undefined>()
  const [adjuntosData, setAdjuntosData] = useState<any[]>([])
  const [mostrarAlertaEliminarAdjunto, setMostrarAlertaEliminarAdjunto] = useState(false)
  const { datoGral, clearState, updateDatoGral } = useDatoGralStore((state) => state)

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<any>()

  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >(
    [
      { campo: 'descripcion', nombre: 'Descripción' },
      { campo: 'nombreOriginal', nombre: 'Nombre' },
      { campo: 'tipoArchivo', nombre: 'tipo' },
    ])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(pathname))
  }


  const obtenerAdjuntos = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documento/listarTodos`,
        params: {
          id: datoGral.id,
          idAmbito: 85,
          pagina: pagina,
          limite: limite,
        },
      })
      setAdjuntosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener los documentos de respaldo del APM`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarAdjuntoModal = () => {
    setAdjuntoEdicion(undefined)
    setModalAdjunto(true)
  }
  const editarAdjuntoModal = (adjunto: AdjuntoCRUDType) => {
    setAdjuntoEdicion(adjunto)
    setModalAdjunto(true)
  }

  const cerrarModalAdjunto = async () => {
    setModalAdjunto(false)
    await delay(500)
    setAdjuntoEdicion(undefined)
  }

  useEffect(() => {
    obtenerAdjuntos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
  ])

  useEffect(() => {
    definirPermisos().finally()
  }, [])

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarAdjuntoToggle'}
      key={'accionFiltrarAdjuntoToggle'}
      icono="search"
      seleccionado={mostrarFiltro}
      cambiar={setMostrarFiltro}
    />,
    <IconoTooltip
      id={`ActualizarAdjunto`}
      titulo={'Actualizar'}
      key={`ActualizarAdjunto`}
      accion={async () => {
        await obtenerAdjuntos()
      }}
      icono={'refresh'}
      name={'Actualizar lista de documentos de respaldo'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarAdjunto'}
        key={'agregarAdjunto'}
        texto={'Nuevo documento'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar nuevo documento de respaldo'}
        accion={() => {
          agregarAdjuntoModal()
        }}
      />
    ),
  ]

  const eliminarAdjuntoModal = (adjunto: AdjuntoCRUDType) => {
    setAdjuntoEdicion(adjunto) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarAdjunto(true) // para mostrar alerta de usuarios
  }

  const contenidoTabla: Array<Array<ReactNode>> = adjuntosData.map(
    (adjuntoData, indexApm) => [

      <Typography
        key={`${adjuntoData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${adjuntoData.tipoDocumento.nombre}`}</Typography>,
      <Typography
        key={`${adjuntoData.nombreOriginal}-${indexApm}-label`}
        variant={'body2'}
      >{`${adjuntoData.nombreOriginal}`}</Typography>,
      <Typography
        key={`${adjuntoData.tipoArchivo.nombre}-${indexApm}-label`}
        variant={'body2'}
      >{`${adjuntoData.tipoArchivo.nombre}`}</Typography>,

      <Stack
        key={`${adjuntoData.id}-${indexApm}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >

        {permisos.update && (
          <IconoTooltip
            id={`editarAdjunto-${adjuntoData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, adjuntoData)
              editarAdjuntoModal(adjuntoData)
            }}
            icono={'edit'}
            name={'Editar adjunto'}
          />
        )}
        {permisos.delete && (
          <IconoTooltip
            id={`eliminarAdjunto-${indexApm}`}
            titulo={'Eliminar'}
            color={'error'}
            accion={() => {
              imprimir(`Eliminaremos`, adjuntoData)
              eliminarAdjuntoModal(adjuntoData)
            }}
            icono={'delete_outline'}
            name={'Eliminar política'}
          />
        )}
      </Stack>,
    ]
  )

  const eliminarAdjuntoPeticion = async (adjunto: AdjuntoCRUDType) => {
    console.log('id:', adjunto)
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documento/${adjunto.id}/anular`,
        method: 'patch',
      })
      imprimir(`respuesta eliminar documento: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerAdjuntos()
    } catch (e) {
      imprimir(`Error al eliminar documento`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const eliminarDireccionModal = (adjunto: AdjuntoCRUDType) => {
    setAdjuntoEdicion(adjunto) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarAdjunto(true) // para mostrar alerta de usuarios
  }

  const cancelarAlertaEliminarAdjunto = () => {
    setMostrarAlertaEliminarAdjunto(false)
    setAdjuntoEdicion(undefined)
  }

  const aceptarAlertaEliminarAdjunto = async () => {
    setMostrarAlertaEliminarAdjunto(false)
    if (adjuntoEdicion) {
      await eliminarAdjuntoPeticion(adjuntoEdicion)
    }
  }

  return (
    <div>
      <AlertDialog
        isOpen={mostrarAlertaEliminarAdjunto}
        titulo={'Alerta'}
        texto={`¿Está seguro de eliminar el documento: ${adjuntoEdicion?.descripcion} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEliminarAdjunto}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEliminarAdjunto}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalAdjunto}
        handleClose={cerrarModalAdjunto}
        maxWidth={'sm'}
        title={adjuntoEdicion ? 'Editar documento' : 'Nuevo documento'}
      >
        <ModalDocumento
          idActorMinero={datoGral.id}
          adjunto={adjuntoEdicion}
          accionCorrecta={() => {
            cerrarModalAdjunto().finally()
            obtenerAdjuntos().finally()
          }}
          accionCancelar={cerrarModalAdjunto}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Documentos de respaldo'}
        error={!!errorData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
      />
    </div>
  );
}
