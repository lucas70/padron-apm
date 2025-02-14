'use client'
import Typography from '@mui/material/Typography'
import { ReactNode, useEffect, useState } from 'react'
import { RolCRUDType } from '@/app/admin/(configuracion)/roles/types/rolCRUDType'
import { useAlerts, useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils'
import { usePathname } from 'next/navigation'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { imprimir } from '@/utils/imprimir'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { Constantes } from '@/config/Constantes'
import { ordenFiltrado } from '@/components/datatable/utils'
import { Paginacion } from '@/components/datatable/Paginacion'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { VistaModalRol } from '@/app/admin/(configuracion)/roles/ui/ModalRol'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { FiltroRol } from '@/app/admin/(configuracion)/roles/ui/FiltroRol'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'

export default function RolesPage() {
  const [rolesData, setRolesData] = useState<RolCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorRolData, setErrorRolData] = useState<any>()

  const [modalRol, setModalRol] = useState(false)

  const [rolEdicion, setRolEdicion] = useState<RolCRUDType | undefined>()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  //filtros

  const [filtroRol, setFiltroRol] = useState<string>('')
  const [mostrarFiltroRol, setMostrarFiltroRol] = useState(false)

  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()

  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const [mostrarAlertaEstadoRol, setMostrarAlertaEstadoRol] = useState(false)

  const editarEstadoRolModal = (rol: RolCRUDType) => {
    setRolEdicion(rol) // para mostrar datos de Rol en la alerta
    setMostrarAlertaEstadoRol(true) // para mostrar alerta de Roles
  }

  const cancelarAlertaEstadoRol = async () => {
    setMostrarAlertaEstadoRol(false)
    await delay(500)
    setRolEdicion(undefined)
  }

  const aceptarAlertaEstadoRol = async () => {
    setMostrarAlertaEstadoRol(false)
    if (rolEdicion) {
      await cambiarEstadoRolPeticion(rolEdicion)
    }
    setRolEdicion(undefined)
  }

  // router para conocer la ruta actual
  const pathname = usePathname()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'rol', nombre: 'Rol', ordenar: true },
    { campo: 'nombre', nombre: 'Nombre', ordenar: true },
    { campo: 'descripcion', nombre: 'Descripción', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = rolesData.map(
    (rolData, indexRol) => [
      <Typography key={`${rolData.id}-${indexRol}-rol`} variant={'body2'}>
        {`${rolData.rol}`}
      </Typography>,
      <Typography
        key={`${rolData.id}-${indexRol}-nombre`}
        variant={'body2'}
      >{`${rolData.nombre}`}</Typography>,
      <Typography
        key={`${rolData.id}-${indexRol}-descripcion`}
        variant={'body2'}
      >{`${rolData.descripcion}`}</Typography>,
      <Typography key={`${rolData.id}-${indexRol}-estado`} component={'div'}>
        <CustomMensajeEstado
          titulo={rolData.estado}
          descripcion={rolData.estado}
          color={
            rolData.estado == 'ACTIVO'
              ? 'success'
              : rolData.estado == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />
      </Typography>,
      <Stack
        key={`${rolData.id}-${indexRol}-accion`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <CustomSwitch
            id={`cambiarEstadoRol-${rolData.id}`}
            titulo={rolData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={() => {
              editarEstadoRolModal(rolData)
            }}
            desactivado={rolData.estado == 'PENDIENTE'}
            marcado={rolData.estado == 'ACTIVO'}
            color={rolData.estado == 'ACTIVO' ? 'success' : 'error'}
            name={rolData.estado == 'ACTIVO' ? 'Inactivar Rol' : 'Activar Rol'}
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarRol-${rolData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, rolData)
              editarRolModal(rolData)
            }}
            icono={'edit'}
            name={'Roles'}
          />
        )}
      </Stack>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarRolToggle'}
      key={'accionFiltrarRolToggle'}
      icono="search"
      seleccionado={mostrarFiltroRol}
      cambiar={setMostrarFiltroRol}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarRoles'}
        key={`ordenarRoles`}
        label={'Ordenar roles'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarRol'}
      titulo={'Actualizar'}
      key={`accionActualizarRol`}
      accion={async () => {
        await obtenerRolesPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de roles'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarRol'}
        key={'agregarRol'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar rol'}
        accion={() => {
          agregarRolModal()
        }}
      />
    ),
  ]

  const cambiarEstadoRolPeticion = async (rol: RolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/roles/${rol.id}/${
          rol.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta inactivar rol: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerRolesPeticion()
    } catch (e) {
      imprimir(`Error al inactivar rol`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerRolesPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/roles/todos`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroRol.length == 0 ? {} : { filtro: filtroRol }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setRolesData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorRolData(null)
    } catch (e) {
      imprimir(`Error al obtener Roles`, e)
      setErrorRolData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarRolModal = () => {
    setRolEdicion(undefined)
    setModalRol(true)
  }
  const editarRolModal = (Rol: RolCRUDType) => {
    setRolEdicion(Rol)
    setModalRol(true)
  }

  const cerrarModalRol = async () => {
    setModalRol(false)
    await delay(500)
    setRolEdicion(undefined)
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerRolesPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroRol,
  ])

  useEffect(() => {
    if (!mostrarFiltroRol) {
      setFiltroRol('')
    }
  }, [mostrarFiltroRol])

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
      <title>{`Roles - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoRol}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          rolEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } a ${titleCase(rolEdicion?.nombre ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoRol}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoRol}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalRol}
        handleClose={cerrarModalRol}
        maxWidth={'sm'}
        title={rolEdicion ? 'Editar rol' : 'Nuevo rol'}
      >
        <VistaModalRol
          rol={rolEdicion}
          accionCorrecta={() => {
            cerrarModalRol().finally()
            obtenerRolesPeticion().finally()
          }}
          accionCancelar={cerrarModalRol}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Roles'}
        error={!!errorRolData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroRol && (
            <FiltroRol
              filtroRol={filtroRol}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroRol(filtros.rol)
              }}
              accionCerrar={() => {}}
            />
          )
        }
      />
    </>
  )
}
