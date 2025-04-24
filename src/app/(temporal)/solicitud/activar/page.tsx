'use client'

import { Icono } from '@/components/Icono';
import { Constantes } from '@/config/Constantes';
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider';
import { useAlerts } from '@/hooks';
import { Servicios } from '@/services';
import { delay, InterpreteMensajes } from '@/utils';
import { imprimir } from '@/utils/imprimir';
import { Box, Button, Fade, Grid, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SolicitudActivaPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tkn = searchParams[1]
    const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)

    const [indicadorHabilitacionCuenta, setIndicadorHabilitacionCuenta] =
        useState<boolean>(false)

    const router = useRouter()

    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()
    const habilitarCuentaTemporalPeticion = async () => {
        try {
            setIndicadorCarga(true)
            await delay(1000)
            const respuesta = await Servicios.peticion({
                url: `${Constantes.baseUrl}/correo/${tkn}/activar`,
                method: 'patch',
            })
            setIndicadorHabilitacionCuenta(true)
            imprimir(InterpreteMensajes(respuesta))
        } catch (e) {
            imprimir(`Error al crear cuenta temporal: `, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setIndicadorCarga(false)
        }
    }

    useEffect(() => {
        habilitarCuentaTemporalPeticion().finally(() => { });

    }, []);

    return (
        <div>
            {indicadorHabilitacionCuenta && (
                <Fade in={indicadorHabilitacionCuenta} timeout={500}>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Icono fontSize={'large'} color={'success'}>
                            check_circle
                        </Icono>
                        <Box height={'15px'} />
                        <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                            ¡Tu cuenta temporal ha sido habilitada!
                        </Typography>
                        <Box height={'15px'} />
                        <Typography variant="body2" color="text.secondary">
                            Para ingresar al SI-APM, presiona el botòn Ingresar
                        </Typography>
                        <Box height={'15px'} />
                        <Grid size={4}>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                onClick={() => {
                                    setIndicadorHabilitacionCuenta(false)
                                    //mostrarLogin()
                                    router.replace('/login')
                                }}
                            >
                                <Typography sx={{ fontWeight: '600' }}>Ingresar</Typography>
                            </Button>


                        </Grid>
                    </Box>
                </Fade>
            )
            }
        </div >
    )
}
export default SolicitudActivaPage
