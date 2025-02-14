import React, { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { ListSkeleton } from '@/components/datatable/CustomSkeleton'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'

export interface CustomDataTableTypeMobile {
  titulo?: string
  descripcion?: string
  tituloPersonalizado?: ReactNode
  cabeceraPersonalizada?: ReactNode
  error?: boolean
  cargando?: boolean
  acciones?: Array<ReactNode>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  columnas: Array<CriterioOrdenType>
  filtros?: ReactNode
  contenidoTabla: Array<Array<ReactNode>>
  paginacion?: ReactNode
  seleccionable?: boolean
  seleccionados?: (indices: Array<number>) => void
}

export const CustomMobileTableMobile = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
}: CustomDataTableTypeMobile) => {
  const [todoSeleccionado, setTodoSeleccionado] = useState(false)

  const [indicesSeleccionados, setIndicesSeleccionados] = useState<
    Array<boolean>
  >([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.name)
    setIndicesSeleccionados((prev) => {
      const newState = [...prev]
      newState[index] = event.target.checked
      return newState
    })
  }

  useEffect(
    () => {
      if (seleccionados) {
        seleccionados(
          indicesSeleccionados.reduce(
            (resulltado: Array<number>, value, index) => {
              if (value) {
                resulltado.push(index)
              }
              return resulltado
            },
            []
          )
        )
      }

      if (
        indicesSeleccionados.filter((value) => value).length ==
        indicesSeleccionados.length
      )
        setTodoSeleccionado(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(indicesSeleccionados)]
  )

  useEffect(
    () => {
      setIndicesSeleccionados(
        new Array(contenidoTabla.length).fill(todoSeleccionado)
      )
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoSeleccionado]
  )

  useEffect(
    () => {
      if (!cargando) {
        setIndicesSeleccionados(new Array(contenidoTabla.length).fill(false))
        setTodoSeleccionado(false)
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargando, contenidoTabla.length]
  )

  return (
    <Box sx={{ pb: 2 }}>
      {/*título y acciones*/}
      {!cabeceraPersonalizada && (
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            {titulo ? (
              <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
                {`${titulo}`}
              </Typography>
            ) : tituloPersonalizado ? (
              tituloPersonalizado
            ) : (
              <Box />
            )}
            <Box>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {seleccionable &&
                  indicesSeleccionados.filter((value) => value).length > 0 && (
                    <Box sx={{ mx: 1 }}>
                      <Typography key={'contador'} variant={'subtitle2'}>
                        {`${
                          indicesSeleccionados.filter((value) => value).length
                        } seleccionados`}
                      </Typography>
                    </Box>
                  )}
                {acciones.map((accion, index) => (
                  <div key={`accion-id-${index}`}>{accion}</div>
                ))}
              </Grid>
            </Box>
          </Grid>
          {descripcion && (
            <Typography sx={{ pt: 1 }} fontSize={15}>
              {`${descripcion}`}
            </Typography>
          )}
        </Box>
      )}

      {cabeceraPersonalizada && cabeceraPersonalizada}
      {/* filtros */}
      {filtros ? (
        <Box
          sx={{
            py: 2,
          }}
        >
          {filtros}
        </Box>
      ) : (
        <Box
          sx={{
            py: 1,
          }}
        />
      )}
      {/*Contenedor de la tabla*/}
      {
        <Box>
          {error ? (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        justifyItems={'center'}
                      >
                        <Grid item xs={3} xl={4}>
                          <Typography
                            variant={'body1'}
                            component="h1"
                            noWrap={true}
                            alignItems={'center'}
                          >
                            {`Error obteniendo información`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : contenidoTabla.length == 0 && !cargando ? (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        justifyItems={'center'}
                      >
                        <Grid item xs={3} xl={4}>
                          <Typography
                            variant={'body1'}
                            component="h1"
                            noWrap={true}
                            alignItems={'center'}
                          >
                            {`Sin registros`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              {cargando ? (
                <ListSkeleton filas={10} />
              ) : (
                <div>
                  {contenidoTabla.map((contenidoFila, index) => (
                    <Card
                      key={`celda-id-${index}`}
                      sx={{
                        borderRadius: 3,
                        mb: 2,
                      }}
                    >
                      <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                        {seleccionable && (
                          <Grid
                            key={`Grid-id-${index}-seleccionar`}
                            container
                            direction="row"
                            paddingBottom={'0px'}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              color="text.secondary"
                              variant={'subtitle2'}
                            >
                              {'Seleccionar'}
                            </Typography>
                            {indicesSeleccionados.length > index && (
                              <Checkbox
                                checked={indicesSeleccionados[index]}
                                onChange={handleChange}
                                name={`${index}`}
                              />
                            )}
                          </Grid>
                        )}
                        {contenidoFila.map((contenido, indexContenido) => (
                          <Grid
                            key={`Grid-id-${index}-${indexContenido}`}
                            container
                            direction="row"
                            paddingTop={'5px'}
                            paddingBottom={'0px'}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              color="text.secondary"
                              variant={'subtitle2'}
                            >
                              {columnas[indexContenido].nombre}
                            </Typography>
                            {contenido}
                          </Grid>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {paginacion}
            </Box>
          )}
        </Box>
      }
    </Box>
  )
}
