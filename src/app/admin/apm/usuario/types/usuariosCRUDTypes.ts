// CRUD de usuarios

export interface RolCRUDType {
  id: string
  rol: string
}

export interface UsuarioRolCRUDType {
  fechaCreacion: Date
  usuarioCreacion: string
  fechaActualizacion: Date
  usuarioActualizacion?: string
  id: string
  estado: string
  rol: RolCRUDType
}

export interface PersonaCRUDType {
  nombres: string
  primerApellido: string
  segundoApellido: string
  tipoDocumento: string
  numeroDocumento: string
  fechaNacimiento: string
}

export interface UsuarioListType {
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico: string
  estado: string
  usuarioRol: UsuarioRolCRUDType[]
  persona: PersonaCRUDType
}

export interface UsuarioCRUDType {
  id: string
  numeroDocumento: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  fechaNacimiento: string
  correoElectronico: string
  usuarioRol: UsuarioRolCRUDType[]
}

// Crear usuario

export interface CrearPersonaType {
  nombres: string
  primerApellido: string
  segundoApellido: string
  numeroDocumento: string
  fechaNacimiento: string
}

export interface CrearEditarUsuarioType {
  id: string
  numeroDocumento: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  fechaNacimiento: string
  correoElectronico: string
  roles: string[]
}

/// Tipo rol transversal

export interface RolType {
  id: string
  rol: string
  nombre: string
}
