export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "counter"
  | "jsx"
  | "props"
  | "state"
  | "effect"
  | "list"
  | "form"
  | "context"
  | "memo"
  | "async"
  | "router"
  | "zustand"
  | "guard"
  | "validate"
  | "challenge"
  | "reducer"
  | "ref"
  | "portal"
  | "query";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track:
    "基础" | "进阶" | "全栈准备" | "全栈实训" | "工程化" | "进阶模式" | "现代 React" | "数据层";
  minutes: number;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "React 是什么",
    summary: "组件化 UI 库、声明式渲染与生态定位。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "一句话",
        body: "React 用组件描述界面，用状态驱动更新。你写「UI 是状态的函数」，库负责高效更新 DOM。",
      },
      {
        type: "code",
        title: "最小组件",
        lang: "tsx",
        code: `function App() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>点了 {n} 次</button>
}`,
      },
      {
        type: "demo",
        kind: "counter",
        title: "动手：计数器",
        hint: "状态变 → 组件重新渲染。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "React 核心思路？",
            options: ["手写 DOM", "UI = f(state)", "仅 class 组件", "必须 jQuery"],
            answer: 1,
            explain: "声明式：状态决定 UI。",
          },
          {
            id: "i2",
            question: "现代 React 默认？",
            options: ["仅 Class", "函数组件 + Hooks", "仅 Vue SFC", "仅 jQuery"],
            answer: 1,
            explain: "函数组件与 Hooks。",
          },
        ],
      },
    ],
  },
  {
    slug: "jsx",
    title: "JSX 与渲染",
    summary: "表达式、属性、条件渲染与列表。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "JSX 不是 HTML",
        body: "JSX 是语法糖，编译为 React.createElement / jsx()。用 className、htmlFor；花括号嵌入表达式。",
      },
      {
        type: "code",
        title: "条件与列表",
        lang: "tsx",
        code: `{ok && <p>显示</p>}
{items.map((it) => (
  <li key={it.id}>{it.text}</li>
))}`,
      },
      {
        type: "demo",
        kind: "jsx",
        title: "动手：改数据看 JSX",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "j1",
            question: "class 在 JSX 中写？",
            options: ["class", "className", "class-name", "css"],
            answer: 1,
            explain: "DOM 属性是 className。",
          },
          {
            id: "j2",
            question: "列表需要？",
            options: ["可无 key", "稳定 key", "只用 index 永远最好", "禁止 map"],
            answer: 1,
            explain: "稳定 key 帮助协调。",
          },
        ],
      },
    ],
  },
  {
    slug: "components-props",
    title: "组件与 Props",
    summary: "拆分 UI、单向数据流、children。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "Props",
        lang: "tsx",
        code: `type CardProps = { title: string; children?: React.ReactNode }
function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}`,
      },
      {
        type: "text",
        title: "组件与 Props",
        body: "组件是函数，props 是入参。单向数据流：父传子，子通过回调通知父。children 是组合插槽。",
      },
      {
        type: "demo",
        kind: "props",
        title: "动手：传 props",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "Props 方向？",
            options: ["子改父随意", "父→子单向", "全局可变", "仅字符串"],
            answer: 1,
            explain: "单向数据流。",
          },
          {
            id: "p2",
            question: "children？",
            options: ["非法", "嵌套内容插槽", "仅数组", "生命周期"],
            answer: 1,
            explain: "组合模式。",
          },
        ],
      },
    ],
  },
  {
    slug: "state",
    title: "useState 状态",
    summary: "本地状态、不可变更新、批量更新。",
    level: "入门",
    track: "基础",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "不可变",
        body: "不要直接 mutate 对象/数组。用展开或 map/filter 生成新引用，React 才能发现变化。",
      },
      {
        type: "code",
        title: "更新模式",
        lang: "tsx",
        code: `setN(n + 1)
setN((x) => x + 1) // 基于最新值
setUser({ ...user, name: 'Ada' })
setItems((xs) => xs.filter((x) => x.id !== id))`,
      },
      {
        type: "demo",
        kind: "state",
        title: "动手：状态更新",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "s1",
            question: "对象状态正确更新？",
            options: ["obj.x=1", "setObj({...obj,x:1})", "mutate 即可", "只用 props"],
            answer: 1,
            explain: "不可变更新。",
          },
          {
            id: "s2",
            question: "连续 set 依赖上次？",
            options: ["setN(n+1) 两次总对", "函数式 setN(x=>x+1)", "禁止更新", "用 var"],
            answer: 1,
            explain: "函数式更新。",
          },
        ],
      },
    ],
  },
  {
    slug: "effects",
    title: "useEffect 副作用",
    summary: "同步外部系统、依赖数组与清理。",
    level: "入门",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "何时用 Effect",
        body: "订阅、定时器、与非 React 系统同步。派生数据优先用渲染中计算，不必 effect。",
      },
      {
        type: "code",
        title: "清理",
        lang: "tsx",
        code: `useEffect(() => {
  const id = setInterval(() => setT(Date.now()), 1000)
  return () => clearInterval(id)
}, [])`,
      },
      {
        type: "demo",
        kind: "effect",
        title: "动手：挂载与清理",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: "空依赖 []？",
            options: ["每次渲染", "仅挂载/卸载", "从不运行", "仅卸载"],
            answer: 1,
            explain: "挂载跑一次。",
          },
          {
            id: "e2",
            question: "return 函数？",
            options: ["渲染 UI", "清理副作用", "定义 props", "路由"],
            answer: 1,
            explain: "cleanup。",
          },
        ],
      },
    ],
  },
  {
    slug: "lists-keys",
    title: "列表与 Key",
    summary: "map 渲染、key 与重排陷阱。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "列表与 Key",
        body: "map 渲染列表时 key 必须稳定。用 index 当 key 在重排/插入时会导致状态错位。",
      },
      {
        type: "code",
        title: "对应源码 · 列表 map + 稳定 key",
        lang: "tsx",
        code: "const [items, setItems] = useState([\n  { id: 1, text: '学 useState' },\n  { id: 2, text: '学 key' },\n])\n\n<ul>\n  {items.map((it) => (\n    <li key={it.id}>\n      {it.text}\n      <button onClick={() =>\n        setItems((xs) => xs.filter((x) => x.id !== it.id))\n      }>删</button>\n    </li>\n  ))}\n</ul>",
      },
      {
        type: "demo",
        kind: "list",
        title: "动手：增删列表",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "key 优先用？",
            options: ["随机数", "稳定 id", "永远 index", "不要 key"],
            answer: 1,
            explain: "稳定业务 id。",
          },
          {
            id: "l2",
            question: "index 当 key 风险？",
            options: ["无", "重排时状态错位", "更快所以必须", "仅 TypeScript"],
            answer: 1,
            explain: "复用错组件状态。",
          },
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "表单与受控组件",
    summary: "value + onChange 受控模式。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "受控输入",
        lang: "tsx",
        code: `const [name, setName] = useState('')
<input value={name} onChange={(e) => setName(e.target.value)} />`,
      },
      {
        type: "text",
        title: "受控组件",
        body: "value + onChange 让 React 成为唯一数据源。便于校验、禁用提交、即时预览。",
      },
      {
        type: "demo",
        kind: "form",
        title: "动手：受控表单",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "受控组件？",
            options: ["DOM 自己管", "React state 为唯一数据源", "仅 class", "无 onChange"],
            answer: 1,
            explain: "state 驱动 value。",
          },
        ],
      },
    ],
  },
  {
    slug: "hooks-custom",
    title: "自定义 Hooks",
    summary: "复用状态逻辑：useXxx。",
    level: "进阶",
    track: "基础",
    minutes: 11,
    blocks: [
      {
        type: "code",
        title: "useCounter",
        lang: "ts",
        code: `function useCounter(initial = 0) {
  const [n, setN] = useState(initial)
  const inc = () => setN((x) => x + 1)
  return { n, inc }
}`,
      },
      {
        type: "text",
        title: "自定义 Hook",
        body: "useXxx 抽取可复用状态逻辑。Hook 只能在组件或其他 Hook 顶层调用。",
      },
      {
        type: "demo",
        kind: "counter",
        title: "复习：抽成 Hook 的计数器",
      },
      {
        type: "tip",
        body: "Hook 只能在组件或其它 Hook 顶层调用；命名 use 开头。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "h1",
            question: "自定义 Hook 命名？",
            options: ["getXxx", "useXxx", "makeXxx", "XxxService"],
            answer: 1,
            explain: "use 前缀。",
          },
          {
            id: "h2",
            question: "Hook 规则？",
            options: ["可在 if 里随意", "顶层调用", "仅 class", "仅 SSR"],
            answer: 1,
            explain: "Rules of Hooks。",
          },
        ],
      },
    ],
  },
  {
    slug: "context",
    title: "Context 跨层传递",
    summary: "避免 props 钻取；适合主题/会话。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "createContext",
        lang: "tsx",
        code: `const ThemeCtx = createContext<'dark' | 'light'>('dark')
function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <ThemeCtx.Provider value={theme}>
      <Toolbar />
    </ThemeCtx.Provider>
  )
}
function Child() {
  const theme = useContext(ThemeCtx)
  return <span>{theme}</span>
}`,
      },
      {
        type: "text",
        title: "Context",
        body: "跨层传值避免 props 钻透。高频变化的值放 Context 要小心重渲染；可用拆分/memo。",
      },
      {
        type: "demo",
        kind: "context",
        title: "动手：主题 Context",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "Context 适合？",
            options: ["每个按钮本地状态", "主题/当前用户等跨层", "替代全部 state", "仅 CSS"],
            answer: 1,
            explain: "树内共享。",
          },
          {
            id: "c2",
            question: "频繁变的大数据？",
            options: [
              "全塞 Context 最好",
              "拆分或状态库，避免整树重渲",
              "禁止 Context",
              "只用 ref",
            ],
            answer: 1,
            explain: "注意性能。",
          },
        ],
      },
    ],
  },
  {
    slug: "memo",
    title: "memo / useMemo / useCallback",
    summary: "何时优化重渲染。",
    level: "进阶",
    track: "进阶",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "先正确再优化",
        body: "memo 跳过 props 浅比较相同的重渲；useMemo 缓存计算；useCallback 稳定函数引用。不要过早到处包。",
      },
      {
        type: "code",
        title: "对应源码 · memo / useMemo",
        lang: "tsx",
        code: "const Child = memo(function Child({ label }: { label: string }) {\n  return <div>{label}</div>\n})\n\nfunction Parent() {\n  const [n, setN] = useState(0)\n  const [label, setLabel] = useState('固定 props')\n  const doubled = useMemo(() => n * 2, [n])\n  return (\n    <>\n      <p>{n} / {doubled}</p>\n      <Child label={label} />\n    </>\n  )\n}",
      },
      {
        type: "demo",
        kind: "memo",
        title: "动手：感受渲染次数",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "m1",
            question: "React.memo？",
            options: ["服务端缓存", "props 浅相等则跳过重渲", "替代 useState", "路由"],
            answer: 1,
            explain: "纯展示优化。",
          },
          {
            id: "m2",
            question: "useMemo 用于？",
            options: ["必须每个变量", "昂贵计算/稳定引用", "替代 effect", "CSS"],
            answer: 1,
            explain: "按需缓存。",
          },
        ],
      },
    ],
  },
  {
    slug: "router",
    title: "React Router 入门",
    summary: "SPA 路由、Link、动态参数。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "概念",
        lang: "tsx",
        code: `<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/lesson/:slug" element={<Lesson />} />
  </Routes>
</BrowserRouter>`,
      },
      {
        type: "text",
        title: "路由",
        body: "Link / useNavigate 导航，Outlet 渲染子路由，useParams 读动态段。",
      },
      {
        type: "demo",
        kind: "router",
        title: "动手：迷你路由",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "Link 相对 a？",
            options: ["强制刷新", "客户端导航", "不能用", "仅外链"],
            answer: 1,
            explain: "SPA 导航。",
          },
          {
            id: "r2",
            question: "读参数？",
            options: ["useState", "useParams", "useMemo", "localStorage"],
            answer: 1,
            explain: "useParams。",
          },
        ],
      },
    ],
  },
  {
    slug: "zustand",
    title: "Zustand 状态管理",
    summary: "轻量全局 store（本站进度也在用）。",
    level: "进阶",
    track: "进阶",
    minutes: 11,
    blocks: [
      {
        type: "code",
        title: "define store",
        lang: "ts",
        code: `import { create } from 'zustand'
const useCart = create((set) => ({
  items: [] as string[],
  add: (name: string) =>
    set((s) => ({ items: [...s.items, name] })),
}))`,
      },
      {
        type: "text",
        title: "Zustand",
        body: "极简全局 store：create + selector。比 Context 更适合高频更新的客户端状态。",
      },
      {
        type: "demo",
        kind: "zustand",
        title: "动手：共享购物车",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "z1",
            question: "Zustand 特点？",
            options: ["必须 Redux 样板", "轻量 hooks API", "仅 class", "仅 Vue"],
            answer: 1,
            explain: "简洁全局状态。",
          },
          {
            id: "z2",
            question: "何时用全局 store？",
            options: ["每个 input", "跨页共享业务状态", "替代 CSS", "仅动画"],
            answer: 1,
            explain: "跨组件共享。",
          },
        ],
      },
    ],
  },
  {
    slug: "async-data",
    title: "异步数据与请求态",
    summary: "loading / error / empty 与取消。",
    level: "实战",
    track: "全栈准备",
    minutes: 13,
    blocks: [
      {
        type: "code",
        title: "useEffect + fetch",
        lang: "tsx",
        code: `useEffect(() => {
  const c = new AbortController()
  setLoading(true)
  fetch(url, { signal: c.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => { if (e.name !== 'AbortError') setError(e.message) })
    .finally(() => setLoading(false))
  return () => c.abort()
}, [url])`,
      },
      {
        type: "text",
        title: "异步三态",
        body: "idle/loading/ok/error 分支渲染。现代项目更推荐 TanStack Query 管理缓存与重试。",
      },
      {
        type: "demo",
        kind: "async",
        title: "动手：请求三态",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "a1",
            question: "离开页面请求？",
            options: ["忽略", "AbortController", "只锁 UI", "window"],
            answer: 1,
            explain: "取消竞态。",
          },
          {
            id: "a2",
            question: "最少 UI 状态？",
            options: ["仅成功", "loading/error/成功", "仅 spinner", "仅 toast"],
            answer: 1,
            explain: "三态。",
          },
        ],
      },
    ],
  },
  {
    slug: "route-guards",
    title: "路由守卫心智",
    summary: "登录拦截与 redirect（体验层）。",
    level: "实战",
    track: "全栈准备",
    minutes: 11,
    blocks: [
      {
        type: "tip",
        body: "前端守卫可被绕过；API 必须鉴权。工坊里试 401。",
      },
      {
        type: "text",
        title: "路由守卫心智",
        body: "未登录跳转登录并带 redirect。前端 Protected 只是 UX；API 必须鉴权。",
      },
      {
        type: "code",
        title: "对应源码 · 路由守卫心智",
        lang: "tsx",
        code: "function Protected({ children }: { children: React.ReactNode }) {\n  const token = localStorage.getItem('token')\n  const loc = useLocation()\n  if (!token) {\n    return <Navigate to={`/login?redirect=${loc.pathname}`} replace />\n  }\n  return children\n}\n\n// <Route path=\"/dashboard\" element={<Protected><Dash /></Protected>} />\n// 前端守卫 ≠ 安全：API 仍要验 token",
      },
      {
        type: "demo",
        kind: "guard",
        title: "动手：门禁模拟",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "g1",
            question: "前端守卫=安全？",
            options: ["是", "否，服务端必验", "仅 HTTPS", "仅 CORS"],
            answer: 1,
            explain: "可被绕过。",
          },
          {
            id: "g2",
            question: "登录回跳？",
            options: ["写死", "redirect 查询参数", "reload", "仅 back"],
            answer: 1,
            explain: "常见模式。",
          },
        ],
      },
    ],
  },
  {
    slug: "form-validate",
    title: "表单校验",
    summary: "字段错误与提交门禁。",
    level: "实战",
    track: "全栈准备",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "表单校验",
        body: "字段错误映射到具体输入。可用手写或 React Hook Form + Zod。",
      },
      {
        type: "code",
        title: "对应源码 · 字段级校验",
        lang: "tsx",
        code: "const [email, setEmail] = useState('')\nconst [password, setPassword] = useState('')\nconst [errors, setErrors] = useState<{ email?: string; password?: string }>({})\n\nfunction submit() {\n  const e: typeof errors = {}\n  if (!/@/.test(email)) e.email = '邮箱格式不对'\n  if (password.length < 6) e.password = '至少 6 位'\n  setErrors(e)\n  if (Object.keys(e).length === 0) { /* 提交 */ }\n}",
      },
      {
        type: "demo",
        kind: "validate",
        title: "动手：登录校验",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "v1",
            question: "前端校验=安全？",
            options: ["是", "否", "HTTPS 即可", "Zod 即可"],
            answer: 1,
            explain: "后端也要。",
          },
          {
            id: "v2",
            question: "字段错误好处？",
            options: ["酷", "知道哪错", "少代码", "无 label"],
            answer: 1,
            explain: "可修正。",
          },
        ],
      },
    ],
  },
  {
    slug: "rest-api",
    title: "REST 与 CRUD",
    summary: "HTTP 方法、状态码、资源路径。",
    level: "实战",
    track: "全栈实训",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "约定",
        lang: "text",
        code: `GET/POST /api/notes
PUT/DELETE /api/notes/:id
401 未登录 · 201 创建成功`,
      },
      {
        type: "tip",
        body: "打开「全栈工坊」完成闯关，看请求日志。",
      },
      {
        type: "text",
        title: "REST",
        body: "围绕资源设计 URL 与方法；用状态码驱动客户端分支（401 清会话等）。",
      },
      {
        type: "demo",
        kind: "async",
        title: "复习：请求态",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rs1",
            question: "创建资源？",
            options: ["GET", "POST", "DELETE", "HEAD"],
            answer: 1,
            explain: "POST。",
          },
          {
            id: "rs2",
            question: "401？",
            options: ["成功", "未认证", "永久跳转", "缓存"],
            answer: 1,
            explain: "Unauthorized。",
          },
        ],
      },
    ],
  },
  {
    slug: "auth-token",
    title: "Token 登录",
    summary: "Bearer、会话与 401 清理。",
    level: "实战",
    track: "全栈实训",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "Token",
        body: "登录拿 token → 请求头携带 → 401 统一处理。优先 HttpOnly Cookie 方案时注意 CSRF。",
      },
      {
        type: "code",
        title: "对应源码 · 路由守卫心智",
        lang: "tsx",
        code: "function Protected({ children }: { children: React.ReactNode }) {\n  const token = localStorage.getItem('token')\n  const loc = useLocation()\n  if (!token) {\n    return <Navigate to={`/login?redirect=${loc.pathname}`} replace />\n  }\n  return children\n}\n\n// <Route path=\"/dashboard\" element={<Protected><Dash /></Protected>} />\n// 前端守卫 ≠ 安全：API 仍要验 token",
      },
      {
        type: "demo",
        kind: "guard",
        title: "复习：登录门禁",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "at1",
            question: "Bearer 放？",
            options: ["URL", "Authorization 头", "CSS", "不发"],
            answer: 1,
            explain: "请求头。",
          },
          {
            id: "at2",
            question: "HttpOnly Cookie？",
            options: ["更快", "JS 难读，降 XSS 偷 token", "免 HTTPS", "免 CSRF 全自动"],
            answer: 1,
            explain: "更安全存储。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "可演示的 React 全栈小产品。",
    level: "实战",
    track: "全栈实训",
    minutes: 9,
    blocks: [
      {
        type: "code",
        title: "验收",
        lang: "text",
        code: `[ ] 登录退出
[ ] CRUD + 空状态
[ ] loading/error
[ ] 校验
[ ] 部署 + README 演示账号`,
      },
      {
        type: "text",
        title: "毕业作品",
        body: "鉴权 + CRUD + 校验 + 部署 + 演示账号，构成可评审作品最小集。",
      },
      {
        type: "demo",
        kind: "challenge",
        title: "热身：修状态更新",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cap1",
            question: "作品最少？",
            options: ["静态页", "鉴权+CRUD", "仅 CSS", "仅动画"],
            answer: 1,
            explain: "证明全栈协作。",
          },
          {
            id: "cap2",
            question: "演示账号？",
            options: ["不写", "README", "口口", "CSS"],
            answer: 1,
            explain: "方便评审。",
          },
        ],
      },
    ],
  },
  {
    slug: "typescript-react",
    title: "React 与 TypeScript",
    summary: "类型化 props、事件与 hooks。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "Props 类型",
        lang: "tsx",
        code: `type Props = {
  title: string
  onSave: (id: string) => void
  children?: React.ReactNode
}
export function Panel({ title, onSave, children }: Props) {
  return <section>...</section>
}`,
      },
      {
        type: "text",
        title: "React + TS",
        body: "为 props、state、事件对象建模。事件用 React.ChangeEvent<HTMLInputElement> 等。",
      },
      {
        type: "demo",
        kind: "props",
        title: "想象 props 都有类型",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ts1",
            question: "事件类型常用？",
            options: ["any", "React.ChangeEvent<HTMLInputElement>", "string", "EventTarget only"],
            answer: 1,
            explain: "具体 DOM 事件泛型。",
          },
          {
            id: "ts2",
            question: "useState 泛型？",
            options: ["禁止", "useState<User | null>(null)", "仅 class", "仅 Vue"],
            answer: 1,
            explain: "显式状态类型。",
          },
        ],
      },
    ],
  },
  {
    slug: "testing-react",
    title: "测试入门",
    summary: "Vitest + Testing Library 思路。",
    level: "实战",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "测试",
        body: "React Testing Library 主张按用户行为测；E2E 覆盖关键路径。",
      },
      {
        type: "code",
        title: "组件测试骨架",
        lang: "tsx",
        code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

it('increments', async () => {
  render(<Counter />)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByText(/1/)).toBeInTheDocument()
})`,
      },
      {
        type: "tip",
        body: "工坊 6 关 ≈ E2E 用例：login / 401 / CRUD / logout。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "RTL 强调？",
            options: ["测实现细节", "像用户一样测", "仅快照", "仅 CSS"],
            answer: 1,
            explain: "可访问角色与行为。",
          },
          {
            id: "t2",
            question: "E2E 适合？",
            options: ["每个私有函数", "主用户路径", "替代全部单测", "像素对比必须"],
            answer: 1,
            explain: "关键路径。",
          },
        ],
      },
    ],
  },
  {
    slug: "deploy",
    title: "生产部署清单",
    summary: "环境变量、SPA fallback、密钥。",
    level: "实战",
    track: "工程化",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "部署",
        body: "build 产物为静态资源；SPA 需配置 fallback 到 index.html；环境变量勿把密钥打进前端。",
      },
      {
        type: "code",
        title: "检查表",
        lang: "text",
        code: `[ ] VITE_API_BASE
