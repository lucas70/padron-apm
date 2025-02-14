import { Meta, StoryFn } from '@storybook/react'
import { CardItem } from './CardItem'
import { Box, Grid, Typography } from '@mui/material'
import { ReactNode } from 'react'

export default {
  title: 'Organismos/CardView/CardView',
  component: CardItem,
  argTypes: {
    accion: {
      type: 'function',
      control: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Ejemplo de organismo en diseño atómico para Storybook, que organiza componentes de tarjetas con datos en una interfaz cohesiva y estilizada, demostrando cómo se pueden combinar elementos más simples en una estructura compleja y reutilizable.`,
      },
    },
  },
} as Meta<typeof CardItem>

const listaLibros = [
  {
    id: '1',
    nombre: 'Cien años de soledad',
    resumen:
      'Una novela de realismo mágico que cuenta la historia de la familia Buendía a lo largo de varias generaciones en el ficticio pueblo de Macondo.',
    fechaPublicacion: '1967-05-30',
  },
  {
    id: '2',
    nombre: '1984',
    resumen:
      'Una novela distópica que presenta una sociedad totalitaria y vigilante en la que el gobierno controla cada aspecto de la vida de sus ciudadanos.',
    fechaPublicacion: '1949-06-08',
  },
  {
    id: '3',
    nombre: 'El señor de los anillos',
    resumen:
      'Una épica trilogía de fantasía que sigue las aventuras de hobbits, elfos, magos y guerreros en su búsqueda para destruir el anillo del poder y derrotar al malvado Sauron.',
    fechaPublicacion: '1954-07-29',
  },
  {
    id: '4',
    nombre: 'Matar a un ruiseñor',
    resumen:
      'Una novela clásica de la literatura estadounidense que aborda temas de racismo y justicia a través de la historia de un abogado que defiende a un hombre negro injustamente acusado de un delito.',
    fechaPublicacion: '1960-07-11',
  },
  {
    id: '5',
    nombre: 'Harry Potter y la piedra filosofal',
    resumen:
      'El primer libro de la serie de fantasía juvenil que sigue las aventuras de un joven mago llamado Harry Potter mientras asiste a la escuela de magia y hechicería de Hogwarts.',
    fechaPublicacion: '1997-06-26',
  },
]

// Demo tabla cards
interface CardDataTableType {
  titulo?: string
  contenidoTabla: Array<Array<ReactNode>>
}

const CardView = ({ titulo, contenidoTabla }: CardDataTableType) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant={'h5'} sx={{ fontWeight: '600', pl: 1 }}>
        {`${titulo}`}
      </Typography>
      <Box height={'20px'} />
      <Grid
        container
        direction="row"
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12, xl: 12 }}
      >
        {contenidoTabla.map((contenidoFila, index) => (
          <Grid item xs={2} sm={4} md={4} lg={3} key={index}>
            {contenidoFila.map((contenido, indexContenido) => (
              <Grid key={indexContenido} display="flex" height="100%">
                {contenido}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
const TemplateCards: StoryFn<typeof CardItem> = () => {
  const contenidoCards: Array<Array<ReactNode>> = listaLibros.map(
    (libro, index) => [
      <CardItem
        key={index}
        titulo={libro.nombre}
        subtitulo={libro.fechaPublicacion}
        descripcion={libro.resumen}
        imagen={`img`}
      />,
    ]
  )
  return <CardView contenidoTabla={contenidoCards} titulo="Libros" />
}
export const CardViewSample = TemplateCards.bind({})
