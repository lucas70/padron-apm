import { create } from 'zustand'

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

interface State {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
}

export const useFormStepStore = create<State>()((set) => ({
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
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}))
