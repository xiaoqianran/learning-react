import { useEffect, useState, memo, useMemo } from "react";
import type { DemoKind } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Check, RotateCcw } from "lucide-react";

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            交互 Demo
          </p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-fg">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 font-mono text-[10px] text-primary">
          live
        </span>
      </div>
      <div className="p-4 sm:p-5">
        {hint ? <p className="mb-4 text-sm text-muted">{hint}</p> : null}
        <DemoBody kind={kind} />
      </div>
    </section>
  );
}

function DemoBody({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "counter":
      return <CounterDemo />;
    case "jsx":
      return <JsxDemo />;
    case "props":
      return <PropsDemo />;
    case "state":
      return <StateDemo />;
    case "effect":
      return <EffectDemo />;
    case "list":
      return <ListDemo />;
    case "form":
      return <FormDemo />;
    case "context":
      return <ContextDemo />;
    case "memo":
      return <MemoDemo />;
    case "async":
      return <AsyncDemo />;
    case "router":
      return <RouterDemo />;
    case "zustand":
      return <ZustandDemo />;
    case "guard":
      return <GuardDemo />;
    case "validate":
      return <ValidateDemo />;
    case "challenge":
      return <ChallengeDemo />;
    case "reducer":
      return <ReducerDemo />;
    case "ref":
      return <RefDemo />;
    case "portal":
      return <PortalDemo />;
    default:
      return null;
  }
}

function Panel({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-2 p-3 sm:p-4",
        className,
      )}
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-subtle">
        {label}
      </p>
      {children}
    </div>
  );
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="组件输出">
        <p className="font-mono text-sm">
          点了 <span className="text-primary">{count}</span> 次
        </p>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => setCount((c) => c + 1)}>setCount(n+1)</Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            重置
          </Button>
        </div>
      </Panel>
      <Panel label="useState">
        <pre className="font-mono text-xs text-code-fg">
          {`const [count, setCount] = useState(${count})`}
        </pre>
      </Panel>
    </div>
  );
}

function JsxDemo() {
  const [msg, setMsg] = useState("Hello React");
  const [on, setOn] = useState(true);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="数据">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
        />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => setOn(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          show = {String(on)}
        </label>
      </Panel>
      <Panel label="JSX 结果">
        <p className="text-sm">
          {"{msg} → "}
          <span className="text-primary">{msg}</span>
        </p>
        {on ? (
          <p className="mt-2 rounded-md bg-primary-soft px-2 py-1 text-sm text-primary">
            {"{on && <p>…</p>}"}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">条件为 false，未渲染</p>
        )}
      </Panel>
    </div>
  );
}

function PropsDemo() {
  const [title, setTitle] = useState("卡片标题");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="父组件">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
        />
        <p className="mt-2 font-mono text-xs text-muted">
          {`<Card title="${title}" />`}
        </p>
      </Panel>
      <Panel label="子组件收到 props">
        <div className="rounded-md border border-border bg-bg p-3">
          <p className="text-xs text-muted">props.title</p>
          <p className="mt-1 font-medium text-primary">{title}</p>
        </div>
      </Panel>
    </div>
  );
}

function StateDemo() {
  const [user, setUser] = useState({ name: "Ada", score: 1 });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="不可变更新">
        <Button
          size="sm"
          onClick={() => setUser((u) => ({ ...u, score: u.score + 1 }))}
        >
          {"setUser({ ...u, score: u.score + 1 })"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="mt-2"
          onClick={() => setUser((u) => ({ ...u, name: u.name + "!" }))}
        >
          改 name
        </Button>
      </Panel>
      <Panel label="当前 state">
        <pre className="font-mono text-xs text-primary">
          {JSON.stringify(user, null, 2)}
        </pre>
      </Panel>
    </div>
  );
}