[ ] CORS
[ ] history fallback → index.html
[ ] 密钥不进前端包
[ ] 错误可观测`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "d1",
            question: "刷新 /dashboard 404？",
            options: ["React 坏了", "服务器未 fallback", "必须 hash", "Zustand 问题"],
            answer: 1,
            explain: "SPA 需服务器配合。",
          },
          {
            id: "d2",
            question: "密钥放？",
            options: ["git 明文", "服务端环境变量", "前端常量", "CSS"],
            answer: 1,
            explain: "服务端。",
          },
        ],
      },
    ],
  },
  {
    slug: "use-reducer",
    title: "useReducer",
    summary: "复杂状态迁移：action → next state。",
    level: "进阶",
    track: "进阶模式",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "何时用",
        body: "多字段联动、下一步依赖上一步规则时，useReducer 比多个 useState 更清晰：dispatch(action) 描述「发生了什么」。",
      },
      {
        type: "code",
        title: "计数器",
        lang: "tsx",
        code: `type Action = { type: 'inc' } | { type: 'dec' } | { type: 'set'; n: number }
function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'inc': return state + 1
    case 'dec': return state - 1
    case 'set': return action.n
  }
}
const [n, dispatch] = useReducer(reducer, 0)`,
      },
      { type: "demo", kind: "reducer", title: "动手：dispatch" },
      {
        type: "quiz",
        questions: [
          {
            id: "ur1",
            question: "useReducer 适合？",
            options: ["仅字符串", "规则清晰的复杂状态", "替代 CSS", "禁止 TypeScript"],
            answer: 1,
            explain: "action 驱动状态机式更新。",
          },
          {
            id: "ur2",
            question: "更新方式？",
            options: [
              "直接 mutate state",
              "dispatch(action)",
              "仅 setState 对象",
              "document.write",
            ],
            answer: 1,
            explain: "dispatch。",
          },
        ],
      },
    ],
  },
  {
    slug: "use-ref",
    title: "useRef 与 DOM",
    summary: "可变盒子：DOM 句柄与不触发重渲的值。",
    level: "进阶",
    track: "进阶模式",
    minutes: 11,
    blocks: [
      {
        type: "code",
        title: "聚焦输入",
        lang: "tsx",
        code: `const inputRef = useRef<HTMLInputElement>(null)
