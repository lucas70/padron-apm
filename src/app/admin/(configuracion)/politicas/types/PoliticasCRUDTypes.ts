/// CRUD de políticas

import { optionType } from '@/components/form'

export interface PoliticaCRUDType {
  sujeto: string
  objeto: string
  accion: string
  app: string
}

export interface CrearEditarPoliticaCRUDType {
  sujeto: string
  objeto: string
  accion: optionType[]
  app: string
}

export interface guardarPoliticaCRUDType {
  sujeto: string
  objeto: string
  accion: string
  app: string
}
