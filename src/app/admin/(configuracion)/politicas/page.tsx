'use client'
import Typography from '@mui/material/Typography'
import { ReactNode, useEffect, useState } from 'react'
import { PoliticaCRUDType } from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'
import { useAlerts, useSession } from '@/hooks'
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import { usePathname } from 'next/navigation'
import {
  Button,
  Chip,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { imprimir } from '@/utils/imprimir'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { Constantes } from '@/config/Constantes'
import { ordenFiltrado } from '@/components/datatable/utils'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { VistaModalPolitica } from '@/app/admin/(configuracion)/politicas/ui'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { Paginacion } from '@/components/datatable/Paginacion'
import { FiltroPolitica } from '@/app/admin/(configuracion)/politicas/ui/FiltroPoliticas'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'

export default function PoliticasPage() {
  const [politicasData, setPoliticasData] = useState<PoliticaCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [mostrarFiltroPolitica, setMostrarFiltroPolitica] = useState(false)
  const [filtroPolitica, setFiltroPolitica] = useState<string>('')
  const [filtroApp, setFiltroApp] = useState<string>('')
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorData, setErrorData] = useState<any>()
  const [modalPolitica, setModalPolitica] = useState(false)

  /// Indicador para mostrar una vista de alerta
  const [mostrarAlertaEliminarPolitica, setMostrarAlertaEliminarPolitica] =
    useState(false)

  const [politicaEdicion, setPoliticaEdicion] = useState<
    PoliticaCRUDType | undefined
  >()

  // Roles de usuario
  const [rolesData, setRolesData] = useState<RolType[]>([])

  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()

  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  // router para conocer la ruta actual
  const pathname = usePathname()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'sujeto', nombre: 'Sujeto', ordenar: true },
    { campo: 'objeto', nombre: 'Objeto', ordenar: true },
    { campo: 'accion', nombre: 'Acción', ordenar: true },
    { campo: 'app', nombre: 'App', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = politicasData.map(
    (politicaData, indexPolitica) => [
      <Typography
        key={`${politicaData.sujeto}-${indexPolitica}-sujeto`}
        variant={'body2'}
      >{`${politicaData.sujeto}`}</Typography>,
      <Typography
        key={`${politicaData.objeto}-${indexPolitica}-objeto`}
        variant={'body2'}
      >{`${politicaData.objeto}`}</Typography>,
      <Grid key={`${politicaData.accion}-${indexPolitica}-accion`}>
        {politicaData.accion.split('|').map((itemAccion, indexAccion) => (
          <Chip
            key={`accion-${indexPolitica}-${indexAccion}`}
            label={itemAccion}
          />
        ))}
      </Grid>,
      <Typography
        key={`${politicaData.accion}-${indexPolitica}-app`}
        variant={'body2'}
      >{`${politicaData.app}`}</Typography>,
      <Stack
        key={`${politicaData.accion}-${indexPolitica}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <IconoTooltip
            id={`editarPolitica-${indexPolitica}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, politicaData)
              editarPoliticaModal(politicaData)
            }}
            icono={'edit'}
            name={'Editar política'}
          />
        )}

        {permisos.delete && (
          <IconoTooltip
            id={`eliminarPolitica-${indexPolitica}`}
            titulo={'Eliminar'}
            color={'error'}
            accion={() => {
              imprimir(`Eliminaremos`, politicaData)
              eliminarPoliticaModal(politicaData)
            }}
            icono={'delete_outline'}
            name={'Eliminar política'}
          />
        )}
      </Stack>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarPoliticasToggle'}
      key={'accionFiltrarPoliticasToggle'}
      icono="search"
      seleccionado={mostrarFiltroPolitica}
      cambiar={setMostrarFiltroPolitica}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarUsuarios'}
        key={`ordenarUsuarios`}
        label={'Ordenar políticas'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarPolitica'}
      titulo={'Actualizar'}
      key={`accionActualizarPolitica`}
      accion={async () => {
        await obtenerPoliticasPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de políticas'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarPolitica'}
        key={'agregarPolitica'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar política'}
        accion={() => {
          agregarPoliticaModal()
        }}
      />
    ),
  ]

  const obtenerPoliticasPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/politicas`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroPolitica.length == 0 ? {} : { filtro: filtroPolitica }),
          ...(filtroApp.length == 0 ? {} : { aplicacion: filtroApp }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setPoliticasData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener políticas`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const eliminarPoliticaPeticion = async (politica: PoliticaCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/politicas`,
        method: 'delete',
        params: {
          sujeto: politica?.sujeto,
          objeto: politica?.objeto,
          accion: politica?.accion,
          app: politica?.app,
        },
      })
      imprimir(`respuesta eliminar política: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerPoliticasPeticion()
    } catch (e) {
      imprimir(`Error al eliminar política`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarPoliticaModal = () => {
    setPoliticaEdicion(undefined)
    setModalPolitica(true)
  }
  const editarPoliticaModal = (politica: PoliticaCRUDType) => {
    setPoliticaEdicion(politica)
    setModalPolitica(true)
  }

  const cerrarModalPolitica = async () => {
    setModalPolitica(false)
    await delay(500)
    setPoliticaEdicion(undefined)
  }

  const obtenerRolesPeticion = async () => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/roles`,
      })
      setRolesData(respuesta.datos)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener roles`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
    }
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerRolesPeticion().then(() => {
      obtenerPoliticasPeticion().finally(() => {})
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    filtroApp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroPolitica,
  ])
  useEffect(() => {
    if (!mostrarFiltroPolitica) {
      setFiltroPolitica('')
      setFiltroApp('')
    }
  }, [mostrarFiltroPolitica])

  const eliminarPoliticaModal = (politica: PoliticaCRUDType) => {
    setPoliticaEdicion(politica) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarPolitica(true) // para mostrar alerta de usuarios
  }

  const cancelarAlertaEliminarPolitica = () => {
    setMostrarAlertaEliminarPolitica(false)
    setPoliticaEdicion(undefined)
  }

  const aceptarAlertaEliminarPoliticas = async () => {
    setMostrarAlertaEliminarPolitica(false)
    if (politicaEdicion) {
      await eliminarPoliticaPeticion(politicaEdicion)
    }
  }

  return (
    <>
      <title>{`Políticas - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEliminarPolitica}
        titulo={'Alerta'}
        texto={`¿Está seguro de eliminar la política ${politicaEdicion?.app}-${politicaEdicion?.objeto}-${politicaEdicion?.sujeto}-${politicaEdicion?.accion} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEliminarPolitica}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEliminarPoliticas}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalPolitica}
        handleClose={cerrarModalPolitica}
        title={politicaEdicion ? 'Editar política' : 'Nueva política'}
      >
        <VistaModalPolitica
          politica={politicaEdicion}
          roles={rolesData}
          accionCorrecta={() => {
            cerrarModalPolitica().finally()
            obtenerPoliticasPeticion().finally()
          }}
          accionCancelar={cerrarModalPolitica}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Políticas'}
        error={!!errorData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        contenidoTabla={contenidoTabla}
        paginacion={
          <Paginacion
            pagina={pagina}
            limite={limite}
            total={total}
            cambioPagina={setPagina}
            cambioLimite={setLimite}
          />
        }
        filtros={
          mostrarFiltroPolitica && (
            <FiltroPolitica
              filtroPolitica={filtroPolitica}
              filtroApp={filtroApp}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroPolitica(filtros.buscar)
                setFiltroApp(filtros.app)
              }}
              accionCerrar={() => {}}
            />
          )
        }
      />
    </>
  )
}