function focus() {
  inputRef.current?.focus()
}
return <input ref={inputRef} />`,
      },
      {
        type: "text",
        title: "useRef",
        body: "拿到 DOM 或保存可变值且不触发渲染。聚焦输入、存 timer id 常用。",
      },
      { type: "demo", kind: "ref", title: "动手：ref 聚焦" },
      {
        type: "quiz",
        questions: [
          {
            id: "rf1",
            question: "改 ref.current？",
            options: ["一定重渲", "不触发重渲", "卸载组件", "发请求"],
            answer: 1,
            explain: "可变但不调度渲染。",
          },
          {
            id: "rf2",
            question: "ref 常见用途？",
            options: ["全局 CSS", "DOM/保存上次值", "替代 Router", "仅服务端"],
            answer: 1,
            explain: "DOM 与持久值。",
          },
        ],
      },
    ],
  },
  {
    slug: "portal",
    title: "Portal 传送门",
    summary: "createPortal 把弹层挂到 body。",
    level: "进阶",
    track: "进阶模式",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "Modal",
        lang: "tsx",
        code: `import { createPortal } from 'react-dom'
{open && createPortal(
  <div className="mask"><dialog>…</dialog></div>,
  document.body,
)}`,
      },
      {
        type: "text",
        title: "Portal",
        body: "createPortal 把节点挂到 body，做模态框/浮层，脱离父级层叠上下文限制。",
      },
      { type: "demo", kind: "portal", title: "动手：遮罩弹层" },
      {
        type: "quiz",
        questions: [
          {
            id: "pt1",
            question: "Portal 解决？",
            options: ["鉴权", "DOM 挂载位置与组件树解耦", "替代 useState", "CSS Modules"],
            answer: 1,
            explain: "弹层挂 body。",
          },
          {
            id: "pt2",
            question: "事件冒泡？",
            options: ["不冒泡", "仍按 React 树冒泡", "仅 window", "被禁用"],
            answer: 1,
            explain: "React 事件按组件树。",
          },
        ],
      },
    ],
  },
  {
    slug: "error-boundary",
    title: "错误边界心智",
    summary: "子树渲染错误兜底（class 边界 / 库）。",
    level: "实战",
    track: "进阶模式",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "为什么需要",
        body: "子组件 throw 时，没有边界会导致整页白屏。Error Boundary 捕获渲染期错误并展示降级 UI。事件处理器里的错误要用 try/catch。",
      },
      {
        type: "code",
        title: "概念",
        lang: "tsx",
        code: `// 经典为 class：getDerivedStateFromError / componentDidCatch
