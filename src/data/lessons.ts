export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "counter"
  | "template"
  | "ref-vs-reactive"
  | "computed"
  | "list"
  | "events"
  | "form"
  | "component"
  | "lifecycle"
  | "todo"
  | "router"
  | "pinia"
  | "challenge"
  | "slots"
  | "provide"
  | "async"
  | "guard"
  | "validate";

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
  track: "基础" | "进阶" | "全栈准备" | "全栈实训" | "工程化";
  minutes: number;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "Vue 3 是什么",
    summary: "认识渐进式框架与组合式 API。",
    level: "入门",
    track: "基础",
    minutes: 6,
    blocks: [
      {
        type: "text",
        title: "一句话",
        body: "Vue：声明式 UI + 响应式数据驱动视图。",
      },
      {
        type: "demo",
        kind: "counter",
        title: "动手：计数器",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "Vue 核心思路？",
            options: ["手写 DOM", "声明式 + 数据驱动", "仅类组件", "必须 jQuery"],
            answer: 1,
            explain: "声明式模板与响应式。",
          },
          {
            id: "i2",
            question: "Vue 3 推荐？",
            options: ["仅 Options", "组合式 API", "仅 Class", "仅 JSX"],
            answer: 1,
            explain: "Composition API。",
          },
        ],
      },
    ],
  },
  {
    slug: "template",
    title: "模板语法",
    summary: "插值、指令与 v-html 安全。",
    level: "入门",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "demo",
        kind: "template",
        title: "动手：模板绑定",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "v-bind 简写？",
            options: [":", "@", "#", "v-"],
            answer: 0,
            explain: ":title",
          },
          {
            id: "t2",
            question: "v-html 风险？",
            options: ["慢", "XSS", "已移除", "仅数字"],
            answer: 1,
            explain: "原始 HTML 注入。",
          },
        ],
      },
    ],
  },
  {
    slug: "reactivity",
    title: "响应式：ref 与 reactive",
    summary: ".value 与解构陷阱。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "demo",
        kind: "ref-vs-reactive",
        title: "动手：ref / reactive",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "脚本读 ref？",
            options: ["count", "count.value", "count()", "count.val"],
            answer: 1,
            explain: ".value",
          },
          {
            id: "r2",
            question: "解构 reactive？",
            options: ["更快", "丢响应式", "变 ref", "报错"],
            answer: 1,
            explain: "用 toRefs。",
          },
        ],
      },
    ],
  },
  {
    slug: "computed",
    title: "计算属性与侦听器",
    summary: "computed 缓存与 watch 副作用。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "demo",
        kind: "computed",
        title: "动手：computed + watch",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "computed 优势？",
            options: ["async", "缓存", "仅 Options", "无返回"],
            answer: 1,
            explain: "依赖缓存。",
          },
          {
            id: "c2",
            question: "watchEffect？",
            options: ["必须指定源", "自动追踪", "只一次", "不能清理"],
            answer: 1,
            explain: "自动依赖。",
          },
        ],
      },
    ],
  },
  {
    slug: "list-render",
    title: "条件与列表渲染",
    summary: "v-if / v-for / key。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "demo",
        kind: "list",
        title: "动手：列表",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "key 作用？",
            options: ["可省略", "复用 DOM", "CSS", "请求"],
            answer: 1,
            explain: "diff 身份。",
          },
          {
            id: "l2",
            question: "频繁显隐？",
            options: ["v-if", "v-show", "v-html", "v-once"],
            answer: 1,
            explain: "v-show。",
          },
        ],
      },
    ],
  },
  {
    slug: "events",
    title: "事件处理",
    summary: "v-on 与修饰符。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "demo",
        kind: "events",
        title: "动手：事件",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: ".prevent？",
            options: ["冒泡", "preventDefault", "一次", "捕获"],
            answer: 1,
            explain: "默认行为。",
          },
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "表单与 v-model",
    summary: "双向绑定。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "demo",
        kind: "form",
        title: "动手：表单",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: ".number？",
            options: ["限长", "转数字", "整数", "禁用"],
            answer: 1,
            explain: "数字转换。",
          },
        ],
      },
    ],
  },
  {
    slug: "components",
    title: "组件基础",
    summary: "SFC 积木。",
    level: "进阶",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "demo",
        kind: "component",
        title: "动手：子组件",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "SFC？",
            options: ["服务", "单文件组件", "函数", "样式"],
            answer: 1,
            explain: ".vue 文件。",
          },
        ],
      },
    ],
  },
  {
    slug: "props-emits",
    title: "Props 与 Emits",
    summary: "单向数据流。",
    level: "进阶",
    track: "基础",
    minutes: 11,
    blocks: [
      {
        type: "demo",
        kind: "todo",
        title: "动手：Todo",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "子改父？",
            options: ["改 props", "emit", "window", "v-html"],
            answer: 1,
            explain: "事件上抛。",
          },
        ],
      },
    ],
  },
  {
    slug: "lifecycle",
    title: "生命周期",
    summary: "挂载与清理。",
    level: "进阶",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "demo",
        kind: "lifecycle",
        title: "动手：生命周期",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "lf1",
            question: "onMounted？",
            options: ["定义 ref", "DOM/请求", "改 props", "CSS"],
            answer: 1,
            explain: "挂载后副作用。",
          },
        ],
      },
    ],
  },
  {
    slug: "composition",
    title: "组合式 API 实践",
    summary: "useXxx composable。",
    level: "实战",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "counter",
        title: "composable 思路",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "co1",
            question: "命名？",
            options: ["get", "useXxx", "make", "Service"],
            answer: 1,
            explain: "use 前缀。",
          },
          {
            id: "co2",
            question: "收益？",
            options: ["无 TS", "逻辑复用", "无构建", "无组件"],
            answer: 1,
            explain: "聚合复用。",
          },
        ],
      },
    ],
  },
  {
    slug: "router",
    title: "Vue Router 路由",
    summary: "SPA 导航。",
    level: "进阶",
    track: "进阶",
    minutes: 14,
    blocks: [
      {
        type: "demo",
        kind: "router",
        title: "动手：路由",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rt1",
            question: "RouterLink？",
            options: ["仅相对", "SPA 无刷新", "强制刷新", "无 params"],
            answer: 1,
            explain: "客户端导航。",
          },
          {
            id: "rt2",
            question: "读参数？",
            options: ["useStore", "useRoute", "useAttrs", "css"],
            answer: 1,
            explain: "useRoute。",
          },
        ],
      },
    ],
  },
  {
    slug: "pinia",
    title: "Pinia 状态管理",
    summary: "跨组件 store。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "pinia",
        title: "动手：Pinia",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pi1",
            question: "Pinia？",
            options: ["必须 mutations", "轻量 TS", "仅 Options", "单 store"],
            answer: 1,
            explain: "官方推荐。",
          },
          {
            id: "pi2",
            question: "改状态？",
            options: ["commit", "直接改/调函数", "dispatch", "仅外"],
            answer: 1,
            explain: "setup store。",
          },
        ],
      },
    ],
  },
  {
    slug: "pitfalls",
    title: "常见坑与性能",
    summary: "响应式与浅层。",
    level: "实战",
    track: "进阶",
    minutes: 11,
    blocks: [
      {
        type: "demo",
        kind: "challenge",
        title: "挑战：修响应式",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pf1",
            question: "shallowRef？",
            options: ["深度", "只替换 .value", "不能对象", "reactive"],
            answer: 1,
            explain: "浅层。",
          },
          {
            id: "pf2",
            question: "computed 请求？",
            options: ["好", "不好", "仅 Vue2", "缓存到 LS"],
            answer: 1,
            explain: "副作用用 watch。",
          },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "从零搭一个小项目",
    summary: "Vite 与环境变量。",
    level: "实战",
    track: "进阶",
    minutes: 13,
    blocks: [
      {
        type: "demo",
        kind: "todo",
        title: "综合 Todo",
      },
      {
        type: "tip",
        body: "v5/v6：全栈工坊闯关 + 工程化课。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pj1",
            question: "Vite 前缀？",
            options: ["REACT_APP_", "VITE_", "NEXT_", "PUBLIC_"],
            answer: 1,
            explain: "VITE_。",
          },
          {
            id: "pj2",
            question: "脚手架？",
            options: ["create vue@latest", "vue create", "CRA", "next"],
            answer: 0,
            explain: "官方 create vue。",
          },
        ],
      },
    ],
  },
  {
    slug: "slots",
    title: "插槽 Slots",
    summary: "默认/具名/作用域。",
    level: "进阶",
    track: "全栈准备",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "slots",
        title: "动手：插槽",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sl1",
            question: "具名简写？",
            options: ["@", "#", ":", "."],
            answer: 1,
            explain: "#header",
          },
          {
            id: "sl2",
            question: "作用域插槽？",
            options: ["穿透", "父用子数据", "替代 props", "SSR"],
            answer: 1,
            explain: "slot props。",
          },
        ],
      },
    ],
  },
  {
    slug: "provide-inject",
    title: "Provide / Inject",
    summary: "跨层注入。",
    level: "进阶",
    track: "全栈准备",
    minutes: 11,
    blocks: [
      {
        type: "demo",
        kind: "provide",
        title: "动手：注入",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pr1",
            question: "vs Pinia？",
            options: ["替代", "树内 vs 全局", "仅字符串", "仅 Options"],
            answer: 1,
            explain: "职责不同。",
          },
          {
            id: "pr2",
            question: "InjectionKey？",
            options: ["快", "类型+唯一", "必须", "体积"],
            answer: 1,
            explain: "TS 安全。",
          },
        ],
      },
    ],
  },
  {
    slug: "async-data",
    title: "异步数据与请求态",
    summary: "loading / error / Abort。",
    level: "实战",
    track: "全栈准备",
    minutes: 14,
    blocks: [
      {
        type: "demo",
        kind: "async",
        title: "动手：三态",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "as1",
            question: "离开页请求？",
            options: ["忽略", "Abort", "锁按钮", "window"],
            answer: 1,
            explain: "取消。",
          },
          {
            id: "as2",
            question: "最少状态？",
            options: ["仅成功", "loading/error/成功", "仅 error", "skeleton"],
            answer: 1,
            explain: "三态。",
          },
        ],
      },
    ],
  },
  {
    slug: "route-guards",
    title: "路由守卫与鉴权心智",
    summary: "beforeEach 与 redirect。",
    level: "实战",
    track: "全栈准备",
    minutes: 13,
    blocks: [
      {
        type: "demo",
        kind: "guard",
        title: "动手：门禁",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "gd1",
            question: "前端守卫=安全？",
            options: ["是", "否", "仅 CSRF", "仅 CORS"],
            answer: 1,
            explain: "服务端必校验。",
          },
          {
            id: "gd2",
            question: "回跳？",
            options: ["写死", "redirect 参数", "reload", "back"],
            answer: 1,
            explain: "query.redirect。",
          },
        ],
      },
    ],
  },
  {
    slug: "form-validate",
    title: "表单校验",
    summary: "字段错误与门禁。",
    level: "实战",
    track: "全栈准备",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "validate",
        title: "动手：校验",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "fv1",
            question: "前端校验=安全？",
            options: ["是", "否", "HTTPS", "Zod"],
            answer: 1,
            explain: "后端也要。",
          },
          {
            id: "fv2",
            question: "字段错误？",
            options: ["酷", "可知哪错", "少代码", "无 label"],
            answer: 1,
            explain: "可修正。",
          },
        ],
      },
    ],
  },
  {
    slug: "rest-api",
    title: "REST API 与 CRUD",
    summary: "资源、方法、状态码。",
    level: "实战",
    track: "全栈实训",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "约定",
        body: "GET 读、POST 建、PUT 改、DELETE 删。200/201 成功，400 参数，401 未登录，404 不存在，500 服务器。",
      },
      {
        type: "code",
        title: "路径",
        lang: "text",
        code: `GET/POST /api/notes
PUT/DELETE /api/notes/:id
Authorization: Bearer <token>`,
      },
      {
        type: "tip",
        body: "去全栈工坊完成闯关，对照右侧请求日志。",
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
            question: "创建用？",
            options: ["GET", "POST", "DELETE", "HEAD"],
            answer: 1,
            explain: "POST。",
          },
          {
            id: "rs2",
            question: "401？",
            options: ["成功", "未认证", "500", "301"],
            answer: 1,
            explain: "Unauthorized。",
          },
        ],
      },
    ],
  },
  {
    slug: "auth-token",
    title: "Token 登录与会话",
    summary: "Bearer 与 401 清会话。",
    level: "实战",
    track: "全栈实训",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "流程",
        body: "login → 存 token → 请求带 Authorization → 401 则清态跳登录。生产更推荐 HttpOnly Cookie。",
      },
      {
        type: "demo",
        kind: "guard",
        title: "复习：门禁",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "at1",
            question: "Bearer 放哪？",
            options: ["URL", "Authorization 头", "CSS", "从不发"],
            answer: 1,
            explain: "请求头。",
          },
          {
            id: "at2",
            question: "HttpOnly？",
            options: ["更快", "JS 难偷 token", "免 HTTPS", "免 CSRF"],
            answer: 1,
            explain: "防 XSS 读 cookie。",
          },
        ],
      },
    ],
  },
  {
    slug: "nuxt-map",
    title: "Nuxt 全栈地图",
    summary: "pages 与 server/api。",
    level: "实战",
    track: "全栈实训",
    minutes: 15,
    blocks: [
      {
        type: "code",
        title: "结构",
        lang: "text",
        code: `pages/
server/api/notes.get.ts
composables/
nuxt.config.ts`,
      },
      {
        type: "code",
        title: "useFetch",
        lang: "ts",
        code: `const { data, pending, error, refresh } = await useFetch('/api/notes')`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "nx1",
            question: "notes.get.ts？",
            options: ["静态", "GET /api/notes", "仅客户端", "Pinia"],
            answer: 1,
            explain: "Nitro 路由。",
          },
          {
            id: "nx2",
            question: "useFetch？",
            options: ["无差", "SSR 友好", "无 TS", "仅 POST"],
            answer: 1,
            explain: "数据获取集成。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "可演示的全栈小产品。",
    level: "实战",
    track: "全栈实训",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "验收",
        lang: "text",
        code: `[ ] 登录退出
[ ] 401 回登录
[ ] CRUD + 空状态
[ ] 校验前后端
[ ] loading/error
[ ] README 演示账号
[ ] 部署链接`,
      },
      {
        type: "demo",
        kind: "todo",
        title: "热身 Todo",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cap1",
            question: "作品最少？",
            options: ["静态", "鉴权+CRUD", "仅 CSS", "仅动画"],
            answer: 1,
            explain: "前后端协作。",
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

  // ——— v6 工程化 ———
  {
    slug: "vue-ts",
    title: "Vue 与 TypeScript",
    summary: "类型化 props、emits、ref 与组件实例。",
    level: "实战",
    track: "工程化",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "为什么要 TS",
        body: "全栈项目接口字段多、重构频繁。TS 在编译期抓住 props 写错、漏处理 null、API 响应形状不对等问题。",
      },
      {
        type: "code",
        title: "script setup + 类型",
        lang: "vue",
        code: `<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  noteId: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  save: [payload: { title: string; body: string }]
  cancel: []
}>()

const title = ref('')
const charCount = computed(() => title.value.length)

function onSave() {
  emit('save', { title: title.value, body: '' })
}
</script>`,
      },
      {
        type: "code",
        title: "API 响应类型",
        lang: "ts",
        code: `type Note = { id: string; title: string; body: string }

async function listNotes(token: string): Promise<Note[]> {
  const res = await fetch('/api/notes', {
    headers: { Authorization: \`Bearer \${token}\` },
  })
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<Note[]>
}`,
      },
      {
        type: "tip",
        body: "工坊的 mock-api 返回形状就是你该在真实项目里定义的 type/interface。",
      },
      {
        type: "demo",
        kind: "form",
        title: "表单数据也要有类型",
        hint: "想象 email/password 是 typed form state。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ts1",
            question: "defineProps 泛型写法？",
            options: [
              "defineProps()",
              "defineProps<{ title: string }>()",
              "props: Object",
              "PropTypes",
            ],
            answer: 1,
            explain: "Vue 3 + TS 推荐泛型 props。",
          },
          {
            id: "ts2",
            question: "API JSON 建议？",
            options: [
              "any 到底",
              "定义 response 类型并校验失败分支",
              "忽略错误",
              "只用 string",
            ],
            answer: 1,
            explain: "类型 + 错误处理。",
          },
        ],
      },
    ],
  },
  {
    slug: "api-client",
    title: "封装 API 客户端",
    summary: "统一 baseURL、token、错误与 composable。",
    level: "实战",
    track: "工程化",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "不要满天飞 fetch",
        body: "每个页面自己写 fetch 会重复处理 token、401、JSON 解析。抽一层 apiClient + 领域函数（listNotes / createNote），组件只关心业务。",
      },
      {
        type: "code",
        title: "轻量 client",
        lang: "ts",
        code: `const BASE = import.meta.env.VITE_API_BASE ?? ''

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const headers = new Headers(opts.headers)
  headers.set('Content-Type', 'application/json')
  if (opts.token) headers.set('Authorization', \`Bearer \${opts.token}\`)

  const res = await fetch(BASE + path, { ...opts, headers })
  if (res.status === 401) throw new ApiError(401, '未登录')
  if (!res.ok) throw new ApiError(res.status, await res.text())
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const notesApi = {
  list: (token: string) => api<Note[]>('/api/notes', { token }),
  create: (token: string, body: unknown) =>
    api<Note>('/api/notes', { method: 'POST', token, body: JSON.stringify(body) }),
}`,
      },
      {
        type: "code",
        title: "composable",
        lang: "ts",
        code: `export function useNotes(token: Ref<string | null>) {
  const data = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    if (!token.value) return
    loading.value = true
    error.value = null
    try {
      data.value = await notesApi.list(token.value)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, refresh }
}`,
      },
      {
        type: "tip",
        body: "本站 mock-api.ts 就是教学版 client。真实项目换成 VITE_API_BASE 指向后端即可。",
      },
      {
        type: "demo",
        kind: "async",
        title: "client 之上仍是三态 UI",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ac1",
            question: "封装 API 客户端主要为了？",
            options: [
              "让代码变长",
              "统一鉴权、错误与路径，减少重复",
              "替代组件",
              "去掉 TypeScript",
            ],
            answer: 1,
            explain: "横切关注点集中。",
          },
          {
            id: "ac2",
            question: "401 在 client 层？",
            options: [
              "忽略",
              "抛出可识别错误，由路由/store 清会话",
              "只 console.log",
              "自动 POST 删除库",
            ],
            answer: 1,
            explain: "统一抛错 + 上层处理跳转。",
          },
        ],
      },
    ],
  },
  {
    slug: "testing-vue",
    title: "测试入门",
    summary: "Vitest 测逻辑，Vue Test Utils 测组件。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "测什么",
        body: "优先测：纯函数校验、composable、关键组件交互。E2E（Playwright）覆盖登录→CRUD 主路径。不要追求 100% 覆盖率装饰。",
      },
      {
        type: "code",
        title: "Vitest 测校验",
        lang: "ts",
        code: `import { describe, it, expect } from 'vitest'
import { validateLogin } from './validate'

describe('validateLogin', () => {
  it('rejects short password', () => {
    const e = validateLogin('a@b.com', '123')
    expect(e.password).toBeTruthy()
  })
  it('accepts ok form', () => {
    expect(validateLogin('a@b.com', 'password123')).toEqual({})
  })
})`,
      },
      {
        type: "code",
        title: "组件冒烟",
        lang: "ts",
        code: `import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

it('increments', async () => {
  const w = mount(Counter)
  await w.get('button').trigger('click')
  expect(w.text()).toContain('1')
})`,
      },
      {
        type: "tip",
        body: "工坊闯关清单 ≈ 手写 E2E 用例：login / 401 / create / edit / delete / logout。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "te1",
            question: "Vue 单测常用？",
            options: ["JUnit only", "Vitest + Vue Test Utils", "仅 Photoshop", "仅 ESLint"],
            answer: 1,
            explain: "社区主流。",
          },
          {
            id: "te2",
            question: "E2E 更适合？",
            options: [
              "每个私有函数",
              "用户主路径（登录到 CRUD）",
              "替代单元测试",
              "测 CSS 像素",
            ],
            answer: 1,
            explain: "关键路径回归。",
          },
        ],
      },
    ],
  },
  {
    slug: "deploy-prod",
    title: "生产部署清单",
    summary: "环境变量、CORS、路由 fallback、监控。",
    level: "实战",
    track: "工程化",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "上线不等于 build 成功",
        body: "还要：API 地址正确、HTTPS、CORS、SPA 刷新 404 回退、密钥不进仓库、错误可观测。",
      },
      {
        type: "code",
        title: "检查表",
        lang: "text",
        code: `[ ] VITE_API_BASE 指向生产 API
[ ] 后端 CORS 允许你的前端源
[ ] history 模式：nginx try_files / 平台 SPA fallback
[ ] 无 token 打进前端包
[ ] 401/500 有用户可读提示
[ ] 基础日志 / 错误上报
[ ] README 含演示账号与架构图`,
      },
      {
        type: "tip",
        body: "本学习站用 GitHub Pages 静态部署；你的全栈作品通常是「前端静态 + API 服务」或 Nuxt 一体部署。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "dp1",
            question: "SPA 直接打开 /dashboard 404？",
            options: [
              "Vue 坏了",
              "服务器未 fallback 到 index.html",
              "必须用 hash 模式",
              "Pinia 问题",
            ],
            answer: 1,
            explain: "history 路由需服务器配合。",
          },
          {
            id: "dp2",
            question: "密钥放哪？",
            options: [
              "提交到 git",
              "服务端环境变量 / 密钥管理",
              "写在前端常量",
              "写在 CSS",
            ],
            answer: 1,
            explain: "永远别把私钥放前端。",
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
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> =
    [];
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
