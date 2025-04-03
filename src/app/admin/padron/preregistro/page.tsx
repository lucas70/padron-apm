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
import { InterpreteMensajes } from "@/utils";
import { imprimir } from "@/utils/imprimir";
import { useMediaQuery, useTheme, Typography, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from 'react'
import { IconoBoton } from "@/components/botones/IconoBoton";
import { useDatoGralStore } from "@/lib/_store/datoGralStore";


export default function PreregistroPage() {
  // router para conocer la ruta actual
  const pathname = usePathname()
  const [errorModulosData, setErrorModulosData] = useState<any>()
  const [mostrarFiltroModulo, setMostrarFiltroModulo] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [apmsData, setApmsData] = useState<any[]>([])
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
      { campo: 'tipoApm', nombre: 'Tipo' },
      { campo: 'numeroDocumento', nombre: 'Documento N°' },
      { campo: 'razonSocial', nombre: 'Razón Social' },
      { campo: 'municipio', nombre: 'Municipio' },
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
  ])

  useEffect(() => {
    definirPermisos().finally()
  }, [])

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarApmToggle'}
      key={'accionFiltrarApmToggle'}
      icono="search"
      seleccionado={mostrarFiltroModulo}
      cambiar={setMostrarFiltroModulo}
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
              clearState()
              obtenerApm(apmData.id)

              router.replace('/admin/padron/edicion')
            }}
            icono={'edit'}
            name={'Editar módulo'}
          />
        )}
      </Stack>,
    ]
  )


  return (
    <div>
      <CustomDataTable
        titulo={'Pre-Registro'}
        error={!!errorModulosData}
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
