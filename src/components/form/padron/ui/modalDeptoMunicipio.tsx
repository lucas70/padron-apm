import React, { ReactNode, useEffect, useState } from 'react'
import { ModalMunicipioType } from '../types/modalMunicipioType'
import { Button, DialogActions, DialogContent, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { FormInputDropdown } from '../../FormInputDropdown'
import { FormInputText } from '../../FormInputText'
import { BusquedaMunicipioType } from '../types/busquedaMunicipioType'
import { useForm } from 'react-hook-form'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { InterpreteMensajes } from '@/utils'
import { DeptoDTOType } from '../types/deptoDTOType'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { MunicipioDTOType } from '../types/municipioDTOType'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { ParametroType, useDatoGralStore } from '@/lib/_store/datoGralStore'

const ModalDeptoMunicipio = ({
    accionCancelar,
}: ModalMunicipioType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [deptos, setDeptos] = useState<DeptoDTOType[]>([]);
    const [municipios, setMunicipios] = useState<MunicipioDTOType[]>([]);
    const { Alerta } = useAlerts()
    const [error, setError] = useState<any>()
    const { sesionPeticion } = useSession()
    const { datoGral, updateDatoGral } = useDatoGralStore((state) => state);

    const [ordenCriterios, setOrdenCriterios] = useState<
        Array<CriterioOrdenType>
    >([
        { campo: 'nombre', nombre: 'Nombre', ordenar: true },
        { campo: 'accion', nombre: 'Acciòn' },
    ])

    const { handleSubmit, control } = useForm<BusquedaMunicipioType>();

    const obtenerDepto = async () => {
        try {
            setLoading(true)

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/organizacion/departamentos`
            })

            setDeptos(respuesta.datos);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener los departamentos`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const obtenerMunicipios = async (id: string, muni: string) => {
        try {
            setLoading(true)

            const municipio = (muni !== '') ? `&municipio=${muni}` : ''

            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/organizacion/municipios?limite=10&pagina=1&idDepartamento=${id}${municipio}`
            })

            setMunicipios(respuesta.datos.filas);

            setError(null)
        } catch (e) {
            imprimir(`Error al obtener los municipios`, e)
            setError(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('ingresa por aqui');
        obtenerDepto().finally(() => { });
    }, []);

    const onSubmit = async (datos: BusquedaMunicipioType) => {
        const deptoSeleccionado = deptos.find((depto) => depto.id === datos.depto)
        const dep: ParametroType = {
            id: (deptoSeleccionado?.id)? deptoSeleccionado.id: '',
            descripcion: (deptoSeleccionado?.nombre)? deptoSeleccionado.nombre: ''
        }
        console.log('depto:', dep);
        updateDatoGral({...datoGral, departamento:dep})
        obtenerMunicipios(datos.depto, datos.municipio)
    }

    const onSelect = (municipio:MunicipioDTOType) => {
        const mun: ParametroType = {
            id: municipio.id,
            descripcion: municipio.nombre
        }
        updateDatoGral({...datoGral, municipio: mun})
        accionCancelar();
    }

    const contenidoTabla: Array<Array<ReactNode>> = municipios.map(
        (municipio, indexMunicipio) => [
            <Typography
                key={`${municipio.id}-${indexMunicipio}-label`}
                variant={'body2'}
            >{`${municipio.nombre}`}</Typography>,
            <Stack
                key={`${municipio.id}-${indexMunicipio}-acciones`}
                direction={'row'}
                alignItems={'center'}
            >
                <IconoTooltip
                    id={`editarModulo-${municipio.id}`}
                    titulo={'Seleccionar'}
                    color={'primary'}
                    accion={() => {
                        onSelect(municipio)
                    }}
                    icono={'done'}
                    name={'Seleccionar municipio'} />
            </Stack>,
        ]
    )

    function setSelectedDepto(event:SelectChangeEvent): void {
        
        const opcionSeleccionada = deptos.find((depto) => depto.id === event.target.value);
        console.log('seleccionado:', opcionSeleccionada);
    }

    return (
        <div>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormInputDropdown
                                id={'depto'}
                                name="depto"
                                control={control}
                                label="Departamento"
                                options={deptos.map((depto) => ({
                                    key: depto.id,
                                    value: depto.id,
                                    label: depto.nombre,
                                }))}
                                bgcolor={'background.paper'}
                                rules={{ required: 'Este campo es requerido' }}
                                onChange={setSelectedDepto}
                                clearable
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <FormInputText
                                id={'municipio'}
                                control={control}
                                name="municipio"
                                label="Municipio"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                variant={'subtitle2'}
                                sx={{ color: 'text.primary', fontWeight: '500' }}
                            >
                                &nbsp;
                            </Typography>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
                                Buscar
                            </Button>
                        </Grid>

                    </Grid>
                </form>
                <CustomDataTable titulo={'Módulos'} columnas={ordenCriterios} contenidoTabla={contenidoTabla} />
            </DialogContent>
            <DialogActions>
                <Button
                    variant={'outlined'}
                    disabled={loadingModal}
                    onClick={accionCancelar}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </div>
    )
}

export default ModalDeptoMunicipio
