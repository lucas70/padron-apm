import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Button, DialogActions, DialogContent, Grid, SelectChangeEvent } from '@mui/material'
import { FormInputDate, FormInputDropdown, FormInputText } from 'src/components/form'
import Box from '@mui/material/Box'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { DireccionCRUDType } from '../types/direccionCRUDType'
import { ParametroDTOType } from '../types/parametroDTOType'
import { RepresentanteCRUDType } from '../types/representanteCRUDType'

export interface ModalRepresentanteType {
  idActorMinero: string
  representante?: RepresentanteCRUDType
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const ModalRepresentante = ({
  idActorMinero,
  representante,
  accionCorrecta,
  accionCancelar,
}: ModalRepresentanteType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()
  const [tiposDocumento, setTiposDocumento] = useState<ParametroDTOType[]>([]);
  const [tiposRepresentante, setTiposRepresentante] = useState<ParametroDTOType[]>([]);
  const [idTipoRepresentante, setIdTipoRepresentante] = useState<string>(representante ? representante.idTipoRepresentanteLegal : '');
  const [idRepresentante, setIdRepresentante] = useState<string>(representante ? representante.id : '');
  const [idTipoDocumento, setIdTipoDocumento] = useState<string>(representante ? representante.idTipoDocumento : '');

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<RepresentanteCRUDType>({
    defaultValues: {
      idTipoRepresentanteLegal: representante?.idTipoRepresentanteLegal,
      primerApellido: representante?.primerApellido,
      segundoApellido: representante?.segundoApellido,
      nombres: representante?.nombres,
      fechaNacimiento: representante?.fechaNacimiento,
      idTipoDocumento: representante?.idTipoDocumento,
      numeroDocumento: representante?.numeroDocumento,
      correoElectronico: representante?.correoElectronico,
      telefono: representante?.telefono,
      celular: representante?.celular,
    },
  })

  const guardarActualizarRepresentante = async (data: RepresentanteCRUDType) => {
    await guardarActualizarRepresentantePeticion(data)
  }

  const guardarActualizarRepresentantePeticion = async (representante: RepresentanteCRUDType) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/representante${idRepresentante ? `/${idRepresentante}` : ''
          }`,
        method: !!idRepresentante ? 'patch' : 'post',
        body: { ...representante, idActorMinero: idActorMinero, idTipoRepresentante: idTipoRepresentante, idTipoDocumento: idTipoDocumento },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar el representante`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }


  const obtenerTiposRepresentante = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parametros/TTA/listado`
      })

      setTiposRepresentante(respuesta.datos);

      setError(null)
    } catch (e) {
      imprimir(`Error al obtener tipos de representante`, e)
      setError(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerTiposDocumento = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parametros/TD/listado`
      })

      setTiposDocumento(respuesta.datos);

      setError(null)
    } catch (e) {
      imprimir(`Error al obtener tipos de documento`, e)
      setError(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerTiposRepresentante().finally(() => { });
    obtenerTiposDocumento().finally(() => { })
  }, []);

  function onChangeTipo(event: SelectChangeEvent): void {
    setIdTipoRepresentante(event.target.value);
  }

  function onChangeTipoDocumento(event: SelectChangeEvent): void {
    setIdTipoDocumento(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarRepresentante)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                id={'idTipoRepresentanteLegal'}
                name="idTipoRepresentanteLegal"
                control={control}
                label="Tipo Representante"
                options={tiposRepresentante.map((tipo) => ({
                  key: tipo.id,
                  value: tipo.id,
                  label: tipo.nombre,
                }))}
                bgcolor={'background.paper'}
                onChange={onChangeTipo}
                clearable
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'primerApellido'}
                control={control}
                name="primerApellido"
                label="Primer Apellido"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'segundoApellido'}
                control={control}
                name="segundoApellido"
                label="Segundo Apellido"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'nombres'}
                control={control}
                name="nombres"
                label="Nombres"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDate
                id={'fechaNacimiento'}
                control={control}
                name="fechaNacimiento"
                label="Fecha Nacimiento(dd/mm/yyyy)"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                id={'idTipoDocumento'}
                name="idTipoDocumento"
                control={control}
                label="Tipo Documento"
                options={tiposDocumento.map((tipo) => ({
                  key: tipo.id,
                  value: tipo.id,
                  label: tipo.nombre,
                }))}
                bgcolor={'background.paper'}
                onChange={onChangeTipoDocumento}
                clearable
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'numeroDocumento'}
                control={control}
                name="numeroDocumento"
                label="Número Documento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'correoEletronico'}
                control={control}
                name="correoElectronico"
                label="Correo Electónico"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'telefono'}
                control={control}
                name="telefono"
                label="Teléfono"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'celular'}
                control={control}
                name="celular"
                label="Celular"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'20px'} />
          <ProgresoLineal mostrar={loadingModal} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
