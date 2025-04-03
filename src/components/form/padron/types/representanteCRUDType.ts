import { ParametroDTOType } from "./parametroDTOType"

export interface RepresentanteCRUDType {
    id: string
    idActorMinero: string,
    idTipoRepresentanteLegal: string,
    idTipoDocumento: string,
    numeroDocumento: string,
    primerApellido: string,
    segundoApellido: string,
    nombres: string,
    fechaNacimiento: string,
    telefono: string,
    celular: string,
    correoElectronico: string,
  }