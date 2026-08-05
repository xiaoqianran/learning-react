import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "核心",
    items: [
      { k: "组件", v: "UI = f(props, state)" },
      { k: "useState", v: "本地状态；不可变更新" },
      { k: "useEffect", v: "同步外部系统；返回 cleanup" },
      { k: "useMemo / useCallback", v: "按需缓存计算与函数引用" },
      { k: "useRef", v: "可变盒子，不触发重渲" },
      { k: "自定义 Hook", v: "useXxx 复用逻辑" },
    ],
  },
  {
    title: "JSX",
    items: [
      { k: "className", v: "代替 class" },
      { k: "{expr}", v: "嵌入表达式" },
      { k: "条件", v: "&& 或 三元" },
      { k: "列表", v: "map + 稳定 key" },
      { k: "事件", v: "onClick={fn} 传函数勿立刻调用" },
    ],
  },
  {
    title: "数据流",
    items: [
      { k: "props ↓", v: "父→子" },
      { k: "回调 ↑", v: "子通知父更新" },
      { k: "Context", v: "跨层主题/会话" },
      { k: "Zustand/Redux", v: "跨页业务状态" },
    ],
  },
  {
    title: "全栈",
    items: [
      { k: "loading/error/data", v: "请求三态" },
      { k: "AbortController", v: "取消请求" },
      { k: "401", v: "清 token → 登录" },
      { k: "REST", v: "GET/POST/PUT/DELETE" },
      { k: "VITE_", v: "Vite 环境变量前缀" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          速查
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          React 速查表
        </h1>
        <p className="mt-2 text-sm text-muted">
          配合{" "}
          <Link to="/studio" className="text-primary no-underline hover:underline">
            全栈工坊
          </Link>{" "}
          与课程食用。
        </p>
      </header>
      <div className="grid gap-4">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li
                  key={it.k}
                  className="grid gap-1 px-4 py-2.5 sm:grid-cols-[10rem_1fr]"
                >
                  <code className="font-mono text-xs text-primary">{it.k}</code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
