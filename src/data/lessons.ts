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
  track: "基础" | "进阶" | "全栈准备" | "全栈实训";
  minutes: number;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "Vue 3 是什么",
    summary: "认识渐进式框架、组合式 API，以及它解决的问题。",
    level: "入门",
    track: "基础",
    minutes: 6,
    blocks: [
      {
        type: "text",
        title: "一句话理解 Vue",
        body: "Vue 是一个用于构建用户界面的渐进式 JavaScript 框架。核心思想：声明式模板描述 UI，响应式数据驱动视图更新。",
      },
      {
        type: "code",
        title: "最小的 Vue 3 应用",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
<template>
  <button @click="count++">点了 {{ count }} 次</button>
</template>`,
      },
      {
        type: "demo",
        kind: "counter",
        title: "动手：响应式计数器",
        hint: "数据变 → 视图自动更新。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "Vue 的核心思路最接近？",
            options: [
              "手动操作 DOM",
              "声明式描述 UI，数据驱动视图",
              "只能用类组件",
              "必须搭配 jQuery",
            ],
            answer: 1,
            explain: "声明式 + 响应式是 Vue 核心。",
          },
          {
            id: "i2",
            question: "Vue 3 默认推荐？",
            options: ["仅 Options API", "组合式 API", "仅 Class", "仅 JSX"],
            answer: 1,
            explain: "Composition API / script setup。",
          },
        ],
      },
    ],
  },
  {
    slug: "template",
    title: "模板语法",
    summary: "插值、指令、属性绑定与 v-html 的安全边界。",
    level: "入门",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "文本插值",
        body: "双花括号 {{ }} 渲染文本。v-bind(:) 绑属性，v-on(@) 绑事件。",
      },
      {
        type: "demo",
        kind: "template",
        title: "动手：改数据看模板",
        hint: "修改输入，插值与 class 跟随变化。",
      },
      {
        type: "tip",
        body: "不要把不可信内容交给 v-html（XSS）。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "v-bind:title 简写？",
            options: [":title", "@title", "#title", "v-title"],
            answer: 0,
            explain: "v-bind 简写为 :。",
          },
          {
            id: "t2",
            question: "谨慎使用 v-html 因为？",
            options: ["性能", "XSS 风险", "已移除", "只能绑数字"],
            answer: 1,
            explain: "会插入原始 HTML。",
          },
        ],
      },
    ],
  },
  {
    slug: "reactivity",
    title: "响应式：ref 与 reactive",
    summary: "理解 Proxy 响应式、.value 与解构陷阱。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "ref 与 reactive",
        lang: "ts",
        code: `import { ref, reactive } from 'vue'
const count = ref(0)
count.value++
const state = reactive({ name: 'Vue', n: 1 })
state.n++`,
      },
      {
        type: "demo",
        kind: "ref-vs-reactive",
        title: "动手：对比 ref / reactive",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "脚本中读 ref？",
            options: ["count", "count.value", "count()", "count.val"],
            answer: 1,
            explain: "脚本用 .value，模板自动解包。",
          },
          {
            id: "r2",
            question: "解构 reactive 会？",
            options: ["更快", "失去响应式", "变 ref", "报错"],
            answer: 1,
            explain: "用 toRefs 保持响应式。",
          },
        ],
      },
    ],
  },
  {
    slug: "computed",
    title: "计算属性与侦听器",
    summary: "computed 缓存派生状态，watch 处理副作用。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "demo",
        kind: "computed",
        title: "动手：全名计算与日志",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "computed 优势？",
            options: ["可 async", "有缓存", "仅 Options", "无返回值"],
            answer: 1,
            explain: "依赖不变不重算。",
          },
          {
            id: "c2",
            question: "watchEffect 特点？",
            options: ["必须指定源", "自动追踪依赖", "只一次", "不能清理"],
            answer: 1,
            explain: "自动收集依赖。",
          },
        ],
      },
    ],
  },
  {
    slug: "list-render",
    title: "条件与列表渲染",
    summary: "v-if / v-show、v-for 与 key。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "demo",
        kind: "list",
        title: "动手：条件 + 列表",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "v-for 需要 key？",
            options: ["可省略", "高效复用 DOM", "CSS 用", "强制请求"],
            answer: 1,
            explain: "稳定 key 识别节点。",
          },
          {
            id: "l2",
            question: "频繁显隐用？",
            options: ["v-if", "v-show", "v-html", "v-once"],
            answer: 1,
            explain: "v-show 切换 CSS。",
          },
        ],
      },
    ],
  },
  {
    slug: "events",
    title: "事件处理",
    summary: "v-on、修饰符与内联处理器。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "demo",
        kind: "events",
        title: "动手：点击与修饰符",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: "@click.prevent？",
            options: ["阻止冒泡", "preventDefault", "只一次", "捕获"],
            answer: 1,
            explain: ".prevent = preventDefault。",
          },
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "表单与 v-model",
    summary: "双向绑定与修饰符。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "demo",
        kind: "form",
        title: "动手：实时表单",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "v-model.number？",
            options: ["限长", "转为数字", "仅整数", "禁用"],
            answer: 1,
            explain: "parseFloat 处理输入。",
          },
        ],
      },
    ],
  },
  {
    slug: "components",
    title: "组件基础",
    summary: "SFC 与父子结构。",
    level: "进阶",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "demo",
        kind: "component",
        title: "动手：两个独立子组件",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "SFC 是？",
            options: ["服务表单", "单文件组件", "静态函数", "样式库"],
            answer: 1,
            explain: "Single File Component。",
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
        title: "动手：迷你 Todo",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "子改父数据？",
            options: ["改 props", "emit 由父更新", "改 window", "v-html"],
            answer: 1,
            explain: "单向数据流。",
          },
        ],
      },
    ],
  },
  {
    slug: "lifecycle",
    title: "生命周期",
    summary: "onMounted / onUnmounted。",
    level: "进阶",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "demo",
        kind: "lifecycle",
        title: "动手：挂载后计时器",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "lf1",
            question: "onMounted 适合？",
            options: ["定义 ref", "DOM/初始化请求", "改 props", "全局 CSS"],
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
    summary: "composable 复用逻辑。",
    level: "实战",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "useCounter",
        lang: "ts",
        code: `export function useCounter(initial = 0) {
  const count = ref(initial)
  const inc = () => count.value++
  return { count, inc }
}`,
      },
      {
        type: "demo",
        kind: "counter",
        title: "复习：composable 思路",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "co1",
            question: "composable 命名？",
            options: ["getXxx", "useXxx", "makeXxx", "XxxService"],
            answer: 1,
            explain: "use 前缀。",
          },
          {
            id: "co2",
            question: "组合式收益？",
            options: ["不能 TS", "逻辑聚合复用", "无需构建", "取消组件"],
            answer: 1,
            explain: "相关逻辑可写在一起。",
          },
        ],
      },
    ],
  },
  {
    slug: "router",
    title: "Vue Router 路由",
    summary: "SPA 导航与动态路由。",
    level: "进阶",
    track: "进阶",
    minutes: 14,
    blocks: [
      {
        type: "demo",
        kind: "router",
        title: "动手：迷你路由",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rt1",
            question: "RouterLink 优势？",
            options: ["仅相对路径", "SPA 导航不整页刷新", "强制刷新", "无 params"],
            answer: 1,
            explain: "客户端路由。",
          },
          {
            id: "rt2",
            question: "读路由参数？",
            options: ["useStore", "useRoute", "useAttrs", "useCssModule"],
            answer: 1,
            explain: "useRoute()。",
          },
        ],
      },
    ],
  },
  {
    slug: "pinia",
    title: "Pinia 状态管理",
    summary: "跨组件共享状态。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "pinia",
        title: "动手：共享购物车",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pi1",
            question: "Pinia 优势？",
            options: ["必须 mutations", "轻量 TS 友好", "仅 Options", "单 store"],
            answer: 1,
            explain: "Vuex 继任。",
          },
          {
            id: "pi2",
            question: "setup store 改状态？",
            options: ["只能 commit", "直接改 ref/调函数", "dispatch 字符串", "仅组件外"],
            answer: 1,
            explain: "直接调用。",
          },
        ],
      },
    ],
  },
  {
    slug: "pitfalls",
    title: "常见坑与性能",
    summary: "响应式丢失与浅层优化。",
    level: "实战",
    track: "进阶",
    minutes: 11,
    blocks: [
      {
        type: "demo",
        kind: "challenge",
        title: "挑战：修复响应式",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pf1",
            question: "shallowRef？",
            options: ["深度代理", "只追踪 .value 替换", "不能对象", "等同 reactive"],
            answer: 1,
            explain: "浅层 ref。",
          },
          {
            id: "pf2",
            question: "computed 里请求？",
            options: ["推荐", "不推荐，副作用用 watch", "仅 Vue2", "自动缓存到 LS"],
            answer: 1,
            explain: "computed 应纯。",
          },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "从零搭一个小项目",
    summary: "Vite 脚手架与环境变量。",
    level: "实战",
    track: "进阶",
    minutes: 13,
    blocks: [
      {
        type: "code",
        title: "环境变量",
        lang: "text",
        code: `VITE_API_BASE=http://localhost:3000
// import.meta.env.VITE_API_BASE`,
      },
      {
        type: "demo",
        kind: "todo",
        title: "综合：任务清单",
      },
      {
        type: "tip",
        body: "v5 起请打开「全栈工作室」做登录 + CRUD 实战。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pj1",
            question: "Vite 环境变量前缀？",
            options: ["REACT_APP_", "VITE_", "NEXT_PUBLIC_", "PUBLIC_"],
            answer: 1,
            explain: "VITE_。",
          },
          {
            id: "pj2",
            question: "官方脚手架？",
            options: ["npm create vue@latest", "vue create", "CRA", "next-app"],
            answer: 0,
            explain: "create vue@latest。",
          },
        ],
      },
    ],
  },
  {
    slug: "slots",
    title: "插槽 Slots",
    summary: "默认、具名与作用域插槽。",
    level: "进阶",
    track: "全栈准备",
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "slots",
        title: "动手：卡片插槽",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sl1",
            question: "v-slot:header 简写？",
            options: ["@header", "#header", ":header", ".header"],
            answer: 1,
            explain: "#name。",
          },
          {
            id: "sl2",
            question: "作用域插槽？",
            options: ["样式穿透", "父用子内部数据渲染", "替代 props", "SSR"],
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
    summary: "跨层依赖注入。",
    level: "进阶",
    track: "全栈准备",
    minutes: 11,
    blocks: [
      {
        type: "demo",
        kind: "provide",
        title: "动手：主题注入",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pr1",
            question: "provide vs Pinia？",
            options: ["完全替代", "树内上下文 vs 全局业务", "只能字符串", "仅 Options"],
            answer: 1,
            explain: "职责不同。",
          },
          {
            id: "pr2",
            question: "Symbol InjectionKey？",
            options: ["更快", "避免冲突 + TS", "必须", "减体积"],
            answer: 1,
            explain: "类型安全唯一 key。",
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
        title: "动手：请求三态",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "as1",
            question: "切换页面未完成请求？",
            options: ["忽略", "AbortController", "只锁按钮", "写 window"],
            answer: 1,
            explain: "取消避免竞态。",
          },
          {
            id: "as2",
            question: "最少请求态？",
            options: ["仅成功", "loading/error/成功(empty)", "仅 error", "仅 skeleton"],
            answer: 1,
            explain: "完整三态。",
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
        title: "动手：登录门禁",
      },
      {
        type: "tip",
        body: "前端守卫可被绕过；API 必须服务端鉴权。去「全栈工作室」体会 401。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "gd1",
            question: "beforeEach 能替代服务端鉴权？",
            options: ["能", "不能", "仅 CSRF", "仅 CORS"],
            answer: 1,
            explain: "前端可被绕过。",
          },
          {
            id: "gd2",
            question: "登录回跳？",
            options: ["写死 /home", "redirect 查询参数", "reload", "仅 back"],
            answer: 1,
            explain: "login?redirect=。",
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
    minutes: 12,
    blocks: [
      {
        type: "demo",
        kind: "validate",
        title: "动手：登录表单校验",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "fv1",
            question: "前端校验=安全？",
            options: ["是", "否，后端仍要校验", "HTTPS 即可", "Zod 即可"],
            answer: 1,
            explain: "服务端是最后防线。",
          },
          {
            id: "fv2",
            question: "字段级错误优势？",
            options: ["更酷", "知道哪错怎么改", "更少代码", "不需 label"],
            answer: 1,
            explain: "可修正性。",
          },
        ],
      },
    ],
  },

  // ——— v5 全栈实训 ———
  {
    slug: "rest-api",
    title: "REST API 与 CRUD",
    summary: "资源、HTTP 方法、状态码——前后端共同语言。",
    level: "实战",
    track: "全栈实训",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "资源导向",
        body: "REST 把业务建模成资源（/api/notes）。用 HTTP 方法表达意图：GET 读、POST 建、PUT/PATCH 改、DELETE 删。响应用状态码说话：200/201 成功，400 参数错，401 未登录，404 不存在，500 服务器错。",
      },
      {
        type: "code",
        title: "典型约定",
        lang: "text",
        code: `GET    /api/notes          → 200 + 数组
POST   /api/notes          → 201 + 新建对象
GET    /api/notes/:id      → 200 | 404
PUT    /api/notes/:id      → 200 + 更新对象
DELETE /api/notes/:id      → 204 无正文

Authorization: Bearer <token>`,
      },
      {
        type: "code",
        title: "前端 fetch 示例",
        lang: "ts",
        code: `const res = await fetch('/api/notes', {
  headers: { Authorization: \`Bearer \${token}\` },
})
if (res.status === 401) {
  // 清 token，跳登录
}
if (!res.ok) throw new Error(await res.text())
const notes = await res.json()`,
      },
      {
        type: "tip",
        body: "打开侧栏「全栈工作室」：登录后增删改查笔记，右侧请求日志会打印 method/path/status——对照本课。",
      },
      {
        type: "demo",
        kind: "async",
        title: "复习：请求态 UI",
        hint: "CRUD 每个动作都要有 loading / 错误反馈。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rs1",
            question: "创建资源通常用？",
            options: ["GET", "POST", "DELETE", "HEAD"],
            answer: 1,
            explain: "POST 创建；成功常见 201。",
          },
          {
            id: "rs2",
            question: "401 含义？",
            options: ["成功", "未认证/登录失效", "服务器炸了", "永久重定向"],
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
    summary: "登录发 token、请求带 Authorization、401 清会话。",
    level: "实战",
    track: "全栈实训",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "常见流程",
        body: "1) POST /api/auth/login 提交账号密码。2) 服务端校验后返回 token（或 Set-Cookie）。3) 前端保存；后续请求带上。4) 服务端校验 token，失败返回 401。5) 前端清本地态并跳登录。",
      },
      {
        type: "code",
        title: "Bearer 模式（教学）",
        lang: "ts",
        code: `// 登录
const { token, user } = await api.login(email, password)
localStorage.setItem('token', token)

// 业务请求
fetch('/api/notes', {
  headers: { Authorization: \`Bearer \${token}\` },
})

// 生产更推荐 HttpOnly Cookie，降低 XSS 偷 token 风险`,
      },
      {
        type: "demo",
        kind: "guard",
        title: "复习：路由门禁",
        hint: "门禁是体验层；实训工作室里的 401 才是 API 层。",
      },
      {
        type: "tip",
        body: "工坊账号 demo@vue.dev / password123。试错密码看 401 日志。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "at1",
            question: "Bearer token 通常放在？",
            options: [
              "URL 查询串明文",
              "Authorization 请求头",
              "仅 CSS",
              "仅 localStorage 从不发送",
            ],
            answer: 1,
            explain: "Authorization: Bearer …",
          },
          {
            id: "at2",
            question: "HttpOnly Cookie 相对 localStorage 的安全点？",
            options: [
              "更快",
              "JS 读不到，降低 XSS 窃取风险",
              "不需要 HTTPS",
              "自动禁用 CSRF",
            ],
            answer: 1,
            explain: "脚本无法直接读 HttpOnly Cookie。",
          },
        ],
      },
    ],
  },
  {
    slug: "nuxt-map",
    title: "Nuxt 全栈地图",
    summary: "pages、server/api、useFetch——Vue 全栈常见终点站。",
    level: "实战",
    track: "全栈实训",
    minutes: 15,
    blocks: [
      {
        type: "text",
        title: "为什么是 Nuxt",
        body: "Nuxt 3 基于 Vue 3 + Nitro：同一仓库里写页面与 server/api/*，自带路由、数据获取、SSR/SSG。适合个人与中小团队「Vue 全栈」落地。",
      },
      {
        type: "code",
        title: "目录心智模型",
        lang: "text",
        code: `app/
  pages/index.vue          # 文件即路由
  pages/notes/[id].vue
  components/
  composables/useNotes.ts
server/
  api/notes.get.ts         # GET /api/notes
  api/notes.post.ts
  api/auth/login.post.ts
nuxt.config.ts`,
      },
      {
        type: "code",
        title: "server/api + useFetch",
        lang: "ts",
        code: `// server/api/notes.get.ts
export default defineEventHandler(async (event) => {
  const user = await requireUser(event) // 读 cookie/session
  return await db.note.findMany({ where: { userId: user.id } })
})

// pages/notes.vue
const { data, pending, error, refresh } = await useFetch('/api/notes')`,
      },
      {
        type: "tip",
        body: "本站「全栈工作室」用浏览器模拟 API，对应 Nuxt 里的 server/api。学会工坊后，把同一套路径搬进 Nuxt 即可。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "nx1",
            question: "Nuxt server/api/notes.get.ts 对应？",
            options: [
              "仅静态文件",
              "GET /api/notes 服务端处理函数",
              "只能客户端跑",
              "Pinia 插件",
            ],
            answer: 1,
            explain: "Nitro 文件路由。",
          },
          {
            id: "nx2",
            question: "useFetch 相对手写 onMounted+fetch？",
            options: [
              "无区别",
              "SSR 友好、状态与刷新集成更好",
              "不能用 TypeScript",
              "只能 POST",
            ],
            answer: 1,
            explain: "Nuxt 数据获取一等公民。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "用你已学能力做一个可演示的全栈小产品。",
    level: "实战",
    track: "全栈实训",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "最小可交付作品",
        body: "选一个：笔记 / 待办 / 记账。必须包含：注册或演示登录、列表、创建、编辑、删除、未登录拦截、基础校验、部署链接。",
      },
      {
        type: "code",
        title: "验收清单",
        lang: "text",
        code: `[ ] 登录 / 退出
[ ] 401 时回到登录
[ ] CRUD 全通 + 空状态
[ ] 字段校验（前端）+ 后端也拒非法数据
[ ] loading / error UI
[ ] 环境变量区分 API 地址
[ ] README：如何本地跑、演示账号
[ ] 部署（Vercel / Cloudflare / 自己的服务器）`,
      },
      {
        type: "tip",
        body: "可先在本站全栈工坊走通流程，再复制到 Vite+真实 API 或 Nuxt。作品 > 证书。",
      },
      {
        type: "demo",
        kind: "todo",
        title: "热身：本地 Todo 交互",
        hint: "把 Todo 升级成「带登录的云端笔记」就是作品雏形。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cap1",
            question: "全栈作品最少要有？",
            options: [
              "只有静态页",
              "鉴权 + 持久化 CRUD + 错误处理",
              "只有 CSS",
              "只有动画",
            ],
            answer: 1,
            explain: "证明你会前后端协作。",
          },
          {
            id: "cap2",
            question: "演示账号写在？",
            options: ["不写", "README 与登录页提示", "仅口口相传", "硬编码在 CSS"],
            answer: 1,
            explain: "方便评审与自测。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = ["基础", "进阶", "全栈准备", "全栈实训"] as const;

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
