import type { DemoKind } from "@/data/lessons";

export type DemoSource = {
  lang: string;
  title: string;
  code: string;
};

/** 每个交互 Demo 对应的示例源码——讲解区与 live 区共用 */
export const DEMO_SOURCES: Record<DemoKind, DemoSource> = {
  counter: {
    lang: "tsx",
    title: "计数器 · useState",
    code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <>
      <p>点了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>setCount(n+1)</button>
      <button onClick={() => setCount(0)}>重置</button>
    </>
  )
}`,
  },
  jsx: {
    lang: "tsx",
    title: "JSX 条件与表达式",
    code: `function Hello({ msg, on }: { msg: string; on: boolean }) {
  return (
    <>
      <p>{msg}</p>
      {on && <p>条件为 true 才渲染</p>}
    </>
  )
}`,
  },
  props: {
    lang: "tsx",
    title: "组件与 Props",
    code: `type CardProps = { title: string; children?: React.ReactNode }

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

// 父组件
<Card title="卡片标题">正文</Card>`,
  },
  state: {
    lang: "tsx",
    title: "不可变更新",
    code: `const [user, setUser] = useState({ name: 'Ada', score: 1 })

// ✅ 新对象
setUser({ ...user, score: user.score + 1 })
setUser((u) => ({ ...u, name: u.name + '!' }))

// ❌ 不要 mutate
// user.score++`,
  },
  effect: {
    lang: "tsx",
    title: "useEffect 与清理",
    code: `useEffect(() => {
  const id = setInterval(() => setTicks((t) => t + 1), 1000)
  return () => clearInterval(id) // cleanup
}, []) // 挂载跑一次，卸载清理`,
  },
  list: {
    lang: "tsx",
    title: "列表 map + 稳定 key",
    code: `const [items, setItems] = useState([
  { id: 1, text: '学 useState' },
  { id: 2, text: '学 key' },
])

<ul>
  {items.map((it) => (
    <li key={it.id}>
      {it.text}
      <button onClick={() =>
        setItems((xs) => xs.filter((x) => x.id !== it.id))
      }>删</button>
    </li>
  ))}
</ul>`,
  },
  form: {
    lang: "tsx",
    title: "受控表单",
    code: `const [name, setName] = useState('')
const [agree, setAgree] = useState(false)

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<label>
  <input
    type="checkbox"
    checked={agree}
    onChange={(e) => setAgree(e.target.checked)}
  />
  同意条款
</label>`,
  },
  context: {
    lang: "tsx",
    title: "Context Provider / useContext",
    code: `const ThemeCtx = createContext<'dark' | 'light'>('dark')

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <ThemeCtx.Provider value={theme}>
      <Toolbar />
    </ThemeCtx.Provider>
  )
}

function DeepChild() {
  const theme = useContext(ThemeCtx)
  return <p>theme = {theme}</p>
}`,
  },
  memo: {
    lang: "tsx",
    title: "memo / useMemo",
    code: `const Child = memo(function Child({ label }: { label: string }) {
  return <div>{label}</div>
})

function Parent() {
  const [n, setN] = useState(0)
  const [label, setLabel] = useState('固定 props')
  const doubled = useMemo(() => n * 2, [n])
  return (
    <>
      <p>{n} / {doubled}</p>
      <Child label={label} />
    </>
  )
}`,
  },
  async: {
    lang: "tsx",
    title: "请求三态",
    code: `const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
const [items, setItems] = useState<string[]>([])

async function load(ok = true) {
  setStatus('loading')
  try {
    await delay(700)
    if (!ok) throw new Error('fail')
    setItems(['学 fetch', '处理 loading', '处理 error'])
    setStatus('ok')
  } catch {
    setStatus('error')
  }
}

// UI: status === 'loading' | 'error' | 'ok' 分支渲染`,
  },
  router: {
    lang: "tsx",
    title: "声明式路由",
    code: `// 路由表（概念）
const routes = [
  { path: '/', element: <Home /> },
  { path: '/lesson/:slug', element: <Lesson /> },
  { path: '/about', element: <About /> },
]

// 导航 + 出口
<nav>
  <Link to="/">/</Link>
  <Link to="/lesson/intro">/lesson/intro</Link>
</nav>
<Outlet />

// 参数
const { slug } = useParams()`,
  },
  zustand: {
    lang: "ts",
    title: "Zustand store",
    code: `import { create } from 'zustand'

type Cart = {
  items: string[]
  add: (t: string) => void
}

export const useCart = create<Cart>((set) => ({
  items: ['学 Zustand'],
  add: (t) =>
    set((s) => ({ items: t.trim() ? [...s.items, t.trim()] : s.items })),
}))

// 组件 A / B 共用
const items = useCart((s) => s.items)
const add = useCart((s) => s.add)`,
  },
  guard: {
    lang: "tsx",
    title: "路由守卫心智",
    code: `function Protected({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const loc = useLocation()
  if (!token) {
    return <Navigate to={\`/login?redirect=\${loc.pathname}\`} replace />
  }
  return children
}

// <Route path="/dashboard" element={<Protected><Dash /></Protected>} />
// 前端守卫 ≠ 安全：API 仍要验 token`,
  },
  validate: {
    lang: "tsx",
    title: "字段级校验",
    code: `const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

function submit() {
  const e: typeof errors = {}
  if (!/@/.test(email)) e.email = '邮箱格式不对'
  if (password.length < 6) e.password = '至少 6 位'
  setErrors(e)
  if (Object.keys(e).length === 0) { /* 提交 */ }
}`,
  },
  challenge: {
    lang: "tsx",
    title: "综合挑战清单",
    code: `// 毕业作品最小验收
// [ ] 登录 / 退出
// [ ] 列表 CRUD
// [ ] 表单校验
// [ ] loading / error
// [ ] 路由鉴权跳转
// [ ] README 演示账号`,
  },
  reducer: {
    lang: "tsx",
    title: "useReducer",
    code: `type State = { count: number }
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 }
    case 'dec': return { count: state.count - 1 }
    case 'reset': return { count: 0 }
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
// dispatch({ type: 'inc' })`,
  },
  ref: {
    lang: "tsx",
    title: "useRef 与 DOM",
    code: `const inputRef = useRef<HTMLInputElement>(null)

function focus() {
  inputRef.current?.focus()
}

return (
  <>
    <input ref={inputRef} />
    <button onClick={focus}>聚焦</button>
  </>
)
// ref 变化不触发重渲染；也可存可变值`,
  },
  portal: {
    lang: "tsx",
    title: "createPortal",
    code: `import { createPortal } from 'react-dom'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return createPortal(
    <div className="mask" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  )
}`,
  },
  query: {
    lang: "tsx",
    title: "TanStack Query 概念",
    code: `const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['notes'],
  queryFn: () => notesApi.list(),
})

const mut = useMutation({
  mutationFn: (body) => notesApi.create(body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  },
})

// queryKey 决定缓存身份；mutation 后 invalidate 刷新列表`,
  },
};

export function getDemoSource(kind: DemoKind): DemoSource {
  return DEMO_SOURCES[kind];
}
