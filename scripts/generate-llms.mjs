import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public");
const bundle = path.join(root, "node_modules/.cache/lessons-llms.mjs");
fs.mkdirSync(path.dirname(bundle), { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

execSync(
  `npx esbuild ${path.join(root, "src/data/lessons.ts")} --bundle --format=esm --platform=node --outfile=${bundle}`,
  { stdio: "inherit", cwd: root },
);

const { LESSONS } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`);
const SITE = "https://xiaoqianran.github.io/learning-react";

function blockMd(b) {
  if (b.type === "text") {
    const head = b.title ? `### ${b.title}\n\n` : "";
    return `${head}${b.body || ""}\n`;
  }
  if (b.type === "tip") return `> **提示：** ${b.body || ""}\n`;
  if (b.type === "code") {
    const head = b.title ? `### ${b.title}\n\n` : "";
    return `${head}\`\`\`${b.lang || "tsx"}\n${b.code || ""}\n\`\`\`\n`;
  }
  if (b.type === "demo") {
    return `**交互 Demo：** ${b.title || ""}（kind: \`${b.kind}\`）\n`;
  }
  if (b.type === "quiz") {
    const lines = ["**测验：**"];
    for (const q of b.questions || []) {
      lines.push(`- Q: ${q.question}`);
      (q.options || []).forEach((o, i) => {
        lines.push(`  - [${i === q.answer ? "✓" : " "}] ${o}`);
      });
      lines.push(`  - 解析: ${q.explain}`);
    }
    return lines.join("\n") + "\n";
  }
  return "";
}

const byTrack = new Map();
for (const l of LESSONS) {
  const t = l.track || "其他";
  if (!byTrack.has(t)) byTrack.set(t, []);
  byTrack.get(t).push(l);
}
const order = ["基础", "进阶", "现代 React", "数据层", "全栈准备", "全栈实训", "工程化", "进阶模式"];
const tracks = [
  ...order.filter((t) => byTrack.has(t)),
  ...[...byTrack.keys()].filter((t) => !order.includes(t)),
];

const index = [
  "# learning-react",
  "",
  "> 交互式中文 React 教程：讲解 + 源码 + Demo（代码即组件）+ 测验 + Playground + 全栈工坊。",
  "> 权威以 [react.dev/llms.txt](https://react.dev/llms.txt) 为准。",
  "",
  `完整上下文（全文）：[${SITE}/llms-full.txt](${SITE}/llms-full.txt)`,
  "",
  "## 官方权威（务必优先）",
  "",
  "- [react.dev/llms.txt](https://react.dev/llms.txt)",
  "- [zh-hans.react.dev/llms.txt](https://zh-hans.react.dev/llms.txt)",
  "- [React Learn](https://react.dev/learn)",
  "- [React API Reference](https://react.dev/reference/react)",
  "",
  "## 站点入口",
  "",
  `- [首页大纲](${SITE}/)`,
  `- [文档地图](${SITE}/docs)`,
  `- [Playground](${SITE}/playground)`,
  `- [全栈工坊](${SITE}/studio)`,
  `- [路线图](${SITE}/roadmap)`,
  `- [速查表](${SITE}/cheatsheet)`,
  `- [学习中心](${SITE}/hub)`,
  `- [结业证明](${SITE}/certificate)`,
  "",
];

for (const tr of tracks) {
  index.push(`## 课程 · ${tr}`, "");
  for (const l of byTrack.get(tr)) {
    index.push(
      `- [${l.title}](${SITE}/lesson/${l.slug}): ${l.summary}（${l.level} · ${l.minutes} 分钟）`,
    );
  }
  index.push("");
}

const full = [
  "# learning-react — full curriculum",
  "",
  `生成自本站 ${LESSONS.length} 课。语义以 react.dev 为准。`,
  "",
];

for (const l of LESSONS) {
  full.push(
    `---`,
    "",
    `# ${l.title}`,
    "",
    `- slug: \`${l.slug}\``,
    `- track: ${l.track}`,
    `- level: ${l.level}`,
    `- minutes: ${l.minutes}`,
    "",
  );
  for (const b of l.blocks || []) full.push(blockMd(b), "");
}

fs.writeFileSync(path.join(outDir, "llms.txt"), index.join("\n"));
fs.writeFileSync(path.join(outDir, "llms-full.txt"), full.join("\n"));
console.log("lessons", LESSONS.length);
console.log("llms.txt", fs.statSync(path.join(outDir, "llms.txt")).size);
console.log("llms-full.txt", fs.statSync(path.join(outDir, "llms-full.txt")).size);
