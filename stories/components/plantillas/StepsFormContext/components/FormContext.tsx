import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

interface FormData {
  nombre: string
  primerApellido: string
  segundoApellido: string
  nroDocumento: string
  correo: string
  nroCelular: string
  nroCelularAlternativo: string
  zona: string
  calle: string
  nroDomicilio: string
}

interface FormContext {
  formData: FormData
  setFormData: Dispatch<SetStateAction<FormData>>
}

const FormContext = createContext<FormContext>({
  formData: {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    nroDocumento: '',
    correo: '',
    nroCelular: '',
    nroCelularAlternativo: '',
    zona: '',
    calle: '',
    nroDomicilio: '',
  },
  setFormData: () => {},
})

interface Props {
  children: ReactNode
}

export function FromProvider({ children }: Props) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    nroDocumento: '',
    correo: '',
    nroCelular: '',
    nroCelularAlternativo: '',
    zona: '',
    calle: '',
    nroDomicilio: '',
  })

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormState() {
  return useContext(FormContext)
}
