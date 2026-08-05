import { createFileRoute, Link } from "@tanstack/react-router";
import { TRACKS, getLessonsByTrack, LESSONS } from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Check, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapPage,
});

function RoadmapPage() {
  const completed = useProgress((s) => s.completed);
  const next =
    LESSONS.find((l) => !completed.includes(l.slug)) ?? LESSONS[LESSONS.length - 1];
  const pct = Math.round((completed.length / LESSONS.length) * 100);

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <MapIcon className="h-3.5 w-3.5" />
          v4 · 路线图
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          学习路线
        </h1>
        <p className="mt-2 text-sm text-muted">
          按路径推进。总进度 {completed.length}/{LESSONS.length}（{pct}%）
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
        {next ? (
          <Link
            to="/lesson/$slug"
            params={{ slug: next.slug }}
            className="mt-4 inline-flex no-underline"
          >
            <Button>
              继续：{next.title}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : null}
      </header>

      <ol className="space-y-6">
        {TRACKS.map((track, ti) => {
          const list = getLessonsByTrack(track);
          const done = list.filter((l) => completed.includes(l.slug)).length;
          const trackPct = list.length
            ? Math.round((done / list.length) * 100)
            : 0;
          return (
            <li key={track} className="relative">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] text-subtle">
                    阶段 {ti + 1}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-fg">
                    {track}
                  </h2>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {done}/{list.length} · {trackPct}%
                </span>
              </div>
              <ul className="space-y-1.5 border-l-2 border-border pl-4">
                {list.map((lesson) => {
                  const ok = completed.includes(lesson.slug);
                  const isNext = lesson.slug === next?.slug;
                  return (
                    <li key={lesson.slug}>
                      <Link
                        to="/lesson/$slug"
                        params={{ slug: lesson.slug }}
                        className={cn(
                          "flex items-start gap-2 rounded-lg border px-3 py-2.5 no-underline transition-colors",
                          ok
                            ? "border-primary/25 bg-primary-soft/40"
                            : isNext
                              ? "border-primary/50 bg-surface"
                              : "border-border bg-surface hover:bg-surface-2",
                        )}
                      >
                        <span className="mt-0.5 shrink-0 text-primary">
                          {ok ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4 text-subtle" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-fg">
                            {lesson.title}
                            {isNext ? (
                              <span className="ml-2 text-[10px] font-normal text-primary">
                                下一步
                              </span>
                            ) : null}
                          </span>
                          <span className="text-xs text-muted">
                            {lesson.summary} · {lesson.minutes} 分
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
