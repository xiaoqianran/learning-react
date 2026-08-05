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
  | "challenge";

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
  /** Learning path track — v2 */
  track: "基础" | "进阶";
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
        body: "后面所有 Demo 都在模拟 Vue 的行为逻辑，帮助你理解概念。真正项目里你会写 .vue 单文件组件，由 Vite 编译。",
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
  <!-- 谨慎：会插入 HTML -->
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

// 基本类型 / 任意值 → ref
const count = ref(0)
count.value++          // 脚本里要 .value

// 对象 → reactive（或 ref 包对象）
const state = reactive({ name: 'Vue', n: 1 })
state.n++              // 不用 .value

// 注意：解构会丢失响应式
// const { n } = state  // 坏：n 不再是响应式
// 用 toRefs(state) 再解构`,
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
        body: "依赖的响应式数据不变时，computed 会缓存上次结果，避免重复计算。适合「由已有状态推导出的值」，而不是在模板里写一长串表达式。",
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
  // 自动追踪内部用到的依赖
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
        body: "需要「返回值」用 computed；需要「副作用」（请求、日志、同步到 localStorage）用 watch / watchEffect。",
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
            explain: "watchEffect 立即运行并自动收集依赖；watch 通常需显式指定源。",
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
        body: "v-if 是真正的条件渲染（不满足时不创建 DOM），适合切换不频繁的场景。v-show 始终渲染，用 CSS display 切换，适合频繁显隐。列表用 v-for，务必提供稳定的 key。",
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
  <p v-else>已隐藏</p>

  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </ul>
</template>`,
      },
      {
        type: "demo",
        kind: "list",
        title: "动手：条件 + 列表",
        hint: "切换显示、添加/删除项，观察列表变化。key 用稳定 id，不要用 index 当唯一标识（在会重排时）。",
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
            explain: "稳定 key 让 diff 算法正确识别节点身份，避免错误复用状态。",
          },
          {
            id: "l2",
            question: "频繁切换显隐更适合？",
            options: ["v-if", "v-show", "v-html", "v-once"],
            answer: 1,
            explain: "v-show 避免反复销毁/创建 DOM，切换成本更低。",
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
        body: "用 @click 等绑定处理器。可以写内联表达式，也可以指向方法。修饰符如 .prevent、.stop、.once 覆盖常见 DOM 事件需求。",
      },
      {
        type: "code",
        title: "事件示例",
        lang: "vue",
        code: `<script setup>
import { ref } from 'vue'
const n = ref(0)
function add(delta: number) {
  n.value += delta
}
function onSubmit(e: Event) {
  // 或在模板用 @submit.prevent
  e.preventDefault()
}
</script>

<template>
  <button @click="add(1)">+1</button>
  <button @click="n++">内联 +1</button>
  <form @submit.prevent="onSubmit">
    <button type="submit">提交</button>
  </form>
