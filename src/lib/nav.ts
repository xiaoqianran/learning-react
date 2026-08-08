import {
  Award,
  BookMarked,
  BookOpen,
  BookX,
  Code2,
  FlaskConical,
  Keyboard,
  LayoutDashboard,
  Library,
  Map as MapIcon,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { LESSONS, TRACKS } from "@/data/lessons";

export const TRACK_META: Record<
  Lesson["track"],
  { order: number; label: string; blurb: string }
> = {
  基础: { order: 1, label: "① 入门", blurb: "JSX · 组件 · 状态 · Effect" },
  进阶: { order: 2, label: "② 进阶", blurb: "Context · memo · 性能" },
  "现代 React": { order: 3, label: "③ 现代 React", blurb: "Suspense · Transition · a11y" },
  数据层: { order: 4, label: "④ 数据层", blurb: "Query · 表单 · 缓存" },
  全栈准备: { order: 5, label: "⑤ 全栈准备", blurb: "路由 · 守卫 · 异步" },
  全栈实训: { order: 6, label: "⑥ 全栈实训", blurb: "REST · 鉴权 · 综合" },
  工程化: { order: 7, label: "⑦ 工程化", blurb: "TS · 测试 · 部署" },
  进阶模式: { order: 8, label: "⑧ 进阶模式", blurb: "Reducer · Portal · 面试" },
};

export function trackLabel(track: string) {
  return (TRACK_META as Record<string, { label: string }>)[track]?.label ?? track;
}

export function orderedTracks(): Lesson["track"][] {
  return [...TRACKS].sort(
    (a, b) =>
      ((TRACK_META as Record<string, { order: number }>)[a]?.order ?? 99) -
      ((TRACK_META as Record<string, { order: number }>)[b]?.order ?? 99),
  );
}

export function getValidCompleted(completed: string[]): string[] {
  const set = new Set(LESSONS.map((l) => l.slug));
  return completed.filter((s) => set.has(s));
}

export function completedCount(completed: string[]): number {
  return getValidCompleted(completed).length;
}

export function progressPercent(completed: string[]): number {
  if (!LESSONS.length) return 0;
  return Math.round((completedCount(completed) / LESSONS.length) * 100);
}

export function isAllComplete(completed: string[]): boolean {
  return LESSONS.every((l) => completed.includes(l.slug));
}

export function getContinueLesson(completed: string[]): Lesson {
  return (
    LESSONS.find((l) => !completed.includes(l.slug)) ??
    LESSONS[LESSONS.length - 1]!
  );
}

export function getContinueHref(completed: string[]): {
  kind: "lesson" | "certificate";
  slug?: string;
} {
  if (isAllComplete(completed)) return { kind: "certificate" };
  return { kind: "lesson", slug: getContinueLesson(completed).slug };
}

export type NavItem = {
  to:
    | "/"
    | "/docs"
    | "/cheatsheet"
    | "/studio"
    | "/playground"
    | "/lab"
    | "/hub"
    | "/mistakes"
    | "/certificate"
    | "/roadmap"
    | "/shortcuts";
  label: string;
  hint?: string;
  icon: LucideIcon;
};

export const NAV_PRIMARY: NavItem[] = [
  { to: "/docs", label: "文档", hint: "查 · react.dev 对照", icon: Library },
  { to: "/studio", label: "工坊", hint: "练 · 全栈闯关", icon: Server },
  { to: "/hub", label: "进度", hint: "我 · 学习中心", icon: LayoutDashboard },
];

export const NAV_TOOLS: NavItem[] = [
  { to: "/cheatsheet", label: "速查表", hint: "Hooks 扫一眼", icon: BookMarked },
  { to: "/playground", label: "Playground", hint: "代码试验", icon: Code2 },
  { to: "/roadmap", label: "路线图", hint: "学习路径图", icon: MapIcon },
  { to: "/lab", label: "练习场", hint: "刷测验题", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", hint: "错题重练", icon: BookX },
  { to: "/shortcuts", label: "快捷键", hint: "键盘操作", icon: Keyboard },
  { to: "/certificate", label: "结业证书", hint: "掌握后解锁", icon: Award },
];

export const NAV_HOME: NavItem = {
  to: "/",
  label: "学 · 首页",
  hint: "路径与大纲",
  icon: BookOpen,
};
