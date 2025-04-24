import { ParametroDTOType } from "./parametroDTOType"

export interface AdjuntoCRUDType {
    id: string
    idTipo: string
    descripcion: string
    nombreOriginal: string
    tipoArchivo: string
    documento:  FileList    
  }