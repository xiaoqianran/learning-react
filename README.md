# learning-react

交互式中文 **React** 教程（TanStack Start + Vite）。

- 对齐 [react.dev/llms.txt](https://react.dev/llms.txt)（官方有！）
- 本站：[`/llms.txt`](https://xiaoqianran.github.io/learning-react/llms.txt) · [`/llms-full.txt`](https://xiaoqianran.github.io/learning-react/llms-full.txt)
- UI：Catppuccin + 学/查/练/我 导航（与 learning-vue3 同构）
- 讲解与 Demo 源码一一对应（代码即组件）
- 部署：GitHub Actions → GitHub Pages

# React 实战学习

**在线：** https://xiaoqianran.github.io/learning-react/  
**仓库：** https://github.com/xiaoqianran/learning-react

## 分支 / 标签

| 分支 | 标签 | 说明 |
|------|------|------|
| v1 | v1.0.0 | 首发 |
| v2 | v2.0.0 | 进阶模式 + 成就 + 主题 |
| v3 | v3.0.0 | 现代 React + 命令面板 |
| v4 | v4.0.0 | 数据层 + 路线图 + 闪卡 |
| **v5** | **v5.0.0** | Query 工坊 + 打卡日历（当前） |
| main | 最新 | 同步当前线 |

## v5 亮点

- 全栈工坊用 **TanStack Query**（useQuery / useMutation / invalidate）
- 学习中心 **14 天打卡日历**
- **快捷键** 页 `/shortcuts`
- 新课：工坊×Query 对照、useDeferredValue

工坊：`demo@react.dev` / `password123`

```bash
npm install && npm run dev
```

## 代码 ↔ 组件对照

- 每节课：**讲解 → 对应源码 → 交互 Demo → 测验**
- Demo 卡片内嵌 **A 运行结果 / B 对应源码**，同一套逻辑，便于看出「什么代码产出什么组件」
- 源码定义集中在 `src/data/demo-sources.ts`，与 `InteractiveDemos` 按 `DemoKind` 绑定

