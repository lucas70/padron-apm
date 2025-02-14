import { Ref, forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Box } from '@mui/material'
import { FormInputText } from '@/components/form'
import { isValidEmail } from '@/utils/validations'
import { useFormStepStore } from '../StepsForm-store'

export interface Form2Ref {
  validar: () => Promise<void>
}

interface PropsComponente {
  accionSiguiente: () => Promise<void>
}

interface Form2Type {
  correo: string
  nroCelular: string
  nroCelularAlternativo: string
}

const Form2 = (props: PropsComponente, ref: Ref<unknown | undefined>) => {
  const formData = useFormStepStore((state) => state.formData)
  const setFormData = useFormStepStore((state) => state.setFormData)
  const { control, handleSubmit } = useForm<Form2Type>({
    defaultValues: formData,
  })

  const onSubmit: SubmitHandler<Form2Type> = async (data) => {
    setFormData(data)
    await props.accionSiguiente()
  }

  useImperativeHandle(
    ref,
    (): Form2Ref => ({
      validar: () => {
        return handleSubmit(onSubmit)()
      },
    })
  )

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <FormInputText
        id={'correo'}
        control={control}
        name="correo"
        label="Correo"
        type={'email'}
        rules={{
          required: 'Este campo es requerido',
          validate: (value) => {
            if (!isValidEmail(value)) return 'No es un correo válido'
          },
        }}
      />

      <FormInputText
        id={'nroCelular'}
        control={control}
        name="nroCelular"
        label="Nro. de Celular"
        type={'number'}
        rules={{
          required: 'Este campo es requerido',
        }}
      />

      <FormInputText
        id={'nroCelularAlternativo'}
        control={control}
        name="nroCelularAlternativo"
        label="Nro. de celular alternativo"
        type={'number'}
      />
    </Box>
  )
}

export default forwardRef(Form2)
