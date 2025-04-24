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
import { InterpreteMensajes, titleCase } from "@/utils";
import { imprimir } from "@/utils/imprimir";
import { useMediaQuery, useTheme, Typography, Stack, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from 'react'
import { IconoBoton } from "@/components/botones/IconoBoton";
import { useDatoGralStore } from "@/lib/_store/datoGralStore";
import { FiltroApm } from "./ui/FiltroApm";
import { Imprima } from "next/font/google";
import { AlertDialog } from "@/components/modales/AlertDialog";


export default function RegistroPage() {
  // router para conocer la ruta actual
  const pathname = usePathname()
  const [errorModulosData, setErrorModulosData] = useState<any>()
  const [mostrarFiltroApm, setMostrarFiltroApm] = useState(false)
  const [filtroApm, setFiltroApm] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [apmsData, setApmsData] = useState<any[]>([])
  const { datoGral, clearState, updateDatoGral } = useDatoGralStore((state) => state)
  const [datoSeleccionado, setDatoSeleccionado] = useState<any>()

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
      { campo: 'tipoApm', nombre: 'Tipo' },
      { campo: 'numeroDocumento', nombre: 'Documento N°' },
      { campo: 'razonSocial', nombre: 'Razón Social' },
      { campo: 'municipio', nombre: 'Municipio' },
      { campo: 'etapa', nombre: 'Etapa' },
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

  const obtenerApm = async (id: string) => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/${id}/actor`
      })

      updateDatoGral({
        ...datoGral,
        id: respuesta.datos.filas[0].id,
        razonSocial: respuesta.datos.filas[0].razonSocial,
        numeroDocumento: respuesta.datos.filas[0].numeroDocumento,
        nia: respuesta.datos.filas[0].nia,
        telefono: respuesta.datos.filas[0].telefono,
        celular: respuesta.datos.filas[0].celular,
        correoElectronico: respuesta.datos.filas[0].correoElectronico,
        tipoActorMinero: { id: respuesta.datos.filas[0].tipoActorMinero.id, descripcion: respuesta.datos.filas[0].tipoActorMinero.nombre },
        municipio: { id: respuesta.datos.filas[0].municipio.id, descripcion: respuesta.datos.filas[0].municipio.nombre },
        departamento: { id: respuesta.datos.filas[0].municipio.dependencia.dependencia.id, descripcion: respuesta.datos.filas[0].municipio.dependencia.dependencia.nombre },
        etapaActorMinero: { id: respuesta.datos.filas[0].etapaActorMinero.id, descripcion: respuesta.datos.filas[0].etapaActorMinero.nombre },
        oficina: { id: respuesta.datos.filas[0].oficina.id, descripcion: respuesta.datos.filas[0].oficina.nombre },
        estado: respuesta.datos.filas[0].estado
      })
      setError(null)
    } catch (e) {
      imprimir(`Error al obtener los datos del APM`, e)
      setError(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  const obtenerApms = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/bandeja`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroApm.length == 0 ? {} : { filtro: filtroApm }),
        },
      })
      setApmsData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorModulosData(null)
    } catch (e) {
      imprimir(`Error al obtener APM`, e)
      setErrorModulosData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerApms().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    filtroApm,
  ])

  useEffect(() => {
    definirPermisos().finally()
  }, [])

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarApmToggle'}
      key={'accionFiltrarApmToggle'}
      icono="search"
      seleccionado={mostrarFiltroApm}
      cambiar={setMostrarFiltroApm}
    />,
    <IconoTooltip
      id={`ActualizarApm`}
      titulo={'Actualizar'}
      key={`ActualizarApm`}
      accion={async () => {
        await obtenerApms()
      }}
      icono={'refresh'}
      name={'Actualizar lista de Apm'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarApm'}
        key={'agregarApm'}
        texto={'Nuevo APM'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar nuevp APM'}
        accion={() => {
          clearState()
          router.replace('/admin/padron/edicion')
        }}
      />
    ),
  ]

  const contenidoTabla: Array<Array<ReactNode>> = apmsData.map(
    (apmData, indexApm) => [

      <Typography
        key={`${apmData.id}-${indexApm}-label`}
        variant={'body2'}
      >{`${apmData.tipoActorMinero.nombre}`}</Typography>,
      <Typography
        key={`${apmData.id}-${indexApm}-descripcion`}
        variant={'body2'}
      >{`${apmData.numeroDocumento}`}</Typography>,

      <Typography key={`${apmData.id}-${indexApm}-url`} variant={'body2'}>
        {`${apmData.razonSocial}`}
      </Typography>,

      <Typography key={`${apmData.id}-${indexApm}-url`} variant={'body2'}>
        {`${apmData.municipio.nombre}`}
      </Typography>,

      <Typography key={`${apmData.id}-${indexApm}-url`} variant={'body2'}>
        {`${apmData.etapaActorMinero.nombre}`}
      </Typography>,

      <Stack
        key={`${apmData.id}-${indexApm}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >

        {permisos.update && (
          <IconoTooltip
            id={`editarModulo-${apmData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos :`, apmData)
              setDatoSeleccionado(apmData);
              if (apmData.etapaActorMinero.id != 50) {
                clearState()
                obtenerApm(apmData.id)
                router.replace('/admin/padron/edicion')
              } else {
                setMostrarConfirmacion(true)
              }

            }}
            icono={'edit'}
            name={'Editar módulo'}
          />
        )}
      </Stack>,
    ]
  )

  useEffect(() => {
    if (!mostrarFiltroApm) {
      setFiltroApm('')
    }
  }, [mostrarFiltroApm])

  const cancelarConfirmacion = async () => {
    setMostrarConfirmacion(false)
  }

  const guardarDatosGrales = async () => {
    console.log('datos a guardar:', datoGral);
    try {
      setLoading(true)
      //await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/${datoSeleccionado.id}`,
        method: 'patch',
        body: {
          idTipoActorMinero: datoSeleccionado.tipoActorMinero.id,
          idMunicipio: datoSeleccionado.municipio.id,
          razonSocial: datoSeleccionado.razonSocial,
          numeroDocumento: datoSeleccionado.numeroDocumento,
          telefono: datoSeleccionado.telefono,
          celular: datoSeleccionado.celular,
          correoElectronico: datoSeleccionado.correoElectronico,
          idEtapa: "50",
          estado: "ACTIVO"
        },
      })
      updateDatoGral({
        ...datoGral,
        id: respuesta.datos.filas[0].id,
        razonSocial: respuesta.datos.filas[0].razonSocial,
        numeroDocumento: respuesta.datos.filas[0].numeroDocumento,
        nia: respuesta.datos.filas[0].nia,
        telefono: respuesta.datos.filas[0].telefono,
        celular: respuesta.datos.filas[0].celular,
        correoElectronico: respuesta.datos.filas[0].correoElectronico,
        tipoActorMinero: { id: respuesta.datos.filas[0].tipoActorMinero.id, descripcion: respuesta.datos.filas[0].tipoActorMinero.nombre },
        municipio: { id: respuesta.datos.filas[0].municipio.id, descripcion: respuesta.datos.filas[0].municipio.nombre },
        departamento: { id: respuesta.datos.filas[0].municipio.dependencia.dependencia.id, descripcion: respuesta.datos.filas[0].municipio.dependencia.dependencia.nombre },
        etapaActorMinero: { id: respuesta.datos.filas[0].etapaActorMinero.id, descripcion: respuesta.datos.filas[0].etapaActorMinero.nombre },
        oficina: { id: respuesta.datos.filas[0].oficina.id, descripcion: respuesta.datos.filas[0].oficina.nombre },
        estado: respuesta.datos.filas[0].estado
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })

    } catch (e) {
      imprimir(`Error al crear o actualizar los datos del APM`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const aceptarConfirmacion = async () => {

    guardarDatosGrales();
    setMostrarConfirmacion(false)
    router.replace('/admin/padron/edicion')
  }

  return (
    <div>
      <AlertDialog
        isOpen={mostrarConfirmacion}
        titulo={'Actualización'}
        texto={`¿Necesitas actualizar tus datos vigentes? Si tu respuesta es afirmativa, entonces se creará un registro temporal para que registres los cambios.`}
      >
        <Button variant={'outlined'} onClick={cancelarConfirmacion}>
          NO
        </Button>
        <Button variant={'contained'} onClick={aceptarConfirmacion}>
          SI
        </Button>
      </AlertDialog>
      <CustomDataTable
        titulo={'Registro'}
        error={!!errorModulosData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroApm && (
            <FiltroApm
              buscarApm={filtroApm}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroApm(filtros.buscar)
              }}
              accionCerrar={() => { }}
            />
          )
        }
      />
    </div>
  );
}

