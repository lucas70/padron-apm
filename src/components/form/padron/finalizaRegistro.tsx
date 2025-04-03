import React, { ChangeEvent, useState } from 'react'
import FormDisplayText from '../FormDisplayText'
import { Grid, Switch, Alert, Button } from '@mui/material'
import { AlertDialog } from '@/components/modales/AlertDialog';
import { InterpreteMensajes, titleCase } from '@/utils';
import { useAlerts, useSession } from '@/hooks';
import { Constantes } from '@/config/Constantes';
import { imprimir } from '@/utils/imprimir';
import { useDatoGralStore } from '@/lib/_store/datoGralStore';


const FinalizaRegistroPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [primer, setPrimer] = useState(false);
  const [segundo, setSegundo] = useState(false);
  const [tercer, setTercer] = useState(false);
  const { datoGral, updateDatoGral } = useDatoGralStore((state) => state);

  console.log('datos generales: -->', datoGral)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  function onChangePrimer(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    setPrimer(checked);
    if (!checked) {
      setSegundo(false)
      setTercer(false)
    }
  }

  const cancelarConfirmar = () => {
    setMostrarConfirmar(false)
    setPrimer(false)
    setSegundo(false)
    setTercer(false)
  }

  function onChangeSegundo(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    setSegundo(checked);
    if (!checked) {
      setTercer(false)
    }
  }

  function onChangeTercer(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    setTercer(checked);
    setMostrarConfirmar(checked);
  }

  const finalizarRegistro = async () => {
    try {
      setLoading(true)
      //await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/${datoGral.id}/finalizarRegistro`,
        method: 'patch',
      })

      updateDatoGral({...datoGral, etapaActorMinero: respuesta.datos.etapaActorMinero})

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

  const aceptarConfirmar = () => {
    finalizarRegistro().finally(() => { });
    setMostrarConfirmar(false)
  }


  return (
    <div>
      <AlertDialog
        isOpen={mostrarConfirmar}
        titulo={'Alerta'}
        texto={`¿Está seguro de finalizar el registro?`}
      >
        <Button variant={'outlined'} onClick={cancelarConfirmar}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarConfirmar}>
          Aceptar
        </Button>
      </AlertDialog>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Alert severity="success">
            Usted ha registrado toda la información solicitada en el formulario de pre-registro?
          </Alert>
        </Grid>
        <Grid item xs={4}>
          <Switch size='small' onChange={onChangePrimer} checked={primer} />
        </Grid>
        <Grid item xs={8}>
          <Alert severity="success">
            Usted ha revisado toda la información de su formulario de pre-registro?. En el paso anterior puede revisar el formulario
          </Alert>
        </Grid>
        <Grid item xs={4}>
          <Switch size='small' disabled={!primer} onChange={onChangeSegundo} checked={segundo} />
        </Grid>
        <Grid item xs={8}>
          <Alert severity="success">
            Una vez finalizado el formulario no podrá ser modificado. Esta seguro que quiere finalizar el formulario?
          </Alert>

        </Grid>
        <Grid item xs={4}>
          <Switch size='small' disabled={!segundo} onChange={onChangeTercer} checked={tercer} />
        </Grid>
      </Grid>
    </div>
  )
}

export default FinalizaRegistroPage