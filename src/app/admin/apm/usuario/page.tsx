'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Constantes } from '@/config/Constantes'
import React, { ReactNode, useEffect, useState } from 'react'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { useAlerts, useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { CasbinTypes } from '@/types'
import {
  Button,
  Chip,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { usePathname } from 'next/navigation'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { ordenFiltrado } from '@/components/datatable/utils'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import {
  FiltroUsuarios,
} from '@/app/admin/(configuracion)/usuarios/ui'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { Paginacion } from '@/components/datatable/Paginacion'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'
import { VistaModalUsuario } from './ui/ModalUsuarios'
import { RolType, UsuarioCRUDType, UsuarioListType } from './types/usuariosCRUDTypes'
import { UsuarioRolCRUDType } from '../../(configuracion)/usuarios/types/usuariosCRUDTypes'

export default function UsuariosPage() {
  // data de usuarios
  const [usuariosData, setUsuariosData] = useState<UsuarioListType[]>([])

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorData, setErrorData] = useState<any>()

  /// Indicador para mostrar una ventana modal de usuario
  const [modalUsuario, setModalUsuario] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoUsuario, setMostrarAlertaEstadoUsuario] =
    useState(false)

  /// Indicador para mostrar una vista de alerta de restablecimiento de contraseña
  const [mostrarAlertaRestablecerUsuario, setMostrarAlertaRestablecerUsuario] =
    useState(false)

  /// Indicador para mostrar una vista de alerta de reenvio de correo de activación
  const [mostrarAlertaReenvioCorreo, setMostrarAlertaReenvioCorreo] =
    useState(false)

  /// Variable que contiene el estado del usuario que se está editando
  const [usuarioEdicion, setUsuarioEdicion] = useState<
    UsuarioCRUDType | undefined | null
  >()

  // Roles de usuario
  const [rolesData, setRolesData] = useState<RolType[]>([])

  // Variables de paginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Filtros
  const [filtroUsuario, setFiltroUsuario] = useState<string>('')
  const [filtroRoles, setFiltroRoles] = useState<string[]>([])

  /// Indicador para mostrar el filtro de usuarios
  const [mostrarFiltroUsuarios, setMostrarFiltroUsuarios] = useState(false)

  // Proveedor de la sesión

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

  // router para conocer la ruta actual
  const pathname = usePathname()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nroDocumento', nombre: 'Nro. Documento', ordenar: true },
    { campo: 'nombres', nombre: 'Nombres', ordenar: true },
    { campo: 'usuario', nombre: 'Usuario', ordenar: true },
    { campo: 'tipo', nombre: 'Tipo' },
    { campo: 'rol', nombre: 'Roles', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = usuariosData.map(
    (usuarioData, indexUsuario) => [
      <Typography
        key={`${usuarioData.id}-${indexUsuario}-tipoDoc`}
        variant={'body2'}
      >
        {`${usuarioData.persona.tipoDocumento} ${usuarioData.persona.numeroDocumento}`}
      </Typography>,
      <div key={`${usuarioData.id}-${indexUsuario}-nombres`}>
        <Typography variant={'body2'}>
          {`${usuarioData.persona.nombres} ${usuarioData.persona.primerApellido} ${usuarioData.persona.segundoApellido}`}
        </Typography>
      </div>,
      <Typography
        key={`${usuarioData.id}-${indexUsuario}-usuario`}
        variant={'body2'}
      >
        {usuarioData.usuario}
      </Typography>,

      <Box key={`${usuarioData.id}-${indexUsuario}-tipo`}>
        {usuarioData.ciudadaniaDigital && (
          <Chip
            size={'small'}
            color={'primary'}
            label="Ciudadanía"
            variant="outlined"
          />
        )}
        {!usuarioData.ciudadaniaDigital && (
          <Chip size={'small'} label="Normal" variant="outlined" />
        )}
      </Box>,
      <Grid key={`${usuarioData.id}-${indexUsuario}-roles`}>
        {usuarioData.usuarioRol.map((itemUsuarioRol, indexUsuarioRol) => (
          <Chip
            key={`usuario-rol-${indexUsuarioRol}`}
            label={itemUsuarioRol.rol.rol}
            sx={{ m: 0.1 }}
          />
        ))}
      </Grid>,
      <Typography
        component={'div'}
        key={`${usuarioData.id}-${indexUsuario}-estado`}
      >
        <CustomMensajeEstado
          titulo={usuarioData.estado}
          descripcion={usuarioData.estado}
          color={
            usuarioData.estado == 'ACTIVO'
              ? 'success'
              : usuarioData.estado == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />
      </Typography>,
      <Stack
        key={`${usuarioData.id}-${indexUsuario}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <CustomSwitch
            id={`cambiarEstadoUsuario-${usuarioData.id}`}
            titulo={usuarioData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={() => {
              editarEstadoUsuarioModal({
                id: usuarioData.id, numeroDocumento: usuarioData.persona.numeroDocumento, primerApellido: usuarioData.persona.primerApellido,
                segundoApellido: usuarioData.persona.segundoApellido, nombres: usuarioData.persona.nombres, fechaNacimiento: usuarioData.persona.fechaNacimiento,
                correoElectronico: usuarioData.correoElectronico, usuarioRol: usuarioData.usuarioRol
              })
            }}
            desactivado={usuarioData.estado == 'PENDIENTE'}
            color={usuarioData.estado == 'ACTIVO' ? 'success' : 'error'}
            marcado={usuarioData.estado == 'ACTIVO'}
            name={
              usuarioData.estado == 'ACTIVO'
                ? 'Inactivar Usuario'
                : 'Activar Usuario'
            }
          />
        )}
        {(usuarioData.estado == 'ACTIVO' ||
          usuarioData.estado == 'INACTIVO') && (
            <IconoTooltip
              id={`restablecerContrasena-${usuarioData.id}`}
              titulo={
                usuarioData.ciudadaniaDigital
                  ? 'No puede restablecer la contraseña'
                  : 'Restablecer contraseña'
              }
              color={'info'}
              accion={async () => {
                await restablecimientoPassUsuarioModal(usuarioData)
              }}
              desactivado={usuarioData.ciudadaniaDigital}
              icono={'vpn_key'}
              name={'Restablecer contraseña'}
            />
          )}
        {usuarioData.estado == 'PENDIENTE' && (
          <IconoTooltip
            id={`reenviarCorreoActivacion-${usuarioData.id}`}
            titulo={'Reenviar correo de activación'}
            color={'info'}
            accion={async () => {
              await reenvioCorreoModal(usuarioData)
            }}
            desactivado={usuarioData.ciudadaniaDigital}
            icono={'forward_to_inbox'}
            name={'Reenviar correo de activación'}
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarUsusario-${usuarioData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, usuarioData)
              editarUsuarioModal({
                id: usuarioData.id, numeroDocumento: usuarioData.persona.numeroDocumento, primerApellido: usuarioData.persona.primerApellido,
                segundoApellido: usuarioData.persona.segundoApellido, nombres: usuarioData.persona.nombres, fechaNacimiento: usuarioData.persona.fechaNacimiento,
                correoElectronico: usuarioData.correoElectronico, usuarioRol: usuarioData.usuarioRol
              })
            }}
            icono={'edit'}
            name={'Editar usuario'}
          />
        )}
      </Stack>,
    ]
  )


  /// Acciones para data table
  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarUsuarioToggle'}
      key={'accionFiltrarUsuarioToggle'}
      icono="search"
      seleccionado={mostrarFiltroUsuarios}
      cambiar={setMostrarFiltroUsuarios}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarUsuarios'}
        key={`ordenarUsuarios`}
        label={'Ordenar usuarios'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarUsuario'}
      titulo={'Actualizar'}
      key={`actualizarUsuario`}
      accion={async () => {
        await obtenerUsuariosPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de usuario'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarUsuario'}
        key={'agregarUsuario'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar usuario'}
        accion={() => {
          agregarUsuarioModal()
        }}
      />
    ),
  ]

  /// Petición que obtiene lista de usuarios
  const obtenerUsuariosPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/administracion/listarUsuarios`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroUsuario.length == 0 ? {} : { filtro: filtroUsuario }),
          ...(filtroRoles.length == 0 ? {} : { rol: filtroRoles.join(',') }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
              orden: ordenFiltrado(ordenCriterios).join(','),
            }),
        },
      })
      setUsuariosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener usuarios`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /// Petición que obtiene lista de roles
  const obtenerRolesPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/administracion/rolesApm`,
      })
      setRolesData(respuesta.datos)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener roles`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      throw e
    } finally {
      setLoading(false)
    }
  }


  /// Petición que restablecer la contraseña del usuario
  const restablecerPassUsuarioPeticion = async (usuario: UsuarioCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/usuarios/${usuario.id}/restauracion`,
        method: 'patch',
      })
      imprimir(`respuesta restablecer usuario: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al restablecer usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /// Petición que reenvia correo de activación
  const reenviarCorreoActivacionPeticion = async (usuario: UsuarioCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/usuarios/${usuario.id}/reenviar`,
        method: 'patch',
      })
      imprimir(`respuesta reenviar correo usuario: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al reenvio correo usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /// Método abre una ventana modal para un usuario nuevo

  const agregarUsuarioModal = () => {
    setUsuarioEdicion(null)
    setModalUsuario(true)
  }
  /// Método abre una ventana modal para un usuario existente
  const editarUsuarioModal = (usuario: UsuarioCRUDType) => {
    setUsuarioEdicion(usuario)
    setModalUsuario(true)
  }

  /// Método que cierra una ventana modal
  const cerrarModalUsuario = async () => {
    setModalUsuario(false)
    await delay(500)
    setUsuarioEdicion(null)
  }

  /// Método que muestra alerta de cambio de estado

  const editarEstadoUsuarioModal = (usuario: UsuarioCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEstadoUsuario(true) // para mostrar alerta de usuarios
  }

  /// Método que muestra alerta de restablecimiento de contraseña

  const restablecimientoPassUsuarioModal = (usuario: UsuarioCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaRestablecerUsuario(true) // para mostrar alerta de usuarios
  }

  /// Método que muestra alerta de reenvio de correo

  const reenvioCorreoModal = (usuario: UsuarioCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaReenvioCorreo(true) // para mostrar alerta de usuarios
  }

  /// Método que cierra alerta de cambio de estado

  const cancelarAlertaEstadoUsuario = async () => {
    setMostrarAlertaEstadoUsuario(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }


  /// Método que cierra alerta de cambio de estado

  const cancelarAlertaRestablecerUsuario = async () => {
    setMostrarAlertaRestablecerUsuario(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }

  /// Método que oculta la alerta y procede al cambio
  const aceptarAlertaRestablecerUsuario = async () => {
    setMostrarAlertaRestablecerUsuario(false)
    if (usuarioEdicion) {
      await restablecerPassUsuarioPeticion(usuarioEdicion)
    }
    setUsuarioEdicion(null)
  }

  /// Método que cierra alerta de reenvio de correo

  const cancelarAlertaReenvioCorreo = async () => {
    setMostrarAlertaReenvioCorreo(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }

  /// Método que oculta la alerta de reenvio de correo y procede a llamar la petición
  const aceptarAlertaReenvioCorreo = async () => {
    setMostrarAlertaReenvioCorreo(false)
    if (usuarioEdicion) {
      await reenviarCorreoActivacionPeticion(usuarioEdicion)
    }
    setUsuarioEdicion(null)
  }

  /// Método que define permisos por rol desde la sesión
  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    imprimir('usuarios..')
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerRolesPeticion()
      .then(() => {
        obtenerUsuariosPeticion()
          .catch(() => { })
          .finally(() => { })
      })
      .catch(() => { })
      .finally(() => { })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filtroRoles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroUsuario,
  ])

  useEffect(() => {
    if (!mostrarFiltroUsuarios) {
      setFiltroUsuario('')
      setFiltroRoles([])
    }
  }, [mostrarFiltroUsuarios])

  return (
    <>
      <title>{`Usuarios - ${siteName()}`}</title>

      <AlertDialog
        isOpen={mostrarAlertaRestablecerUsuario}
        titulo={'Alerta'}
        texto={`¿Está seguro de restablecer la contraseña de
         ${titleCase(usuarioEdicion?.nombres ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaRestablecerUsuario}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaRestablecerUsuario}>
          Aceptar
        </Button>
      </AlertDialog>
      <AlertDialog
        isOpen={mostrarAlertaReenvioCorreo}
        titulo={'Alerta'}
        texto={`¿Está seguro de reenviar el correo de activación de
         ${titleCase(usuarioEdicion?.nombres ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaReenvioCorreo}>Cancelar</Button>
        <Button onClick={aceptarAlertaReenvioCorreo}>Aceptar</Button>
      </AlertDialog>

      <CustomDialog
        isOpen={modalUsuario}
        handleClose={cerrarModalUsuario}
        title={usuarioEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <VistaModalUsuario
          usuario={usuarioEdicion}
          roles={rolesData}
          accionCorrecta={() => {
            cerrarModalUsuario().finally()
            obtenerUsuariosPeticion().finally()
          }}
          accionCancelar={cerrarModalUsuario}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Usuarios APM'}
        error={!!errorData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroUsuarios && (
            <FiltroUsuarios
              rolesDisponibles={rolesData}
              filtroRoles={filtroRoles}
              filtroUsuario={filtroUsuario}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroRoles(filtros.roles)
                setFiltroUsuario(filtros.usuario)
              }}
              accionCerrar={() => { }}
            />
          )
        }
        paginacion={
          <Paginacion
            pagina={pagina}
            limite={limite}
            total={total}
            cambioPagina={setPagina}
            cambioLimite={setLimite}
          />
        }
      />
    </>
  )
}
