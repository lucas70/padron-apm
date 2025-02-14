import { Servicios } from '@/services'
import { decodeBase64, encodeBase64, serializeError } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { Constantes } from '@/config/Constantes'

const useFirmador = () => {
  const crearDocumentoEnviar = (
    archivoDoc: string | object,
    formato: string,
    nombreArchivo: string
  ) => {
    if (formato === 'pdf') {
      return {
        archivo: [
          {
            base64: `data:application/pdf;base64,${archivoDoc}`,
            name: `${nombreArchivo}.${formato}`,
          },
        ],
        format: 'pades',
        language: 'es',
      }
    }

    const objJsonStr = JSON.stringify(archivoDoc)
    const objJsonB64 = encodeBase64(objJsonStr)

    return {
      archivo: [
        {
          base64: `data:application/javascript;base64,${objJsonB64}`,
          name: `${nombreArchivo}.${formato}`,
        },
      ],
      format: 'jws',
      language: 'es',
    }
  }

  const firmarDocumento = async (
    archivo: string | object,
    formato: string,
    nombreArchivo: string
  ) => {
    try {
      const documentoEnviar = crearDocumentoEnviar(
        archivo,
        formato,
        nombreArchivo
      )

      const respuestaPeticion = await Servicios.peticion({
        method: 'POST',
        url: `${Constantes.firmadorUrl}/sign`,
        body: documentoEnviar,
        withCredentials: false,
      })

      const respuesta = respuestaPeticion.data ?? respuestaPeticion

      if (!respuesta?.files) {
        if (typeof respuesta === 'string') {
          imprimir('Firmatic version 0.7.0')
          return decodeBase64(respuesta)
        }

        imprimir('No se recibió ningún documento del firmador.')
        return
      }

      if (respuesta.files.length === 1) {
        imprimir('Firmatic version 0.9.0')
        const base64 = respuesta.files[0].base64

        if (formato === 'pdf') {
          return base64
        }

        return decodeBase64(base64)
      }

      imprimir('No se recibió ningún documento del firmador.')
      return
    } catch (error) {
      const errorMessage = serializeError(error)

      imprimir(`Error al firmar el documento: ${error}`)
      throw new Error(
        errorMessage?.response?.data?.message ??
          'No se puede conectar con el servicio de Firmatic.'
      )
    }
  }

  const obtenerEstado = async () => {
    try {
      const respuesta = await Servicios.peticionHTTP({
        url: Constantes.firmadorUrl ?? '',
        withCredentials: false,
      })

      imprimir('respuesta:', respuesta.status)
      return respuesta.status
    } catch (error) {
      const errorMessage = serializeError(error)
      imprimir(`Error al consultar el estado del firmador: ${errorMessage}`)
      return errorMessage?.status
    }
  }

  return {
    firmarDocumento,
    obtenerEstado,
  }
}

export default useFirmador
