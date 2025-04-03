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
import { RepresentanteCRUDType } from "./types/representanteCRUDType";
import { ModalRepresentante } from "./ui/modalRepresentante";

export default function BandejaRepresentantesPage() {
  // router para conocer la ruta actual
  const pathname = usePathname()
  const [errorData, setErrorData] = useState<any>()
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [modalRepresentante, setModalRepresentante] = useState(false)
  const [representanteEdicion, setRepresentanteEdicion] = useState<RepresentanteCRUDType | undefined>()
  const [representantesData, setRepresentantesData] = useState<any[]>([])
  const [mostrarAlertaEliminarRepresentante, setMostrarAlertaEliminarRepresentante] = useState(false)
  const { datoGral, clearState, updateDatoGral } = useDatoGralStore((state) => state)
  const [representanteRecuperado, setRepresentanteRecuperado] = useState({});

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
      { campo: 'primerApellido', nombre: 'Primer Apellido' },
      { campo: 'segundoApellido', nombre: 'Segundo Apellido' },
      { campo: 'nombres', nombre: 'Nombres' },
      { campo: 'tipoDocumento', nombre: 'Tipo Docto.' },
      { campo: 'numeroDocumento', nombre: 'Número Docto.' },
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


  const obtenerRepresentantes = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/representante/${datoGral.id}`,
        params: {
          pagina: pagina,
          limite: limite,
        },
      })
      setRepresentantesData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener los representantes del APM`, e)
      setErrorData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

    const obtenerRepresentante = async (id:string) => {
      try {
        setLoading(true)
  
        const respuesta = await sesionPeticion({
          url: `${Constantes.baseUrl}/representante/${id}/representante`
        })
  
        console.log('representante 1:->',respuesta.datos.filas[0]);

        if(respuesta.datos.total === 1 ) {
          setRepresentanteRecuperado(respuesta.datos.filas[0]);
        }
        console.log('representante 2:->',representanteRecuperado);
  
        setError(null)
      } catch (e) {
        imprimir(`Error al obtener tipos de representante`, e)
        setError(e)
        Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

  const agregarRepresentantesModal = () => {
    setRepresentanteEdicion(undefined)
    setModalRepresentante(true)
  }
  const editarRepresentanteModal = (representante: RepresentanteCRUDType) => {
    setRepresentanteEdicion(representante)
    setModalRepresentante(true)
  }

  const cerrarModalRepresentante = async () => {
    setModalRepresentante(false)
    await delay(500)
    setRepresentanteEdicion(undefined)
  }

  useEffect(() => {
    obtenerRepresentantes().finally()
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
      id={'accionFiltrarRepresentanteToggle'}
      key={'accionFiltrarRepresentanteToggle'}
      icono="search"
      seleccionado={mostrarFiltro}
      cambiar={setMostrarFiltro}
    />,
    <IconoTooltip
      id={`ActualizarRepresentante`}
      titulo={'Actualizar'}
      key={`ActualizarRepresentante`}
      accion={async () => {
        await obtenerRepresentantes()
      }}
      icono={'refresh'}
      name={'Actualizar lista de Representante'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarRepresentante'}
        key={'agregarRepresentante'}
        texto={'Nuevo Representante'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar representante'}
        accion={() => {
          agregarRepresentantesModal()
        }}
      />
    ),
  ]


  const contenidoTabla: Array<Array<ReactNode>> = representantesData.map(
    (representanteData, indexApm) => [

      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.tipoRepresentanteLegal.nombre}`}</Typography>,
      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.primerApellido}`}</Typography>,
      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.segundoApellido}`}</Typography>,
      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.nombres}`}</Typography>,
      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.tipoDocumento.nombre}`}</Typography>,
      <Typography
        key={`${representanteData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${representanteData.numeroDocumento}`}</Typography>,

      <Stack
        key={`${representanteData.id}-${indexApm}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >

        {permisos.update && (
          <IconoTooltip
            id={`editarModulo-${representanteData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, representanteData)
              obtenerRepresentante(representanteData.id)
              
              editarRepresentanteModal(representanteRecuperado? representanteData: {})
            }}
            icono={'edit'}
            name={'Editar representante'}
          />
        )}
        {permisos.delete && (
          <IconoTooltip
            id={`eliminarRepresentante-${indexApm}`}
            titulo={'Eliminar'}
            color={'error'}
            accion={() => {
              imprimir(`Eliminaremos`, representanteData)
              eliminarRepresentanteModal(representanteData)
            }}
            icono={'delete_outline'}
            name={'Eliminar representante'}
          />
        )}
      </Stack>,
    ]
  )

  const eliminarRepresentantePeticion = async (representante: RepresentanteCRUDType) => {
    console.log('id:', representante)
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/representante/${representante.id}/inactivacion`,
        method: 'patch',
      })
      imprimir(`respuesta eliminar representante: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerRepresentantes()
    } catch (e) {
      imprimir(`Error al eliminar representante`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const eliminarRepresentanteModal = (representante: RepresentanteCRUDType) => {
    setRepresentanteEdicion(representante) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarRepresentante(true) // para mostrar alerta de usuarios
  }

  const cancelarAlertaEliminarRepresentante = () => {
    setMostrarAlertaEliminarRepresentante(false)
    setRepresentanteEdicion(undefined)
  }

  const aceptarAlertaEliminarRepresentante = async () => {
    setMostrarAlertaEliminarRepresentante(false)
    if (representanteEdicion) {
      await eliminarRepresentantePeticion(representanteEdicion)
    }
  }

  return (
    <div>
      <AlertDialog
        isOpen={mostrarAlertaEliminarRepresentante}
        titulo={'Alerta'}
        texto={`¿Está seguro de eliminar el registro de representante: ${representanteEdicion?.primerApellido} ${representanteEdicion?.segundoApellido} ${representanteEdicion?.nombres} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEliminarRepresentante}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEliminarRepresentante}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalRepresentante}
        handleClose={cerrarModalRepresentante}
        maxWidth={'sm'}
        title={representanteEdicion ? 'Editar representante' : 'Nuevo representante'}
      >
        <ModalRepresentante
          idActorMinero={datoGral.id}
          representante={representanteEdicion}
          accionCorrecta={() => {
            cerrarModalRepresentante().finally()
            obtenerRepresentantes().finally()
          }}
          accionCancelar={cerrarModalRepresentante}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Representantes'}
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
