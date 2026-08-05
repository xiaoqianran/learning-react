import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS, TRACKS, getLessonsByTrack } from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import { Award, Lock } from "lucide-react";

export const Route = createFileRoute("/certificate")({
  component: CertificatePage,
});

function CertificatePage() {
  const completed = useProgress((s) => s.completed);
  const quizScores = useProgress((s) => s.quizScores);
  const streak = useProgress((s) => s.streak);
  const unlocked = completed.length >= LESSONS.length;
  const avg =
    Object.keys(quizScores).length === 0
      ? 0
      : Math.round(
          Object.values(quizScores).reduce((a, b) => a + b, 0) /
            Object.keys(quizScores).length,
        );
  const date = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          结业
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          学习证明
        </h1>
        <p className="mt-1 text-sm text-muted">
          完成全部 {LESSONS.length} 节课程后解锁
        </p>
      </header>

      <section className="mb-4 rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-medium text-fg">各路径进度</h2>
        <ul className="mt-3 space-y-2">
          {TRACKS.map((t) => {
            const list = getLessonsByTrack(t);
            const done = list.filter((l) => completed.includes(l.slug)).length;
            const pct = list.length
              ? Math.round((done / list.length) * 100)
              : 0;
            return (
              <li key={t}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">{t}</span>
                  <span className="font-mono text-subtle">
                    {done}/{list.length}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {!unlocked ? (
        <section className="rounded-xl border border-border bg-surface p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-4 text-sm text-muted">
            进度 {completed.length}/{LESSONS.length}
          </p>
          <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.round((completed.length / LESSONS.length) * 100)}%`,
              }}
            />
          </div>
          <Link to="/" className="mt-6 inline-block no-underline">
            <Button>返回课程</Button>
          </Link>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-xl border border-primary/30 bg-surface p-8 text-center shadow-soft">
          <div className="relative">
            <Award className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Certificate of Completion
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-fg">
              React 实战学习 · v3
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              兹证明持有人已完成本站全部课程：Hooks、组件、路由、状态、全栈准备与工程化实践。
            </p>
            <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-xs text-muted">课程数</dt>
                <dd className="font-mono text-primary">{LESSONS.length}</dd>
              </div>
              <div className="rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-xs text-muted">平均测验</dt>
                <dd className="font-mono text-primary">{avg}%</dd>
              </div>
              <div className="rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-xs text-muted">连续打卡</dt>
                <dd className="font-mono text-primary">{streak} 天</dd>
              </div>
              <div className="rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-xs text-muted">日期</dt>
                <dd className="text-xs text-fg">{date}</dd>
              </div>
            </dl>
            <p className="mt-6 font-mono text-[10px] text-subtle">
              learning-react v3 · local achievement · not an official certificate
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
