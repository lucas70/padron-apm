import { Meta, StoryFn } from '@storybook/react'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import useFirmador from '@/hooks/useFirmador'
import { imprimir } from '@/utils/imprimir'
import { delay } from '@/utils'
import { action } from '@storybook/addon-actions'
import { Typography } from '@mui/material'
import { BackdropVista } from '@/components/progreso/Backdrop'
import Button from '@mui/material/Button'
import { Constantes } from '@/config/Constantes'
import FormInputFile from '@/components/form/FormInputFile'

export interface PersonaType {
  imagenes: FileList
  comentario: string
}

export default {
  title: 'Organismos/Firmador/Firmador',
  parameters: {
    docs: {
      description: {
        component:
          'Ejemplo de implementación de Firmatic para formatos de tipo JSON y PDF',
      },
    },
  },
} as Meta

const TemplateJson: StoryFn = () => {
  const [cargando, setCargando] = useState<boolean>(false)
  const { obtenerEstado, firmarDocumento } = useFirmador()
  const [jsonFirmar] = useState<object>({
    persona: {
      nombre: 'RICARDO',
      apellidoPaterno: 'AGUILERA',
      apellidoMaterno: 'PACO',
    },
    celular: '78945612',
    correo: 'correo@yopmail.com',
  })

  const firmarProcesar = async () => {
    const estadoFirmatic = await obtenerEstado()
    imprimir('estadoFirmatic:', estadoFirmatic)

    if (estadoFirmatic !== 200) {
      imprimir('El Firmatic no se encuentra iniciado')
      handleClick('Error -> El Firmatic no se encuentra iniciado')
      return
    }

    setCargando(true)
    await delay(500)

    try {
      const documentoFirmado = await firmarDocumento(
        jsonFirmar,
        'json',
        'JsonFirmado'
      )
      handleClick(`Finalizado -> JSON firmado: ${documentoFirmado}`)
    } catch (error) {
      imprimir(`Error al firmar: ${error}`)
      handleClick(`Error -> No se pudo firmar documento`)
    } finally {
      setCargando(false)
    }
  }

  const handleClick = action(``)

  return (
    <>
      <Typography>JSON A FIRMAR</Typography>
      <pre>{JSON.stringify(jsonFirmar, null, 2)}</pre>
      <BackdropVista
        color={'inherit'}
        titulo={'Firmando'}
        cargando={cargando}
      />
      <Button
        href={`${Constantes.firmadorUrl}`}
        target="_blank"
        rel="noreferrer"
        sx={{ p: 0 }}
      >
        <Typography
          variant="body2"
          color={'primary'}
          sx={{ textTransform: 'none', fontWeight: '550' }}
        >
          Verificar servicio
        </Typography>
      </Button>
      <Button
        variant={'contained'}
        color={'primary'}
        disabled={cargando}
        onClick={firmarProcesar}
        sx={{ ml: 2 }}
      >
        {`Firmar`}
      </Button>
    </>
  )
}

const TemplatePdf: StoryFn = () => {
  const [cargando, setCargando] = useState<boolean>(false)
  const { obtenerEstado, firmarDocumento } = useFirmador()

  const { control, watch } = useForm<PersonaType>({})

  const obtenerArchivoDescarga = async (documentoFirmado: string) => {
    try {
      const pdf64 = await fetch(
        `data:application/pdf;base64,${documentoFirmado}`
      )
      const blob = await pdf64.blob()
      const documento = new File([blob], 'DocumentoFirmado', {
        type: 'application/pdf',
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(documento)
      link.setAttribute('download', 'DocumentoFirmado')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      imprimir('No se encontro archivo de la solicitud')
      handleClick('Error -> No se encontró archivo de la solicitud')
    }
  }

  const fileABase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'))
      }
      reader.readAsDataURL(file)
    })
  }

  const firmarProcesar = async () => {
    const estadoFirmatic = await obtenerEstado()
    imprimir('estadoFirmatic:', estadoFirmatic)
    if (estadoFirmatic !== 200) {
      imprimir('El Firmatic no se encuentra iniciado')
      handleClick('Error -> El Firmatic no se encuentra iniciado')
      return
    }
    setCargando(true)
    await delay(500)
    const file = watch('imagenes')
    const archivo = await fileABase64(file[0])
    try {
      const documentoFirmado = await firmarDocumento(
        `${archivo}`,
        'pdf',
        'documentoFirmado'
      )
      handleClick(`Finalizado -> Documento firmado: ${documentoFirmado}`)
      await obtenerArchivoDescarga(documentoFirmado)
    } catch (error) {
      imprimir(`Error al firmar: ${error}`)
      handleClick(`Error -> No se puedo firmar documento`)
    } finally {
      setCargando(false)
    }
  }

  const handleClick = action(``)

  return (
    <>
      <FormInputFile
        id={'textfield-form-1'}
        label="Documento"
        name="imagenes"
        control={control}
        tiposPermitidos={['pdf']}
      />
      <BackdropVista
        color={'inherit'}
        titulo={'Firmando'}
        cargando={cargando}
      />
      <Button
        href={`${Constantes.firmadorUrl}`}
        target="_blank"
        rel="noreferrer"
        sx={{ p: 0 }}
      >
        <Typography
          variant="body2"
          color={'primary'}
          sx={{ textTransform: 'none', fontWeight: '550' }}
        >
          Verificar servicio
        </Typography>
      </Button>
      <Button
        variant={'contained'}
        color={'success'}
        disabled={cargando}
        onClick={firmarProcesar}
        sx={{ ml: 2 }}
      >
        {`Firmar`}
      </Button>
    </>
  )
}

export const FirmarJson = TemplateJson.bind({})
FirmarJson.storyName = 'Ejemplo de firma de JSON'

export const FirmarDocumento = TemplatePdf.bind({})
FirmarDocumento.storyName = 'Ejemplo de firma de PDF'
