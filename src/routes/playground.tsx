import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SFC_PRESETS, getPreset } from "@/data/sfc-presets";
import { VueSfcPlayground } from "@/components/VueSfcPlayground";
import { Code2, Sparkles } from "lucide-react";
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
          基于官方{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-primary">
            @vue/repl
          </code>{" "}
          ，在浏览器里编译并运行真正的{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs">
            .vue
          </code>{" "}
          单文件组件。改代码，右侧即时预览。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {SFC_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-fg">{preset.title}</span>
        <span className="text-muted">· {preset.summary}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          实时编译
        </span>
      </div>

      <VueSfcPlayground key={preset.id} preset={preset} />

      <aside className="mt-5 rounded-xl border border-border bg-surface-2 px-4 py-4 text-sm text-muted">
        <p className="font-medium text-fg">怎么玩</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            左侧改{" "}
            <code className="font-mono text-xs text-primary">App.vue</code>
            （多文件示例还有{" "}
            <code className="font-mono text-xs">CounterCard.vue</code>）
          </li>
          <li>右侧 Preview 是真实 Vue 3 runtime 渲染结果</li>
          <li>可切换 JS / CSS 编译产物面板，理解 SFC 编译输出</li>
          <li>建议结合课程：ref、computed、组件 props/emit 对照修改</li>
        </ul>
      </aside>
    </div>
  );
}
