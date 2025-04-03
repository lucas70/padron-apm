  export interface DireccionListDTOType {
    id: string
    zona: string
    avenida: string
    calle: string
    numero: string
    tipoDireccion: TipoDireccion
  }
  
  export interface TipoDireccion {
    id: string
    nombre: string
  }
  