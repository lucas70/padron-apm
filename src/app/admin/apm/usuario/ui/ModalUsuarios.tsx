/// Vista modal de usuario
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { formatoFecha } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import {
  FormInputDate,
  FormInputDropdownMultiple,
  FormInputText,
} from 'src/components/form'
import { isValidEmail } from '@/utils/validations'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { CrearEditarUsuarioType, RolType, UsuarioCRUDType } from '../types/usuariosCRUDTypes'

export interface ModalUsuarioType {
  usuario?: UsuarioCRUDType | undefined | null
  roles: RolType[]
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalUsuario = ({
  usuario,
  roles,
  accionCorrecta,
  accionCancelar,
}: ModalUsuarioType) => {
  // Flag que índica que hay un proceso en ventana modal cargando visualmente
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarUsuarioType>({
    defaultValues: {
      id: usuario?.id,
      roles: usuario?.usuarioRol.map((rol) => rol.id),
      correoElectronico: usuario?.correoElectronico,
      numeroDocumento: usuario?.numeroDocumento,
      nombres: usuario?.nombres,
      primerApellido: usuario?.primerApellido,
      segundoApellido: usuario?.segundoApellido,
      fechaNacimiento: usuario?.fechaNacimiento,
    },
  })

  const guardarActualizarUsuario = async (data: CrearEditarUsuarioType) => {
    await guardarActualizarUsuariosPeticion(data)
  }

  const guardarActualizarUsuariosPeticion = async (
    usuario: CrearEditarUsuarioType
  ) => {
    console.log('usuario a guardar: -->', usuario)
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/administracion/usuario${usuario.id ? `/${usuario.id}` : ''
          }`,
        method: !!usuario.id ? 'patch' : 'post',
        body: {
          ...usuario,
          fechaNacimiento: formatoFecha(
            usuario.fechaNacimiento,
            'YYYY-MM-DD'
          )
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Box height={'5px'} />
          <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
            Datos personales
          </Typography>
          <Box height={'20px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={4}>
              <FormInputText
                id={'nroDocumento'}
                control={control}
                name="numeroDocumento"
                label="Nro. Documento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormInputText
                id={'nombre'}
                control={control}
                name="nombres"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormInputText
                id={'primerApellido'}
                control={control}
                name="primerApellido"
                label="Primer Apellido"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormInputText
                id={'segundoApellido'}
                control={control}
                name="segundoApellido"
                label="Segundo apellido"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormInputDate
                id={'fechaNacimiento'}
                control={control}
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Grid>
            <Box height={'20px'} />
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Datos de usuario
            </Typography>
            <Box height={'10px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputDropdownMultiple
                  id={'roles'}
                  name="roles"
                  control={control}
                  label="Roles"
                  disabled={loadingModal}
                  options={roles.map((rol) => ({
                    key: rol.id,
                    value: rol.id,
                    label: rol.nombre,
                  }))}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'correoElectronico'}
                  control={control}
                  name="correoElectronico"
                  label="Correo electrónico"
                  disabled={loadingModal}
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value) => {
                      if (!isValidEmail(value)) return 'No es un correo válido'
                    },
                  }}
                />
              </Grid>
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
