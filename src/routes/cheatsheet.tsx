import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "响应式",
    items: [
      { k: "ref(x)", v: "基本类型 / 需要 .value；模板自动解包" },
      { k: "reactive(obj)", v: "对象代理；勿直接解构" },
      { k: "toRefs / toRef", v: "解构时保持响应式" },
      { k: "computed", v: "派生只读（可写需 get/set）；有缓存" },
      { k: "watch / watchEffect", v: "副作用；注意清理" },
      { k: "shallowRef", v: "大对象整表替换时用" },
    ],
  },
  {
    title: "模板与指令",
    items: [
      { k: "{{ }}", v: "文本插值" },
      { k: ":attr / v-bind", v: "绑定属性" },
      { k: "@event / v-on", v: "事件；.prevent .stop .once" },
      { k: "v-if / v-show", v: "条件渲染 vs CSS 显隐" },
      { k: "v-for + :key", v: "稳定业务 id 优先" },
      { k: "v-model", v: "值 + 事件语法糖；.lazy .number .trim" },
    ],
  },
  {
    title: "组件",
    items: [
      { k: "props ↓", v: "父→子数据" },
      { k: "emits ↑", v: "子→父事件" },
      { k: "slots", v: "默认 / 具名 #x / 作用域" },
      { k: "provide/inject", v: "树内上下文；全局业务用 Pinia" },
      { k: "Teleport", v: "弹层挂 body" },
      { k: "KeepAlive", v: "缓存动态组件；onActivated" },
    ],
  },
  {
    title: "路由与状态",
    items: [
      { k: "createRouter", v: "history + routes" },
      { k: "useRoute / useRouter", v: "读参 / 跳转" },
      { k: "beforeEach", v: "守卫；不能替代服务端鉴权" },
      { k: "defineStore", v: "Pinia setup 风格" },
      { k: "meta.requiresAuth", v: "配合登录 redirect" },
    ],
  },
  {
    title: "请求与全栈",
    items: [
      { k: "loading/error/data", v: "三态必备" },
      { k: "AbortController", v: "取消竞态" },
      { k: "401", v: "清 token → 登录" },
      { k: "REST", v: "GET/POST/PUT/DELETE + 状态码" },
      { k: "Nuxt server/api", v: "文件路由 API" },
      { k: "VITE_", v: "仅此前缀暴露给前端" },
    ],
  },
  {
    title: "工程",
    items: [
      { k: "script setup lang=ts", v: "默认写法" },
      { k: "api client", v: "统一 baseURL / token / 错误" },
      { k: "Vitest", v: "逻辑与组件单测" },
      { k: "E2E", v: "登录→CRUD 主路径" },
      { k: "SPA fallback", v: "history 刷新需服务器配置" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          v7 · 速查
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          Vue 3 速查表
        </h1>
        <p className="mt-2 text-sm text-muted">
          面试前 / 写代码时快速扫一眼。详细讲解见对应课程；实战见{" "}
          <Link to="/studio" className="text-primary no-underline hover:underline">
            全栈工坊
          </Link>
          。
        </p>
      </header>

      <div className="grid gap-4">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 font-display text-sm font-semibold text-fg">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li
                  key={it.k}
                  className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-3"
                >
                  <code className="font-mono text-xs text-primary">{it.k}</code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-subtle">
        建议学习路径：基础 → 进阶 → 全栈准备 → 工坊闯关 → 工程化 → 进阶模式
      </p>
    </div>
  );
}
