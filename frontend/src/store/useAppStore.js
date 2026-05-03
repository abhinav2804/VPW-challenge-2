import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      currentPhase: 0,
      progressPercentage: 0,
      audienceType: null, // 'under-18', '18-20', '21+'
      theme: 'light',
      language: 'en',
      isAIPanelOpen: false,
      xp: 0,
      level: 1,
      achievements: [],
      
      setPhase: (phase) => set({ currentPhase: phase }),
      setProgress: (progress) => set({ progressPercentage: progress }),
      setAudienceType: (type) => set({ audienceType: type }),
      addXP: (amount, reason) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        const newAchievements = reason 
          ? [{ id: Date.now(), text: `+${amount} XP: ${reason}` }, ...state.achievements].slice(0, 3) 
          : state.achievements;
        return { xp: newXP, level: newLevel, achievements: newAchievements };
      }),
      removeAchievement: (id) => set((state) => ({ 
        achievements: state.achievements.filter(a => a.id !== id) 
      })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
      setAIPanelOpen: (isOpen) => set({ isAIPanelOpen: isOpen }),
    }),
    {
      name: 'voter-quest-storage',
    }
  )
)
