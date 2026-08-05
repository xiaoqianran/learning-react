export type SfcPreset = {
  id: string;
  title: string;
  summary: string;
  /** main file name, usually App.vue */
  mainFile: string;
  files: Record<string, string>;
};

export const SFC_PRESETS: SfcPreset[] = [
  {
    id: "counter",
    title: "计数器",
    summary: "ref + 事件，最经典的第一课",
    mainFile: "App.vue",
    files: {
      "App.vue": `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="wrap">
    <h1>Vue 3 SFC</h1>
    <p>你点了 <strong>{{ count }}</strong> 次</p>
    <button @click="count++">count++</button>
    <button class="ghost" @click="count = 0">重置</button>
  </div>
</template>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  padding: 1.25rem;
  color: #e8ebe9;
}
h1 { font-size: 1.25rem; margin: 0 0 0.75rem; }
p { color: #8b958e; }
strong { color: #42b883; font-variant-numeric: tabular-nums; }
button {
  margin-right: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #42b883;
  color: #062016;
  font-weight: 600;
  cursor: pointer;
}
button.ghost {
  background: transparent;
  border: 1px solid #3a4540;
  color: #e8ebe9;
}
</style>
`,
    },
  },
  {
    id: "computed",
    title: "计算属性",
    summary: "computed 派生全名",
    mainFile: "App.vue",
    files: {
      "App.vue": `<script setup>
import { ref, computed } from 'vue'

const first = ref('Ada')
const last = ref('Lovelace')
const full = computed(() => \`\${first.value} \${last.value}\`)
</script>

<template>
  <div class="wrap">
    <label>名 <input v-model="first" /></label>
    <label>姓 <input v-model="last" /></label>
    <p class="full">{{ full }}</p>
  </div>
</template>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  padding: 1.25rem;
  color: #e8ebe9;
  display: grid;
  gap: 0.75rem;
  max-width: 20rem;
}
label { display: grid; gap: 0.25rem; font-size: 0.85rem; color: #8b958e; }
input {
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #3a4540;
  background: #0e1210;
  color: #e8ebe9;
}
.full {
  font-size: 1.5rem;
  font-weight: 600;
  color: #42b883;
  margin: 0.5rem 0 0;
}
</style>
`,
    },
  },
  {
    id: "todo",
    title: "Todo 列表",
    summary: "v-model + v-for + 条件 class",
    mainFile: "App.vue",
    files: {
      "App.vue": `<script setup>
import { ref } from 'vue'

const draft = ref('')
const items = ref([
  { id: 1, text: '学 ref', done: true },
  { id: 2, text: '写一个 SFC', done: false },
])
let nextId = 3

function add() {
  const t = draft.value.trim()
  if (!t) return
  items.value.push({ id: nextId++, text: t, done: false })
  draft.value = ''
}

function remove(id) {
  items.value = items.value.filter((x) => x.id !== id)
}
</script>

<template>
  <div class="wrap">
    <h1>Todo</h1>
    <form @submit.prevent="add" class="row">
      <input v-model="draft" placeholder="新任务…" />
      <button type="submit">添加</button>
    </form>
    <ul>
      <li v-for="item in items" :key="item.id">
        <label>
          <input type="checkbox" v-model="item.done" />
          <span :class="{ done: item.done }">{{ item.text }}</span>
        </label>
        <button class="ghost" type="button" @click="remove(item.id)">删</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  padding: 1.25rem;
  color: #e8ebe9;
  max-width: 24rem;
}
h1 { font-size: 1.15rem; margin: 0 0 0.75rem; }
.row { display: flex; gap: 0.5rem; }
input[type="text"], .row input {
  flex: 1;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #3a4540;
  background: #0e1210;
  color: #e8ebe9;
}
button {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: none;
  background: #42b883;
  color: #062016;
  font-weight: 600;
  cursor: pointer;
}
button.ghost {
  background: transparent;
  border: 1px solid #3a4540;
  color: #8b958e;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
ul { list-style: none; padding: 0; margin: 1rem 0 0; }
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a322d;
}
label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
.done { text-decoration: line-through; color: #5c6660; }
</style>
`,
    },
  },
  {
    id: "components",
    title: "父子组件",
    summary: "多文件 SFC：props + emit",
    mainFile: "App.vue",
    files: {
      "App.vue": `<script setup>
import { ref } from 'vue'
import CounterCard from './CounterCard.vue'

const title = ref('父组件状态')
const total = ref(0)

function onInc(n) {
  total.value += n
}
</script>

<template>
  <div class="wrap">
    <h1>{{ title }}</h1>
    <p>子组件累计通知：<strong>{{ total }}</strong></p>
    <div class="grid">
      <CounterCard label="A" @inc="onInc" />
      <CounterCard label="B" @inc="onInc" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  padding: 1.25rem;
  color: #e8ebe9;
}
h1 { font-size: 1.15rem; margin: 0 0 0.5rem; }
p { color: #8b958e; }
strong { color: #42b883; }
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
`,
      "CounterCard.vue": `<script setup>
import { ref } from 'vue'

defineProps({
  label: { type: String, default: 'Card' },
})
const emit = defineEmits(['inc'])
const n = ref(0)

function bump() {
  n.value++
  emit('inc', 1)
}
</script>

<template>
  <div class="card">
    <p class="label">{{ label }}</p>
    <p class="n">{{ n }}</p>
    <button @click="bump">+1 并通知父级</button>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #3a4540;
  border-radius: 12px;
  padding: 0.85rem;
  background: #121614;
}
.label { margin: 0; font-size: 0.75rem; color: #8b958e; }
.n {
  margin: 0.35rem 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #42b883;
  font-variant-numeric: tabular-nums;
}
button {
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  border: none;
  background: #42b883;
  color: #062016;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>
`,
    },
  },
  {
    id: "watch",
    title: "watch 侦听",
    summary: "watch 记录变化日志",
    mainFile: "App.vue",
    files: {
      "App.vue": `<script setup>
import { ref, watch } from 'vue'

const msg = ref('hello')
const logs = ref([])

watch(msg, (now, prev) => {
  logs.value = [\`\${prev} → \${now}\`, ...logs.value].slice(0, 6)
})
</script>

<template>
  <div class="wrap">
    <input v-model="msg" />
    <ul>
      <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
    </ul>
    <p v-if="!logs.length" class="hint">修改输入，观察 watch 日志</p>
  </div>
</template>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  padding: 1.25rem;
  color: #e8ebe9;
}
input {
  width: 100%;
  max-width: 20rem;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #3a4540;
  background: #0e1210;
  color: #e8ebe9;
  box-sizing: border-box;
}
ul {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  color: #8b958e;
}
li { padding: 0.25rem 0; border-bottom: 1px solid #2a322d; }
.hint { color: #5c6660; font-size: 0.85rem; }
</style>
`,
    },
  },
];

export function getPreset(id: string): SfcPreset {
  return SFC_PRESETS.find((p) => p.id === id) ?? SFC_PRESETS[0];
}
