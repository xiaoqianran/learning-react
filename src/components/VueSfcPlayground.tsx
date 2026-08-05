import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { SfcPreset } from "@/data/sfc-presets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileCode2,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

type Props = {
  preset: SfcPreset;
  className?: string;
};

type FileApi = {
  listFiles: () => string[];
  activeFile: () => string;
  setActive: (name: string) => void;
  addFile: (name: string) => void;
  deleteFile: (name: string) => void;
  renameFile: (from: string, to: string) => void;
  setFiles: (files: Record<string, string>, main?: string) => Promise<void>;
  unmount: () => void;
};

function stripSrc(name: string) {
  return name.replace(/^src\//, "");
}

function withSrc(name: string) {
  const n = name.trim().replace(/^src\//, "");
  return `src/${n}`;
}

function isValidFileName(display: string) {
  return /\.(vue|jsx?|tsx?|css|json)$/i.test(display.trim());
}

function normalizePresetFiles(files: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(files).map(([k, v]) => [
      k.startsWith("src/") ? k : `src/${k}`,
      v,
    ]),
  );
}

/**
 * Client-only Vue SFC playground with polished file chrome
 * (no native confirm/prompt). Backed by @vue/repl.
 */
export function VueSfcPlayground({ preset, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<FileApi | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState("src/App.vue");
  const [dialog, setDialog] = useState<
    | null
    | { type: "delete"; file: string }
    | { type: "rename"; file: string }
    | { type: "create" }
  >(null);
  const [nameInput, setNameInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const dialogTitleId = useId();

  const refreshFromApi = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    setFiles(api.listFiles());
    setActive(api.activeFile());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const el = hostRef.current;
    if (!el) return;
    let stopWatch: (() => void) | undefined;

    async function boot() {
      try {
        setStatus("loading");
        const vue = await import("vue");
        const repl = await import("@vue/repl");
        const CodeMirror = (await import("@vue/repl/codemirror-editor")).default;
        await import("@vue/repl/style.css");
        if (cancelled || !el) return;

        const { createApp, h, ref, watch, computed } = vue;
        const { Repl, useStore, useVueImportMap } = repl;

        const { importMap: builtinImportMap, vueVersion } = useVueImportMap();
        const store = useStore({
          builtinImportMap,
          vueVersion,
          showOutput: ref(true),
          outputMode: ref("preview"),
        });

        // Replace stock deleteFile (uses window.confirm) with silent delete.
        store.deleteFile = (filename: string) => {
          if (!(filename in store.files)) return;
          if (store.activeFile?.filename === filename) {
            store.setActive(store.mainFile);
          }
          delete (store.files as Record<string, unknown>)[filename];
        };

        const mainKey = preset.mainFile.startsWith("src/")
          ? preset.mainFile
          : `src/${preset.mainFile}`;
        await store.setFiles(normalizePresetFiles(preset.files), mainKey);
        if (cancelled) return;

        const isNarrow =
          typeof window !== "undefined" && window.innerWidth < 768;

        const app = createApp({
          setup() {
            return () =>
              h(Repl, {
                editor: CodeMirror,
                store,
                theme: "dark",
                layout: isNarrow ? "vertical" : "horizontal",
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
                  showErrorText: "编译错误",
                },
                splitPaneOptions: {
                  codeTogglerText: "代码",
                  outputTogglerText: "预览",
                },
              });
          },
        });

        app.mount(el);

        const listFiles = () =>
          Object.entries(store.files)
            .filter(
              ([name, file]) =>
                !name.endsWith("import-map.json") &&
                !name.endsWith("tsconfig.json") &&
                !(file as { hidden?: boolean }).hidden,
            )
            .map(([name]) => name)
            .sort((a, b) => {
              if (a.endsWith("App.vue")) return -1;
              if (b.endsWith("App.vue")) return 1;
              return a.localeCompare(b);
            });

        apiRef.current = {
          listFiles,
          activeFile: () => store.activeFile?.filename ?? store.mainFile,
          setActive: (name) => store.setActive(name),
          addFile: (name) => store.addFile(name),
          deleteFile: (name) => store.deleteFile(name),
          renameFile: (from, to) => store.renameFile(from, to),
          setFiles: async (next, main) => {
            await store.setFiles(
              normalizePresetFiles(next),
              main
                ? main.startsWith("src/")
                  ? main
                  : `src/${main}`
                : undefined,
            );
          },
          unmount: () => {
            stopWatch?.();
            app.unmount();
            el.innerHTML = "";
          },
        };

        const fileNames = computed(() => listFiles().join("|"));
        const activeName = computed(() => store.activeFile?.filename ?? "");
        stopWatch = watch(
          [fileNames, activeName],
          () => {
            if (!cancelled) {
              setFiles(listFiles());
              setActive(store.activeFile?.filename ?? store.mainFile);
            }
          },
          { immediate: true },
        );

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
      stopWatch?.();
      apiRef.current?.unmount();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  useEffect(() => {
    const api = apiRef.current;
    if (!api || status !== "ready") return;
    void api.setFiles(preset.files, preset.mainFile).then(refreshFromApi);
  }, [preset, status, refreshFromApi]);

  function openCreate() {
    setFormError(null);
    let i = 0;
    let name = "Comp.vue";
    const existing = new Set(files.map(stripSrc));
    while (existing.has(name)) {
      i += 1;
      name = `Comp${i}.vue`;
    }
    setNameInput(name);
    setDialog({ type: "create" });
  }

  function openRename(file: string) {
    setFormError(null);
    setNameInput(stripSrc(file));
    setDialog({ type: "rename", file });
  }

  function openDelete(file: string) {
    setFormError(null);
    setDialog({ type: "delete", file });
  }

  function closeDialog() {
    setDialog(null);
    setFormError(null);
  }

  function submitName(e?: FormEvent) {
    e?.preventDefault();
    const api = apiRef.current;
    if (!api || !dialog) return;
    const display = nameInput.trim();
    if (!display) {
      setFormError("请输入文件名");
      return;
    }
    if (!isValidFileName(display)) {
      setFormError("仅支持 .vue / .js / .ts / .jsx / .tsx / .css / .json");
      return;
    }
    const full = withSrc(display);
    if (dialog.type === "create") {
      if (files.includes(full) || files.map(stripSrc).includes(display)) {
        setFormError("同名文件已存在");
        return;
      }
      api.addFile(full);
      closeDialog();
      refreshFromApi();
      return;
    }
    if (dialog.type === "rename") {
      if (full === dialog.file) {
        closeDialog();
        return;
      }
      if (files.includes(full)) {
        setFormError("目标文件名已存在");
        return;
      }
      api.renameFile(dialog.file, full);
      closeDialog();
      refreshFromApi();
    }
  }

  function confirmDelete() {
    const api = apiRef.current;
    if (!api || dialog?.type !== "delete") return;
    const target = dialog.file;
    if (files.length <= 1) {
      setFormError("至少保留一个文件");
      return;
    }
    if (stripSrc(target) === "App.vue") {
      setFormError("入口 App.vue 不能删除");
      return;
    }
    api.deleteFile(target);
    closeDialog();
    refreshFromApi();
  }

  function onDialogKey(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeDialog();
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 px-2 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-thin">
          {status === "ready" && files.length === 0 ? (
            <span className="px-2 text-xs text-muted">暂无文件</span>
          ) : null}
          {files.map((file) => {
            const label = stripSrc(file);
            const isActive = active === file;
            const isMain = label === "App.vue";
            return (
              <div
                key={file}
                className={cn(
                  "group flex shrink-0 items-center gap-0.5 rounded-md border pl-2.5 pr-1 transition-colors duration-150",
                  isActive
                    ? "border-primary/35 bg-primary-soft text-primary"
                    : "border-transparent bg-transparent text-muted hover:bg-surface-3 hover:text-fg",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    apiRef.current?.setActive(file);
                    setActive(file);
                  }}
                  className="flex max-w-[10rem] items-center gap-1.5 py-1.5 text-left text-xs font-medium"
                  title={label}
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate font-mono">{label}</span>
                  {isMain ? (
                    <span className="rounded-sm bg-surface-3 px-1 py-px text-[9px] font-normal uppercase tracking-wide text-subtle">
                      main
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-sm text-current opacity-0 transition-opacity hover:bg-bg/40 group-hover:opacity-100 group-focus-within:opacity-100",
                    isActive && "opacity-70",
                  )}
                  aria-label={`重命名 ${label}`}
                  onClick={() => openRename(file)}
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-sm text-current opacity-0 transition-opacity hover:bg-danger/15 hover:text-danger group-hover:opacity-100 group-focus-within:opacity-100",
                    isActive && "opacity-70",
                    isMain && "pointer-events-none opacity-20",
                  )}
                  aria-label={`删除 ${label}`}
                  onClick={() => openDelete(file)}
                  disabled={isMain}
                  title={isMain ? "入口文件不可删除" : `删除 ${label}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={openCreate}
          disabled={status !== "ready"}
        >
          <Plus className="h-3.5 w-3.5" />
          新建
        </Button>
      </div>

      <div className="relative">
        {status === "loading" ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-surface/95 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
          className="vue-sfc-repl-host vue-sfc-repl-host--chrome h-[min(68vh,620px)] min-h-[400px] w-full"
        />
      </div>

      {dialog ? (
        <div
          className="absolute inset-0 z-30 flex items-end justify-center bg-bg/70 p-4 backdrop-blur-[2px] sm:items-center"
          role="presentation"
          onClick={closeDialog}
          onKeyDown={onDialogKey}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {dialog.type === "delete" ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-danger/15 text-danger">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3
                      id={dialogTitleId}
                      className="font-display text-base font-semibold text-fg"
                    >
                      删除文件
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      确定删除{" "}
                      <code className="rounded-sm bg-surface-3 px-1 font-mono text-xs text-fg">
                        {stripSrc(dialog.file)}
                      </code>
                      ？此操作不可撤销。
                    </p>
                    {formError ? (
                      <p className="mt-2 text-xs text-danger">{formError}</p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={closeDialog}>
                    取消
                  </Button>
                  <Button
                    type="button"
                    className="bg-danger text-fg hover:bg-danger/90"
                    onClick={confirmDelete}
                  >
                    删除
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={submitName}>
                <div className="flex items-start justify-between gap-2">
                  <h3
                    id={dialogTitleId}
                    className="font-display text-base font-semibold text-fg"
                  >
                    {dialog.type === "create" ? "新建文件" : "重命名"}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-fg"
                    onClick={closeDialog}
                    aria-label="关闭"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted">
                  支持 .vue · .js · .ts · .css · .json
                </p>
                <label className="mt-4 block">
                  <span className="text-xs font-medium text-muted">文件名</span>
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setFormError(null);
                    }}
                    className="mt-1.5 h-10 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg outline-none ring-primary focus:ring-2"
                    placeholder="Comp.vue"
                    spellCheck={false}
                  />
                </label>
                {formError ? (
                  <p className="mt-2 text-xs text-danger">{formError}</p>
                ) : null}
                <div className="mt-5 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={closeDialog}>
                    取消
                  </Button>
                  <Button type="submit">
                    {dialog.type === "create" ? "创建" : "保存"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
