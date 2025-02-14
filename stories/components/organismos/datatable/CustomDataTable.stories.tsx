import { Meta, StoryFn } from '@storybook/react'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { ColumnaType } from '@/types'
import { ReactNode, useEffect, useState } from 'react'
import { Box, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { BotonAcciones } from '@/components/botones/BotonAcciones'
import { Paginacion } from '@/components/datatable/Paginacion'
import { CriterioOrdenType, OrdenEnum } from '@/components/datatable/ordenTypes'
import { stringToDate } from '@/utils/fechas'
import { FiltrosDatatable } from './FiltrosDataTable'
import { FiltrosTab } from './FiltrosTab'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'


export default {
  title: 'Organismos/Datatable/CustomDataTable',
  component: CustomDataTable,
  parameters: {
    docs: {
      description: {
        component:
          'El componente `CustomDataTable` es tabla de datos personalizada que acepta varias propiedades (props), como la definición de las columnas, el contenido de la tabla, la paginación, los filtros y las acciones, entre otras.',
      },
    },
  },
} as Meta<typeof CustomDataTable>

// const eventsFromNames = actions('accion')

// replica del componente
const Template: StoryFn<typeof CustomDataTable> = (args) => (
  <CustomDataTable {...args} />
)

/// Columnas para data table
const columnas: Array<ColumnaType> = [
  { campo: 'nombre', nombre: 'Nombre' },
  { campo: 'resumen', nombre: 'Resumen' },
  { campo: 'categoria', nombre: 'Categoría' },
  { campo: 'fechaPublicacion', nombre: 'Fecha Publicación' },
  { campo: 'acciones', nombre: 'Eventos' },
]
const solicitudesData = [
  {
    id: '1',
    nombre: 'Cien años de soledad',
    categoria: 'Fantasía',
    resumen:
      'Una novela de realismo mágico que cuenta la historia de la familia Buendía a lo largo de varias generaciones en el ficticio pueblo de Macondo.',
    fechaPublicacion: '1967-05-30',
  },
  {
    id: '2',
    nombre: '1984',
    categoria: 'Fantasía',
    resumen:
      'Una novela distópica que presenta una sociedad totalitaria y vigilante en la que el gobierno controla cada aspecto de la vida de sus ciudadanos.',
    fechaPublicacion: '1949-06-08',
  },
  {
    id: '3',
    nombre: 'El señor de los anillos',
    categoria: 'Fantasía',
    resumen:
      'Una épica trilogía de fantasía que sigue las aventuras de hobbits, elfos, magos y guerreros en su búsqueda para destruir el anillo del poder y derrotar al malvado Sauron.',
    fechaPublicacion: '1954-07-29',
  },
  {
    id: '4',
    nombre: 'Matar a un ruiseñor',
    categoria: 'Histórico',
    resumen:
      'Una novela clásica de la literatura estadounidense que aborda temas de racismo y justicia a través de la historia de un abogado que defiende a un hombre negro injustamente acusado de un delito.',
    fechaPublicacion: '1960-07-11',
  },
  {
    id: '5',
    nombre: 'Harry Potter y la piedra filosofal',
    categoria: 'Fantasía',
    resumen:
      'El primer libro de la serie de fantasía juvenil que sigue las aventuras de un joven mago llamado Harry Potter mientras asiste a la escuela de magia y hechicería de Hogwarts.',
    fechaPublicacion: '1997-06-26',
  },
  {
    id: '6',
    nombre: `Planeta 'Volver a empezar'`,
    categoria: 'Romance',
    resumen:
      'La alegŕa de Ryle se desvanece cuando piensa que, aunque ya no están casados, sigue teniendo un papel en la familia, y no consentirá que Atlas Corrigan esté presente en su vida y en la de su hija.',
    fechaPublicacion: '2023-01-11',
  },
  {
    id: '7',
    nombre: 'Emperador de Roma',
    categoria: 'Histórico',
    resumen:
      'Emperador de Roma nos lleva directamente hasta el corazón de Roma, y de nuestras fantasías sobre lo que era ser romano, a través de un relato como nunca antes se había contado.',
    fechaPublicacion: '2023-10-25',
  },
  {
    id: '8',
    nombre: 'Planeta silencioso',
    categoria: 'Ciencia',
    resumen:
      'Goulson explora la conexión intrínseca entre el cambio climático, la naturaleza, la vida silvestre y la disminución de la biodiversidad y analiza el impacto dañino por el uso excesivo de insecticidas y fertilizantes para la tierra y sus habitantes.',
    fechaPublicacion: '2023-04-05',
  },
  {
    id: '9',
    nombre: 'Breves respuestas a las grandes preguntas',
    categoria: 'Ciencia',
    resumen:
      'Esta obra simplifica los hechos y descubrimientos de Stephen Hawking, el cual fue reconocido como una de las mentes más brillantes de nuestro tiempo y una figura de inspiración después de desafiar su diagnóstico de ELA a la edad de veintiún años.',
    fechaPublicacion: '2018-08-30',
  },
  {
    id: '10',
    nombre: 'Una historia ridícula',
    categoria: 'Humor',
    resumen:
      'Marcial es un hombre exigente, con don de palabra, y orgulloso de su formación autodidacta. Un día se encuentra con una mujer que no solo le fascina, sino que reúne todo aquello que le gustaría tener en la vida: buen gusto, alta posición, relaciones con gente interesante.',
    fechaPublicacion: '2022-02-02',
  },
  {
    id: '11',
    nombre: 'El Irlandés',
    categoria: 'Histórico',
    resumen:
      'Más conocido como "el irlandés", Frank Sheeran fue un sicario responsable de más de 25 asesinatos, entre ellos el de Jimmy Hoffa, poderoso jefe del sindicato de camioneros.',
    fechaPublicacion: '2019-08-22',
  },
]

const contenidoTabla: Array<Array<ReactNode>> = solicitudesData.map(
  (solicitudData, index) => [
    <Typography key={`${solicitudData.id}-${index}-nombre`} variant={'body2'}>
      {`${solicitudData.nombre}`}
    </Typography>,

    <Typography key={`${solicitudData.id}-${index}-resumen`} variant={'body2'}>
      {`${solicitudData.resumen}`}
    </Typography>,

    <Typography
      key={`${solicitudData.id}-${index}-categoria`}
      variant={'body2'}
    >
      {`${solicitudData.categoria}`}
    </Typography>,

    <Typography
      key={`${solicitudData.id}-${index}-fechaPublicacion`}
      variant={'body2'}
    >
      {solicitudData.fechaPublicacion}
    </Typography>,

    <Stack direction={'row'} key={`${solicitudData.id}-${index}-acciones`}>
      <IconoTooltip
        id={'editarLibro'}
        titulo={'Editar libro'}
        color={'success'}
        accion={() => {}}
        icono={'edit'}
        name={'Editar libro'}
      />
      <IconoTooltip
        id={'verLibro'}
        titulo={'Ver libro'}
        color={'info'}
        accion={() => {}}
        icono={'visibility'}
        name={'Ver libro'}
      />
      <IconoTooltip
        id={'eliminarLibro'}
        titulo={'Eliminar libro'}
        color={'warning'}
        accion={() => {}}
        icono={'delete'}
        name={'Eliminar libro'}
      />
    </Stack>,
  ]
)
/// Columnas
export const Columnas = Template.bind({})
Columnas.parameters = {
  docs: {
    description: {
      story: 'Componente `CustomDataTable` con datos de libros.',
    },
  },
}
Columnas.args = {
  titulo: 'Tabla Libros',
  error: false,
  acciones: [],
  columnas: columnas,
  contenidoTabla: contenidoTabla,
}

/* const acciones: Array<ReactNode> = [
  <IconoTooltip
    id={'buscarProyecto'}
    titulo={'Buscar proyecto'}
    key={`BuscarProyecto`}
    accion={() => {}}
    icono={'search'}
    name={'buscarProyecto'}
  />,
  <IconoTooltip
    id={'actualizarProyecto'}
    titulo={'Actualizar proyecto'}
    key={`accionActualizarProyecto`}
    accion={() => {}}
    icono={'refresh'}
    name={'actualizarProyecto'}
  />,
  <IconoTooltip
    id={'agregarProyecto'}
    titulo={'Agregar proyecto'}
    key={`accionAgregarProyecto`}
    accion={() => {}}
    icono={'add_circle_outline'}
    name={'agregarProyecto'}
  />,
] */
/// Acciones 3
const Template3: StoryFn<typeof CustomDataTable> = (args) => {
  const [mostrarFiltroRol, setMostrarFiltroRol] = useState(false)
  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarRolToggle'}
      key={'accionFiltrarRolToggle'}
      icono="search"
      seleccionado={mostrarFiltroRol}
      cambiar={setMostrarFiltroRol}
    />,
    <IconoTooltip
      id={'actualizarProyecto'}
      titulo={'Actualizar proyecto'}
      key={`accionActualizarProyecto`}
      accion={() => {}}
      icono={'refresh'}
      name={'actualizarProyecto'}
    />,
    <IconoTooltip
      id={'agregarProyecto'}
      titulo={'Agregar proyecto'}
      key={`accionAgregarProyecto`}
      accion={() => {}}
      icono={'add_circle_outline'}
      name={'agregarProyecto'}
    />,
    <BotonAcciones
      id={'agregarModuloSeccion'}
      key={'agregarModuloSeccion'}
      icono={'more_vert'}
      texto={'Agregar'}
      variante={'icono'}
      label={'Agregar libros'}
      acciones={[
        {
          id: 'agregarLibros',
          mostrar: true,
          titulo: 'Importar libro',
          accion: async () => {},
          desactivado: false,
          icono: 'import_contacts',
          name: 'Importar libro',
        },
        {
          id: '1',
          mostrar: true,
          titulo: 'Denunciar',
          accion: async () => {},
          desactivado: false,
          icono: 'flag',
          name: 'denunciar',
        },
      ]}
    />,
  ]
  const Filtro = () => {
    return (
      <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
        <InputLabel>
          <Typography sx={{ color: 'text.primary' }}>{`Buscar`}</Typography>
          <TextField sx={{ bgcolor: 'background.paper' }}></TextField>
        </InputLabel>
      </Box>
    )
  }
  args.acciones = acciones
  args.filtros = mostrarFiltroRol && <Filtro />

  return <CustomDataTable {...args} />
}
export const Acciones3 = Template3.bind({})
Acciones3.storyName = 'Tabla con acciones'
Acciones3.args = {
  ...Columnas.args,
}
Acciones3.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con la propiedad `acciones` establecida.',
    },
  },
}
/// Variable con parámetros de paginación
const paginacion = (
  <Paginacion
    pagina={1}
    limite={20}
    total={500}
    cambioPagina={() => {}}
    cambioLimite={() => {}}
  />
)