// 或使用 react-error-boundary 等库
<ErrorBoundary fallback={<p>出错了</p>}>
  <RiskyWidget />
</ErrorBoundary>`,
      },
      { type: "demo", kind: "async", title: "类比：失败态 UI" },
      {
        type: "quiz",
        questions: [
          {
            id: "eb1",
            question: "Error Boundary 捕获？",
            options: ["所有 Promise", "子树渲染错误", "仅 CSS", "网络层全部"],
            answer: 1,
            explain: "渲染期错误。",
          },
          {
            id: "eb2",
            question: "onClick 里 throw？",
            options: ["边界一定抓住", "需 try/catch 或自己处理", "自动 retry", "忽略"],
            answer: 1,
            explain: "事件不在渲染路径。",
          },
        ],
      },
    ],
  },
  {
    slug: "interview-react",
    title: "面试高频串讲",
    summary: "渲染、Hooks 规则、key、协调一句话答法。",
    level: "实战",
    track: "进阶模式",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "渲染流程",
        body: "state/props 变 → 函数组件再执行 → 产出新 React 元素树 → 协调对比 → 提交 DOM。默认批处理更新。",
      },
      {
        type: "text",
        title: "Hooks 规则",
        body: "只在顶层调用，保证每次渲染顺序一致；自定义 Hook 以 use 开头复用逻辑。",
      },
      {
        type: "text",
        title: "key",
        body: "列表协调用 key 识别身份；稳定业务 id 优于 index。",
      },
      {
        type: "code",
        title: "对应源码 · 不可变更新",
        lang: "tsx",
        code: "const [user, setUser] = useState({ name: 'Ada', score: 1 })\n\n// ✅ 新对象\nsetUser({ ...user, score: user.score + 1 })\nsetUser((u) => ({ ...u, name: u.name + '!' }))\n\n// ❌ 不要 mutate\n// user.score++",
      },
      { type: "demo", kind: "state", title: "口述时配合此 Demo" },
      {
        type: "quiz",
        questions: [
          {
            id: "iv1",
            question: "Hooks 不能？",
            options: ["在顶层", "在条件分支里随意调用", "在自定义 Hook", "在函数组件"],
            answer: 1,
            explain: "保持调用顺序。",
          },
          {
            id: "iv2",
            question: "列表 key？",
            options: ["每次随机", "稳定 id", "永远 index", "不要"],
            answer: 1,
            explain: "稳定身份。",
          },
        ],
      },
    ],
  },
  {
    slug: "suspense",
    title: "Suspense 与懒加载",
    summary: "按需拆包与 loading 边界。",
    level: "进阶",
    track: "现代 React",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "做什么",
        body: "React.lazy + Suspense 在加载代码时显示 fallback。数据 Suspense 需框架或库配合；先掌握「拆代码 + 占位 UI」。",
      },
      {
        type: "code",
        title: "lazy",
        lang: "tsx",
        code: `const Admin = lazy(() => import('./Admin'))
