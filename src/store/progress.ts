import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AchievementId } from "@/data/achievements";
import { LESSONS } from "@/data/lessons";

export type WrongItem = {
  id: string;
  lessonSlug: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  wrongChoice: number;
  at: number;
};

type ProgressState = {
  visited: string[];
  completed: string[];
  mastered: string[];
  studioDone: string[];
  quizScores: Record<string, number>;
  bookmarks: string[];
  notes: Record<string, string>;
  wrongBook: WrongItem[];
  checkIns: string[];
  streak: number;
  achievements: AchievementId[];
  theme: "dark" | "light";
  markVisited: (slug: string) => void;
  markComplete: (slug: string) => void;
  markMastered: (slug: string) => void;
  markStudio: (id: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  toggleBookmark: (slug: string) => void;
  setNote: (slug: string, text: string) => void;
  addWrong: (item: Omit<WrongItem, "at">) => void;
  clearWrong: (id: string) => void;
  clearAllWrong: () => void;
  checkInToday: () => void;
  unlockAchievement: (id: AchievementId) => void;
  syncAchievements: () => void;
  setTheme: (t: "dark" | "light") => void;
  exportSnapshot: () => object;
  importSnapshot: (data: unknown) => boolean;
  reset: () => void;
};

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeStreak(checkIns: string[]): number {
  if (checkIns.length === 0) return 0;
  const set = new Set(checkIns);
  let streak = 0;
  const cursor = new Date();
  if (!set.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  for (;;) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function deriveAchievements(s: {
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  streak: number;
  achievements: AchievementId[];
}): AchievementId[] {
  const set = new Set(s.achievements);
  const n = s.completed.length;
  if (n >= 1) set.add("first-lesson");
  if (n >= 5) set.add("five-lessons");
  if (n >= Math.ceil(LESSONS.length / 2)) set.add("half-course");
  if (n >= LESSONS.length) set.add("all-course");
  if (s.bookmarks.length >= 3) set.add("bookmark-3");
  if (Object.values(s.notes).filter((t) => t.trim()).length >= 3) {
    set.add("notes-3");
  }
  if (s.streak >= 3) set.add("streak-3");
  return [...set];
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      visited: [],
      completed: [],
      mastered: [],
      studioDone: [],
      quizScores: {},
      bookmarks: [],
      notes: {},
      wrongBook: [],
      checkIns: [],
      streak: 0,
      achievements: [],
      theme: "dark",
      markVisited: (slug) =>
        set((s) => ({
          visited: s.visited.includes(slug) ? s.visited : [...s.visited, slug],
        })),
      markComplete: (slug) => {
        set((s) => {
          const completed = s.completed.includes(slug)
            ? s.completed
            : [...s.completed, slug];
          const visited = s.visited.includes(slug)
            ? s.visited
            : [...s.visited, slug];
          const next = { ...s, completed, visited };
          return {
            visited,
            completed,
            achievements: deriveAchievements(next),
          };
        });
      },
      markMastered: (slug) => {
        set((s) => {
          const completed = s.completed.includes(slug)
            ? s.completed
            : [...s.completed, slug];
          const visited = s.visited.includes(slug)
            ? s.visited
            : [...s.visited, slug];
          const mastered = s.mastered.includes(slug)
            ? s.mastered
            : [...s.mastered, slug];
          const next = { ...s, completed, visited, mastered };
          return {
            visited,
            completed,
            mastered,
            achievements: deriveAchievements(next),
          };
        });
      },
      markStudio: (id) =>
        set((s) => ({
          studioDone: s.studioDone.includes(id)
            ? s.studioDone
            : [...s.studioDone, id],
        })),
      setQuizScore: (slug, score) =>
        set((s) => ({
          quizScores: { ...s.quizScores, [slug]: score },
        })),
      toggleBookmark: (slug) =>
        set((s) => {
          const bookmarks = s.bookmarks.includes(slug)
            ? s.bookmarks.filter((b) => b !== slug)
            : [...s.bookmarks, slug];
          const next = { ...s, bookmarks };
          return {
            bookmarks,
            achievements: deriveAchievements(next),
          };
        }),
      setNote: (slug, text) =>
        set((s) => {
          const notes = { ...s.notes, [slug]: text };
          const next = { ...s, notes };
          return {
            notes,
            achievements: deriveAchievements(next),
          };
        }),
      addWrong: (item) =>
        set((s) => {
          const filtered = s.wrongBook.filter((w) => w.id !== item.id);
          return {
            wrongBook: [{ ...item, at: Date.now() }, ...filtered].slice(0, 80),
          };
        }),
      clearWrong: (id) =>
        set((s) => ({
          wrongBook: s.wrongBook.filter((w) => w.id !== id),
        })),
      clearAllWrong: () => set({ wrongBook: [] }),
      checkInToday: () => {
        const key = todayKey();
        const { checkIns } = get();
        const next = checkIns.includes(key) ? checkIns : [...checkIns, key];
        const streak = computeStreak(next);
        set((s) => {
          const state = { ...s, checkIns: next, streak };
          return {
            checkIns: next,
            streak,
            achievements: deriveAchievements(state),
          };
        });
      },
      unlockAchievement: (id) =>
        set((s) =>
          s.achievements.includes(id)
            ? s
            : { achievements: [...s.achievements, id] },
        ),
      syncAchievements: () =>
        set((s) => ({ achievements: deriveAchievements(s) })),
      setTheme: (theme) => set({ theme }),
      exportSnapshot: () => {
        const s = get();
        return {
          version: 3,
          exportedAt: new Date().toISOString(),
          completed: s.completed,
          quizScores: s.quizScores,
          bookmarks: s.bookmarks,
          notes: s.notes,
          wrongBook: s.wrongBook,
          checkIns: s.checkIns,
          streak: s.streak,
          achievements: s.achievements,
          theme: s.theme,
        };
      },
      importSnapshot: (data) => {
        if (!data || typeof data !== "object") return false;
        const p = data as Partial<ProgressState>;
        if (!Array.isArray(p.completed)) return false;
        set({
          completed: p.completed ?? [],
          quizScores: p.quizScores ?? {},
          bookmarks: p.bookmarks ?? [],
          notes: p.notes ?? {},
          wrongBook: p.wrongBook ?? [],
          checkIns: p.checkIns ?? [],
          streak: typeof p.streak === "number" ? p.streak : 0,
          achievements: p.achievements ?? [],
          theme: p.theme === "light" ? "light" : "dark",
        });
        get().syncAchievements();
        return true;
      },
      reset: () =>
        set({
          visited: [],
          completed: [],
          mastered: [],
          studioDone: [],
          quizScores: {},
          bookmarks: [],
          notes: {},
          wrongBook: [],
          checkIns: [],
          streak: 0,
          achievements: [],
          theme: "dark",
        }),
    }),
    {
      name: "react-learn-progress-v6",
      version: 3,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return {
          visited: p.visited ?? p.completed ?? [],
          completed: p.completed ?? [],
          mastered: p.mastered ?? [],
          studioDone: p.studioDone ?? [],
          quizScores: p.quizScores ?? {},
          bookmarks: p.bookmarks ?? [],
          notes: p.notes ?? {},
          wrongBook: p.wrongBook ?? [],
          checkIns: p.checkIns ?? [],
          streak: p.streak ?? 0,
          achievements: p.achievements ?? [],
          theme: p.theme === "light" ? "light" : "dark",
        };
      },
    },
  ),
);

export { todayKey, computeStreak };


export function isCertificateReady(mastered: string[], completed?: string[]) {
  if (mastered.length > 0 && LESSONS.every((l) => mastered.includes(l.slug))) {
    return true;
  }
  if (completed) return LESSONS.every((l) => completed.includes(l.slug));
  return false;
}
