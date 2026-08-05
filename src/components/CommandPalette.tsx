import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { BookOpen, Code2, FlaskConical, LayoutDashboard, Server, BookMarked, Award, BookX, Home, Map as MapIcon, } from "lucide-react";

const PAGES = [
  { to: "/", label: "首页", icon: Home },
  { to: "/studio", label: "全栈工坊", icon: Server },
  { to: "/cheatsheet", label: "速查表", icon: BookMarked },
  { to: "/playground", label: "沙箱", icon: Code2 },
  { to: "/roadmap", label: "路线图", icon: MapIcon },
  { to: "/hub", label: "学习中心", icon: LayoutDashboard },
  { to: "/lab", label: "练习场", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", icon: BookX },
  { to: "/certificate", label: "结业", icon: Award },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(to: string) {
    setOpen(false);
    void navigate({ to: to as "/" });
  }

  function goLesson(slug: string) {
    setOpen(false);
    void navigate({ to: "/lesson/$slug", params: { slug } });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="关闭命令面板"
        onClick={() => setOpen(false)}
      />
      <div className="relative mx-auto mt-[12vh] w-[min(36rem,92vw)] overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
        <Command label="命令面板" className="bg-surface text-fg">
          <div className="flex items-center border-b border-border px-3">
            <Command.Input
              placeholder="搜索页面或课程…（Ctrl/⌘ K）"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-subtle"
              autoFocus
            />
          </div>
          <Command.List className="max-h-[min(50vh,22rem)] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
              无匹配
            </Command.Empty>
            <Command.Group
              heading="页面"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle"
            >
              {PAGES.map((p) => {
                const Icon = p.icon;
                return (
                  <Command.Item
                    key={p.to}
                    value={p.label}
                    onSelect={() => go(p.to)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-fg aria-selected:bg-primary-soft aria-selected:text-primary"
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    {p.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
            <Command.Group
              heading="课程"
              className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle"
            >
              {LESSONS.map((l) => (
                <Command.Item
                  key={l.slug}
                  value={`${l.title} ${l.slug} ${l.track}`}
                  onSelect={() => goLesson(l.slug)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-fg aria-selected:bg-primary-soft aria-selected:text-primary"
                >
                  <BookOpen className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="min-w-0 truncate">{l.title}</span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-subtle">
                    {l.track}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t border-border px-3 py-2 text-[10px] text-subtle">
            ↑↓ 选择 · Enter 打开 · Esc 关闭
          </div>
        </Command>
      </div>
    </div>
  );
}