function App() {
  return (
    <Suspense fallback={<p>加载中…</p>}>
      <Admin />
    </Suspense>
  )
}`,
      },
      { type: "demo", kind: "async", title: "类比：loading 边界" },
      {
        type: "quiz",
        questions: [
          {
            id: "su1",
            question: "React.lazy 用于？",
            options: ["CSS", "动态 import 组件代码拆包", "替代 useState", "服务端鉴权"],
            answer: 1,
            explain: "代码分割。",
          },
          {
            id: "su2",
            question: "Suspense fallback？",
            options: ["错误页", "子内容未就绪时的占位", "路由守卫", "Pinia"],
            answer: 1,
            explain: "加载占位。",
          },
        ],
      },
    ],
  },
  {
    slug: "use-transition",
    title: "useTransition 并发更新",
    summary: "把非紧急更新标为可中断。",
    level: "进阶",
    track: "现代 React",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "紧急 vs 过渡",
        body: "输入框应立即响应；过滤大列表可标为 transition，避免卡顿。isPending 可显示「更新中」。",
      },
      {
        type: "code",
        title: "示例",
        lang: "tsx",
        code: `const [isPending, startTransition] = useTransition()
const [q, setQ] = useState('')
const [list, setList] = useState(items)
function onChange(e) {
  const v = e.target.value
  setQ(v) // 紧急
  startTransition(() => {
    setList(filterHuge(v)) // 可延迟
  })
}`,
      },
      { type: "demo", kind: "memo", title: "感受：重渲染与响应" },
      {
        type: "quiz",
        questions: [
          {
            id: "ut1",
            question: "startTransition 适合？",
            options: [
              "密码输入每个字符加密到服务器",
              "非紧急 UI 更新（大列表过滤）",
              "替代 fetch",
              "仅 class",
            ],
            answer: 1,
            explain: "保持输入流畅。",
          },
          {
            id: "ut2",
            question: "isPending？",
            options: ["错误码", "过渡更新进行中", "路由参数", "CSS 变量"],
            answer: 1,
            explain: "pending 标志。",
          },
        ],
      },
    ],
  },
  {
    slug: "a11y-react",
    title: "无障碍基础",
    summary: "语义、键盘、焦点与 ARIA。",
    level: "实战",
    track: "现代 React",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "清单",
        body: "用 button/a 别用 div 冒充；可聚焦控件；图标按钮要 aria-label；对话框管焦点与 Esc；对比度达标。",
      },
      {
        type: "code",
        title: "示例",
        lang: "tsx",
        code: `<button type="button" aria-label="关闭" onClick={onClose}>
  <X aria-hidden />
