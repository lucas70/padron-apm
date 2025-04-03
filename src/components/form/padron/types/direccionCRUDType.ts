import { ParametroDTOType } from "./parametroDTOType"

export interface DireccionCRUDType {
    id: string
    idActorMinero: string
    tipoDireccion: ParametroDTOType
    zona: string
    avenida: string
    calle: string
    numero: string
    estado: string
  }