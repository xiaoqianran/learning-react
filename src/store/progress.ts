import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completed: string[];
  quizScores: Record<string, number>;
  markComplete: (slug: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completed: [],
      quizScores: {},
      markComplete: (slug) =>
        set((s) =>
          s.completed.includes(slug)
            ? s
            : { completed: [...s.completed, slug] },
        ),
      setQuizScore: (slug, score) =>
        set((s) => ({
          quizScores: { ...s.quizScores, [slug]: score },
        })),
      reset: () => set({ completed: [], quizScores: {} }),
    }),
    { name: "vue3-learn-progress" },
  ),
);