export const SB_PAGINACION = Template3.bind({})
SB_PAGINACION.storyName = 'Paginación'
SB_PAGINACION.args = {
  ...Columnas.args,
  paginacion: paginacion,
}
SB_PAGINACION.parameters = {
  docs: {
    description: {
      story: 'Componente `CustomDataTable` con la propiedad de `paginación`.',
    },
  },
}
// Tabla Cargando
export const Cargando = Template3.bind({})

Cargando.storyName = 'Tabla cargando'
Cargando.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con la propiedad `cargando` con el valor `true` establecido.',
    },
  },
}
Cargando.args = {
  ...Columnas.args,
  cargando: true,
}
/// Orden por columna
const Template1: StoryFn<typeof CustomDataTable> = (args) => {
  const [datos, setDatos] = useState<any[]>([
    {
      nombre: 'Toy Story',
      resumen:
        'Un vaquero de juguete llamado Woody es el favorito de su dueño Andy, pero su posición se ve amenazada cuando llega un nuevo juguete, Buzz Lightyear.',
      fechaPublicacion: '1995',
    },
    {
      nombre: 'Buscando a Nemo',
      resumen:
        'Un pez payaso joven llamado Nemo es capturado y llevado a un acuario en Sydney. Su padre Marlin y Dory, un pez cirujano con problemas de memoria, se embarcan en una aventura para rescatarlo.',
      fechaPublicacion: '2003',
    },
    {
      nombre: 'Los Increíbles',
      resumen:
        'Una familia de superhéroes retirados se ve obligada a volver a la acción para salvar al mundo de un villano malvado.',
      fechaPublicacion: '2004',
    },
    {
      nombre: 'Up',
      resumen:
        'Un viudo llamado Carl Fredricksen se embarca en una aventura en su casa voladora para cumplir el sueño de su difunta esposa de viajar a Sudamérica.',
      fechaPublicacion: '2009',
    },
    {
      nombre: 'Inside Out',
      resumen:
        'La película sigue alas emociones de una niña llamada Riley mientras atraviesa un momento difícil en su vida y debe lidiar con el cambio y la adaptación a una nueva ciudad.',
      fechaPublicacion: '2015',
    },
  ])

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombre', nombre: 'Nombre', ordenar: true, orden: OrdenEnum.DESC },
    { campo: 'resumen', nombre: 'Resumen', ordenar: true },
    {
      campo: 'fechaPublicacion',
      nombre: 'Fecha Publicación',
      ordenar: true,
    },
    { campo: 'acciones', nombre: 'Eventos' },
  ])
  const contenidoTabla: Array<Array<ReactNode>> = datos.map(
    (solicitudData, index) => [
      <Typography key={`${solicitudData.id}-${index}-nombre`} variant={'body2'}>
        {`${solicitudData.nombre}`}
      </Typography>,

      <Typography
        key={`${solicitudData.id}-${index}-resumen`}
        variant={'body2'}
      >
        {`${solicitudData.resumen}`}
      </Typography>,

      <Typography
        key={`${solicitudData.id}-${index}-fechaPublicacion`}
        variant={'body2'}
      >
        {solicitudData.fechaPublicacion}
      </Typography>,

      <Stack direction={'row'} key={`${solicitudData.id}-${index}-acciones`}>
        <IconoTooltip
          id={'editarLibro'}
          titulo={'Editar libro'}
          color={'success'}
          accion={() => {}}
          icono={'edit'}
          name={'Editar libro'}
        />
        <IconoTooltip
          id={'verLibro'}
          titulo={'Ver libro'}
          color={'info'}
          accion={() => {}}
          icono={'visibility'}
          name={'Ver libro'}
        />
        <IconoTooltip
          id={'eliminarLibro'}
          titulo={'Eliminar libro'}
          color={'warning'}
          accion={() => {}}
          icono={'delete'}
          name={'Eliminar libro'}
        />
      </Stack>,
    ]
  )
  args.columnas = ordenCriterios
  args.contenidoTabla = contenidoTabla
  args.cambioOrdenCriterios = setOrdenCriterios
  useEffect(() => {
    const result = ordenCriterios.filter((order) => order.orden !== undefined)
    //console.log(result)
    if (result != undefined && result.length > 0) {
      const campo = result[0].campo
      const f = datos.sort((x, y) => {
        const r = x[campo].localeCompare(y[campo])
        return result[0].orden === OrdenEnum.DESC ? -r : r
      })
      setDatos(f)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenCriterios])
  return <CustomDataTable {...args} />
}

