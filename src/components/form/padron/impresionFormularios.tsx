import { Constantes } from '@/config/Constantes'
import { useAlerts, useSession } from '@/hooks'
import { useDatoContextoStore } from '@/lib/_store/datoContexto'
import { useDatoGralStore } from '@/lib/_store/datoGralStore'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { Alert, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'

const ImpresionFormularios = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const { Alerta } = useAlerts()
  const [error, setError] = useState<any>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

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

  return (
    <div>
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
          <Grid item xs={10}>
            <Alert severity="success">
              Imprimir el formulario de registro
            </Alert>

          </Grid>
          <Grid item xs={10}>
            <Alert severity="success">
              Imprimir el certificado de inscripciòn al Padrón
            </Alert>

          </Grid>

        </Grid>
      )
      }
    </div>
  )
}

export default ImpresionFormularios