</button>
<dialog open={open} aria-labelledby="t">
  <h2 id="t">标题</h2>
</dialog>`,
      },
      { type: "demo", kind: "portal", title: "弹层也要可键盘关闭" },
      {
        type: "quiz",
        questions: [
          {
            id: "a11",
            question: "图标按钮？",
            options: [
              "不用文字即可",
              "需要可访问名称（aria-label 等）",
              "禁止 button",
              "仅 title 足够永远",
            ],
            answer: 1,
            explain: "屏幕阅读器要名称。",
          },
          {
            id: "a12",
            question: "交互首选？",
            options: ["div+onClick", "语义化 button/a", "span", "canvas"],
            answer: 1,
            explain: "原生语义。",
          },
        ],
      },
    ],
  },
  {
    slug: "nextjs-map",
    title: "Next.js 全栈地图",
    summary: "App Router、Server Components、Route Handlers。",
    level: "实战",
    track: "现代 React",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "对应工坊",
        body: "工坊的 mock API 在 Next 里常是 app/api/notes/route.ts；页面可用 Server Component 直接 await 数据，交互岛用 'use client'。",
      },
      {
        type: "code",
        title: "结构",
        lang: "text",
        code: `app/
  page.tsx              # Server Component
  notes/page.tsx
  api/notes/route.ts    # GET/POST
  components/NoteForm.tsx  # 'use client'`,
      },
      {
        type: "code",
        title: "Route Handler",
        lang: "ts",
        code: `// app/api/notes/route.ts
export async function GET() {
  const notes = await db.note.findMany()
  return Response.json(notes)
}`,
      },
      { type: "demo", kind: "async", title: "复习：请求态（客户端岛）" },
      {
        type: "quiz",
        questions: [
          {
            id: "nx1",
            question: "默认 Server Component？",
            options: [
              "App Router 页面默认可在服务端",
              "全部必须 use client",
              "仅 Pages Router",
              "禁止 async",
            ],
            answer: 0,
            explain: "App Router 默认服务端。",
          },
          {
            id: "nx2",
            question: "useState 组件？",
            options: ["随便放服务端", "标 'use client'", "只能写 CSS", "禁止"],
            answer: 1,
            explain: "客户端组件。",
          },
        ],
      },
    ],
  },
  {
    slug: "rhf-forms",
    title: "表单库心智（RHF）",
    summary: "非受控性能、校验与提交。",
    level: "实战",
    track: "现代 React",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "为什么",
        body: "大表单全受控会频繁重渲。react-hook-form 用 ref 收集字段，校验可接 Zod，提交时一次拿到 values。",
      },
      {
        type: "code",
        title: "骨架",
        lang: "tsx",
        code: `const { register, handleSubmit, formState: { errors } } = useForm()
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: true })} />
  {errors.email && <span>必填</span>}
</form>`,
      },
      { type: "demo", kind: "validate", title: "校验 UI 仍重要" },
      {
        type: "quiz",
        questions: [
          {
            id: "rh1",
            question: "RHF 优势之一？",
            options: ["必须 class", "减少大表单重渲、统一校验", "替代路由", "仅 Vue"],
            answer: 1,
            explain: "性能与 DX。",
          },
          {
            id: "rh2",
            question: "register？",
            options: ["路由注册", "注册字段到表单", "Service Worker", "CSS"],
            answer: 1,
            explain: "字段注册。",
          },
        ],
      },
    ],
  },
  {
    slug: "tanstack-query",
    title: "TanStack Query 心智",
    summary: "服务端状态：缓存、stale、refetch。",
    level: "实战",
    track: "数据层",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "客户端 state vs 服务端 state",
        body: "表单输入、弹层开关是客户端状态（useState）。列表/用户资料来自 API，适合 Query：queryKey + queryFn，自动缓存与后台刷新。",
      },
      {
        type: "code",
        title: "useQuery",
        lang: "tsx",
        code: `const { data, isPending, isError, error, refetch, isFetching } = useQuery({
  queryKey: ['notes'],
  queryFn: () => fetch('/api/notes').then(r => r.json()),
})`,
      },
      { type: "demo", kind: "query", title: "动手：缓存与刷新" },
      {
        type: "quiz",
        questions: [
          {
            id: "tq1",
            question: "queryKey 作用？",
            options: ["CSS 类名", "标识缓存条目", "路由 path 必须", "仅调试"],
            answer: 1,
            explain: "缓存与失效的钥匙。",
          },
          {
            id: "tq2",
            question: "适合放 Query 的？",
            options: ["input 瞬时值", "API 列表/详情", "仅动画 frame", "window 尺寸永远不用 state"],
            answer: 1,
            explain: "服务端状态。",
          },
        ],
      },
    ],
  },
  {
    slug: "mutations",
    title: "Mutation 与乐观更新",
    summary: "写操作、invalidate、乐观 UI。",
    level: "实战",
    track: "数据层",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "流程",
        body: "useMutation 发 POST/PUT/DELETE；成功后 invalidateQueries 让列表重新拉。乐观更新：先改缓存，失败再回滚。",
      },
      {
        type: "code",
        title: "骨架",
        lang: "tsx",
        code: `const qc = useQueryClient()
const mut = useMutation({
  mutationFn: (body) => api.createNote(body),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
})`,
      },
      { type: "demo", kind: "query", title: "结合工坊理解写路径" },
      {
        type: "tip",
        body: "全栈工坊的创建/编辑/删除就是 mutation；真实项目里用 Query 接管缓存。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mu1",
            question: "invalidateQueries？",
            options: ["删数据库", "标记查询过期并重拉", "清 localStorage", "登出"],
            answer: 1,
            explain: "刷新缓存。",
          },
          {
            id: "mu2",
            question: "乐观更新风险？",
            options: ["无", "失败需回滚，注意一致性", "只能 GET", "禁止 loading"],
            answer: 1,
            explain: "要处理失败回滚。",
          },
        ],
      },
    ],
  },
  {
    slug: "query-keys",
    title: "Query Key 设计",
    summary: "层级 key、过滤参数与失效范围。",
    level: "实战",
    track: "数据层",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "约定",
        lang: "ts",
        code: `['notes'] // 全部
['notes', { status: 'open' }] // 过滤
['notes', id] // 详情
// 失效全部 notes：
invalidateQueries({ queryKey: ['notes'] })`,
      },
      {
        type: "text",
        title: "Query Key",
        body: "queryKey 是缓存身份证。['notes', filters] 结构清晰；mutation 后 invalidate 对应 key。",
      },
      { type: "demo", kind: "async", title: "不同参数 = 不同缓存" },
      {
        type: "quiz",
        questions: [
          {
            id: "qk1",
            question: "详情 key 常见？",
            options: ["['notes'] 仅", "['notes', id]", "随机数", "仅 URL"],
            answer: 1,
            explain: "含 id 区分。",
          },
          {
            id: "qk2",
            question: "过滤列表？",
            options: ["忽略 filter", "key 中带 filter 对象", "禁止过滤", "只用 index"],
            answer: 1,
            explain: "参数进 key。",
          },
        ],
      },
    ],
  },
  {
    slug: "composition-patterns",
    title: "组合模式复盘",
    summary: "children、render props 思维、复合组件。",
    level: "进阶",
    track: "数据层",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "为什么放这里",
        body: "数据层组件常要拆：List + Item + Empty + Error。用组合而不是巨型 if，便于复用与测试。",
      },
      {
        type: "code",
        title: "复合组件",
        lang: "tsx",
        code: `<Notes>
  <Notes.Toolbar />
  <Notes.List />
  <Notes.Empty />
</Notes>`,
      },
      { type: "demo", kind: "props", title: "props/children 组合" },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "组合优于巨型组件？",
            options: ["否", "职责清晰、易测易换", "更慢必须", "仅 class"],
            answer: 1,
            explain: "可维护性。",
          },
          {
            id: "cp2",
            question: "children？",
            options: ["非法", "插槽式组合", "仅字符串", "生命周期"],
            answer: 1,
            explain: "组合点。",
          },
        ],
      },
    ],
  },
  {
    slug: "studio-query",
    title: "工坊 × Query 对照",
    summary: "把 CRUD 映射到 useQuery / useMutation。",
    level: "实战",
    track: "数据层",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "对照表",
        body: "登录 = mutation；会话用户 = useQuery(['me'])；笔记列表 = useQuery(['notes'])；创建/改/删 = mutation + invalidateQueries(['notes'])。打开全栈工坊看顶部 fetchStatus。",
      },
      {
        type: "code",
        title: "关键",
        lang: "tsx",
        code: `const notes = useQuery({
  queryKey: ['studio','notes', token],
  enabled: !!token,
  queryFn: () => apiListNotes(token),
})
const create = useMutation({
  mutationFn: (body) => apiCreateNote(token, body),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['studio','notes'] }),
})`,
      },
      { type: "demo", kind: "query", title: "缓存心智复习" },
      {
        type: "tip",
        body: "工坊已用 QueryClientProvider 包住本页，不影响全站其它路由。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sq1",
            question: "写成功后？",
            options: ["什么都不做", "invalidate 相关 query", "必须整页刷新", "删 QueryClient"],
            answer: 1,
            explain: "让列表重拉。",
          },
          {
            id: "sq2",
            question: "enabled: !!token？",
            options: ["无意义", "无 token 不发 me/notes 请求", "强制 SSR", "仅 CSS"],
            answer: 1,
            explain: "条件查询。",
          },
        ],
      },
    ],
  },
  {
    slug: "deferred-value",
    title: "useDeferredValue",
    summary: "延迟非紧急派生 UI。",
    level: "进阶",
    track: "现代 React",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "与 transition",
        body: "useDeferredValue(value) 让基于 value 的昂贵渲染可延后；输入仍即时。适合搜索框 + 大结果列表。",
      },
      {
        type: "code",
        title: "示例",
        lang: "tsx",
        code: `const [q, setQ] = useState('')
const deferred = useDeferredValue(q)
const results = useMemo(() => filterHuge(deferred), [deferred])`,
      },
      { type: "demo", kind: "memo", title: "昂贵列表与输入" },
      {
        type: "quiz",
        questions: [
          {
            id: "dv1",
            question: "useDeferredValue 适合？",
            options: ["替代服务端鉴权", "延迟昂贵派生渲染", "禁止 state", "仅 class"],
            answer: 1,
            explain: "保持输入流畅。",
          },
          {
            id: "dv2",
            question: "和 startTransition？",
            options: ["完全无关", "都标记非紧急更新", "只能二选一永远", "仅 Vue"],
            answer: 1,
            explain: "并发特性家族。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = [
  "基础",
  "进阶",
  "全栈准备",
  "全栈实训",
  "工程化",
  "进阶模式",
  "现代 React",
  "数据层",
] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({
            ...q,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }
  return out;
}
