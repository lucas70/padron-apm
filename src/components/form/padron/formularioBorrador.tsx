import { Constantes } from '@/config/Constantes'
import { useAlerts, useSession } from '@/hooks'
import { useDatoGralStore } from '@/lib/_store/datoGralStore'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import React, { useEffect, useState } from 'react'

const FormularioBorradorPage = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const { Alerta } = useAlerts()
  const [error, setError] = useState<any>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const datoGral = useDatoGralStore((state) => state.datoGral);

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

  useEffect(() => {
    console.log('ingresa por aqui');
    obtenerPdfFormulario().finally(() => { });
  }, []);

  return (
    <div>
      {pdfUrl ? (
        <div>
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
        </div>
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  )
}

export default FormularioBorradorPage