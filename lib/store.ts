import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProviderFormData {
  // Step 1: Authentication
  user: {
    id: string | null
    email: string | null
    name: string | null
  } | null
  
  // Step 2: Personal Information
  personalInfo: {
    firstName: string
    lastName: string
    dui: string
    whatsapp: string
    hasFixedJob: boolean | null
  }
  
  // Step 3: Experience and Skills
  experience: {
    areas: string[]
    yearsExperience: number | null
    description: string
  }
  
  // Step 4: Documents
  documents: {
    duiFront: File | null
    duiBack: File | null
    policeRecord: File | null
  }
  
  // UI State
  currentStep: number
  isLoading: boolean
  error: string | null
}

interface ProviderStore extends ProviderFormData {
  // Actions
  setUser: (user: ProviderFormData['user']) => void
  setPersonalInfo: (info: Partial<ProviderFormData['personalInfo']>) => void
  setExperience: (experience: Partial<ProviderFormData['experience']>) => void
  setDocuments: (documents: Partial<ProviderFormData['documents']>) => void
  setCurrentStep: (step: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
  nextStep: () => void
  prevStep: () => void
}

const initialState: ProviderFormData = {
  user: null,
  personalInfo: {
    firstName: '',
    lastName: '',
    dui: '',
    whatsapp: '',
    hasFixedJob: null
  },
  experience: {
    areas: [],
    yearsExperience: null,
    description: ''
  },
  documents: {
    duiFront: null,
    duiBack: null,
    policeRecord: null
  },
  currentStep: 1,
  isLoading: false,
  error: null
}

export const useProviderStore = create<ProviderStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      
      setPersonalInfo: (info) => set((state) => ({
        personalInfo: { ...state.personalInfo, ...info }
      })),
      
      setExperience: (experience) => set((state) => ({
        experience: { ...state.experience, ...experience }
      })),
      
      setDocuments: (documents) => set((state) => ({
        documents: { ...state.documents, ...documents }
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4)
      })),
      
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  loadStepData: async (step: number) => {
    // This will be implemented in each step component
  }
    }),
    {
      name: 'provider-registration',
      partialize: (state) => ({
        user: state.user,
        personalInfo: state.personalInfo,
        experience: state.experience,
        currentStep: state.currentStep
      })
    }
  )
)
