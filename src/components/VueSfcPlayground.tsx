import { useEffect, useRef, useState } from "react";
import type { SfcPreset } from "@/data/sfc-presets";
import { cn } from "@/lib/utils";

type Props = {
  preset: SfcPreset;
  className?: string;
};

/**
 * Client-only host for the official Vue SFC REPL (@vue/repl).
 * Mounts a real Vue app into a DOM node so learners edit & run .vue files.
 */
export function VueSfcPlayground({ preset, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<{
    setFiles: (files: Record<string, string>, main?: string) => Promise<void>;
    unmount: () => void;
  } | null>(null);

  // Mount once
  useEffect(() => {
    let cancelled = false;
    const el = hostRef.current;
    if (!el) return;

    async function boot() {
      try {
        setStatus("loading");
        const vue = await import("vue");
        const repl = await import("@vue/repl");
        const CodeMirror = (await import("@vue/repl/codemirror-editor")).default;
        // styles (v4 still ships css entry)
        await import("@vue/repl/style.css");

        if (cancelled || !el) return;

        const { createApp, h, ref } = vue;
        const { Repl, useStore, useVueImportMap } = repl;

        const { importMap: builtinImportMap, vueVersion } = useVueImportMap();
        const store = useStore({
          builtinImportMap,
          vueVersion,
          showOutput: ref(true),
          outputMode: ref("preview"),
        });

        await store.setFiles(preset.files, preset.mainFile);
        if (cancelled) return;

        const app = createApp({
          setup() {
            return () =>
              h(Repl, {
                editor: CodeMirror,
                store,
                theme: "dark",
                layout: "horizontal",
                layoutReverse: false,
                showCompileOutput: true,
                showImportMap: false,
                showTsConfig: false,
                clearConsole: false,
                previewOptions: {
                  headHTML: `<style>
                    html,body{margin:0;background:#0b0d0c;color:#e8ebe9;}
                    #app{min-height:100%;}
                  </style>`,
                  placeholderHTML: `<div style="padding:1rem;color:#8b958e;font-family:system-ui">编译预览中…</div>`,
                  showRuntimeError: true,
                  showRuntimeWarning: true,
                },
                editorOptions: {
                  autoSaveText: false,
                },
                splitPaneOptions: {
                  codeTogglerText: "代码",
                  outputTogglerText: "预览",
                },
              });
          },
        });

        app.mount(el);
        apiRef.current = {
          setFiles: (files, main) => store.setFiles(files, main),
          unmount: () => {
            app.unmount();
            el.innerHTML = "";
          },
        };
        if (!cancelled) setStatus("ready");
      } catch (e) {
        console.error("[VueSfcPlayground]", e);
        if (!cancelled) {
          setStatus("error");
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }

    void boot();

    return () => {
      cancelled = true;
      apiRef.current?.unmount();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once; files via separate effect
  }, []);

  // Swap preset files when selection changes
  useEffect(() => {
    const api = apiRef.current;
    if (!api || status !== "ready") return;
    void api.setFiles(preset.files, preset.mainFile).catch((e) => {
      console.error("[VueSfcPlayground] setFiles", e);
    });
  }, [preset, status]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-surface", className)}>
      {status === "loading" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/90 text-sm text-muted">
          正在加载 Vue SFC 编译器…
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-surface p-6 text-center">
          <p className="text-sm text-danger">编辑器加载失败</p>
          <p className="max-w-md font-mono text-xs text-muted">{error}</p>
        </div>
      ) : null}
      <div
        ref={hostRef}
        className="vue-sfc-repl-host h-[min(70vh,640px)] min-h-[420px] w-full"
      />
    </div>
  );
}
