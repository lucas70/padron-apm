import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { useForm } from 'react-hook-form'

import { IconoTooltip } from '@/components/botones/IconoTooltip'
import {
  FormInputDropdown,
  FormInputMultiCheckbox,
  FormInputRadio,
  FormInputText,
} from '@/components/form'
import { useAlerts } from '@/hooks'
import { FormInputWysiwyg } from '@/components/form/FormInputWysiwyg'
import FormInputImage from '@/components/form/FormInputImage'

const FormularioLandingForm = () => {
  const { control } = useForm<any>()
  const theme = useTheme()
  const { Alerta } = useAlerts()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return (
    <Box sx={{ pt: 2 }}>
      <form
        onSubmit={() => {
          Alerta({
            mensaje: 'Producto registrado con éxito',
            variant: 'success',
          })
        }}
      >
        <Box display={'flex'} alignItems={'center'} width={'100%'}>
          <IconoTooltip
            id={'atras-landingForm'}
            titulo={'Atrás'}
            color={'primary'}
            accion={() => {}}
            icono={'keyboard_backspace'}
            name={'Atrás'}
          />
          <Typography
            variant="h6"
            component={'h4'}
            fontWeight={600}
            textAlign={'center'}
            alignContent={'center'}
          >
            Agregar Producto
          </Typography>
        </Box>
        <Grid container spacing={2} paddingTop={2}>
          <Grid item xs={12} md={8}>
            <Box>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <FormInputText
                  id="textfield-nombre"
                  label="Nombre"
                  name="nombre"
                  control={control}
                />
                <Box height={15} />
                <FormInputWysiwyg
                  control={control}
                  id="textfield-descripcion"
                  label="Descripción"
                  name="descripción"
                  onChange={() => {}}
                />
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <FormInputImage
                  control={control}
                  id="textfield-multimedia"
                  label="Elementos multimedia"
                  multiple
                  name="elementosMultimedia"
                />
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'}>Precio</Typography>
                <Box
                  display={'flex'}
                  flexDirection={xs ? 'column' : 'row'}
                  width={'100%'}
                  justifyContent={'space-between'}
                  flexWrap={'wrap'}
                  marginTop={3}
                >
                  <Box width={xs ? 'auto' : '49%'}>
                    <FormInputText
                      id="textfield-precio"
                      label="Precio"
                      name="precio"
                      control={control}
                      type="number"
                    />
                  </Box>
                  <Box width={xs ? 'auto' : '49%'}>
                    <FormInputText
                      id="textfield-precio_comparacion"
                      label="Precio de comparación"
                      name="precio_comparacion"
                      control={control}
                      type="number"
                    />
                  </Box>
                </Box>
                <Box height={10} />
                <FormInputMultiCheckbox
                  id="textfield-impuestos"
                  label=""
                  name="impuestos"
                  control={{
                    ...control,
                    _defaultValues: {
                      id: 12,
                      impuestos: ['1'],
                    },
                  }}
                  options={[
                    {
                      key: '1',
                      label: 'Cobrar impuestos sobre la venta de este producto',
                      value: '1',
                    },
                  ]}
                  setValue={() => {}}
                />
                <Box height={10} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormInputText
                      id="textfield-costo-artculo"
                      label="Costo por artículo"
                      name="costo_articulo"
                      control={control}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormInputText
                      id="textfield-ganancia"
                      label="Ganancia"
                      name="ganancia"
                      control={control}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormInputText
                      id="textfield-margen"
                      label="Margen"
                      name="margen"
                      control={control}
                      type="number"
                    />
                  </Grid>
                </Grid>
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'} marginBottom={3}>
                  Inventario
                </Typography>
                <FormInputMultiCheckbox
                  id="textfield-cantidad"
                  label=""
                  name="cantidad"
                  control={{
                    ...control,
                    _defaultValues: {
                      id: 12,
                      cantidad: ['1'],
                    },
                  }}
                  options={[
                    {
                      key: '1',
                      label: 'Rastrear cantidad',
                      value: '1',
                    },
                  ]}
                  setValue={() => {}}
                />
                <Box width={'30%'}>
                  <FormInputText
                    id="textfield-cantidadNumber"
                    label="Cantidad"
                    name="cantidad_number"
                    control={control}
                    type="number"
                  />
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                <Typography fontWeight={'600'} marginBottom={3}>
                  Envíos
                </Typography>
                <FormInputMultiCheckbox
                  id="textfield-fisico"
                  label=""
                  name="fisico"
                  control={{
                    ...control,
                    _defaultValues: {
                      id: 12,
                      fisico: ['1'],
                    },
                  }}
                  options={[
                    {
                      key: '1',
                      label: 'Este es un producto físico',
                      value: '1',
                    },
                  ]}
                  setValue={() => {}}
                />
                <Grid container spacing={2}>
                  <Grid item xs={9} sm={8}>
                    <FormInputText
                      id="textfield-peso"
                      label="Peso"
                      name="peso"
                      control={control}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={3} sm={4}>
                    <FormInputDropdown
                      control={control}
                      id="unidad_peso"
                      label="Unidad"
                      name="unidad_peso"
                      onChange={() => {}}
                      options={[
                        {
                          key: '1',
                          label: 'kg',
                          value: '1',
                        },
                        {
                          key: '2',
                          label: 'lbs.',
                          value: '2',
                        },
                        {
                          key: '3',
                          label: 'grs.',
                          value: '3',
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <FormInputDropdown
                control={control}
                id="estado"
                label="Estado"
                name="estado"
                onChange={() => {}}
                options={[
                  {
                    key: '1',
                    label: 'Activo',
                    value: '1',
                  },
                  {
                    key: '2',
                    label: 'Inactivo',
                    value: '2',
                  },
                ]}
              />
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <Typography fontWeight={'600'} marginBottom={3}>
                Publicación
              </Typography>
              <FormInputRadio
                control={control}
                id="publicacion"
                label="Canales de Venta"
                name="publicacion"
                options={[
                  {
                    key: '1',
                    label: 'Tienda online',
                    value: '1',
                  },
                  {
                    key: '2',
                    label: 'Punto de venta',
                    value: '2',
                  },
                  {
                    key: '3',
                    label: 'Franquicias',
                    value: '3',
                  },
                  {
                    key: '4',
                    label: 'Redes Sociales',
                    value: '4',
                  },
                ]}
              />
              <Box height={20} />
              <FormInputRadio
                control={control}
                id="mercados"
                label="Mercados"
                name="mercados"
                size="small"
                options={[
                  {
                    key: '1',
                    label: 'Bolivia e Internacional',
                    value: '1',
                  },
                ]}
              />
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <Typography fontWeight={'600'} marginBottom={3}>
                Organización de Productos
              </Typography>
              <FormInputText
                id="textfield-categoria"
                label="Categoría"
                name="categoria"
                control={control}
              />
              <FormInputText
                id="textfield-tipo"
                label="Tipo de producto"
                name="tipo"
                control={control}
              />
              <FormInputText
                id="textfield-proveedor"
                label="Proveedor"
                name="proveedor"
                control={control}
              />
              <FormInputText
                id="textfield-colecciones"
                label="Colecciones"
                name="colecciones"
                control={control}
              />
              <FormInputText
                id="textfield-etiquetas"
                label="Etiquetas"
                name="etiquetas"
                control={control}
              />
            </Paper>
            <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
              <FormInputDropdown
                control={control}
                id="tema"
                label="Temas"
                name="tema"
                onChange={() => {}}
                options={[
                  {
                    key: '1',
                    label: 'Tema social',
                    value: '1',
                  },
                  {
                    key: '2',
                    label: 'Tema laboral',
                    value: '2',
                  },
                ]}
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={6}>
          <Grid item xs={12} md={8}>
            <Box
              display={'flex'}
              justifyContent={'end'}
              flexDirection={'row'}
              gap={2}
            >
              <Button type="button" variant="outlined">
                <Typography sx={{ fontWeight: '600' }}>Cancelar</Typography>
              </Button>
              <Button type="submit" variant="contained">
                <Typography sx={{ fontWeight: '600' }}>
                  Registrar producto
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default FormularioLandingForm