export const HeadFiltro = Template1.bind({})
HeadFiltro.storyName = 'Orden por columna'
HeadFiltro.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con la opción de ordenar los datos por columna.',
    },
  },
}
HeadFiltro.args = {
  titulo: 'Tabla Libros',
  error: false,
  cargando: false,
}

/// Selector de filas
const Template2: StoryFn<typeof CustomDataTable> = (args) => {
  const [datos, setDatos] = useState<any[]>([
    {
      nombre: 'Toy Story',
      resumen:
        'Un vaquero de juguete llamado Woody es el favorito de su dueño Andy, pero su posición se ve amenazada cuando llega un nuevo juguete, Buzz Lightyear.',
      fechaPublicacion: '1995',
    },
    {
      nombre: 'Buscando a Nemo',
      resumen:
        'Un pez payaso joven llamado Nemo es capturado y llevado a un acuario en Sydney. Su padre Marlin y Dory, un pez cirujano con problemas de memoria, se embarcan en una aventura para rescatarlo.',
      fechaPublicacion: '2003',
    },
    {
      nombre: 'Los Increíbles',
      resumen:
        'Una familia de superhéroes retirados se ve obligada a volver a la acción para salvar al mundo de un villano malvado.',
      fechaPublicacion: '2004',
    },
    {
      nombre: 'Up',
      resumen:
        'Un viudo llamado Carl Fredricksen se embarca en una aventura en su casa voladora para cumplir el sueño de su difunta esposa de viajar a Sudamérica.',
      fechaPublicacion: '2009',
    },
    {
      nombre: 'Inside Out',
      resumen:
        'La película sigue alas emociones de una niña llamada Riley mientras atraviesa un momento difícil en su vida y debe lidiar con el cambio y la adaptación a una nueva ciudad.',
      fechaPublicacion: '2015',
    },
  ])

  const [datosSeleccionado, setDatosSeleccionado] = useState<any>([])

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      id={'buscarProyecto'}
      titulo={'Buscar proyecto'}
      key={`BuscarProyecto`}
      accion={() => {}}
      icono={'search'}
      name={'buscarProyecto'}
    />,
    <IconoTooltip
      id={'actualizarProyecto'}
      titulo={'Actualizar proyecto'}
      key={`accionActualizarProyecto`}
      accion={() => {}}
      icono={'refresh'}
      name={'actualizarProyecto'}
    />,
    <IconoTooltip
      id={'agregarProyecto'}
      titulo={'Agregar proyecto'}
      key={`accionAgregarProyecto`}
      accion={() => {}}
      icono={'add_circle_outline'}
      name={'agregarProyecto'}
    />,
  ]

  const accionesMultiples: Array<ReactNode> = [
    <IconoTooltip
      id={'imprimir'}
      titulo={'Obtener reporte'}
      key={`imprimir`}
      accion={() => {}}
      icono={'print'}
      name={'imprimir'}
    />,
    <IconoTooltip
      id={'actualizarProyecto'}
      titulo={'Actualizar'}
      key={`accionActualizarProyecto`}
      accion={() => {}}
      icono={'refresh'}
      name={'actualizarProyecto'}
    />,
  ]

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombre', nombre: 'Nombre', ordenar: true, orden: OrdenEnum.DESC },
    { campo: 'resumen', nombre: 'Resumen', ordenar: true },
    {
      campo: 'fechaPublicacion',
      nombre: 'Fecha Publicación',
      ordenar: true,
    },
    { campo: 'acciones', nombre: 'Eventos' },
  ])
  const contenidoTabla: Array<Array<ReactNode>> = datos.map(
    (solicitudData, index) => [
      <Typography key={`${solicitudData.id}-${index}-nombre`} variant={'body2'}>
        {`${solicitudData.nombre}`}
      </Typography>,

      <Typography
        key={`${solicitudData.id}-${index}-resumen`}
        variant={'body2'}
      >
        {`${solicitudData.resumen}`}
      </Typography>,

      <Typography
        key={`${solicitudData.id}-${index}-fechaPublicacion`}
        variant={'body2'}
      >
        {solicitudData.fechaPublicacion}
      </Typography>,

      <Stack direction={'row'} key={`${solicitudData.id}-${index}-acciones`}>
        <IconoTooltip
          id={'editarLibro'}
          titulo={'Editar libro'}
          color={'success'}
          accion={() => {}}
          icono={'edit'}
          name={'Editar libro'}
        />
        <IconoTooltip
          id={'verLibro'}
          titulo={'Ver libro'}
          color={'info'}
          accion={() => {}}
          icono={'visibility'}
          name={'Ver libro'}
        />
        <IconoTooltip
          id={'eliminarLibro'}
          titulo={'Eliminar libro'}
          color={'warning'}
          accion={() => {}}
          icono={'delete'}
          name={'Eliminar libro'}
        />
      </Stack>,
    ]
  )
  args.acciones = datosSeleccionado.length == 0 ? acciones : accionesMultiples
  args.columnas = ordenCriterios
  args.seleccionable = true
  args.seleccionados = (indices) => {
    setDatosSeleccionado(
      datos.filter((value, index) => indices.includes(index))
    )
  }
  args.contenidoTabla = contenidoTabla
  args.cambioOrdenCriterios = setOrdenCriterios
  useEffect(() => {
    const result = ordenCriterios.filter((order) => order.orden !== undefined)
    //console.log(result)
    if (result != undefined && result.length > 0) {
      const campo = result[0].campo
      const f = datos.sort((x, y) => {
        const r = x[campo].localeCompare(y[campo])
        return result[0].orden === OrdenEnum.DESC ? -r : r
      })
      setDatos(f)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenCriterios])
  return <CustomDataTable {...args} />
}
export const MultiSelector = Template2.bind({})
MultiSelector.storyName = 'Selector de filas'
MultiSelector.parameters = {
  docs: {
    description: {
      story: 'Componente `CustomDataTable` con la opción de seleccionar filas.',
    },
  },
}
MultiSelector.args = {
  titulo: 'Tabla Libros',
  error: false,
  cargando: false,
}
/// Filtros
const Template4: StoryFn<typeof CustomDataTable> = (args) => {
  const [mostrarFiltroRol, setMostrarFiltroRol] = useState(true)
  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarRolToggle'}
      key={'accionFiltrarRolToggle'}
      icono="search"
      seleccionado={mostrarFiltroRol}
      cambiar={setMostrarFiltroRol}
    />,

    <IconoTooltip
      id={'actualizarProyecto'}
      titulo={'Actualizar proyecto'}
      key={`accionActualizarProyecto`}
      accion={() => {}}
      icono={'refresh'}
      name={'actualizarProyecto'}
    />,
    <IconoTooltip
      id={'agregarProyecto'}
      titulo={'Agregar proyecto'}
      key={`accionAgregarProyecto`}
      accion={() => {}}
      icono={'add_circle_outline'}
      name={'agregarProyecto'}
    />,
  ]
  const Filtro = () => {
    return (
      <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
        <InputLabel>
          <Typography sx={{ color: 'text.primary' }}>{`Buscar`}</Typography>
          <TextField sx={{ bgcolor: 'background.paper' }}></TextField>
        </InputLabel>
      </Box>
    )
  }
  args.acciones = acciones
  args.filtros = mostrarFiltroRol && <Filtro />

  return <CustomDataTable {...args} />
}
export const Filtros = Template4.bind({})
Filtros.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con la opción de mostrar y ocultar un campo de filtros.',
    },
  },
}

