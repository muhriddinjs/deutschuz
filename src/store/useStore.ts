import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  streak: number;
  totalCorrect: number;
  totalAnswered: number;
  lastActiveDate: string | null;
  incrementStreak: () => void;
  recordAnswer: (isCorrect: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      streak: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      lastActiveDate: null,

      incrementStreak: () => {
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        
        if (lastActiveDate !== today) {
          // If last active date was yesterday, increment streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastActiveDate === yesterday.toDateString()) {
            set({ streak: streak + 1, lastActiveDate: today });
          } else {
            // Otherwise reset to 1
            set({ streak: 1, lastActiveDate: today });
          }
        }
      },

      recordAnswer: (isCorrect: boolean) => set((state) => ({
        totalCorrect: state.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: state.totalAnswered + 1
      }))
    }),
    {
      name: 'deutschuz-storage',
    }
  )
);
