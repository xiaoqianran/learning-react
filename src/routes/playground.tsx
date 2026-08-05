import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InteractiveDemo } from "@/components/demos/InteractiveDemos";
import type { DemoKind } from "@/data/lessons";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

const PRESETS: { id: string; title: string; kind: DemoKind; summary: string }[] =
  [
    { id: "counter", title: "计数器", kind: "counter", summary: "useState 基础" },
    { id: "jsx", title: "JSX", kind: "jsx", summary: "表达式与条件" },
    { id: "state", title: "不可变更新", kind: "state", summary: "对象 state" },
    { id: "list", title: "列表", kind: "list", summary: "key 与增删" },
    { id: "effect", title: "Effect", kind: "effect", summary: "挂载与清理" },
    { id: "form", title: "受控表单", kind: "form", summary: "value + onChange" },
    { id: "async", title: "请求三态", kind: "async", summary: "loading/error" },
    { id: "guard", title: "鉴权门禁", kind: "guard", summary: "redirect 心智" },
  ];

function PlaygroundPage() {
  const [id, setId] = useState("counter");
  const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          沙箱
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          React 交互沙箱
        </h1>
        <p className="mt-2 text-sm text-muted">
          精选 Demo 合集。想写真实组件代码请结合课程示例与本地 Vite 项目；全栈请求请去工坊。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setId(p.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              id === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <p className="mb-3 text-sm text-muted">
        <span className="font-medium text-fg">{preset.title}</span> ·{" "}
        {preset.summary}
      </p>

      <InteractiveDemo
        kind={preset.kind}
        title={preset.title}
        hint={preset.summary}
      />
    </div>
  );
}