</template>`,
      },
      {
        type: "demo",
        kind: "events",
        title: "动手：点击与修饰符",
        hint: "试试普通点击、+5，以及带 prevent 的提交（不会整页刷新）。",
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
            explain: ".prevent 对应 preventDefault；.stop 对应 stopPropagation；.once 只触发一次。",
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
        body: "v-model 是「值绑定 + 监听输入事件」的语法糖。在 input 上约等于 :value + @input。修饰符 .lazy（change 时更新）、.number、.trim 很实用。",
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
const color = ref('green')
</script>

<template>
  <input v-model.trim="name" placeholder="名字" />
  <input v-model.number="age" type="number" />
  <label><input type="checkbox" v-model="agree" /> 同意</label>
  <select v-model="color">
    <option value="green">绿</option>
    <option value="blue">蓝</option>
  </select>
</template>`,
      },
      {
        type: "demo",
        kind: "form",
        title: "动手：实时表单",
        hint: "改输入，预览区同步更新——这就是双向绑定。",
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
            explain: ".number 用 parseFloat 处理用户输入，便于数值计算。",
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
        body: "组件是可复用的 UI 单元。Vue 单文件组件（SFC）把 <script>、<template>、<style> 放在同一个 .vue 文件。父组件通过模板使用子组件标签。",
      },
      {
        type: "code",
        title: "父用子",
        lang: "vue",
        code: `<!-- CounterCard.vue -->
<script setup>
import { ref } from 'vue'
const n = ref(0)
</script>
<template>
  <button @click="n++">子组件计数 {{ n }}</button>
</template>

<!-- App.vue -->
<script setup>
import CounterCard from './CounterCard.vue'
</script>
<template>
  <h1>父级</h1>
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
        type: "tip",
        body: "组件名用多词 PascalCase（如 UserCard），避免与原生 HTML 标签冲突。",
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
        body: "父 → 子：用 props 传数据。子 → 父：用 emit 发事件，由父决定如何改自己的状态。子组件不应直接修改 prop（会破坏可预测性）。",
      },
      {
        type: "code",
        title: "defineProps / defineEmits",
        lang: "vue",
        code: `<!-- Child.vue -->
<script setup lang="ts">
const props = defineProps<{ title: string; count: number }>()
const emit = defineEmits<{
  (e: 'inc'): void
  (e: 'set', value: number): void
}>()
</script>
<template>
  <div>
    <h3>{{ title }} — {{ count }}</h3>
    <button @click="emit('inc')">+1</button>
  </div>
</template>

<!-- Parent -->
<Child :title="name" :count="n" @inc="n++" />`,
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
        body: "组件挂载后适合请求数据、绑定非 Vue 管理的监听；卸载前要清理定时器与监听，避免泄漏。组合式 API 用 onMounted、onUpdated、onUnmounted 等。",
      },
      {
        type: "code",
        title: "钩子示例",
        lang: "ts",
        code: `import { ref, onMounted, onUnmounted } from 'vue'

const now = ref(Date.now())
let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})`,
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
        body: "把有内聚的状态 + 方法抽到 useXxx() 函数里，在多个组件复用。命名约定 use 前缀，内部可自由使用 ref、computed、生命周期钩子。",
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
  function reset() { count.value = initial }
  return { count, doubled, inc, reset }
}

// 组件中
// const { count, doubled, inc } = useCounter(10)`,
      },
      {
        type: "code",
        title: "推荐目录习惯",
        lang: "text",
        code: `src/
  components/     # UI 组件
  composables/    # useXxx 逻辑复用
  views/          # 页面级组件
  stores/         # Pinia 全局状态（需要时）
  assets/`,
      },
      {
        type: "demo",
        kind: "counter",
        title: "复习：计数器 composable 思路",
        hint: "把 count / inc 想成 useCounter 的返回值——组件只负责展示。",
      },
      {
        type: "tip",
        body: "v2 进阶线继续学：Vue Router、Pinia、常见坑与综合挑战。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "co1",
            question: "composable 函数的常见命名？",
            options: ["getXxx", "useXxx", "makeXxx", "XxxService"],
            answer: 1,
            explain: "社区约定 use 前缀，类似 React hooks。",
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

  // ——— v2 进阶线 ———
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
        body: "单页应用靠前端路由切换「页面」而不整页刷新。Vue Router 把 URL 映射到组件，并提供编程式导航与守卫（登录拦截等）。",
      },
      {
        type: "code",
        title: "最小路由配置",
        lang: "ts",
        code: `import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Lesson from './views/Lesson.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/lesson/:slug', component: Lesson, props: true },
  ],
})

// main.ts
// app.use(router)`,
      },
      {
        type: "code",
        title: "模板中跳转",
        lang: "vue",
        code: `<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
function go() {
  router.push({ name: 'lesson', params: { slug: 'intro' } })
}
</script>

<template>
  <RouterLink to="/">首页</RouterLink>
  <p>当前 path: {{ route.path }}</p>
  <button @click="go">去 intro</button>
  <RouterView />
</template>`,
      },
      {
        type: "demo",
        kind: "router",
        title: "动手：迷你路由切换",
        hint: "点击导航切换「页面」，观察 URL 段与视图变化（模拟 Vue Router）。",
      },
      {
        type: "tip",
        body: "history 模式需要服务器把所有路径回退到 index.html；hash 模式（#/path）不需要服务器配置。",
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
            explain: "RouterLink 走客户端路由，支持 active class，体验更好。",
          },
          {
            id: "rt2",
            question: "读取当前路由参数常用？",
            options: ["useStore()", "useRoute()", "useAttrs()", "useCssModule()"],
            answer: 1,
            explain: "useRoute() 返回当前路由对象，含 params / query。",
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
        body: "组件本地状态用 ref 即可。当多个页面要共享用户信息、购物车、主题等，用 Pinia（Vue 官方推荐）集中管理，可配合持久化插件。",
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
  function clear() {
    items.value = []
  }
  return { items, count, add, clear }
})`,
      },
      {
        type: "demo",
        kind: "pinia",
        title: "动手：共享购物车 Store",
        hint: "两个面板共用同一份 store 状态——改一处，处处更新。",
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
        body: "1) 解构 reactive 丢响应式 → toRefs。2) 在脚本里忘写 ref 的 .value。3) v-for 用 index 当 key 且列表会重排。4) 在 computed 里写副作用。5) 过深的响应式大对象导致性能压力。",
      },
      {
        type: "code",
        title: "浅层与冻结",
        lang: "ts",
        code: `import { shallowRef, triggerRef, markRaw } from 'vue'

