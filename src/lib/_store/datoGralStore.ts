import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage-instance"
import { create } from "zustand"

export interface DatoGralType {
    id: string 
    razonSocial: string
    numeroDocumento: string 
    nia: string 
    telefono: string 
    celular: string 
    correoElectronico: string 
    tipoActorMinero: ParametroType
    municipio: ParametroType 
    departamento: ParametroType 
    etapaActorMinero: ParametroType 
    oficina: ParametroType 
    estado: string 
}

export interface ParametroType {
    id: string
    descripcion: string
}

interface DatoGralState {
    datoGral: DatoGralType
    cambios: boolean
    error: boolean
}

const DATOGRAL_INITIAL = {
    id: '',
    razonSocial: '',
    numeroDocumento: '',
    nia: '',
    telefono: '',
    celular: '',
    correoElectronico: '',
    tipoActorMinero: {id:'',descripcion:''},
    municipio: {id:'',descripcion:''},
    departamento: {id:'',descripcion:''},
    etapaActorMinero: {id:'',descripcion:''},
    oficina: {id:'',descripcion:''},
    estado: '',
}

// Initialize a default state
const DATOGRAL_INITIAL_STATE: DatoGralState = {
    datoGral: DATOGRAL_INITIAL,
    cambios: false,
    error: false
}

interface DatoGralActions {
    updateDatoGral: (dato: DatoGralType) => void;
    updateError: (error: boolean) => void;
    updateCambios: (cambio: boolean) => void;
    clearState: () => void;
}

export const useDatoGralStore = create<DatoGralState & DatoGralActions>((set) => ({
    datoGral: DATOGRAL_INITIAL_STATE.datoGral,
    cambios: DATOGRAL_INITIAL_STATE.cambios,
    error: DATOGRAL_INITIAL_STATE.error,
    // Actions
    updateDatoGral: (newDato) => set((state)=>({ datoGral: newDato, error: state.error, cambios: true })),
    updateError: (newError) => set((state)=>({ datoGral: state.datoGral, error: newError })),
    updateCambios: (newCambio) => set((state)=>({datoGral:state.datoGral, error: state.error, cambios: newCambio})),
    clearState: () => set({
        datoGral: DATOGRAL_INITIAL_STATE.datoGral,
        error: DATOGRAL_INITIAL_STATE.error
    })
}));

