'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { ModuloCRUDType } from '@/app/admin/(configuracion)/modulos/types/CrearEditarModulosType'
import { useAlerts, useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { Paginacion } from '@/components/datatable/Paginacion'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { ordenFiltrado } from '@/components/datatable/utils'
import { imprimir } from '@/utils/imprimir'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { BotonAcciones } from '@/components/botones/BotonAcciones'
import { Icono } from '@/components/Icono'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { VistaModalModulo } from '@/app/admin/(configuracion)/modulos/ui/ModalModulo'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { FiltroModulos } from '@/app/admin/(configuracion)/modulos/ui/FiltroModulos'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'


export default function ModulosPage() {
  // router para conocer la ruta actual
  const pathname = usePathname()
  /// Módulos
  const [modulosData, setModulosData] = useState<ModuloCRUDType[]>([])
  const [errorModulosData, setErrorModulosData] = useState<any>()
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  /// Secciones
  const [seccionesData, setSeccionesData] = useState<ModuloCRUDType[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [mostrarFiltroModulo, setMostrarFiltroModulo] = useState(false)
  const [modalModulo, setModalModulo] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoModulo, setMostrarAlertaEstadoModulo] =
    useState(false)

  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()

  const [filtroBuscar, setFiltroBuscar] = useState<string>('')

  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'orden', nombre: 'Orden' },
    { campo: 'label', nombre: 'Label', ordenar: true },
    { campo: 'nombre', nombre: 'Nombre', ordenar: true },
    { campo: 'descripcion', nombre: 'Descripción' },
    { campo: 'url', nombre: 'URL', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const agregarModuloModal = ({ esSeccion }: { esSeccion: boolean }) => {
    setModuloEdicion({ esSeccion: esSeccion } as ModuloCRUDType)
    setModalModulo(true)
  }

  useEffect(() => {
    obtenerSeccionesPeticion().then(() => {
      obtenerModulosPeticion().finally(() => {})
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroBuscar,
  ])

  useEffect(() => {
    if (!mostrarFiltroModulo) {
      setFiltroBuscar('')
    }
  }, [mostrarFiltroModulo])

  const [moduloEdicion, setModuloEdicion] = useState<
    ModuloCRUDType | undefined | null
  >()

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )
  const editarModuloModal = (modulo: ModuloCRUDType) => {
    setModuloEdicion(modulo)
    setModalModulo(true)
  }

  const cerrarModalModulo = async () => {
    setModalModulo(false)
    await delay(500)
    setModuloEdicion(undefined)
  }

  const obtenerModulosPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/modulos`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroBuscar.length == 0 ? {} : { filtro: filtroBuscar }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setModulosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorModulosData(null)
    } catch (e) {
      imprimir(`Error al obtener módulos`, e)
      setErrorModulosData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerSeccionesPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/modulos`,
        params: {
          pagina: 1,
          limite: 20,
          seccion: true,
        },
      })
      setSeccionesData(respuesta.datos?.filas)
    } catch (e) {
      imprimir(`Error al obtener secciones`, e)
      setErrorModulosData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /// Método que muestra alerta de cambio de estado

  const editarEstadoModuloModal = (modulo: ModuloCRUDType) => {
    setModuloEdicion(modulo) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoModulo(true) // para mostrar alerta de modulo
  }

  const cancelarAlertaEstadoModulo = async () => {
    setMostrarAlertaEstadoModulo(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setModuloEdicion(null)
  }

  /// Método que oculta la alerta de y procede con el cambio de estado
  const aceptarAlertaEstadoModulo = async () => {
    setMostrarAlertaEstadoModulo(false)
    if (moduloEdicion) {
      await cambiarEstadoModuloPeticion(moduloEdicion)
    }
    setModuloEdicion(null)
  }

  /// Petición que cambia el estado de un módulo
  const cambiarEstadoModuloPeticion = async (modulo: ModuloCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/modulos/${modulo.id}/${
          modulo.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado modulo: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerModulosPeticion()
    } catch (e) {
      imprimir(`Error estado modulo`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarModuloToggle'}
      key={'accionFiltrarModuloToggle'}
      icono="search"
      seleccionado={mostrarFiltroModulo}
      cambiar={setMostrarFiltroModulo}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarModulos'}
        key={`ordenarModulos`}
        label={'Ordenar módulos'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={`ActualizarModulo`}
      titulo={'Actualizar'}
      key={`ActualizarModulo`}
      accion={async () => {
        await obtenerModulosPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de parámetros'}
    />,
    permisos.create && (
      <BotonAcciones
        id={'agregarModuloSeccion'}
        key={'agregarModuloSeccion'}
        icono={'add_circle_outline'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        label={'Agregar nueva sección o módulo'}
        acciones={[
          {
            id: 'agregarModulo',
            mostrar: true,
            titulo: 'Nuevo módulo',
            accion: () => {
              agregarModuloModal({ esSeccion: false })
            },
            desactivado: false,
            icono: 'menu',
            name: 'Nuevo módulo',
          },
          {
            id: '1',
            mostrar: true,
            titulo: 'Nueva sección',
            accion: () => {
              agregarModuloModal({ esSeccion: true })
            },
            desactivado: false,
            icono: 'list',
            name: 'Nueva sección',
          },
        ]}
      />
    ),
  ]

  const contenidoTabla: Array<Array<ReactNode>> = modulosData.map(
    (moduloData, indexModulo) => [
      <Typography
        key={`${moduloData.id}-${indexModulo}-orden`}
        variant={'body2'}
      >
        {moduloData.propiedades.orden}
      </Typography>,
      <Box
        key={`${moduloData.id}-${indexModulo}-nombre`}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 1,
          alignItems: 'center',
        }}
      >
        {moduloData.modulo === null ? (
          <></>
        ) : (
          <Icono
            sx={{ mr: 1 }}
            color="inherit"
          >{`${moduloData.propiedades.icono}`}</Icono>
        )}
        <Typography
          key={`${moduloData.id}-${indexModulo}-nombre`}
          component={'span'}
          variant={'body2'}
        >
          {`${moduloData.label}`}
        </Typography>
      </Box>,
      <Typography
        key={`${moduloData.id}-${indexModulo}-label`}
        variant={'body2'}
      >{`${moduloData.nombre}`}</Typography>,
      <Typography
        key={`${moduloData.id}-${indexModulo}-descripcion`}
        variant={'body2'}
      >{`${
        moduloData.propiedades?.descripcion
          ? moduloData.propiedades.descripcion
          : ''
      }`}</Typography>,

      <Typography key={`${moduloData.id}-${indexModulo}-url`} variant={'body2'}>
        {`${moduloData.url}`}
      </Typography>,

      <CustomMensajeEstado
        key={`${moduloData.id}-${indexModulo}-estado`}
        titulo={moduloData.estado}
        descripcion={moduloData.estado}
        color={
          moduloData.estado == 'ACTIVO'
            ? 'success'
            : moduloData.estado == 'INACTIVO'
              ? 'error'
              : 'info'
        }
      />,
      <Stack
        key={`${moduloData.id}-${indexModulo}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <CustomSwitch
            id={`cambiarEstadoModulo-${moduloData.id}`}
            titulo={moduloData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={() => {
              editarEstadoModuloModal({
                ...moduloData,
                ...{ esSeccion: moduloData?.modulo == null },
              })
            }}
            desactivado={moduloData.estado == 'PENDIENTE'}
            color={moduloData.estado == 'ACTIVO' ? 'success' : 'error'}
            marcado={moduloData.estado == 'ACTIVO'}
            name={
              moduloData.estado == 'ACTIVO'
                ? 'Inactivar Módulo'
                : 'Activar Módulo'
            }
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarModulo-${moduloData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos :`, moduloData)
              editarModuloModal({
                ...moduloData,
                ...{ esSeccion: moduloData?.modulo == null },
              })
            }}
            icono={'edit'}
            name={'Editar módulo'}
          />
        )}
      </Stack>,
    ]
  )
  return (
    <>
      <title>{`Módulos - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoModulo}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          moduloEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el módulo: ${titleCase(moduloEdicion?.nombre ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoModulo}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoModulo}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalModulo}
        handleClose={cerrarModalModulo}
        title={
          moduloEdicion?.id
            ? moduloEdicion.esSeccion
              ? 'Editar Sección'
              : 'Editar Módulo'
            : moduloEdicion?.esSeccion
              ? 'Nueva Sección'
              : 'Nuevo Módulo'
        }
      >
        <VistaModalModulo
          modulo={moduloEdicion}
          accionCorrecta={() => {
            cerrarModalModulo().finally()
            obtenerSeccionesPeticion().then(() => {
              obtenerModulosPeticion().finally()
            })
          }}
          accionCancelar={cerrarModalModulo}
          modulos={seccionesData}
        />
      </CustomDialog>

      <CustomDataTable
        titulo={'Módulos'}
        error={!!errorModulosData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroModulo && (
            <FiltroModulos
              filtroModulo={filtroBuscar}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroBuscar(filtros.buscar)
              }}
              accionCerrar={() => {}}
            />
          )
        }
      />
    </>
  )
}