// 大体量大对象不想深度代理
const big = shallowRef({ list: [] as number[] })
big.value.list.push(1)
triggerRef(big) // 手动触发更新

// 永不需要响应式的对象（如第三方实例）
const chart = markRaw(new HeavyChart())`,
      },
      {
        type: "demo",
        kind: "challenge",
        title: "挑战：找出响应式问题",
        hint: "按提示修复「计数不更新」的代码逻辑，直到测试通过。",
      },
      {
        type: "tip",
        body: "性能口诀：能 computed 不 watch；列表虚拟化处理超长数据；按需拆组件减少无关渲染。",
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
            explain: "浅层 ref 适合大对象，内部变更需 triggerRef 或替换整个 .value。",
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
            explain: "computed 应纯计算；请求等副作用用 watch 或 onMounted。",
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
        body: "官方脚手架：npm create vue@latest。勾选 Router、Pinia、TS 按需。开发用 npm run dev，构建 npm run build，预览 npm run preview。",
      },
      {
        type: "code",
        title: "环境变量",
        lang: "text",
        code: `# .env.development
VITE_API_BASE=http://localhost:3000

# 代码中
// import.meta.env.VITE_API_BASE
# 只有 VITE_ 前缀会暴露给客户端`,
      },
      {
        type: "code",
        title: "上线前检查清单",
        lang: "text",
        code: `[ ] 路由 history 回退配置
[ ] 生产 API 地址与 CORS
[ ] 错误边界 / 空状态
[ ] 图片与字体体积
[ ] 无 console 敏感信息
[ ] Lighthouse 基础分可接受`,
      },
      {
        type: "demo",
        kind: "todo",
        title: "综合练习：任务清单小应用",
        hint: "用你已学的列表、表单、组件思路完成一个可用的 Todo。",
      },
      {
        type: "tip",
        body: "学完本课可去「练习场」做综合挑战，并在「学习中心」查看进度；全部完成后可领取结业证明。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pj1",
            question: "Vite 暴露给前端的环境变量前缀？",
            options: ["REACT_APP_", "VITE_", "NEXT_PUBLIC_", "PUBLIC_"],
            answer: 1,
            explain: "Vite 约定 VITE_ 前缀才会注入到 import.meta.env。",
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
];

export const TRACKS = ["基础", "进阶"] as const;

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
