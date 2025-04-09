"use client";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import DatosGeneralesPage from '@/components/form/padron/datosGenerales';
import BandejaDireccionesPage from '@/components/form/padron/bandejaDirecciones';
import BandejaRepresentantesPage from '@/components/form/padron/bandejaRepresentantes';
import FormularioBorradorPage from '@/components/form/padron/formularioBorrador';
import FinalizaRegistroPage from '@/components/form/padron/finalizaRegistro';
import ImpresionFormulariosPage from '@/components/form/padron/impresionFormularios';
import { useDatoGralStore } from '@/lib/_store/datoGralStore';
import { useAlerts, useSession } from '@/hooks';
import { useAuth } from '@/context/AuthProvider'
import { useDatoContextoStore } from '@/lib/_store/datoContexto';

const steps = ['Datos Generales', 'Direcciones', 'Representantes', 'Borrador', 'Finalizar', 'Imprimir'];

export default function EdicionPage() {

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
    const [editable, setEditable] = useState(true)

    const { datoGral, updateDatoGral } = useDatoGralStore((state) => state);

    const { dataContexto } = useDatoContextoStore((state) => state);

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    // Proveedor de la sesión
    const { sesionPeticion } = useSession()

    const obtenerEstado = () => {
        console.log('dataContexto:-->', dataContexto, 'etapa:-->', datoGral.etapaActorMinero.id)
        console.log('dato general:-->', datoGral)
        if ((dataContexto.esTemporal && (datoGral.etapaActorMinero.id !== '53' && datoGral.etapaActorMinero.id !== '') ) ||
            (dataContexto.esTecnico && (datoGral.etapaActorMinero.id === '50'))) {
                setActiveStep(5)
                setEditable(false)
            }
    }

    useEffect(() => {
        obtenerEstado();
    }, [dataContexto, datoGral]);

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </Fragment>
            ) : (
                <Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0 || !editable}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Anterior
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Saltar
                            </Button>
                        )}
                        <Button onClick={handleNext} disabled={datoGral.id === ''}>
                            {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                    </Box>
                    {activeStep === 0 && <DatosGeneralesPage />}
                    {activeStep === 1 && <BandejaDireccionesPage />}
                    {activeStep === 2 && <BandejaRepresentantesPage />}
                    {activeStep === 3 && <FormularioBorradorPage />}
                    {activeStep === 4 && <FinalizaRegistroPage />}
                    {activeStep === 5 && <ImpresionFormulariosPage />}

                </Fragment>
            )}
        </Box>
    );
}

