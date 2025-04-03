import { create } from "zustand"

export interface ContextoType {
    esTecnico: boolean
    esTemporal: boolean
}

interface DatoContextoState {
    dataContexto: ContextoType
}


interface DatoContextoActions {
    updateTecnico: (dato: boolean) => void;
    updateTemporal: (dato: boolean) => void;
    clearState: () => void;
}

export const useDatoContextoStore = create<DatoContextoState & DatoContextoActions>((set) => ({
    dataContexto: {esTecnico: false, esTemporal: false},    // Actions
    updateTecnico: (newDato) => set((state) => ({ dataContexto: {...state.dataContexto, esTecnico: newDato} })),
    updateTemporal: (newDato) => set((state) => ({ dataContexto: {...state.dataContexto, esTemporal: newDato} })),
    clearState: () => set({dataContexto: {esTecnico: false, esTemporal: false}})
}));