Filtros.args = {
  ...Columnas.args,
}
/// Filtros adicionales en cabecera personalizada
const Template5: StoryFn<typeof CustomDataTable> = (args) => {
  const categoriasSet = new Set(solicitudesData.map((libro) => libro.categoria))
  const categorias = Array.from(categoriasSet)
  const [filtroPalabraClave, setFiltroPalabraClave] = useState<string>('')
  const [filtroCategorias, setFiltroCategorias] = useState<string[]>([])

  const [filtroFechaInicial, setFiltroFechaInicial] = useState<Date>()
  const [filtroFechaFinal, setFiltroFechaFinal] = useState<Date>()

  interface filtrosType {
    palabraClave: string
    categorias: Array<string>
    fechaInicial?: Date
    fechaFinal?: Date
  }

  interface dataTableType {
    id: string
    nombre: string
    resumen: string
    fechaPublicacion: string
    categoria: string
  }

  const filtrarTabla = (
    dataLibros: Array<dataTableType>,
    filtro: filtrosType
  ) => {
    if (
      filtro.palabraClave ||
      filtro.categorias.length > 0 ||
      filtro.fechaInicial ||
      filtro.fechaFinal
    ) {
      return dataLibros.filter((solicitud) => {
        const cumplePalabraClave = solicitud.nombre
          .toLowerCase()
          .includes(filtro.palabraClave.toLowerCase())
        const cumpleCategorias =
          filtro.categorias.length === 0 ||
          filtro.categorias.includes(solicitud.categoria)
        let cumpleRangoFechas = true
        if (filtro.fechaInicial && filtro.fechaFinal) {
          cumpleRangoFechas =
            stringToDate(solicitud.fechaPublicacion, 'YYYY-MM-DD') >=
              filtro.fechaInicial &&
            stringToDate(solicitud.fechaPublicacion, 'YYYY-MM-DD') <=
              filtro.fechaFinal
        } else if (filtro.fechaInicial) {
          cumpleRangoFechas =
            stringToDate(solicitud.fechaPublicacion, 'YYYY-MM-DD') >=
            filtro.fechaInicial
        } else if (filtro.fechaFinal) {
          cumpleRangoFechas =
            stringToDate(solicitud.fechaPublicacion, 'YYYY-MM-DD') <=
            filtro.fechaFinal
        }
        return cumplePalabraClave && cumpleCategorias && cumpleRangoFechas
      })
    } else {
      return solicitudesData
    }
  }

  const contenidoTablaFiltros = filtrarTabla(solicitudesData, {
    palabraClave: filtroPalabraClave,
    categorias: filtroCategorias,
    fechaInicial: filtroFechaInicial,
    fechaFinal: filtroFechaFinal,
  })
  args.contenidoTabla = contenidoTablaFiltros.map((solicitudData, index) => [
    <Typography key={`${solicitudData.id}-${index}-nombre`} variant={'body2'}>
      {`${solicitudData.nombre}`}
    </Typography>,
    <Typography key={`${solicitudData.id}-${index}-resumen`} variant={'body2'}>
      {`${solicitudData.resumen}`}
    </Typography>,
    <Typography
      key={`${solicitudData.id}-${index}-categoria`}
      variant={'body2'}
    >
      {`${solicitudData.categoria}`}
    </Typography>,
    <Typography
      key={`${solicitudData.id}-${index}-fechaPublicacion`}
      variant={'body2'}
    >
      {solicitudData.fechaPublicacion}
    </Typography>,
    <Stack direction={'row'} key={`${solicitudData.id}-${index}-acciones`}>
      <IconoTooltip
        id={'editarLibro'}
        titulo={'Editar libro'}
        color={'success'}
        accion={() => {}}
        icono={'edit'}
        name={'Editar libro'}
      />
      <IconoTooltip
        id={'verLibro'}
        titulo={'Ver libro'}
        color={'info'}
        accion={() => {}}
        icono={'visibility'}
        name={'Ver libro'}
      />
      <IconoTooltip
        id={'eliminarLibro'}
        titulo={'Eliminar libro'}
        color={'warning'}
        accion={() => {}}
        icono={'delete'}
        name={'Eliminar libro'}
      />
    </Stack>,
  ])
  args.cabeceraPersonalizada = (
    <FiltrosDatatable
      titulo="Tabla con filtros"
      categoriasDisponibles={categorias}
      filtroFechaInicial={filtroFechaInicial}
      filtroFechaFinal={filtroFechaFinal}
      filtroCategorias={filtroCategorias}
      filtroPalabraClave={filtroPalabraClave}
      accionCorrecta={(filtros) => {
        setFiltroCategorias(filtros.categorias)
        setFiltroPalabraClave(filtros.palabraClave)
        setFiltroFechaInicial(filtros.fechaInicial)
        setFiltroFechaFinal(filtros.fechaFinal)
      }}
    />
  )
  return <CustomDataTable {...args} />
}
export const FiltrosAdicionales = Template5.bind({})
FiltrosAdicionales.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con filtros adicionales en la propiedad `cabeceraPersonalizada`.',
    },
  },
}
FiltrosAdicionales.args = {
  ...Columnas.args,
}
/// Pestañas en cabecera personalizada
const Template6: StoryFn<typeof CustomDataTable> = (args) => {
  const [pestanaActiva, setPestanaActiva] = useState<number>(0)

  const pestanas = [
    'Todos',
    ...new Set(solicitudesData.map((libro) => libro.categoria)),
  ]
  const handlePestanaChange = (indicePestana: number) => {
    setPestanaActiva(indicePestana)
    const librosFiltrados =
      indicePestana == 0
        ? solicitudesData
        : solicitudesData.filter(
            (libro) => libro.categoria === pestanas[indicePestana]
          )

    args.contenidoTabla = librosFiltrados.map((libro, index) => [
      <Typography key={`${libro.id}-${index}-nombre`} variant={'body2'}>
        {`${libro.nombre}`}
      </Typography>,

      <Typography key={`${libro.id}-${index}-resumen`} variant={'body2'}>
        {`${libro.resumen}`}
      </Typography>,
      <Typography key={`${libro.id}-${index}-categoria`} variant={'body2'}>
        {libro.categoria}
      </Typography>,

      <Typography
        key={`${libro.id}-${index}-fechaPublicacion`}
        variant={'body2'}
      >
        {libro.fechaPublicacion}
      </Typography>,

      <Stack direction={'row'} key={`${libro.id}-${index}-acciones`}>
        <IconoTooltip
          id={'editarLibro'}
          titulo={'Editar libro'}
          color={'success'}
          accion={() => {}}
          icono={'edit'}
          name={'Editar libro'}
        />
        <IconoTooltip
          id={'verLibro'}
          titulo={'Ver libro'}
          color={'info'}
          accion={() => {}}
          icono={'visibility'}
          name={'Ver libro'}
        />
        <IconoTooltip
          id={'eliminarLibro'}
          titulo={'Eliminar libro'}
          color={'warning'}
          accion={() => {}}
          icono={'delete'}
          name={'Eliminar libro'}
        />
      </Stack>,
    ])
  }
  args.cabeceraPersonalizada = (
    <FiltrosTab
      titulo="Tabla con pestañas"
      labelSelect="Categorias"
      pestanas={pestanas}
      pestanaActiva={pestanaActiva}
      accion={handlePestanaChange}
      acciones={
        <Stack direction={'row'}>
          <IconoTooltip
            id={'editarLibro'}
            titulo={'Buscar'}
            color={'primary'}
            accion={() => {}}
            icono={'search'}
            name={'Editar libro'}
          />
          <IconoTooltip
            id={'eliminarLibro'}
            titulo={'Actualizar lista'}
            color={'primary'}
            accion={() => {}}
            icono={'refresh'}
            name={'Eliminar libro'}
          />
          <IconoTooltip
            id={'verLibro'}
            titulo={'Agregar elementos'}
            color={'primary'}
            accion={() => {}}
            icono={'add_circle_outline'}
            name={'Ver libro'}
          />
        </Stack>
      }
    />
  )
  return <CustomDataTable {...args} />
}
export const DemoTabs = Template6.bind({})
DemoTabs.storyName = 'Tabla con pestañas'
DemoTabs.parameters = {
  docs: {
    description: {
      story:
        'Componente `CustomDataTable` con pestañas en la propiedad `cabeceraPersonalizada`.',
    },
  },
}
DemoTabs.args = {
  ...Columnas.args,
}
