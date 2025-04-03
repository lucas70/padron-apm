import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Button, DialogActions, DialogContent, Grid, SelectChangeEvent } from '@mui/material'
import { FormInputDropdown, FormInputText } from 'src/components/form'
import Box from '@mui/material/Box'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { DireccionCRUDType } from '../types/direccionCRUDType'
import { ParametroDTOType } from '../types/parametroDTOType'

export interface ModalDireccionType {
    idActorMinero: string
    direccion?: DireccionCRUDType
    accionCorrecta: () => void
    accionCancelar: () => void
}

export const ModalDireccion = ({
    idActorMinero,
    direccion,
    accionCorrecta,
    accionCancelar,
}: ModalDireccionType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>()
    const [tiposDireccion, setTiposDireccion] = useState<ParametroDTOType[]>([]);
    const [idTipoDireccion, setIdTipoDireccion] = useState<string>(direccion? direccion.tipoDireccion.id: '');
    const [idDireccion, setIdDireccion] = useState<string>(direccion? direccion.id: '');

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    // Proveedor de la sesión
    const { sesionPeticion } = useSession()

    const { handleSubmit, control } = useForm<DireccionCRUDType>({
        defaultValues: {
            tipoDireccion: direccion?.tipoDireccion,
            zona: direccion?.zona,
            avenida: direccion?.avenida,
            calle: direccion?.calle,
            numero: direccion?.numero,
        },
    })

    const guardarActualizarDireccion = async (data: DireccionCRUDType) => {
        await guardarActualizarDireccionPeticion(data)
    }

    const guardarActualizarDireccionPeticion = async (direccion: DireccionCRUDType) => {
        console.log('id dirección: -->', direccion.id )
        try {
            setLoadingModal(true)
            await delay(1000)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/direccion${idDireccion ? `/${idDireccion}` : ''
                    }`,
                method: !!idDireccion ? 'patch' : 'post',
                body: { ...direccion, idActorMinero: idActorMinero, idTipo: idTipoDireccion },
            })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            accionCorrecta()
        } catch (e) {
            imprimir(`Error al crear o actualizar la direccion`, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoadingModal(false)
        }
    }

    const obtenerTiposDireccion = async () => {
        try {
            setLoading(true)

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/parametros/TDD/listado`
            })

            setTiposDireccion(respuesta.datos);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener tipos dirección`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('idAPM input:->', idActorMinero);
        console.log('direccion input:->', direccion)
        obtenerTiposDireccion().finally(() => { });
    }, []);

    function onChangeTipo(event: SelectChangeEvent): void {
        setIdTipoDireccion(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit(guardarActualizarDireccion)}>
            <DialogContent dividers>
                <Grid container direction={'column'} justifyContent="space-evenly">
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputDropdown
                                id={'idTipo'}
                                name="tipoDireccion.id"
                                control={control}
                                label="Tipo"
                                options={tiposDireccion.map((tipo) => ({
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
                                id={'zona'}
                                control={control}
                                name="zona"
                                label="Zona"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputText
                                id={'avenida'}
                                control={control}
                                name="avenida"
                                label="Avenida"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputText
                                id={'calle'}
                                control={control}
                                name="calle"
                                label="Calle"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputText
                                id={'numero'}
                                control={control}
                                name="numero"
                                label="Numero"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                                rows={3}
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
