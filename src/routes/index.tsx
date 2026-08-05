import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const completed = useProgress((s) => s.completed);
  const quizScores = useProgress((s) => s.quizScores);
  const reset = useProgress((s) => s.reset);
  const progress = Math.round((completed.length / LESSONS.length) * 100);
  const firstIncomplete =
    LESSONS.find((l) => !completed.includes(l.slug)) ?? LESSONS[0];

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <section className="relative overflow-hidden rounded-xl border border-border bg-surface px-5 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px 200px at 10% -10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/60 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            交互式教程 · 中文
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
            带你系统学 Vue 3
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            从响应式原理到组件通信，每节都有讲解、可操作 Demo 和小测验。
            进度会保存在本机，随时继续。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/lesson/$slug"
              params={{ slug: firstIncomplete.slug }}
              className="no-underline"
            >
              <Button size="lg">
                {completed.length > 0 ? "继续学习" : "开始第一节"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted">
              <BookOpen className="h-4 w-4" />
              {LESSONS.length} 节 · 约{" "}
              {LESSONS.reduce((a, l) => a + l.minutes, 0)} 分钟
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-surface-3 sm:max-w-xs">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums text-muted">
              已完成 {completed.length}/{LESSONS.length}
            </span>
            {completed.length > 0 ? (
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-1 text-xs text-subtle hover:text-muted"
              >
                <RotateCcw className="h-3 w-3" />
                重置进度
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-fg">课程大纲</h2>
        <p className="mt-1 text-sm text-muted">按顺序学效果最好，也可跳着看。</p>
        <ol className="mt-4 flex flex-col gap-2">
          {LESSONS.map((lesson, i) => {
            const done = completed.includes(lesson.slug);
            const score = quizScores[lesson.slug];
            return (
              <li key={lesson.slug}>
                <Link
                  to="/lesson/$slug"
                  params={{ slug: lesson.slug }}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 no-underline transition-colors duration-150 hover:border-border-strong hover:bg-surface-2 sm:items-center",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-sm font-medium",
                      done
                        ? "bg-primary text-primary-fg"
                        : "bg-surface-3 text-muted",
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-fg group-hover:text-primary">
                        {lesson.title}
                      </h3>
                      <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                        {lesson.level}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{lesson.summary}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.minutes} 分
                    </span>
                    {score !== undefined ? (
                      <span className="font-mono text-primary">
                        测验 {score}%
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-surface-2 px-5 py-5">
        <h2 className="font-display text-base font-semibold">怎么学最有效</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>先读概念，再在 Demo 里动手改数据，观察视图如何更新。</li>
          <li>对照代码块理解 Vue 写法；测验全对会自动标记完成。</li>
          <li>
            学完后建议用 Vite 创建真实项目：
            <code className="mx-1 rounded-sm bg-bg px-1.5 py-0.5 font-mono text-xs text-primary">
              npm create vue@latest
            </code>
          </li>
        </ul>
      </section>
    </div>
  );
}
