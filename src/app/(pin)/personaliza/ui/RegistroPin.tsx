import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Fade, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

import { PersonalizaPinType } from '../types/personalizaPinTypes'
import { useAlerts } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Icono } from '@/components/Icono'
import { FormInputDate, FormInputText } from 'src/components/form'
import { isValidEmail } from '@/utils/validations'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'

const RegistroPin = () => {
    const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)

    const [indicadorCreacionCuenta, setIndicadorCreacionCuenta] =
        useState<boolean>(false)

    const router = useRouter()

    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    const { handleSubmit, control, reset, watch } = useForm<PersonalizaPinType>({
        defaultValues: {},
    })

    const guardarPin = async (data: PersonalizaPinType) => {
        await guardarPinPeticion(data)
    }

    const guardarPinPeticion = async (cuenta: PersonalizaPinType) => {
        try {
            setIndicadorCarga(true)
            await delay(1000)
            const respuesta = await Servicios.peticion({
                url: `${Constantes.baseUrl}/servicio/activar`,
                method: 'patch',
                body: { ...cuenta },
            })
            setIndicadorCreacionCuenta(true)
            imprimir(InterpreteMensajes(respuesta))
        } catch (e) {
            imprimir(`Error al crear cuenta temporal: `, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setIndicadorCarga(false)
        }
    }
    const redireccionarInicio = async () => {
        mostrarFullScreen()
        await delay(500)
        router.replace('/login')
        ocultarFullScreen()
    }

    const passwordWatch = watch('password')

    return (
        <Box>
            {indicadorCreacionCuenta && (
                <Fade in={indicadorCreacionCuenta} timeout={500}>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Icono fontSize={'large'} color={'success'}>
                            check_circle
                        </Icono>
                        <Box height={'15px'} />
                        <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                            ¡Tu PIN inicial ha sido personalizado!
                        </Typography>
                        <Box height={'15px'} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                reset()
                                setIndicadorCreacionCuenta(false)
                                //mostrarLogin()
                                router.replace('/login')
                            }}
                        >
                            <Typography sx={{ fontWeight: '600' }}>Entendido</Typography>
                        </Button>
                    </Box>
                </Fade>
            )}
            {!indicadorCreacionCuenta && (
                <form onSubmit={handleSubmit(guardarPin)}>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Icono fontSize={'large'}> person_add</Icono>
                        <Box height={'10px'} />
                        <Typography sx={{ fontWeight: 'medium' }} variant={'subtitle2'}>
                            Formulario de Personalizacion del PIN inicial
                        </Typography>
                    </Box>
                    <Box height={'20px'} />
                    <Typography variant="body2" color="text.secondary">
                        Por favor, ingresa tus datos para registrar tu PIN inicial.
                    </Typography>
                    <Box height={'20px'} />
                    <Grid>
                        <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                            Datos de Personalización
                        </Typography>
                        <Box height={'20px'} />
                        <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormInputText
                                    id={'nia'}
                                    control={control}
                                    name="nia"
                                    type={'text'}
                                    label="NIA"
                                    disabled={indicadorCarga}
                                    rules={{ required: 'Este campo es requerido' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormInputText
                                    id={'pin'}
                                    control={control}
                                    name="pin"
                                    type={'text'}
                                    label="PIN"
                                    disabled={indicadorCarga}
                                    rules={{ required: 'Este campo es requerido' }}
                                />
                            </Grid>
                        </Grid>
                        <Box height={'10px'} />
                        <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormInputText
                                    id={'password'}
                                    control={control}
                                    name="password"
                                    label="Contraseña"
                                    disabled={indicadorCarga}
                                    type={'password'}
                                    rules={{ required: 'Este campo es requerido' }}
                                />
                            </Grid>

                            {watch('password') && (
                                <Grid item xs={12} sm={12} md={12}>
                                    <NivelSeguridadPass pass={passwordWatch} />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={12} md={12}>
                                <FormInputText
                                    id={'passwordConfirmacion'}
                                    control={control}
                                    name="passwordConfirmacion"
                                    label="Repita su contraseña"
                                    disabled={indicadorCarga}
                                    type={'password'}
                                    rules={{
                                        required: 'Este campo es requerido',
                                        validate: (value: string) => {
                                            if (value != passwordWatch)
                                                return 'La contraseña no coincide'
                                        },
                                    }}
                                />
                            </Grid>
                            <Box height={'10px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputText
                                        id={'numeroDocuemento'}
                                        control={control}
                                        name="numeroDocumento"
                                        label="C.I. No."
                                        disabled={indicadorCarga}
                                        rules={{
                                            required: 'Este campo es requerido',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Box height={'20px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputText
                                        id={'primerApellido'}
                                        control={control}
                                        name="primerApellido"
                                        type={'text'}
                                        label="Primer Apellido"
                                        disabled={indicadorCarga}
                                        rules={{ required: 'Este campo es requerido' }}
                                    />
                                </Grid>
                            </Grid>
                            <Box height={'10px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputText
                                        id={'segundoApellido'}
                                        control={control}
                                        name="segundoApellido"
                                        type={'text'}
                                        label="Segundo Apellido"
                                        disabled={indicadorCarga}
                                        rules={{ required: 'Este campo es requerido' }}
                                    />
                                </Grid>
                            </Grid>
                            <Box height={'10px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputText
                                        id={'nombres'}
                                        control={control}
                                        name="nombres"
                                        type={'text'}
                                        label="Nombres"
                                        disabled={indicadorCarga}
                                        rules={{ required: 'Este campo es requerido' }}
                                    />
                                </Grid>
                            </Grid>
                            <Box height={'10px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputDate
                                        id={'fechaNacimiento'}
                                        control={control}
                                        name="fechaNacimiento"
                                        label="Fecha Nacimiento(dd/mm/yyyy)"
                                        disabled={indicadorCarga}
                                        rules={{ required: 'Este campo es requerido' }}
                                    />
                                </Grid>
                            </Grid>
                            <Box height={'10px'} />
                            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormInputText
                                        id={'correoElectronico'}
                                        control={control}
                                        name="correoElectronico"
                                        label="Correo Electrónico"
                                        disabled={indicadorCarga}
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
                        <ProgresoLineal mostrar={indicadorCarga} />
                        <Box height={'5px'} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={indicadorCarga}
                        >
                            <Typography sx={{ fontWeight: '600' }}>Personalizar PIN</Typography>
                        </Button>
                        <Box height={'10px'} />
                        <Button
                            type="button"
                            variant="outlined"
                            disabled={indicadorCarga}
                            onClick={redireccionarInicio}
                            fullWidth
                        >
                            <Typography sx={{ fontWeight: '400' }}>Cancelar</Typography>
                        </Button>
                    </Grid>
                </form>
            )}
        </Box>
    )
}
export default RegistroPin

