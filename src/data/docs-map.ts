/** 文档地图：react.dev ⇄ 本站课 */
export type DocItem = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  id: string;
  title: string;
  items: DocItem[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "learn",
    title: "React Learn",
    items: [
      { title: "Quick Start", official: "https://react.dev/learn", lessonSlug: "intro" },
      { title: "Thinking in React", official: "https://react.dev/learn/thinking-in-react", lessonSlug: "intro" },
      { title: "Your First Component", official: "https://react.dev/learn/your-first-component", lessonSlug: "components-props" },
      { title: "JSX", official: "https://react.dev/learn/writing-markup-with-jsx", lessonSlug: "jsx" },
      { title: "Props", official: "https://react.dev/learn/passing-props-to-a-component", lessonSlug: "components-props" },
      { title: "Conditional Rendering", official: "https://react.dev/learn/conditional-rendering", lessonSlug: "jsx" },
      { title: "Lists", official: "https://react.dev/learn/rendering-lists", lessonSlug: "lists-keys" },
      { title: "State", official: "https://react.dev/learn/state-a-components-memory", lessonSlug: "state" },
      { title: "Responding to Events", official: "https://react.dev/learn/responding-to-events", lessonSlug: "state" },
      { title: "Effects", official: "https://react.dev/learn/synchronizing-with-effects", lessonSlug: "effects" },
      { title: "You Might Not Need an Effect", official: "https://react.dev/learn/you-might-not-need-an-effect", lessonSlug: "effects" },
      { title: "Custom Hooks", official: "https://react.dev/learn/reusing-logic-with-custom-hooks", lessonSlug: "hooks-custom" },
      { title: "Refs", official: "https://react.dev/learn/referencing-values-with-refs", lessonSlug: "use-ref" },
    ],
  },
  {
    id: "api",
    title: "React API",
    items: [
      { title: "useState", official: "https://react.dev/reference/react/useState", lessonSlug: "state" },
      { title: "useEffect", official: "https://react.dev/reference/react/useEffect", lessonSlug: "effects" },
      { title: "useContext", official: "https://react.dev/reference/react/useContext", lessonSlug: "context" },
      { title: "useReducer", official: "https://react.dev/reference/react/useReducer", lessonSlug: "use-reducer" },
      { title: "useMemo / memo", official: "https://react.dev/reference/react/useMemo", lessonSlug: "memo" },
      { title: "useTransition", official: "https://react.dev/reference/react/useTransition", lessonSlug: "use-transition" },
      { title: "Suspense", official: "https://react.dev/reference/react/Suspense", lessonSlug: "suspense" },
      { title: "createPortal", official: "https://react.dev/reference/react-dom/createPortal", lessonSlug: "portal" },
    ],
  },
  {
    id: "data",
    title: "Data & Ecosystem",
    items: [
      { title: "TanStack Query", official: "https://tanstack.com/query/latest", lessonSlug: "tanstack-query" },
      { title: "React Hook Form", official: "https://react-hook-form.com/", lessonSlug: "rhf-forms" },
      { title: "Zustand", official: "https://zustand-demo.pmnd.rs/", lessonSlug: "zustand" },
    ],
  },
  {
    id: "llms",
    title: "官方 LLM 索引（有！）",
    items: [
      { title: "react.dev/llms.txt", official: "https://react.dev/llms.txt", note: "总索引" },
      { title: "zh-hans.react.dev/llms.txt", official: "https://zh-hans.react.dev/llms.txt", note: "中文索引" },
    ],
  },
];

export function docsCoverage() {
  const items = DOC_SECTIONS.flatMap((s) => s.items);
  const linked = items.filter((i) => i.lessonSlug).length;
  return { total: items.length, linked, pct: Math.round((linked / items.length) * 100) };
}
