"use client";

import { Box, Button, Chip, Grid, InputLabel, Link, Paper, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormInputDropdown } from "../FormInputDropdown";
import { DatosGralesType } from "@/app/admin/padron/edicion/types/datosGralesType";
import { FormInputText } from "../FormInputText";
import { useCountStore } from "@/lib/_store";
import BusquedaAPMComponente from "./busquedaAPM";
import { useDatoGralStore } from "@/lib/_store/datoGralStore";
import { CustomDialog } from "@/components/modales/CustomDialog";
import ModalDeptoMunicipio from "./ui/modalDeptoMunicipio";
import { useAlerts, useSession } from "@/hooks";
import { Constantes } from "@/config/Constantes";
import { InterpreteMensajes } from "@/utils";
import { imprimir } from "@/utils/imprimir";
import { ParametroDTOType } from "./types/parametroDTOType";



const DatosGeneralesPage = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [modalMunicipio, setModalMunicipio] = useState(false);
    const { datoGral, updateDatoGral } = useDatoGralStore((state) => state);
    const [error, setError] = useState<any>()
    const [oficinas, setOficinas] = useState<ParametroDTOType[]>([]);

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    // Proveedor de la sesión
    const { sesionPeticion } = useSession()

    const mostrarModalMunicipio = () => {
        setModalMunicipio(true)
    }

    const cerrarModalMunicipio = () => {
        setModalMunicipio(false)
    }

    const { handleSubmit, control } = useForm<DatosGralesType>({
        defaultValues: {
            correo: datoGral.correoElectronico, telefono: datoGral.telefono, celular: datoGral.celular
        }
    })

    const guardarDatosGrales = async () => {
        console.log('datos a guardar:', datoGral);
        try {
            setLoading(true)
            //await delay(1000)
            const respuesta = await sesionPeticion({
                url: !!datoGral.id ? `${Constantes.baseUrl}/actores/${datoGral.id}` : `${Constantes.baseUrl}/actores`,
                method: !!datoGral.id ? 'patch' : 'post',
                body: {
                    idTipoActorMinero: datoGral.tipoActorMinero.id,
                    idMunicipio: datoGral.municipio.id,
                    razonSocial: datoGral.razonSocial,
                    numeroDocumento: datoGral.numeroDocumento,
                    telefono: datoGral.telefono,
                    celular: datoGral.celular,
                    correoElectronico: datoGral.correoElectronico,
                    idEtapa: "50",
                    estado: "ACTIVO"
                },
            })
            updateDatoGral({ ...datoGral, id: respuesta.datos.id })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })

        } catch (e) {
            imprimir(`Error al crear o actualizar los datos del APM`, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (datos: any) => {
        guardarDatosGrales();
    }

    const obtenerOficinas = async () => {
        try {
            setLoading(true)

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/parametros/OFC/listado`
            })

            setOficinas(respuesta.datos);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener las oficinas de la AJAM`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        obtenerOficinas().finally(() => { });

    }, []);

    function onChangeCorreo(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        updateDatoGral({ ...datoGral, correoElectronico: event.target.value })
    }

    function onChangeTelefono(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        updateDatoGral({ ...datoGral, telefono: event.target.value })
    }

    function onChangeCelular(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        updateDatoGral({ ...datoGral, celular: event.target.value })
    }

    function onChangeOficina(event: SelectChangeEvent): void {
        updateDatoGral({
            ...datoGral, oficina: {
                id: event.target.value,
                descripcion: ""
            }
        })
    }

    return (

        <>
            <BusquedaAPMComponente />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputLabel htmlFor={'denominacion'}>
                            <Typography
                                variant={'subtitle2'}
                                sx={{ color: 'text.primary', fontWeight: '500' }}
                            >
                                Denominación
                            </Typography>
                        </InputLabel>
                        <Box sx={{ p: 2, height: 40, border: '1px solid', backgroundColor: '#f5f4f4' }}>{datoGral.razonSocial}</Box>
                    </Grid>
                    <Grid item xs={5}>
                        <InputLabel htmlFor={'Departamento'}>
                            <Typography
                                variant={'subtitle2'}
                                sx={{ color: 'text.primary', fontWeight: '500' }}
                            >
                                Departamento
                            </Typography>
                        </InputLabel>
                        <Box sx={{ p: 2, height: 40, border: '1px solid', backgroundColor: '#f5f4f4' }}>{datoGral.departamento.descripcion}</Box>
                    </Grid>
                    <Grid item xs={5}>
                        <InputLabel htmlFor={'Municipio'}>
                            <Typography
                                variant={'subtitle2'}
                                sx={{ color: 'text.primary', fontWeight: '500' }}
                            >
                                Municipio
                            </Typography>
                        </InputLabel>
                        <Box sx={{ p: 2, height: 40, border: '1px solid', backgroundColor: '#f5f4f4' }}>{datoGral.municipio.descripcion}</Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography
                            variant={'subtitle2'}
                            sx={{ color: 'text.primary', fontWeight: '500' }}
                        >
                            .
                        </Typography>
                        <Button onClick={mostrarModalMunicipio} variant="contained" color="success" fullWidth>
                            Seleccionar
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormInputText
                            id={'correo'}
                            control={control}
                            name="correo"
                            label="Correo eletrónico"
                            rules={{ maxLength: 40, required: 'Este campo es requerido' }}
                            onChange={onChangeCorreo}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormInputText
                            id={'telefono'}
                            control={control}
                            name="telefono"
                            label="Telefono Nº"
                            rules={{ maxLength: 10 }}
                            onChange={onChangeTelefono}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormInputText
                            id={'celular'}
                            control={control}
                            name="celular"
                            label="Celular Nº"
                            rules={{ maxLength: 10 }}
                            onChange={onChangeCelular}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
                            Guardar
                        </Button>
                    </Grid>
                    <Grid item xs={2}>

                        <Link href="/admin/padron/registro">
                            <Button variant="contained" color="warning" fullWidth sx={{ marginTop: '10px' }}>
                                Cancelar
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </form>
            <CustomDialog
                isOpen={modalMunicipio}
                handleClose={cerrarModalMunicipio}
                title={'Buscar Municipio'
                }>
                <ModalDeptoMunicipio accionCancelar={cerrarModalMunicipio} />
            </CustomDialog>
        </>
    );
};


export default DatosGeneralesPage

