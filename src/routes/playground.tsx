import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SFC_PRESETS, getPreset } from "@/data/sfc-presets";
import { VueSfcPlayground } from "@/components/VueSfcPlayground";
import { Code2, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaygroundSearch = {
  example?: string;
};

export const Route = createFileRoute("/playground")({
  validateSearch: (search: Record<string, unknown>): PlaygroundSearch => ({
    example:
      typeof search.example === "string" && search.example.length > 0
        ? search.example
        : undefined,
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const { example } = Route.useSearch();
  const [activeId, setActiveId] = useState(example ?? "counter");
  const preset = useMemo(() => getPreset(activeId), [activeId]);

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          v3 · 真实 Vue SFC
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          在线编辑器
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          真实编译运行{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-primary">
            .vue
          </code>{" "}
          单文件组件。文件用顶部标签管理——重命名、删除都是应用内弹层，不再弹系统对话框。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {SFC_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium text-fg">{preset.title}</span>
          <span className="text-muted"> · {preset.summary}</span>
        </div>
        <p className="inline-flex items-center gap-1.5 text-[11px] text-subtle">
          <Keyboard className="h-3 w-3" />
          Esc 关闭弹层 · 标签上铅笔/垃圾桶管理文件
        </p>
      </div>

      <VueSfcPlayground key={preset.id} preset={preset} />

      <aside className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "编辑代码",
            d: "左侧是 CodeMirror，改 script / template / style 会即时编译。",
          },
          {
            t: "管理文件",
            d: "顶部标签切换文件；新建、重命名、删除均使用页面内确认，无浏览器原生弹窗。",
          },
          {
            t: "预览结果",
            d: "右侧 iframe 跑真实 Vue 3 runtime。可看 JS/CSS 编译产物。",
          },
        ].map((item) => (
          <div
            key={item.t}
            className="rounded-lg border border-border bg-surface-2 px-3.5 py-3"
          >
            <p className="text-sm font-medium text-fg">{item.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.d}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
