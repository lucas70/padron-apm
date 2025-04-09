import { CustomDialog } from '@/components/modales/CustomDialog'
import { Constantes } from '@/config/Constantes'
import { useAlerts, useSession } from '@/hooks'
import { useDatoContextoStore } from '@/lib/_store/datoContexto'
import { useDatoGralStore } from '@/lib/_store/datoGralStore'
import { delay, InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { Alert, Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ModalImpresionFormulario } from './ui/modalImpresionFormulario'
import { ModalImpresionCertificado } from './ui/modalImpresionCertificado'
import { ModalImpresionPin } from './ui/modalImpresionPin'

const ImpresionFormularios = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const { Alerta } = useAlerts()
  const [error, setError] = useState<any>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [modalReporteFormulario, setModalReporteFormulario] = useState(false)
  const [modalReporteCertificado, setModalReporteCertificado] = useState(false)
  const [modalReportePin, setModalReportePin] = useState(false)

  const datoGral = useDatoGralStore((state) => state.datoGral);
  const { dataContexto } = useDatoContextoStore((state) => state);

  const { sesionPeticion, sesionPeticionExterno } = useSession()

  const base64toBlob = (data: string) => {
    // Cut the prefix data:application/pdf;base64 from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };

  const obtenerPdfFormulario = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/reporte/${datoGral.id}/registro`,
      })

      const blob = base64toBlob(respuesta.datos);
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl)

      setError(null)
    } catch (e) {
      imprimir(`Error al obtener el formulario de registro`, e)
      setError(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerPdfFormularioCertificado = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/actores/reporte/${datoGral.id}/certificado`,
      })

      const blob = base64toBlob(respuesta.datos);
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl)

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
    obtenerPdfFormulario().finally(() => { });
  }, []);

  const cerrarModalReporteFormulario = async () => {
    setModalReporteFormulario(false)
    await delay(500)
  }

  const imprimirFormulario = () => {
    setModalReporteFormulario(true);
  }

  const cerrarModalReporteCertificado = async () => {
    setModalReporteCertificado(false)
    await delay(500)
  }

  const imprimirCertificado = () => {
    setModalReporteCertificado(true);
  }

  const cerrarModalReportePin = async () => {
    setModalReportePin(false)
    await delay(500)
  }

  const imprimirPin = () => {
    setModalReportePin(true);
  }

  return (
    <div>
      <CustomDialog
        isOpen={modalReporteFormulario}
        handleClose={cerrarModalReporteFormulario}
        maxWidth={'sm'}
        title='Impresión'
      >
        <ModalImpresionFormulario
          accionCorrecta={() => {
            cerrarModalReporteFormulario().finally()
          }}
          accionCancelar={cerrarModalReporteFormulario}
        />
      </CustomDialog>
      <CustomDialog
        isOpen={modalReporteCertificado}
        handleClose={cerrarModalReporteCertificado}
        maxWidth={'sm'}
        title='Impresión'
      >
        <ModalImpresionCertificado
          accionCorrecta={() => {
            cerrarModalReporteCertificado().finally()
          }}
          accionCancelar={cerrarModalReporteCertificado}
        />
      </CustomDialog>
      <CustomDialog
        isOpen={modalReportePin}
        handleClose={cerrarModalReportePin}
        maxWidth={'sm'}
        title='Impresión'
      >
        <ModalImpresionPin
          accionCorrecta={() => {
            cerrarModalReportePin().finally()
          }}
          accionCancelar={cerrarModalReportePin}
        />
      </CustomDialog>
      {(dataContexto.esTemporal &&
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Alert severity="success">
                Usted debe imprimir 2 ejemplares del formulario de registro y luego apersonarse a la plataforma de atenciòn de la AJAM, con la documentaciòn de respaldo correspondiente.  Una vez finalizada la revisiòn por parte del personal técnico de plataforma  y si no existira observaciòn alguna se le entregará su certificado de inscripción.
              </Alert>

            </Grid>

          </Grid>
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>
              Tu navegador no soporta la visualización de PDFs. Puedes ver el
              PDF{' '}
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                aquí
              </a>
              .
            </p>
          </object>
        </>
      )}
      {(dataContexto.esTecnico &&
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Alert severity="success">
              Imprimir el formulario de registro
            </Alert>

          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="success" fullWidth sx={{ marginTop: '10px' }} onClick={imprimirFormulario}>
              Imprimir
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Alert severity="success">
              Imprimir el certificado de inscripciòn al Padrón
            </Alert>

          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="success" fullWidth sx={{ marginTop: '10px' }} onClick={imprimirCertificado}>
              Imprimir
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Alert severity="success">
              Imprimir el reporte que contiene el PIN inicial
            </Alert>

          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="success" fullWidth sx={{ marginTop: '10px' }} onClick={imprimirPin}>
              Imprimir
            </Button>
          </Grid>

        </Grid>
      )
      }
    </div>
  )
}

export default ImpresionFormularios