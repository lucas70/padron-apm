import { ModuloCRUDType } from '@/app/admin/(configuracion)/modulos/types/CrearEditarModulosType'

export interface ModalModuloType {
  modulo?: ModuloCRUDType | undefined | null
  accionCorrecta: () => void
  accionCancelar: () => void
  modulos: ModuloCRUDType[]
}
