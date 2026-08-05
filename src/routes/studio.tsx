import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ApiError,
  apiCreateNote,
  apiDeleteNote,
  apiListNotes,
  apiLogin,
  apiLogout,
  apiMe,
  apiUpdateNote,
  clearLogs,
  getDemoCredentials,
  getLogs,
  resetMockApi,
  type ApiLog,
  type ApiNote,
  type ApiUser,
} from "@/lib/mock-api";
import {
  loadQuestDone,
  saveQuestDone,
  resetQuests,
  QUEST_DEFS,
  type QuestId,
} from "@/lib/studio-quests";
import {
  Server,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  Terminal,
  Check,
  Flag,
  Download,
} from "lucide-react";

const TOKEN_KEY = "learning-react-studio-token";

export const Route = createFileRoute("/studio")({
  component: StudioRoute,
});

function StudioRoute() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 5_000, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <StudioPage />
    </QueryClientProvider>
  );
}

function StudioPage() {
  const qc = useQueryClient();
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  );
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const demo = getDemoCredentials();
  const [email, setEmail] = useState(demo.email);
  const [password, setPassword] = useState(demo.password);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [questDone, setQuestDone] = useState<QuestId[]>(() =>
    typeof window !== "undefined" ? loadQuestDone() : [],
  );

  const markQuest = useCallback((id: QuestId) => {
    setQuestDone((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveQuestDone(next);
      return next;
    });
  }, []);

  const questProgress = useMemo(() => {
    const done = questDone.length;
    const total = QUEST_DEFS.length;
    return { done, total, pct: Math.round((done / total) * 100) };
  }, [questDone]);

  const allQuestsDone = questProgress.done === questProgress.total;
  const refreshLogs = useCallback(() => setLogs(getLogs()), []);

  const meQuery = useQuery({
    queryKey: ["studio", "me", token],
    enabled: !!token,
    queryFn: async () => {
      try {
        const user = await apiMe(token);
        refreshLogs();
        return user as ApiUser;
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        refreshLogs();
        throw e;
      }
    },
  });

  const notesQuery = useQuery({
    queryKey: ["studio", "notes", token],
    enabled: !!token && !!meQuery.data,
    queryFn: async () => {
      const list = await apiListNotes(token);
      refreshLogs();
      return list as ApiNote[];
    },
  });

  const loginMut = useMutation({
    mutationFn: async () => apiLogin(email, password),
    onSuccess: (res) => {
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setError(null);
      markQuest("login");
      refreshLogs();
      void qc.invalidateQueries({ queryKey: ["studio"] });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) markQuest("fail401");
      setError(err instanceof Error ? err.message : "登录失败");
      refreshLogs();
    },
  });

  const logoutMut = useMutation({
    mutationFn: async () => apiLogout(token),
    onSettled: () => {
      markQuest("logout");
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setError(null);
      refreshLogs();
      qc.removeQueries({ queryKey: ["studio"] });
    },
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return apiUpdateNote(token, editingId, { title, body });
      }
      return apiCreateNote(token, { title, body });
    },
    onSuccess: (_data, _v, _c) => {
      if (editingId) markQuest("edit");
      else markQuest("create");
      setTitle("");
      setBody("");
      setEditingId(null);
      setError(null);
      refreshLogs();
      void qc.invalidateQueries({ queryKey: ["studio", "notes"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "保存失败");
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
      refreshLogs();
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => apiDeleteNote(token, id),
    onSuccess: (_d, id) => {
      markQuest("delete");
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setBody("");
      }
      refreshLogs();
      void qc.invalidateQueries({ queryKey: ["studio", "notes"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "删除失败");
      refreshLogs();
    },
  });

  const user = meQuery.data ?? null;
  const notes = notesQuery.data ?? [];
  const booting = !!token && meQuery.isLoading;
  const busy =
    loginMut.isPending ||
    logoutMut.isPending ||
    saveMut.isPending ||
    deleteMut.isPending;

  function startEdit(n: ApiNote) {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
  }

  function exportNotes() {
    const payload = {
      exportedAt: new Date().toISOString(),
      user,
      notes,
      via: "tanstack-query-studio",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${user?.email ?? "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Server className="h-3.5 w-3.5" />
          v5 · Query 工坊
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          全栈工坊 · TanStack Query
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          本页用 <code className="rounded bg-surface-3 px-1 font-mono text-xs">useQuery</code> /{" "}
          <code className="rounded bg-surface-3 px-1 font-mono text-xs">useMutation</code>{" "}
          接模拟 API。账号{" "}
          <code className="rounded-sm bg-surface-3 px-1 font-mono text-xs">
            demo@react.dev
          </code>{" "}
          /{" "}
          <code className="rounded-sm bg-surface-3 px-1 font-mono text-xs">
            password123
          </code>
        </p>
        <p className="mt-2 text-xs text-subtle">
          课程：
          <Link
            to="/lesson/$slug"
            params={{ slug: "tanstack-query" }}
            className="mx-1 text-primary no-underline hover:underline"
          >
            Query
          </Link>
          ·
          <Link
            to="/lesson/$slug"
            params={{ slug: "mutations" }}
            className="mx-1 text-primary no-underline hover:underline"
          >
            Mutation
          </Link>
          ·
          <Link
            to="/lesson/$slug"
            params={{ slug: "studio-query" }}
            className="mx-1 text-primary no-underline hover:underline"
          >
            工坊对照
          </Link>
        </p>
      </header>

      {allQuestsDone ? (
        <div className="mb-4 rounded-xl border border-primary/35 bg-primary-soft px-4 py-3 text-sm text-primary">
          闯关完成。对照右侧：invalidate 后 notes 查询会自动重拉。
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted">
        me: {meQuery.fetchStatus}/{meQuery.status}
        {" · "}
        notes: {notesQuery.fetchStatus}/{notesQuery.status}
        {notesQuery.isFetching ? " · isFetching" : ""}
        {saveMut.isPending ? " · mut pending" : ""}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-4">
          {booting ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
              useQuery 恢复会话…
            </div>
          ) : !user ? (
            <section className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
              <h2 className="font-display text-lg font-semibold text-fg">
                登录 · useMutation
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loginMut.mutate();
                }}
                className="mt-4 max-w-sm space-y-3"
              >
                <label className="block">
                  <span className="text-xs text-muted">email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
                    autoComplete="username"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted">password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
                    autoComplete="current-password"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={busy}>
                    {loginMut.isPending ? "请求中…" : "登录"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => {
                      setEmail(demo.email);
                      setPassword("wrong-password");
                    }}
                  >
                    填错密码（练 401）
                  </Button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-fg">{user.name}</p>
                  <p className="font-mono text-xs text-muted">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      void qc.invalidateQueries({
                        queryKey: ["studio", "notes"],
                      })
                    }
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    invalidate
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={notes.length === 0}
                    onClick={exportNotes}
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => logoutMut.mutate()}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    退出
                  </Button>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                <h2 className="font-display text-base font-semibold text-fg">
                  {editingId ? "编辑 · mutation + invalidate" : "新建 · mutation"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveMut.mutate();
                  }}
                  className="mt-3 space-y-3"
                >
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="标题"
                    className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="正文"
                    rows={3}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={busy}>
                      <Plus className="h-3.5 w-3.5" />
                      {editingId ? "保存修改" : "创建"}
                    </Button>
                    {editingId ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(null);
                          setTitle("");
                          setBody("");
                        }}
                      >
                        取消
                      </Button>
                    ) : null}
                  </div>
                </form>
              </section>

              <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-base font-semibold text-fg">
                    useQuery [studio, notes]
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {notes.length} 条
                    {notesQuery.isFetching ? " · fetching" : ""}
                  </span>
                </div>
                {notesQuery.isPending ? (
                  <p className="text-sm text-muted">isPending…</p>
                ) : notes.length === 0 ? (
                  <p className="text-sm text-muted">暂无笔记</p>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((n) => (
                      <li
                        key={n.id}
                        className="rounded-lg border border-border bg-surface-2 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-fg">{n.title}</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                              {n.body || "（无正文）"}
                            </p>
                            <p className="mt-2 font-mono text-[10px] text-subtle">
                              {n.id} ·{" "}
                              {new Date(n.updatedAt).toLocaleString("zh-CN")}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              className="rounded-md p-2 text-muted hover:bg-bg hover:text-fg"
                              onClick={() => startEdit(n)}
                              aria-label="编辑"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-md p-2 text-muted hover:bg-danger/15 hover:text-danger"
                              onClick={() => deleteMut.mutate(n.id)}
                              aria-label="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-fg">
                <Flag className="h-3.5 w-3.5 text-primary" />
                闯关
              </p>
              <span className="font-mono text-[10px] text-muted">
                {questProgress.done}/{questProgress.total}
              </span>
            </div>
            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${questProgress.pct}%` }}
              />
            </div>
            <ul className="space-y-1.5">
              {QUEST_DEFS.map((q) => {
                const done = questDone.includes(q.id);
                return (
                  <li
                    key={q.id}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs",
                      done ? "bg-primary-soft text-primary" : "bg-bg text-muted",
                    )}
                  >
                    <span className="flex items-start gap-1.5">
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          done ? "bg-primary text-primary-fg" : "bg-surface-3",
                        )}
                      >
                        {done ? <Check className="h-2.5 w-2.5" /> : null}
                      </span>
                      <span>
                        <span className="block font-medium">{q.title}</span>
                        <span className="text-[10px] opacity-80">{q.hint}</span>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-2 text-[11px] text-subtle hover:text-muted"
              onClick={() => {
                resetQuests();
                setQuestDone([]);
              }}
            >
              重置闯关
            </button>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-fg">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                请求日志
              </p>
              <button
                type="button"
                className="text-[11px] text-muted hover:text-fg"
                onClick={() => {
                  clearLogs();
                  refreshLogs();
                }}
              >
                清空
              </button>
            </div>
            {logs.length === 0 ? (
              <p className="text-xs text-muted">操作后显示 method / path</p>
            ) : (
              <ul className="max-h-[18rem] space-y-1.5 overflow-y-auto scrollbar-thin">
                {logs.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-md bg-bg px-2 py-1.5 font-mono text-[10px]"
                  >
                    <span
                      className={cn(
                        "mr-1.5 font-semibold",
                        l.status >= 400 ? "text-danger" : "text-primary",
                      )}
                    >
                      {l.status}
                    </span>
                    <span className="text-muted">{l.method}</span>{" "}
                    <span className="text-fg">{l.path}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
            <p className="font-medium text-fg">Query 对照</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>登录成功 → set token → me/notes queries enable</li>
              <li>写操作 success → invalidate notes</li>
              <li>顶部状态条显示 fetchStatus</li>
            </ul>
            <Button
              size="sm"
              variant="ghost"
              className="mt-3"
              onClick={() => {
                resetMockApi();
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setError(null);
                qc.clear();
                refreshLogs();
              }}
            >
              重置模拟库
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
