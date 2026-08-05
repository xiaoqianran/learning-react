import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  getAdjacent,
  getLesson,
  getLessonIndex,
  LESSONS,
} from "@/data/lessons";
import { CodeBlock } from "@/components/CodeBlock";
import { InteractiveDemo } from "@/components/demos/InteractiveDemos";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/store/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Lightbulb,
} from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/lesson/$slug")({
  component: LessonPage,
});

function LessonPage() {
  const { slug } = Route.useParams();
  const lesson = getLesson(slug);
  if (!lesson) {
    throw notFound();
  }

  const idx = getLessonIndex(slug);
  const { prev, next } = getAdjacent(slug);
  const completed = useProgress((s) => s.completed);
  const markComplete = useProgress((s) => s.markComplete);
  const done = completed.includes(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <article className="mx-auto max-w-3xl pb-20">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link to="/" className="text-muted no-underline hover:text-fg">
          课程首页
        </Link>
        <span className="text-subtle">/</span>
        <span className="text-fg">
          第 {idx + 1}/{LESSONS.length} 节
        </span>
      </div>

      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary">
            {lesson.level}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" />
            约 {lesson.minutes} 分钟
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
              <Check className="h-3 w-3" />
              已完成
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-base text-muted">{lesson.summary}</p>
      </header>

      <div className="mt-8 space-y-8">
        {lesson.blocks.map((block, i) => {
          if (block.type === "text") {
            return (
              <section key={i}>
                {block.title ? (
                  <h2 className="mb-2 font-display text-lg font-semibold text-fg">
                    {block.title}
                  </h2>
                ) : null}
                <p className="text-[15px] leading-relaxed text-muted whitespace-pre-line">
                  {block.body}
                </p>
              </section>
            );
          }
          if (block.type === "code") {
            return (
              <CodeBlock
                key={i}
                code={block.code}
                title={block.title}
                lang={block.lang}
              />
            );
          }
          if (block.type === "tip") {
            return (
              <aside
                key={i}
                className="flex gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted">{block.body}</p>
              </aside>
            );
          }
          if (block.type === "demo") {
            return (
              <InteractiveDemo
                key={i}
                kind={block.kind}
                title={block.title}
                hint={block.hint}
              />
            );
          }
          if (block.type === "quiz") {
            return <Quiz key={i} slug={slug} questions={block.questions} />;
          }
          return null;
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {!done ? (
          <Button variant="secondary" onClick={() => markComplete(slug)}>
            <Check className="h-4 w-4" />
            标记本节完成
          </Button>
        ) : null}
      </div>

      <nav className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/lesson/$slug"
            params={{ slug: prev.slug }}
            className="no-underline"
          >
            <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-2">
              <p className="inline-flex items-center gap-1 text-xs text-muted">
                <ArrowLeft className="h-3.5 w-3.5" />
                上一节
              </p>
              <p className="mt-1 font-medium text-fg">{prev.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to="/lesson/$slug"
            params={{ slug: next.slug }}
            className="no-underline sm:text-right"
          >
            <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-2">
              <p className="inline-flex items-center gap-1 text-xs text-muted sm:justify-end">
                下一节
                <ArrowRight className="h-3.5 w-3.5" />
              </p>
              <p className="mt-1 font-medium text-fg">{next.title}</p>
            </div>
          </Link>
        ) : (
          <Link to="/" className="no-underline sm:text-right">
            <div className="rounded-xl border border-primary/30 bg-primary-soft p-4">
              <p className="text-xs text-primary">全部学完了</p>
              <p className="mt-1 font-medium text-fg">返回课程首页</p>
            </div>
          </Link>
        )}
      </nav>
    </article>
  );
}
