import { create } from 'zustand'

export const useAppStore = create((set) => ({
  currentPhase: 0,
  progressPercentage: 0,
  audienceType: null, // 'under-18', '18-20', '21+'
  theme: 'light',
  language: 'en',
  isAIPanelOpen: false,
  
  setPhase: (phase) => set({ currentPhase: phase }),
  setProgress: (progress) => set({ progressPercentage: progress }),
  setAudienceType: (type) => set({ audienceType: type }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
  setAIPanelOpen: (isOpen) => set({ isAIPanelOpen: isOpen }),
}))