function EffectDemo() {
  const [mounted, setMounted] = useState(true);
  const [ticks, setTicks] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!mounted) return;
    setLog((xs) => [...xs, "effect: 启动 interval"].slice(-6));
    setTicks(0);
    const id = window.setInterval(() => setTicks((t) => t + 1), 1000);
    return () => {
      clearInterval(id);
      setLog((xs) => [...xs, "cleanup: clearInterval"].slice(-6));
    };
  }, [mounted]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="组件">
        {mounted ? (
          <>
            <p className="font-mono text-3xl text-primary tabular-nums">{ticks}s</p>
            <Button className="mt-3" variant="secondary" onClick={() => setMounted(false)}>
              卸载
            </Button>
          </>
        ) : (
          <Button onClick={() => setMounted(true)}>重新挂载</Button>
        )}
      </Panel>
      <Panel label="日志">
        <ul className="space-y-1 font-mono text-xs text-muted">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function ListDemo() {
  const [items, setItems] = useState([
    { id: 1, text: "学 useState" },
    { id: 2, text: "学 key" },
  ]);
  const [draft, setDraft] = useState("");
  const [nextId, setNextId] = useState(3);

  function add() {
    const t = draft.trim();
    if (!t) return;
    setItems((xs) => [...xs, { id: nextId, text: t }]);
    setNextId((n) => n + 1);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
          placeholder="新项"
        />
        <Button onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between rounded-md bg-surface-2 px-3 py-2 text-sm"
          >
            <span>
              <span className="mr-2 font-mono text-xs text-subtle">#{it.id}</span>
              {it.text}
            </span>
            <button
              type="button"
              className="text-muted hover:text-danger"
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== it.id))}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormDemo() {
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="受控表单">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          placeholder="名字"
        />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          同意条款
        </label>
      </Panel>
      <Panel label="state 预览">
        <pre className="font-mono text-xs text-primary">
          {JSON.stringify({ name, agree }, null, 2)}
        </pre>
      </Panel>
    </div>
  );
}

function ContextDemo() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <div className="space-y-3">
      <Panel label="Provider 值">
        <div className="flex gap-2">
          <Button size="sm" variant={theme === "dark" ? "default" : "secondary"} onClick={() => setTheme("dark")}>
            dark
          </Button>
          <Button size="sm" variant={theme === "light" ? "default" : "secondary"} onClick={() => setTheme("light")}>
            light
          </Button>
        </div>
      </Panel>
      <div
        className={cn(
          "rounded-lg border p-4 text-sm",
          theme === "dark"
            ? "border-border bg-bg text-fg"
            : "border-border-strong bg-fg text-bg",
        )}
      >
        深层子组件 useContext → theme = <strong>{theme}</strong>
      </div>
    </div>
  );
}

const ExpensiveChild = memo(function ExpensiveChild({
  label,
  onRender,
}: {
  label: string;
  onRender: () => void;
}) {
  onRender();
  return (
    <div className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
      memo 子组件：{label}
    </div>
  );
});

function MemoDemo() {
  const [n, setN] = useState(0);
  const [label, setLabel] = useState("固定 props");
  const [childRenders, setChildRenders] = useState(0);
  const doubled = useMemo(() => n * 2, [n]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="父组件状态">
        <p className="font-mono text-sm">
          n={n} · doubled={doubled}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setN((x) => x + 1)}>
            n++
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setLabel((s) => s + "!")}>
            改 label props
          </Button>
        </div>
      </Panel>
      <Panel label="子渲染次数">
        <p className="text-sm text-muted">
          仅 label 变化时子应增加渲染（memo 浅比较）
        </p>
        <p className="mt-1 font-mono text-primary">{childRenders}</p>
        <div className="mt-2">
          <ExpensiveChild
            label={label}
            onRender={() => setChildRenders((c) => c + 1)}
          />
        </div>
      </Panel>
    </div>
  );
}

