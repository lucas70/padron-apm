import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ContextoType {
    esTecnico: boolean
    esTemporal: boolean
}

type DatoContextoStore = {
    dataContexto: ContextoType
    updateTecnico: (dato: boolean) => void
    updateTemporal: (dato: boolean) => void
    clearState: () => void
}



export const useDatoContextoStore = create<DatoContextoStore>()(
    persist(
        (set, get) => ({
            dataContexto: { esTecnico: false, esTemporal: false },    // Actions
            updateTecnico: (newDato) => set((state) => ({ dataContexto: { ...state.dataContexto, esTecnico: newDato } })),
            updateTemporal: (newDato) => set((state) => ({ dataContexto: { ...state.dataContexto, esTemporal: newDato } })),
            clearState: () => set({ dataContexto: { esTecnico: false, esTemporal: false } })
        }),
        {
          name: 'dato-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },       
      ),
    );
