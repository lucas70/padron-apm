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
import { DireccionCRUDType } from "./types/direccionCRUDType";
import { ModalDireccion } from "./ui/modalDireccion";
import { CustomDialog } from "@/components/modales/CustomDialog";
import { AlertDialog } from "@/components/modales/AlertDialog";

export default function BandejaDireccionPage() {
  // router para conocer la ruta actual
  const pathname = usePathname()
  const [errorData, setErrorData] = useState<any>()
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [modalDireccion, setModalDireccion] = useState(false)
  const [direccionEdicion, setDireccionEdicion] = useState<DireccionCRUDType | undefined>()
  const [direccionesData, setDireccionesData] = useState<any[]>([])
  const [mostrarAlertaEliminarDireccion, setMostrarAlertaEliminarDireccion] = useState(false)
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
      { campo: 'tipo', nombre: 'Tipo' },
      { campo: 'zona', nombre: 'Zona' },
      { campo: 'avenida', nombre: 'Avenida' },
      { campo: 'calle', nombre: 'Calle' },
      { campo: 'numero', nombre: 'Número' },
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


  const obtenerDirecciones = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/direccion/${datoGral.id}`,
        params: {
          pagina: pagina,
          limite: limite,
        },
      })
      setDireccionesData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener las direcciones del APM`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarDireccionModal = () => {
    setDireccionEdicion(undefined)
    setModalDireccion(true)
  }
  const editarDireccionModal = (direccion: DireccionCRUDType) => {
    setDireccionEdicion(direccion)
    setModalDireccion(true)
  }

  const cerrarModalDireccion = async () => {
    setModalDireccion(false)
    await delay(500)
    setDireccionEdicion(undefined)
  }

  useEffect(() => {
    obtenerDirecciones().finally()
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
      id={'accionFiltrarDireccionToggle'}
      key={'accionFiltrarDireccionToggle'}
      icono="search"
      seleccionado={mostrarFiltro}
      cambiar={setMostrarFiltro}
    />,
    <IconoTooltip
      id={`ActualizarDireccion`}
      titulo={'Actualizar'}
      key={`ActualizarDireccion`}
      accion={async () => {
        await obtenerDirecciones()
      }}
      icono={'refresh'}
      name={'Actualizar lista de Direcciones'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarDireccion'}
        key={'agregarDireccion'}
        texto={'Nueva Dirección'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar nueva dirección'}
        accion={() => {
          agregarDireccionModal()
        }}
      />
    ),
  ]

  const eliminarPoliticaModal = (direccion: DireccionCRUDType) => {
    setDireccionEdicion(direccion) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarDireccion(true) // para mostrar alerta de usuarios
  }
  const contenidoTabla: Array<Array<ReactNode>> = direccionesData.map(
    (direccionData, indexApm) => [

      <Typography
        key={`${direccionData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${direccionData.tipoDireccion.nombre}`}</Typography>,
      <Typography
        key={`${direccionData.zona}-${indexApm}-label`}
        variant={'body2'}
      >{`${direccionData.zona}`}</Typography>,
      <Typography
        key={`${direccionData.avenida}-${indexApm}-label`}
        variant={'body2'}
      >{`${direccionData.avenida}`}</Typography>,
      <Typography
        key={`${direccionData.calle}-${indexApm}-label`}
        variant={'body2'}
      >{`${direccionData.calle}`}</Typography>,
      <Typography
        key={`${direccionData.numero}-${indexApm}-label`}
        variant={'body2'}
      >{`${direccionData.numero}`}</Typography>,

      <Stack
        key={`${direccionData.id}-${indexApm}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >

        {permisos.update && (
          <IconoTooltip
            id={`editarModulo-${direccionData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, direccionData)
              editarDireccionModal(direccionData)
            }}
            icono={'edit'}
            name={'Editar módulo'}
          />
        )}
        {permisos.delete && (
          <IconoTooltip
            id={`eliminarPolitica-${indexApm}`}
            titulo={'Eliminar'}
            color={'error'}
            accion={() => {
              imprimir(`Eliminaremos`, direccionData)
              eliminarDireccionModal(direccionData)
            }}
            icono={'delete_outline'}
            name={'Eliminar política'}
          />
        )}
      </Stack>,
    ]
  )

  const eliminarDireccionPeticion = async (direccion: DireccionCRUDType) => {
    console.log('id:', direccion)
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/direccion/${direccion.id}/inactivacion`,
        method: 'patch',
      })
      imprimir(`respuesta eliminar política: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerDirecciones()
    } catch (e) {
      imprimir(`Error al eliminar política`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const eliminarDireccionModal = (politica: DireccionCRUDType) => {
    setDireccionEdicion(politica) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarDireccion(true) // para mostrar alerta de usuarios
  }

  const cancelarAlertaEliminarDireccion = () => {
    setMostrarAlertaEliminarDireccion(false)
    setDireccionEdicion(undefined)
  }

  const aceptarAlertaEliminarDireccion = async () => {
    setMostrarAlertaEliminarDireccion(false)
    if (direccionEdicion) {
      await eliminarDireccionPeticion(direccionEdicion)
    }
  }

  return (
    <div>
      <AlertDialog
        isOpen={mostrarAlertaEliminarDireccion}
        titulo={'Alerta'}
        texto={`¿Está seguro de eliminar la dirección: ${direccionEdicion?.tipoDireccion.nombre} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEliminarDireccion}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEliminarDireccion}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalDireccion}
        handleClose={cerrarModalDireccion}
        maxWidth={'sm'}
        title={direccionEdicion ? 'Editar dirección' : 'Nueva dirección'}
      >
        <ModalDireccion
          idActorMinero={datoGral.id}
          direccion={direccionEdicion}
          accionCorrecta={() => {
            cerrarModalDireccion().finally()
            obtenerDirecciones().finally()
          }}
          accionCancelar={cerrarModalDireccion}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Direcciones'}
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
