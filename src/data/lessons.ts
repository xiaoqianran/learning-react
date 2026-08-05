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
  track: "基础" | "进阶" | "全栈准备";
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
        body: "Vue 是一个用于构建用户界面的渐进式 JavaScript 框架。你可以用它写一小块交互组件，也可以搭完整的 SPA。核心思想是：用声明式模板描述 UI，用响应式数据驱动视图更新。",
      },
      {
        type: "text",
        title: "Vue 3 相对 Vue 2 的关键变化",
        body: "Vue 3 默认推荐组合式 API（Composition API），基于 ref / reactive 的 Proxy 响应式系统更强；支持更好的 TypeScript；打包体积更小、性能更好。本课程全程使用 Vue 3 + 组合式 API（script setup）。",
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
        hint: "点击按钮，数字变化。这就是「数据变 → 视图自动更新」。",
      },
      {
        type: "tip",
        body: "后面所有 Demo 都在模拟 Vue 的行为逻辑，帮助你理解概念。真正项目里你会写 .vue 单文件组件，由 Vite 编译。v3 起可在「SFC 编辑器」写真实 .vue。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "Vue 的核心思路最接近哪一句？",
            options: [
              "手动操作 DOM 更新页面",
              "声明式描述 UI，数据驱动视图",
              "只能用类组件写界面",
              "必须搭配 jQuery 使用",
            ],
            answer: 1,
            explain: "Vue 用声明式模板 + 响应式数据，数据变化时框架负责更新 DOM。",
          },
          {
            id: "i2",
            question: "Vue 3 默认推荐的写法是？",
            options: ["Options API  only", "组合式 API（Composition API）", "仅 Class 组件", "仅 JSX"],
            answer: 1,
            explain: "Vue 3 大力推广 Composition API / <script setup>，更利于逻辑复用与 TS。",
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
        body: "双花括号 {{ }} 会把表达式结果渲染成文本。它们是响应式的：数据变了，插值内容会自动更新。",
      },
      {
        type: "code",
        title: "插值与指令",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const msg = ref('你好，Vue')
const isActive = ref(true)
const raw = ref('<b>粗体</b>')
</script>

<template>
  <p>{{ msg }}</p>
  <p :class="{ active: isActive }">属性绑定用 v-bind 或 :</p>
  <div v-html="raw"></div>
</template>`,
      },
      {
        type: "text",
        title: "常用指令速记",
        body: "v-bind（简写 :）绑定属性；v-on（简写 @）绑定事件；v-if / v-show 控制显示；v-for 列表；v-model 双向绑定。指令是 Vue 模板的「特殊属性」。",
      },
      {
        type: "demo",
        kind: "template",
        title: "动手：改数据看模板",
        hint: "修改输入框，下方插值与 class 会跟着变。",
      },
      {
        type: "tip",
        body: "永远不要把不可信用户输入直接丢给 v-html，可能造成 XSS。优先用文本插值 {{ }}。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "v-bind:title 的简写是？",
            options: [":title", "@title", "#title", "v-title"],
            answer: 0,
            explain: "v-bind 简写为冒号 :，v-on 简写为 @。",
          },
          {
            id: "t2",
            question: "为什么要谨慎使用 v-html？",
            options: [
              "性能太差",
              "可能引入 XSS 安全风险",
              "Vue 3 已移除",
              "只能绑定数字",
            ],
            answer: 1,
            explain: "v-html 会插入原始 HTML，恶意脚本可能被执行。",
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
        type: "text",
        title: "为什么需要响应式？",
        body: "普通 JS 变量变了，页面不会自动更新。Vue 用 Proxy 包装数据，在读取时收集依赖、在写入时触发更新，从而实现「改数据即改 UI」。",
      },
      {
        type: "code",
        title: "ref 与 reactive",
        lang: "ts",
        code: `import { ref, reactive } from 'vue'

const count = ref(0)
count.value++

const state = reactive({ name: 'Vue', n: 1 })
state.n++

// 解构会丢失响应式 → toRefs(state)`,
      },
      {
        type: "demo",
        kind: "ref-vs-reactive",
        title: "动手：对比 ref / reactive",
        hint: "两种写法都能驱动视图；注意 ref 在脚本中的 .value。",
      },
      {
        type: "tip",
        body: "团队约定建议：基本类型用 ref，复杂对象用 reactive 或 ref。模板中 ref 会自动解包，不需要写 .value。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "在 <script setup> 中读取 ref 的正确方式？",
            options: ["count", "count.value", "count()", "count.val"],
            answer: 1,
            explain: "脚本中必须用 .value；模板里会自动解包。",
          },
          {
            id: "r2",
            question: "直接解构 reactive 对象会怎样？",
            options: [
              "更快",
              "失去响应式连接",
              "自动变成 ref",
              "编译报错",
            ],
            answer: 1,
            explain: "解构拿到的是普通值。需要 toRefs / toRef 保持响应式。",
          },
        ],
      },
    ],
  },
  {
    slug: "computed",
    title: "计算属性与侦听器",
    summary: "computed 缓存派生状态，watch / watchEffect 响应副作用。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "computed：派生状态",
        body: "依赖的响应式数据不变时，computed 会缓存上次结果，避免重复计算。适合「由已有状态推导出的值」。",
      },
      {
        type: "code",
        title: "computed 与 watch",
        lang: "ts",
        code: `import { ref, computed, watch, watchEffect } from 'vue'

const first = ref('Ada')
const last = ref('Lovelace')
const full = computed(() => first.value + ' ' + last.value)

watch(full, (now, prev) => {
  console.log('名字从', prev, '变成', now)
})

watchEffect(() => {
  document.title = full.value
})`,
      },
      {
        type: "demo",
        kind: "computed",
        title: "动手：全名计算与日志",
        hint: "改姓/名，全名自动更新；下方模拟 watch 日志。",
      },
      {
        type: "tip",
        body: "需要「返回值」用 computed；需要「副作用」用 watch / watchEffect。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "computed 相对 methods 的主要优势？",
            options: [
              "可以写 async",
              "有缓存，依赖不变不重算",
              "只能在 Options API 用",
              "没有返回值",
            ],
            answer: 1,
            explain: "computed 按依赖缓存；methods 每次渲染都会重新执行。",
          },
          {
            id: "c2",
            question: "watchEffect 的特点是？",
            options: [
              "必须手动指定依赖源",
              "自动追踪回调内用到的响应式依赖",
              "只能监听一次",
              "不能清理副作用",
            ],
            answer: 1,
            explain: "watchEffect 立即运行并自动收集依赖。",
          },
        ],
      },
    ],
  },
  {
    slug: "list-render",
    title: "条件与列表渲染",
    summary: "v-if / v-show、v-for 与 key 的正确用法。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "v-if 还是 v-show？",
        body: "v-if 是真正的条件渲染；v-show 用 CSS display 切换。列表用 v-for，务必提供稳定的 key。",
      },
      {
        type: "code",
        title: "列表与条件",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const ok = ref(true)
const items = ref([
  { id: 1, text: '学 ref' },
  { id: 2, text: '学 v-for' },
])
</script>

<template>
  <p v-if="ok">显示中</p>
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </ul>
</template>`,
      },
      {
        type: "demo",
        kind: "list",
        title: "动手：条件 + 列表",
        hint: "切换显示、添加/删除项，观察列表变化。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "v-for 为什么需要 key？",
            options: [
              "只是语法糖，可省略",
              "帮助 Vue 高效复用 / 移动 DOM 节点",
              "用于 CSS 选择器",
              "强制重新请求数据",
            ],
            answer: 1,
            explain: "稳定 key 让 diff 算法正确识别节点身份。",
          },
          {
            id: "l2",
            question: "频繁切换显隐更适合？",
            options: ["v-if", "v-show", "v-html", "v-once"],
            answer: 1,
            explain: "v-show 避免反复销毁/创建 DOM。",
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
        type: "text",
        title: "绑定事件",
        body: "用 @click 等绑定处理器。修饰符如 .prevent、.stop、.once 覆盖常见 DOM 事件需求。",
      },
      {
        type: "code",
        title: "事件示例",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const n = ref(0)
function add(delta: number) { n.value += delta }
</script>

<template>
  <button @click="add(1)">+1</button>
  <form @submit.prevent="() => {}">
    <button type="submit">提交</button>
  </form>
</template>`,
      },
      {
        type: "demo",
        kind: "events",
        title: "动手：点击与修饰符",
        hint: "试试普通点击、+5，以及带 prevent 的提交。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: "@click.prevent 的作用？",
            options: [
              "阻止事件冒泡",
              "调用 event.preventDefault()",
              "只触发一次",
              "捕获阶段监听",
            ],
            answer: 1,
            explain: ".prevent 对应 preventDefault；.stop 对应 stopPropagation。",
          },
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "表单与 v-model",
    summary: "双向绑定、修饰符与多表单控件。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "v-model 在做什么",
        body: "v-model 是「值绑定 + 监听输入事件」的语法糖。修饰符 .lazy、.number、.trim 很实用。",
      },
      {
        type: "code",
        title: "表单绑定",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const name = ref('')
const age = ref(18)
const agree = ref(false)
</script>

<template>
  <input v-model.trim="name" />
  <input v-model.number="age" type="number" />
  <label><input type="checkbox" v-model="agree" /> 同意</label>
</template>`,
      },
      {
        type: "demo",
        kind: "form",
        title: "动手：实时表单",
        hint: "改输入，预览区同步更新。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "v-model.number 的作用？",
            options: [
              "限制最大长度",
              "自动把输入转为数字",
              "只允许整数",
              "禁用输入",
            ],
            answer: 1,
            explain: ".number 用 parseFloat 处理用户输入。",
          },
        ],
      },
    ],
  },
  {
    slug: "components",
    title: "组件基础",
    summary: "单文件组件、父子结构与局部注册。",
    level: "进阶",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "把 UI 拆成积木",
        body: "组件是可复用的 UI 单元。Vue 单文件组件（SFC）把 script、template、style 放在同一个 .vue 文件。",
      },
      {
        type: "code",
        title: "父用子",
        lang: "vue",
        code: `<!-- App.vue -->
<script setup>
import CounterCard from './CounterCard.vue'
</script>
<template>
  <CounterCard />
  <CounterCard />
</template>`,
      },
      {
        type: "demo",
        kind: "component",
        title: "动手：两个独立子组件",
        hint: "每个子组件有自己的状态，互不影响。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "SFC 指的是？",
            options: [
              "Server Form Control",
              "单文件组件 Single File Component",
              "静态函数调用",
              "样式框架",
            ],
            answer: 1,
            explain: ".vue 单文件组件是 Vue 项目的标准组织方式。",
          },
        ],
      },
    ],
  },
  {
    slug: "props-emits",
    title: "Props 与 Emits",
    summary: "向下传数据、向上发事件，保持单向数据流。",
    level: "进阶",
    track: "基础",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "单向数据流",
        body: "父 → 子：props。子 → 父：emit 事件，由父更新状态。子组件不应直接修改 prop。",
      },
      {
        type: "code",
        title: "defineProps / defineEmits",
        lang: "vue",
        code: `<script setup lang="ts">
const props = defineProps<{ title: string; count: number }>()
const emit = defineEmits<{ (e: 'inc'): void }>()
</script>
<template>
  <button @click="emit('inc')">{{ title }} {{ count }}</button>
</template>`,
      },
      {
        type: "demo",
        kind: "todo",
        title: "动手：迷你 Todo（综合 props/事件/列表）",
        hint: "添加、完成、删除——典型父子协作模式。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "子组件想改父级数据，正确做法是？",
            options: [
              "直接改 props",
              "emit 事件，由父更新状态",
              "改 window 全局变量",
              "用 v-html 覆盖",
            ],
            answer: 1,
            explain: "保持单向数据流：子通知，父更新。",
          },
        ],
      },
    ],
  },
  {
    slug: "lifecycle",
    title: "生命周期",
    summary: "onMounted、onUnmounted 等钩子的使用时机。",
    level: "进阶",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "何时跑哪段逻辑",
        body: "挂载后适合请求数据、绑定监听；卸载前清理定时器与监听，避免泄漏。",
      },
      {
        type: "code",
        title: "钩子示例",
        lang: "ts",
        code: `import { ref, onMounted, onUnmounted } from 'vue'
const now = ref(Date.now())
let timer: number
onMounted(() => {
  timer = window.setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(timer))`,
      },
      {
        type: "demo",
        kind: "lifecycle",
        title: "动手：挂载后启动计时器",
        hint: "挂载时开始滴答；点「卸载」清理计时器。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "lf1",
            question: "适合在 onMounted 里做的事？",
            options: [
              "定义 ref",
              "访问已挂载的 DOM / 发起初始化请求",
              "修改 props",
              "注册全局 CSS",
            ],
            answer: 1,
            explain: "挂载完成后 DOM 可用，适合初始化副作用。",
          },
        ],
      },
    ],
  },
  {
    slug: "composition",
    title: "组合式 API 实践",
    summary: "把逻辑抽成 composable，组织可维护代码。",
    level: "实战",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "composable 是什么",
        body: "把有内聚的状态 + 方法抽到 useXxx() 函数里，在多个组件复用。命名约定 use 前缀。",
      },
      {
        type: "code",
        title: "useCounter.ts",
        lang: "ts",
        code: `import { ref, computed } from 'vue'
export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  function inc() { count.value++ }
  return { count, doubled, inc }
}`,
      },
      {
        type: "demo",
        kind: "counter",
        title: "复习：计数器 composable 思路",
        hint: "把 count / inc 想成 useCounter 的返回值。",
      },
      {
        type: "tip",
        body: "进阶线：Router、Pinia、常见坑。全栈准备线（v4）：Slots、异步请求、路由守卫。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "co1",
            question: "composable 函数的常见命名？",
            options: ["getXxx", "useXxx", "makeXxx", "XxxService"],
            answer: 1,
            explain: "社区约定 use 前缀。",
          },
          {
            id: "co2",
            question: "组合式 API 相对 Options 的主要收益？",
            options: [
              "不能用 TypeScript",
              "相关逻辑可聚合与复用，而非按 data/methods 拆散",
              "不再需要构建工具",
              "取消了组件概念",
            ],
            answer: 1,
            explain: "同一功能的状态与方法可写在一起，并通过 composable 复用。",
          },
        ],
      },
    ],
  },
  {
    slug: "router",
    title: "Vue Router 路由",
    summary: "SPA 导航、动态路由、嵌套路由与导航守卫入门。",
    level: "进阶",
    track: "进阶",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "为什么需要路由",
        body: "单页应用靠前端路由切换「页面」而不整页刷新。Vue Router 把 URL 映射到组件。",
      },
      {
        type: "code",
        title: "最小路由配置",
        lang: "ts",
        code: `import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/lesson/:slug', component: Lesson, props: true },
  ],
})`,
      },
      {
        type: "demo",
        kind: "router",
        title: "动手：迷你路由切换",
        hint: "点击导航切换「页面」，观察 URL 段与视图变化。",
      },
      {
        type: "tip",
        body: "守卫与登录拦截见 v4「路由守卫与鉴权心智」。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rt1",
            question: "RouterLink 相对 a 标签的优势？",
            options: [
              "只能用相对路径",
              "SPA 内导航、可高亮激活、避免整页刷新",
              "会强制刷新页面",
              "不能传 params",
            ],
            answer: 1,
            explain: "RouterLink 走客户端路由，支持 active class。",
          },
          {
            id: "rt2",
            question: "读取当前路由参数常用？",
            options: ["useStore()", "useRoute()", "useAttrs()", "useCssModule()"],
            answer: 1,
            explain: "useRoute() 返回当前路由对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "pinia",
    title: "Pinia 状态管理",
    summary: "跨组件共享状态：defineStore、state、getters、actions。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "什么时候用 Pinia",
        body: "组件本地状态用 ref 即可。多页面共享用户信息、购物车、主题等用 Pinia。",
      },
      {
        type: "code",
        title: "defineStore 示例",
        lang: "ts",
        code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useCartStore = defineStore('cart', () => {
  const items = ref<{ id: number; name: string }[]>([])
  const count = computed(() => items.value.length)
  function add(name: string) {
    items.value.push({ id: Date.now(), name })
  }
  return { items, count, add }
})`,
      },
      {
        type: "demo",
        kind: "pinia",
        title: "动手：共享购物车 Store",
        hint: "两个面板共用同一份 store 状态。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pi1",
            question: "Pinia 相对 Vuex 的常见优势？",
            options: [
              "必须用 mutations",
              "更轻量、TS 友好、去掉繁琐 mutations",
              "只能用 Options 写法",
              "不能拆多个 store",
            ],
            answer: 1,
            explain: "Pinia 设计更简洁，官方推荐作为 Vuex 继任。",
          },
          {
            id: "pi2",
            question: "setup 风格 store 里改状态通常？",
            options: [
              "只能通过 commit",
              "直接改 ref / 调 action 函数",
              "必须 dispatch 字符串",
              "只能在组件外改",
            ],
            answer: 1,
            explain: "组合式 store 返回 ref 与函数，直接调用即可。",
          },
        ],
      },
    ],
  },
  {
    slug: "pitfalls",
    title: "常见坑与性能",
    summary: "响应式丢失、滥用 watch、列表 key、大列表优化要点。",
    level: "实战",
    track: "进阶",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "高频踩坑清单",
        body: "1) 解构 reactive 丢响应式。2) 忘写 .value。3) v-for 用 index 当 key 且会重排。4) computed 里写副作用。5) 过深的大对象代理。",
      },
      {
        type: "code",
        title: "浅层与冻结",
        lang: "ts",
        code: `import { shallowRef, triggerRef, markRaw } from 'vue'
const big = shallowRef({ list: [] as number[] })
big.value.list.push(1)
triggerRef(big)
const chart = markRaw(new HeavyChart())`,
      },
      {
        type: "demo",
        kind: "challenge",
        title: "挑战：找出响应式问题",
        hint: "用 ref 并使用 .value 更新，直到检查通过。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pf1",
            question: "shallowRef 的特点？",
            options: [
              "深度监听所有嵌套",
              "只追踪 .value 的替换，不深度代理内部",
              "不能用于对象",
              "等同于 reactive",
            ],
            answer: 1,
            explain: "浅层 ref 适合大对象。",
          },
          {
            id: "pf2",
            question: "computed 里发起网络请求？",
            options: [
              "推荐做法",
              "不推荐：副作用应放 watch / 生命周期",
              "只能在 Vue 2 这样写",
              "会自动缓存请求结果到 localStorage",
            ],
            answer: 1,
            explain: "computed 应纯计算。",
          },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "从零搭一个小项目",
    summary: "Vite + Vue 3 工程结构、环境变量与发布清单。",
    level: "实战",
    track: "进阶",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "推荐起步",
        body: "官方脚手架：npm create vue@latest。勾选 Router、Pinia、TS 按需。",
      },
      {
        type: "code",
        title: "环境变量",
        lang: "text",
        code: `VITE_API_BASE=http://localhost:3000
// import.meta.env.VITE_API_BASE
# 只有 VITE_ 前缀会暴露给客户端`,
      },
      {
        type: "demo",
        kind: "todo",
        title: "综合练习：任务清单小应用",
        hint: "用列表、表单、组件思路完成 Todo。",
      },
      {
        type: "tip",
        body: "v4 全栈准备线继续：Slots、异步请求、路由守卫、表单校验——这是接 API 与鉴权前的最后一块前端拼图。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pj1",
            question: "Vite 暴露给前端的环境变量前缀？",
            options: ["REACT_APP_", "VITE_", "NEXT_PUBLIC_", "PUBLIC_"],
            answer: 1,
            explain: "Vite 约定 VITE_ 前缀。",
          },
          {
            id: "pj2",
            question: "create vue 官方脚手架命令？",
            options: [
              "npm create vue@latest",
              "npm i -g vue-cli && vue create",
              "npx create-react-app",
              "yarn create next-app",
            ],
            answer: 0,
            explain: "现代官方推荐 npm create vue@latest。",
          },
        ],
      },
    ],
  },

  // ——— v4 全栈准备 ———
  {
    slug: "slots",
    title: "插槽 Slots",
    summary: "默认插槽、具名插槽与作用域插槽：组件组合的关键。",
    level: "进阶",
    track: "全栈准备",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "为什么需要插槽",
        body: "Props 适合传数据；插槽适合「父级决定一块 UI 怎么画」。卡片壳、布局、表格列、弹层内容几乎都靠插槽。",
      },
      {
        type: "code",
        title: "默认 / 具名 / 作用域插槽",
        lang: "vue",
        code: `<!-- Card.vue -->
<script setup lang="ts">
defineProps<{ title: string }>()
</script>
<template>
  <section class="card">
    <header><slot name="header">{{ title }}</slot></header>
    <div class="body"><slot /></div>
    <footer><slot name="footer" :year="2026" /></footer>
  </section>
</template>

<!-- 使用 -->
<Card title="默认标题">
  <template #header>自定义头</template>
  <p>默认插槽内容</p>
  <template #footer="{ year }">© {{ year }}</template>
</Card>`,
      },
      {
        type: "demo",
        kind: "slots",
        title: "动手：卡片插槽组合",
        hint: "切换是否自定义 header / footer，理解插槽替换默认内容。",
      },
      {
        type: "tip",
        body: "作用域插槽 = 子组件把内部数据「借」给父模板用，常见于表格列、列表项渲染。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sl1",
            question: "v-slot:header 的简写？",
            options: ["@header", "#header", ":header", ".header"],
            answer: 1,
            explain: "具名插槽简写为 #name。",
          },
          {
            id: "sl2",
            question: "作用域插槽主要解决？",
            options: [
              "样式穿透",
              "父模板能用到子组件内部数据来渲染",
              "替代 props",
              "服务端渲染",
            ],
            answer: 1,
            explain: "子通过 slot props 把数据暴露给父级插槽内容。",
          },
        ],
      },
    ],
  },
  {
    slug: "provide-inject",
    title: "Provide / Inject",
    summary: "跨层级依赖注入：主题、当前用户、配置，避免 props 逐层传递。",
    level: "进阶",
    track: "全栈准备",
    minutes: 11,
    blocks: [
      {
        type: "text",
        title: "何时用 provide/inject",
        body: "深层组件树不想把 props 一层层钻（prop drilling）时，祖先 provide，后代 inject。适合主题、locale、当前用户上下文。全局业务状态仍优先 Pinia。",
      },
      {
        type: "code",
        title: "InjectionKey 与只读约定",
        lang: "ts",
        code: `// keys.ts
import type { InjectionKey, Ref } from 'vue'
export const themeKey: InjectionKey<Ref<'dark' | 'light'>> = Symbol('theme')

// 祖先
import { provide, ref } from 'vue'
import { themeKey } from './keys'
const theme = ref<'dark' | 'light'>('dark')
provide(themeKey, theme)

// 后代
import { inject } from 'vue'
const theme = inject(themeKey)
// 约定：后代尽量不直接改，提供 toggleTheme 方法一起 inject`,
      },
      {
        type: "demo",
        kind: "provide",
        title: "动手：主题从祖先注入",
        hint: "祖先切换主题，深层子组件无需 props 链路即可响应。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pr1",
            question: "provide/inject 相对 Pinia？",
            options: [
              "完全替代 Pinia",
              "适合树内上下文；跨页面全局业务状态更适合 Pinia",
              "只能传字符串",
              "只能在 Options API 用",
            ],
            answer: 1,
            explain: "注入适合组件树上下文；全局业务状态用 store 更清晰。",
          },
          {
            id: "pr2",
            question: "推荐用 Symbol + InjectionKey 的原因？",
            options: [
              "更快",
              "避免字符串 key 冲突并获得 TS 类型",
              "必须才能运行",
              "减少打包体积",
            ],
            answer: 1,
            explain: "Symbol key 唯一，InjectionKey 提供类型安全。",
          },
        ],
      },
    ],
  },
  {
    slug: "async-data",
    title: "异步数据与请求态",
    summary: "loading / error / empty、取消请求、把 fetch 放进 composable。",
    level: "实战",
    track: "全栈准备",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "全栈第一步：会「要数据」",
        body: "真实应用的数据在服务端。前端必须处理：加载中、失败重试、空列表、竞态（后发先至）。这是接 REST/GraphQL 前的基本功。",
      },
      {
        type: "code",
        title: "useFetch 风格 composable",
        lang: "ts",
        code: `import { ref, onMounted, onUnmounted } from 'vue'

export function useTodos(url: string) {
  const data = ref<{ id: number; title: string }[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let ctrl: AbortController | null = null

  async function load() {
    ctrl?.abort()
    ctrl = new AbortController()
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      data.value = await res.json()
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  onMounted(load)
  onUnmounted(() => ctrl?.abort())
  return { data, loading, error, reload: load }
}`,
      },
      {
        type: "demo",
        kind: "async",
        title: "动手：模拟请求三态",
        hint: "触发加载 / 失败 / 成功，观察 loading · error · 列表 UI。",
      },
      {
        type: "tip",
        body: "生产可考虑 ofetch、TanStack Query / VueQuery、或 Nuxt 的 useFetch。核心仍是：显式状态 + 取消竞态 + 错误可恢复。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "as1",
            question: "请求过程中用户快速切换页面，应？",
            options: [
              "忽略",
              "用 AbortController 取消未完成请求",
              "只靠 loading 锁按钮",
              "把结果写到 window",
            ],
            answer: 1,
            explain: "取消可避免卸载后 setState 与竞态覆盖。",
          },
          {
            id: "as2",
            question: "UI 最少应覆盖哪些请求态？",
            options: [
              "只有成功",
              "loading / error / 成功（及 empty）",
              "只有 error",
              "只有 skeleton",
            ],
            answer: 1,
            explain: "完整体验需要加载、失败、成功与空数据。",
          },
        ],
      },
    ],
  },
  {
    slug: "route-guards",
    title: "路由守卫与鉴权心智",
    summary: "beforeEach、meta.requiresAuth、登录跳转与回跳地址。",
    level: "实战",
    track: "全栈准备",
    minutes: 13,
    blocks: [
      {
        type: "text",
        title: "鉴权在前端的边界",
        body: "前端守卫只是体验层：没登录就跳登录页。真正安全必须在服务端校验 token/session。前后端要约定：401 → 清登录态并跳转。",
      },
      {
        type: "code",
        title: "全局前置守卫",
        lang: "ts",
        code: `// router.ts
router.beforeEach((to) => {
  const authed = Boolean(localStorage.getItem('token'))
  if (to.meta.requiresAuth && !authed) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
  if (to.path === '/login' && authed) return '/'
})

// routes
{ path: '/dashboard', component: Dash, meta: { requiresAuth: true } }
{ path: '/login', component: Login }`,
      },
      {
        type: "demo",
        kind: "guard",
        title: "动手：登录门禁模拟",
        hint: "未登录访问受保护页会跳登录；登录后可进入，并支持退出。",
      },
      {
        type: "tip",
        body: "token 放 localStorage 有 XSS 风险；更稳妥是 HttpOnly Cookie + 服务端 session（Nuxt/BFF 常见）。此处先建立心智模型。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "gd1",
            question: "前端 beforeEach 能替代服务端鉴权吗？",
            options: [
              "能，足够安全",
              "不能，前端可被绕过，服务端必须校验",
              "只能替代 CSRF",
              "只能替代 CORS",
            ],
            answer: 1,
            explain: "前端守卫可被禁用/伪造；API 必须鉴权。",
          },
          {
            id: "gd2",
            question: "登录后跳回原页面常用？",
            options: [
              "写死 /home",
              "login?redirect=原路径，成功后 router.replace(redirect)",
              "location.reload",
              "只用 history.back",
            ],
            answer: 1,
            explain: "redirect 查询参数是常见模式。",
          },
        ],
      },
    ],
  },
  {
    slug: "form-validate",
    title: "表单校验",
    summary: "同步规则、失焦校验、提交拦截——接注册/登录接口前必备。",
    level: "实战",
    track: "全栈准备",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "校验分层",
        body: "前端校验提升体验（即时反馈）；后端校验保证正确与安全。永远不要只信前端。",
      },
      {
        type: "code",
        title: "轻量规则示例",
        lang: "ts",
        code: `type Errors = Partial<Record<'email' | 'password', string>>

function validate(email: string, password: string): Errors {
  const e: Errors = {}
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) e.email = '邮箱格式不正确'
  if (password.length < 8) e.password = '密码至少 8 位'
  return e
}

// 提交
const errors = validate(email.value, password.value)
if (Object.keys(errors).length) { /* 展示错误，不请求 */ return }
await api.login({ email, password })`,
      },
      {
        type: "demo",
        kind: "validate",
        title: "动手：登录表单校验",
        hint: "试错误邮箱与短密码，看字段级错误；合法后才「提交成功」。",
      },
      {
        type: "tip",
        body: "复杂表单可上 VeeValidate + Zod/Yup。先掌握「规则函数 + 错误对象 + 提交门禁」。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "fv1",
            question: "前端校验通过是否等于数据安全？",
            options: [
              "是",
              "否，后端仍必须校验",
              "仅 HTTPS 时等于",
              "仅用 Zod 时等于",
            ],
            answer: 1,
            explain: "客户端可被篡改，服务端是最后防线。",
          },
          {
            id: "fv2",
            question: "字段级错误相对 toast 一次提示的优势？",
            options: [
              "更酷",
              "用户知道哪个字段错、如何改",
              "更少代码",
              "不需要 label",
            ],
            answer: 1,
            explain: "字段错误提升可访问性与可修正性。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = ["基础", "进阶", "全栈准备"] as const;

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
