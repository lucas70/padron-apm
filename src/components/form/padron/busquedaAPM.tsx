"use client";

import { Box, Button, Grid, InputLabel, SelectChangeEvent, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAlerts, useSession } from '@/hooks'
import { useForm } from "react-hook-form";
import { FormInputDropdown } from "../FormInputDropdown";
import { FormInputText } from "../FormInputText";
import { BusquedaAPMType } from "./types/busquedaAPMType";
import { Constantes } from "@/config/Constantes";
import { imprimir } from "@/utils/imprimir";
import { InterpreteMensajes } from "@/utils";
import { ParametroDTOType } from "./types/parametroDTOType";
import { useDatoGralStore } from "@/lib/_store/datoGralStore";



const BusquedaAPMComponente = () => {

    const [loading, setLoading] = useState<boolean>(true)
    const { Alerta } = useAlerts()
    const [error, setError] = useState<any>()
    const [tiposAPM, setTiposAPM] = useState<ParametroDTOType[]>([]);
    const [apm, setApm] = useState<any>({});

    const datoGral = useDatoGralStore((state) => state.datoGral);

    const updateDatoGral = useDatoGralStore((state) => state.updateDatoGral);

    const { sesionPeticion, sesionPeticionExterno } = useSession()

    const { handleSubmit, control } = useForm<BusquedaAPMType>({
        defaultValues: {
            numeroApm: datoGral.numeroDocumento,
            tipoApm: datoGral.tipoActorMinero.id
        }
    })

    const onSubmit = async (datos: BusquedaAPMType) => {
        console.log(datos);
        try {
            setLoading(true)


            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/actores/busqueda?idTipoActorMinero=${datoGral.tipoActorMinero.id}&codigo=${datoGral.numeroDocumento}`
            })
            if (respuesta.datos.id !== null)
                updateDatoGral({ ...datoGral, razonSocial: respuesta.datos.nombre })

            setApm(respuesta.datos);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener datos SEPREC`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }

    }

    const obtenerTipoAPM = async () => {
        try {
            setLoading(true)

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/parametros/APM/listado`
            })

            setTiposAPM(respuesta.datos);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener tipos APM`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('ingresa por aqui');
        obtenerTipoAPM().finally(() => { });
    }, []);

    function onChangeTipoApm(event: SelectChangeEvent): void {
        const datitos = { ...datoGral, tipoActorMinero: { id: event.target.value, descripcion: '' } }
        updateDatoGral(datitos);
    }

    function onChangeNumeroApm(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const datitos = { ...datoGral, numeroDocumento: event.target.value }
        updateDatoGral(datitos);
    }

    return (
        <>
            {datoGral.id !== '' &&
                (
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <InputLabel htmlFor={'tipoApm'}>
                                <Typography
                                    variant={'subtitle2'}
                                    sx={{ color: 'text.primary', fontWeight: '500' }}
                                >
                                    Tipo APM
                                </Typography>
                            </InputLabel>
                            <Box sx={{ p: 2, height: 40, border: '1px solid', backgroundColor: '#f5f4f4' }}>{datoGral.tipoActorMinero.descripcion}</Box>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel htmlFor={'numeroDocumento'}>
                                <Typography
                                    variant={'subtitle2'}
                                    sx={{ color: 'text.primary', fontWeight: '500' }}
                                >
                                    Nª Identificador
                                </Typography>
                            </InputLabel>
                            <Box sx={{ p: 2, height: 40, border: '1px solid', backgroundColor: '#f5f4f4' }}>{datoGral.razonSocial}</Box>
                        </Grid>
                    </Grid>
                )

            }
            {datoGral.id === '' &&
                (<form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <FormInputDropdown
                                id={'tipoAPM'}
                                name="tipoApm"
                                control={control}
                                label="Tipo APM"
                                options={tiposAPM.map((tipo) => ({
                                    key: tipo.id,
                                    value: tipo.id,
                                    label: tipo.nombre,
                                }))}
                                bgcolor={'background.paper'}
                                onChange={onChangeTipoApm}
                                clearable
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormInputText
                                id={'numeroAPM'}
                                control={control}
                                name="numeroApm"
                                label="Nº Identificador"
                                rules={{ required: 'Este campo es requerido' }}
                                onChange={onChangeNumeroApm}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Typography
                                variant={'subtitle2'}
                                sx={{ color: 'text.primary', fontWeight: '500' }}
                            >
                                &nbsp;
                            </Typography>
                            <Button type="submit" variant="contained" color="success" fullWidth sx={{ marginTop: '10px' }}>
                                Buscar
                            </Button>
                        </Grid>

                    </Grid>
                </form>)
            }
        </>
    );
};


export default BusquedaAPMComponente


