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
import { ParametroDTOType } from '../types/parametroDTOType'
import { AdjuntoCRUDType } from '../types/adjuntoCRUDType'
import FormInputFile from '../../FormInputFile'

export interface ModalDocumentoType {
    idActorMinero: string
    adjunto?: AdjuntoCRUDType
    accionCorrecta: () => void
    accionCancelar: () => void
}

export const ModalDocumento = ({
    idActorMinero,
    adjunto,
    accionCorrecta,
    accionCancelar,
}: ModalDocumentoType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>()
    const [tiposDocumento, setTiposDocumento] = useState<ParametroDTOType[]>([]);
    const [idTipoDocumento, setIdTipoDocumento] = useState<string>(adjunto ? adjunto.idTipo : '');
    const [idAdjunto, setIdAdjunto] = useState<string>(adjunto ? adjunto.id : '');
    const [image, setImage] = useState(null);
    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    // Proveedor de la sesión
    const { sesionPeticion } = useSession()

    const { handleSubmit, control } = useForm<AdjuntoCRUDType>({
        defaultValues: {
            idTipo: adjunto?.idTipo,
        },
    })

    const guardarActualizarAdjunto = async (data: AdjuntoCRUDType) => {
        imprimir('datos enviados desde el formulari son:', data)
        const formData = new FormData()
        formData.append('id', idActorMinero);
        formData.append('idTipo', data.idTipo);
        formData.append('idTipoArchivo', '75');
        formData.append('idAmbito', '85');
        formData.append('file', data.documento[0]);
        imprimir('datos del formData:', formData)
        try {
            setLoadingModal(true)
            await delay(1000)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/documento/subir`,
                method: 'post',
                body: formData,
            })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            accionCorrecta()
        } catch (e) {
            imprimir(`Error al crear o actualizar el documento`, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoadingModal(false)
        }
    }

    const obtenerTiposDocumento = async () => {
        try {
            setLoading(true)

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/parametros/DOCS/listado`
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
        obtenerTiposDocumento().finally(() => { });
    }, []);

    function onChangeTipo(event: SelectChangeEvent): void {
        setIdTipoDocumento(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit(guardarActualizarAdjunto)}>
            <DialogContent dividers>
                <Grid container direction={'column'} justifyContent="space-evenly">
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputDropdown
                                id={'idTipo'}
                                name="idTipo"
                                control={control}
                                label="Tipo documento"
                                options={tiposDocumento.map((tipo) => ({
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
                            <FormInputFile
                                id={'textfield-form-1'}
                                label="Documento Identidad Declarante"
                                name="documento"
                                control={control}
                                tiposPermitidos={['pdf']}
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
