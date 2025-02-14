import React, { ReactNode, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { FiltrosTab } from '../../organismos/datatable/FiltrosTab'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { ColumnaType } from '@/types'

const columnasD: Array<ColumnaType> = [
  { campo: 'nombre', nombre: 'Nombre' },
  { campo: 'resumen', nombre: 'Resumen' },
  { campo: 'categoria', nombre: 'Categoría' },
  { campo: 'fechaPublicacion', nombre: 'Fecha Publicación' },
  { campo: 'acciones', nombre: 'Eventos' },
]
const solicitudesDataD = [
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

const TableLanding = ({
  columnas = columnasD,
  solicitudesData = solicitudesDataD,
  titulo = 'Inventario de libros',
  showAccion = true,
  editAccion = true,
  deleteAccion = true,
}) => {
  const contenidoTabla: Array<Array<ReactNode>> = solicitudesData.map(
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
        {editAccion && (
          <IconoTooltip
            id={'editarLibro'}
            titulo={'Editar libro'}
            color={'success'}
            accion={() => {}}
            icono={'edit'}
            name={'Editar libro'}
          />
        )}
        {showAccion && (
          <IconoTooltip
            id={'verLibro'}
            titulo={'Ver libro'}
            color={'info'}
            accion={() => {}}
            icono={'visibility'}
            name={'Ver libro'}
          />
        )}
        {deleteAccion && (
          <IconoTooltip
            id={'eliminarLibro'}
            titulo={'Eliminar libro'}
            color={'warning'}
            accion={() => {}}
            icono={'delete'}
            name={'Eliminar libro'}
          />
        )}
      </Stack>,
    ]
  )

  const [pestanaActiva, setPestanaActiva] = useState<number>(0)
  const [tablaEstado, setTablaEstado] = useState<any>(contenidoTabla)

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

    const TablaFiltrada: Array<Array<ReactNode>> = librosFiltrados.map(
      (libro, index) => [
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
          {editAccion && (
            <IconoTooltip
              id={'editarLibro'}
              titulo={'Editar libro'}
              color={'success'}
              accion={() => {}}
              icono={'edit'}
              name={'Editar libro'}
            />
          )}
          {showAccion && (
            <IconoTooltip
              id={'verLibro'}
              titulo={'Ver libro'}
              color={'info'}
              accion={() => {}}
              icono={'visibility'}
              name={'Ver libro'}
            />
          )}
          {deleteAccion && (
            <IconoTooltip
              id={'eliminarLibro'}
              titulo={'Eliminar libro'}
              color={'warning'}
              accion={() => {}}
              icono={'delete'}
              name={'Eliminar libro'}
            />
          )}
        </Stack>,
      ]
    )
    setTablaEstado(TablaFiltrada)
  }

  const cabezera = (
    <FiltrosTab
      titulo={titulo}
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
  return (
    <CustomDataTable
      cabeceraPersonalizada={cabezera}
      contenidoTabla={tablaEstado}
      columnas={columnas}
    />
  )
}

export default TableLanding