function AsyncDemo() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [items, setItems] = useState<string[]>([]);

  function load(mode: "ok" | "error") {
    setStatus("loading");
    setItems([]);
    window.setTimeout(() => {
      if (mode === "error") {
        setStatus("error");
        return;
      }
      setItems(["学 fetch", "处理 loading", "处理 error"]);
      setStatus("ok");
    }, 700);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="触发">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => load("ok")} disabled={status === "loading"}>
            成功
          </Button>
          <Button size="sm" variant="secondary" onClick={() => load("error")} disabled={status === "loading"}>
            失败
          </Button>
        </div>
        <p className="mt-2 font-mono text-xs text-muted">status={status}</p>
      </Panel>
      <Panel label="UI">
        {status === "idle" && <p className="text-sm text-muted">尚未请求</p>}
        {status === "loading" && <p className="text-sm text-primary">loading…</p>}
        {status === "error" && <p className="text-sm text-danger">error: 失败</p>}
        {status === "ok" && (
          <ul className="text-sm">
            {items.map((t) => (
              <li key={t} className="rounded-md bg-bg px-2 py-1 mb-1">
                {t}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function RouterDemo() {
  const pages = [
    { path: "/", title: "Home" },
    { path: "/lesson/intro", title: "Lesson" },
    { path: "/about", title: "About" },
  ] as const;
  const [path, setPath] = useState<(typeof pages)[number]["path"]>("/");
  const cur = pages.find((p) => p.path === path) ?? pages[0];
  return (
    <div className="grid gap-3 sm:grid-cols-[11rem_1fr]">
      <Panel label="Link">
        {pages.map((p) => (
          <button
            key={p.path}
            type="button"
            onClick={() => setPath(p.path)}
            className={cn(
              "mb-1 block w-full rounded-md px-2 py-1.5 text-left text-sm",
              path === p.path ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-3",
            )}
          >
            {p.path}
          </button>
        ))}
      </Panel>
      <Panel label="Outlet">
        <p className="font-mono text-xs text-subtle">path = {path}</p>
        <p className="mt-2 font-medium text-fg">{cur.title}</p>
      </Panel>
    </div>
  );
}

function ZustandDemo() {
  const [items, setItems] = useState<string[]>(["学 Zustand"]);
  const [draft, setDraft] = useState("");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="组件 A · useCart()">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-md border border-border bg-bg px-2 text-sm"
          />
          <Button
            size="sm"
            onClick={() => {
              if (!draft.trim()) return;
              setItems((xs) => [...xs, draft.trim()]);
              setDraft("");
            }}
          >
            add
          </Button>
        </div>
      </Panel>
      <Panel label="组件 B · 同一 store">
        <ul className="text-sm space-y-1">
          {items.map((it, i) => (
            <li key={i} className="rounded-md bg-bg px-2 py-1">
              {it}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-mono text-xs text-primary">count={items.length}</p>
      </Panel>
    </div>
  );
}

function GuardDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState<"home" | "dash" | "login">("home");
  const [msg, setMsg] = useState("在首页");

  function go(target: "home" | "dash" | "login") {
    if (target === "dash" && !token) {
      setPage("login");
      setMsg("未登录 → /login?redirect=/dashboard");
      return;
    }
    setPage(target);
    setMsg(target === "dash" ? "进入受保护页" : target === "login" ? "登录页" : "首页");
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="导航">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => go("home")}>
            /
          </Button>
          <Button size="sm" variant="secondary" onClick={() => go("dash")}>
            /dashboard
          </Button>
          <Button size="sm" onClick={() => setToken("tok")}>
            登录
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setToken(null); setPage("home"); }}>
            退出
          </Button>
        </div>
        <p className="mt-2 font-mono text-xs text-muted">token={token ? "ok" : "null"}</p>
      </Panel>
      <Panel label="视图">
        <p className="font-medium text-fg">page={page}</p>
        <p className="mt-1 text-xs text-muted">{msg}</p>
      </Panel>
    </div>
  );
}

function ValidateDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [ok, setOk] = useState(false);

  function submit() {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "邮箱格式不正确";
    if (password.length < 8) e.password = "密码至少 8 位";
    setErrors(e);
    setOk(Object.keys(e).length === 0);
  }

  return (
    <div className="mx-auto max-w-sm space-y-3">
      <input
        value={email}
        onChange={(e) => { setEmail(e.target.value); setOk(false); }}
        className={cn("h-10 w-full rounded-md border bg-bg px-3 text-sm", errors.email ? "border-danger" : "border-border")}
        placeholder="email"
      />
      {errors.email ? <p className="text-xs text-danger">{errors.email}</p> : null}
      <input
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setOk(false); }}
        className={cn("h-10 w-full rounded-md border bg-bg px-3 text-sm", errors.password ? "border-danger" : "border-border")}
        placeholder="password"
      />
      {errors.password ? <p className="text-xs text-danger">{errors.password}</p> : null}
      <Button onClick={submit}>提交</Button>
      {ok ? <p className="text-sm text-primary">校验通过，可请求 API</p> : null}
    </div>
  );
}

