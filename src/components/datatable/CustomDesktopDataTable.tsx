import React, { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Fade,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { TableSkeletonBody } from './CustomSkeleton'
import { Icono } from '../Icono'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { ToggleOrden } from '@/components/datatable/utils'

export interface CustomDataTableType {
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

export const CustomDesktopDataTable = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  cambioOrdenCriterios,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
}: CustomDataTableType) => {
  const [todoSeleccionado, setTodoSeleccionado] = useState(false)

  const cambiarTodoSeleccionado = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTodoSeleccionado(event.target.checked)
  }

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
          indicesSeleccionados.length &&
        indicesSeleccionados.length != 0
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
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {titulo ? (
            <Grid>
              <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
                {`${titulo}`}
              </Typography>
              {descripcion && (
                <Typography sx={{ pt: 1 }} fontSize={15}>
                  {`${descripcion}`}
                </Typography>
              )}
            </Grid>
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
      <Card
        sx={{
          borderRadius: 3,
          pt: 0,
          // pl: { sm: 3, md: 3, xl: 3 },
          // pr: { sm: 3, md: 3, xl: 3 },
          pb: { sm: 2, md: 2, xl: 2 },
          mb: { sm: 3, md: 3, xl: 3 },
          backgroundColor: {},
          boxShadow: {},
        }}
      >
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
                {
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {seleccionable && (
                            <TableCell
                              key={`cabecera-id-seleccionar`}
                              sx={{ p: 1.2 }}
                            >
                              <Checkbox
                                checked={todoSeleccionado}
                                disabled={cargando}
                                onChange={cambiarTodoSeleccionado}
                                indeterminate={
                                  indicesSeleccionados.filter((value) => value)
                                    .length != indicesSeleccionados.length &&
                                  indicesSeleccionados.filter((value) => value)
                                    .length > 0
                                }
                              />
                            </TableCell>
                          )}
                          {columnas.map((columna, index) => (
                            <TableCell
                              key={`cabecera-id-${index}`}
                              sx={{
                                p: 1.2,
                                pl: { md: 2, xl: 2 },
                              }}
                            >
                              {columna.ordenar ? (
                                <Button
                                  disabled={cargando}
                                  style={{
                                    justifyContent: 'flex-start',
                                    minWidth: '0',
                                    padding: '0 1',
                                  }}
                                  onClick={() => {
                                    const nuevosCriterios = [...columnas] // crea una copia del array original

                                    if (cambioOrdenCriterios) {
                                      cambioOrdenCriterios(
                                        nuevosCriterios.map(
                                          (value, indice) => ({
                                            ...value,
                                            ...{
                                              orden:
                                                index == indice
                                                  ? ToggleOrden(value.orden)
                                                  : undefined,
                                            },
                                          })
                                        )
                                      )
                                    }
                                  }}
                                >
                                  <Typography
                                    variant={'caption'}
                                    color="text.primary"
                                    fontWeight={'600'}
                                    align={'left'}
                                    noWrap
                                  >
                                    {columna.nombre}
                                  </Typography>
                                  {columna.orden && <Box width={'10px'} />}
                                  {columna.orden && (
                                    <Icono
                                      fontSize={'inherit'}
                                      color={'secondary'}
                                    >
                                      {columna.orden == 'asc'
                                        ? 'north'
                                        : 'south'}
                                    </Icono>
                                  )}
                                </Button>
                              ) : (
                                <Typography
                                  variant={'caption'}
                                  color="text.primary"
                                  fontWeight={'600'}
                                  align={'left'}
                                  noWrap
                                  sx={{
                                    pl: { md: 2, xl: 2 },
                                  }}
                                >
                                  {columna.nombre}
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {cargando ? (
                        <TableSkeletonBody
                          filas={10}
                          columnas={columnas.length + (seleccionable ? 1 : 0)}
                        />
                      ) : (
                        <TableBody>
                          {contenidoTabla.map(
                            (contenidoFila, indexContenidoTabla) => (
                              <TableRow
                                key={`row-id-${indexContenidoTabla}`}
                                hover={true}
                              >
                                {seleccionable && (
                                  <TableCell
                                    key={`row-id-seleccionar-${indexContenidoTabla}`}
                                  >
                                    <Fade in={!cargando} timeout={1000}>
                                      <Box>
                                        {indicesSeleccionados.length >
                                          indexContenidoTabla && (
                                          <Checkbox
                                            checked={
                                              indicesSeleccionados[
                                                indexContenidoTabla
                                              ]
                                            }
                                            onChange={handleChange}
                                            name={`${indexContenidoTabla}`}
                                          />
                                        )}
                                      </Box>
                                    </Fade>
                                  </TableCell>
                                )}
                                {contenidoFila.map(
                                  (contenido, indexContenidoFila) => (
                                    <TableCell
                                      key={`celda-id-${indexContenidoTabla}-${indexContenidoFila}`}
                                      sx={{
                                        p: '10px',
                                        px: { md: 2.5, xl: 2.5 },
                                      }}
                                    >
                                      <Fade in={!cargando} timeout={1000}>
                                        <Box>{contenido}</Box>
                                      </Fade>
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                }
                {paginacion}
              </Box>
            )}
          </Box>
        }
      </Card>
    </Box>
  )
}
