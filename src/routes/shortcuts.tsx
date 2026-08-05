import { createFileRoute } from "@tanstack/react-router";
import { Keyboard } from "lucide-react";

export const Route = createFileRoute("/shortcuts")({
  component: ShortcutsPage,
});

const ROWS: { keys: string; action: string }[] = [
  { keys: "Ctrl / ⌘ + K", action: "打开命令面板，搜索页面与课程" },
  { keys: "Esc", action: "关闭命令面板 / 弹层" },
  { keys: "↑ ↓", action: "命令面板中移动选项" },
  { keys: "Enter", action: "命令面板确认跳转" },
  { keys: "侧栏点击", action: "课程目录与快捷入口" },
  { keys: "顶栏主题按钮", action: "明暗主题切换" },
];

function ShortcutsPage() {
  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Keyboard className="h-3.5 w-3.5" />
          v5 · 快捷键
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          键盘与导航
        </h1>
        <p className="mt-2 text-sm text-muted">
          学 React 也要高效浏览本站。
        </p>
      </header>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {ROWS.map((r) => (
          <li
            key={r.keys}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr] sm:items-center"
          >
            <kbd className="inline-flex w-fit rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-primary">
              {r.keys}
            </kbd>
            <span className="text-sm text-muted">{r.action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