function ChallengeDemo() {
  const [code, setCode] = useState(
    `// 有问题：直接 mutate\nconst [items, setItems] = useState([1])\nfunction add() {\n  items.push(2) // ?\n}`,
  );
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");

  function check() {
    const ok =
      /setItems/.test(code) &&
      (/\.\.\./.test(code) || /concat|filter|map/.test(code)) &&
      !/items\.push/.test(code);
    setStatus(ok ? "pass" : "fail");
  }

  return (
    <Panel label="修状态更新">
      <textarea
        value={code}
        onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
        rows={6}
        className="w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"
      />
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={check}>检查</Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            setCode(
              `const [items, setItems] = useState([1])\nfunction add() {\n  setItems((xs) => [...xs, 2])\n}`,
            )
          }
        >
          参考答案
        </Button>
      </div>
      {status === "pass" ? <p className="mt-2 text-sm text-primary">通过</p> : null}
      {status === "fail" ? (
        <p className="mt-2 text-sm text-warn">用 setItems + 新数组，不要 push 原数组</p>
      ) : null}
    </Panel>
  );
}


function ReducerDemo() {
  type Action = { type: "inc" } | { type: "dec" } | { type: "reset" };
  const [n, setN] = useState(0);
  function reduce(action: Action) {
    if (action.type === "inc") setN((x) => x + 1);
    if (action.type === "dec") setN((x) => x - 1);
    if (action.type === "reset") setN(0);
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel label="state">
        <p className="font-mono text-3xl text-primary tabular-nums">{n}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => reduce({ type: "inc" })}>
            dispatch(inc)
          </Button>
          <Button size="sm" variant="secondary" onClick={() => reduce({ type: "dec" })}>
            dispatch(dec)
          </Button>
          <Button size="sm" variant="ghost" onClick={() => reduce({ type: "reset" })}>
            reset
          </Button>
        </div>
      </Panel>
      <Panel label="心智">
        <p className="text-sm text-muted">
          描述「发生了什么」，由 reducer 算出下一状态。
        </p>
        <pre className="mt-2 font-mono text-xs text-primary">
{`// useReducer(reducer, 0)
dispatch({ type: 'inc' })`}
        </pre>
      </Panel>
    </div>
  );
}

function RefDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-3">
      <Panel label="inputRef.current?.focus()">
        <input
          key={key}
          autoFocus
          className="h-10 w-full max-w-xs rounded-md border border-border bg-bg px-3 text-sm"
          placeholder="点击按钮重新挂载并聚焦"
        />
        <Button className="mt-3" size="sm" onClick={() => setKey((k) => k + 1)}>
          模拟 ref 聚焦
        </Button>
      </Panel>
      <p className="text-xs text-muted">
        useRef 改 .current 不会触发重渲；适合 DOM 与「上次值」。
      </p>
    </div>
  );
}

function PortalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开 Portal 弹层</Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <h4 className="font-display font-semibold">createPortal(…, body)</h4>
            <p className="mt-2 text-sm text-muted">
              逻辑仍在当前组件，DOM 挂在高层。
            </p>
            <Button className="mt-4" size="sm" onClick={() => setOpen(false)}>
              关闭
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
