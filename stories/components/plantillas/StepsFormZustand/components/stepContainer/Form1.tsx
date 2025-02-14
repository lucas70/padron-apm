import { Ref, forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Box } from '@mui/material'
import { FormInputText } from '@/components/form'
import { useFormStepStore } from '../StepsForm-store'

export interface Form1Ref {
  validar: () => Promise<void>
}

interface PropsComponente {
  accionSiguiente: () => Promise<void>
}

interface Form1Type {
  nombre: string
  primerApellido: string
  segundoApellido: string
  nroDocumento: string
}

const Form1 = (props: PropsComponente, ref: Ref<unknown | undefined>) => {
  const formData = useFormStepStore((state) => state.formData)
  const setFormData = useFormStepStore((state) => state.setFormData)

  const { control, handleSubmit } = useForm<Form1Type>({
    defaultValues: formData,
  })

  const onSubmit: SubmitHandler<Form1Type> = async (data) => {
    setFormData(data)
    await props.accionSiguiente()
  }

  useImperativeHandle(
    ref,
    (): Form1Ref => ({
      validar: () => {
        return handleSubmit(onSubmit)()
      },
    })
  )

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <FormInputText
        id={'nombre'}
        control={control}
        name="nombre"
        label="Nombre"
        type={'text'}
        rules={{
          required: 'Este campo es requerido',
        }}
      />

      <FormInputText
        id={'primerApellido'}
        control={control}
        name="primerApellido"
        label="Primer Apellido"
        type={'text'}
        rules={{
          required: 'Este campo es requerido',
        }}
      />

      <FormInputText
        id={'segundoApellido'}
        control={control}
        name="segundoApellido"
        label="Segundo Apellido"
        type={'text'}
        rules={{
          required: 'Este campo es requerido',
        }}
      />

      <FormInputText
        id={'nroDocumento'}
        control={control}
        name="nroDocumento"
        label="Nro. de Documento C.I."
        type={'text'}
        rules={{
          required: 'Este campo es requerido',
        }}
      />
    </Box>
  )
}

export default forwardRef(Form1)
