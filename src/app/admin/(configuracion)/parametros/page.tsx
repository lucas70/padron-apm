'use client'
import Typography from '@mui/material/Typography'
import { ReactNode, useEffect, useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { ParametroCRUDType } from '@/app/admin/(configuracion)/parametros/types/parametrosCRUDTypes'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { usePathname } from 'next/navigation'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { ordenFiltrado } from '@/components/datatable/utils'
import { Paginacion } from '@/components/datatable/Paginacion'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { FiltroParametros } from '@/app/admin/(configuracion)/parametros/ui/FiltroParametros'
import { VistaModalParametro } from '@/app/admin/(configuracion)/parametros/ui'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'

export default function ParametrosPage() {
  const [parametrosData, setParametrosData] = useState<ParametroCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorParametrosData, setErrorParametrosData] = useState<any>()

  const [modalParametro, setModalParametro] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoParametro, setMostrarAlertaEstadoParametro] =
    useState(false)

  const [parametroEdicion, setParametroEdicion] = useState<
    ParametroCRUDType | undefined | null
  >()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()

  const [filtroParametro, setFiltroParametro] = useState<string>('')
  const [mostrarFiltroParametros, setMostrarFiltroParametros] = useState(false)
  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Método que muestra alerta de cambio de estado

  const editarEstadoParametroModal = (parametro: ParametroCRUDType) => {
    setParametroEdicion(parametro) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoParametro(true) // para mostrar alerta de parametro
  }

  const cancelarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setParametroEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false)
    if (parametroEdicion) {
      await cambiarEstadoParametroPeticion(parametroEdicion)
    }
    setParametroEdicion(null)
  }

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoParametroPeticion = async (
    parametro: ParametroCRUDType
  ) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parametros/${parametro.id}/${
          parametro.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado parametro: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerParametrosPeticion()
    } catch (e) {
      imprimir(`Error estado parametro`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // router para conocer la ruta actual
  const pathname = usePathname()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'codigo', nombre: 'Código', ordenar: true },
    { campo: 'nombre', nombre: 'Nombre', ordenar: true },
    { campo: 'descripcion', nombre: 'Descripción', ordenar: true },
    { campo: 'grupo', nombre: 'Grupo', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = parametrosData.map(
    (parametroData, indexParametro) => [
      <Typography
        key={`${parametroData.id}-${indexParametro}-codigo`}
        variant={'body2'}
      >{`${parametroData.codigo}`}</Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-nombre`}
        variant={'body2'}
      >
        {`${parametroData.nombre}`}
      </Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-descripcion`}
        variant={'body2'}
      >{`${parametroData.descripcion}`}</Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-grupo`}
        variant={'body2'}
      >{`${parametroData.grupo}`}</Typography>,

      <CustomMensajeEstado
        key={`${parametroData.id}-${indexParametro}-estado`}
        titulo={parametroData.estado}
        descripcion={parametroData.estado}
        color={
          parametroData.estado == 'ACTIVO'
            ? 'success'
            : parametroData.estado == 'INACTIVO'
              ? 'error'
              : 'info'
        }
      />,
      <Stack
        key={`${parametroData.id}-${indexParametro}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <CustomSwitch
            id={`cambiarEstadoParametro-${parametroData.id}`}
            titulo={parametroData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={async () => {
              await editarEstadoParametroModal(parametroData)
            }}
            name={
              parametroData.estado == 'ACTIVO'
                ? 'Inactivar Parámetro'
                : 'Activar Parámetro'
            }
            color={parametroData.estado == 'ACTIVO' ? 'success' : 'error'}
            marcado={parametroData.estado == 'ACTIVO'}
            desactivado={parametroData.estado == 'PENDIENTE'}
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarParametros-${parametroData.id}`}
            name={'Parámetros'}
            titulo={'Editar'}
            color={'primary'}
            icono={'edit'}
            accion={async () => {
              await editarParametroModal(parametroData)
            }}
          />
        )}
      </Stack>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarParametrosToggle'}
      key={'accionFiltrarParametrosToggle'}
      icono="search"
      seleccionado={mostrarFiltroParametros}
      cambiar={setMostrarFiltroParametros}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarParametros'}
        key={`ordenarParametros`}
        label={'Ordenar parámetros'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarParametro'}
      titulo={'Actualizar'}
      key={`accionActualizarParametro`}
      accion={async () => {
        await obtenerParametrosPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de parámetros'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarParametro'}
        key={'agregarParametro'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar parámetro'}
        accion={() => {
          agregarParametroModal()
        }}
      />
    ),
  ]

  const obtenerParametrosPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parametros`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroParametro.length == 0 ? {} : { filtro: filtroParametro }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setParametrosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorParametrosData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorParametrosData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarParametroModal = () => {
    setParametroEdicion(undefined)
    setModalParametro(true)
  }
  const editarParametroModal = (parametro: ParametroCRUDType) => {
    setParametroEdicion(parametro)
    setModalParametro(true)
  }

  const cerrarModalParametro = async () => {
    setModalParametro(false)
    await delay(500)
    setParametroEdicion(undefined)
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerParametrosPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroParametro,
  ])

  useEffect(() => {
    if (!mostrarFiltroParametros) {
      setFiltroParametro('')
    }
  }, [mostrarFiltroParametros])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  return (
    <>
      <title>{`Parámetros - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoParametro}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          parametroEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el parámetro: ${titleCase(parametroEdicion?.nombre ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoParametro}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoParametro}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalParametro}
        handleClose={cerrarModalParametro}
        title={parametroEdicion ? 'Editar parámetro' : 'Nuevo parámetro'}
      >
        <VistaModalParametro
          parametro={parametroEdicion}
          accionCorrecta={() => {
            cerrarModalParametro().finally()
            obtenerParametrosPeticion().finally()
          }}
          accionCancelar={cerrarModalParametro}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Parámetros'}
        error={!!errorParametrosData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroParametros && (
            <FiltroParametros
              filtroParametro={filtroParametro}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroParametro(filtros.parametro)
              }}
              accionCerrar={() => {
                imprimir(`👀 cerrar`)
              }}
            />
          )
        }
      />
    </>
  )
}
