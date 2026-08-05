import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getAllQuizQuestions } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/progress";
import { FlaskConical, Shuffle, Layers } from "lucide-react";

export const Route = createFileRoute("/lab")({
  component: LabPage,
});

type Mode = "quiz" | "flash";

function LabPage() {
  const all = useMemo(() => getAllQuizQuestions(), []);
  const [mode, setMode] = useState<Mode>("quiz");
  const [seed, setSeed] = useState(0);
  const pack = useMemo(() => {
    const arr = [...all];
    let s = seed + 1;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, mode === "flash" ? 8 : 5);
  }, [all, seed, mode]);

  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const checkInToday = useProgress((s) => s.checkInToday);
  const addWrong = useProgress((s) => s.addWrong);
  const unlockAchievement = useProgress((s) => s.unlockAchievement);

  const current = pack[idx];

  function resetRound(nextSeed?: number) {
    setSeed((s) => nextSeed ?? s + 1);
    setIdx(0);
    setChoice(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
    setFlipped(false);
    setKnown(0);
  }

  function switchMode(m: Mode) {
    setMode(m);
    resetRound();
  }

  function submit() {
    if (choice === null || !current) return;
    setRevealed(true);
    const ok = choice === current.answer;
    if (ok) setScore((s) => s + 1);
    else {
      addWrong({
        id: `lab:${current.id}:${Date.now()}`,
        lessonSlug: current.lessonSlug,
        question: current.question,
        options: current.options,
        answer: current.answer,
        explain: current.explain,
        wrongChoice: choice,
      });
    }
  }

  function next() {
    if (idx >= pack.length - 1) {
      const final = score;
      if (mode === "quiz" && final === pack.length) {
        unlockAchievement("lab-perfect");
      }
      setDone(true);
      checkInToday();
      return;
    }
    setIdx((i) => i + 1);
    setChoice(null);
    setRevealed(false);
  }

  function flashNext(knew: boolean) {
    if (knew) setKnown((k) => k + 1);
    if (idx >= pack.length - 1) {
      setDone(true);
      checkInToday();
      return;
    }
    setIdx((i) => i + 1);
    setFlipped(false);
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <FlaskConical className="h-3.5 w-3.5" />
          v5 · 练习场
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          综合练习
        </h1>
        <p className="mt-1 text-sm text-muted">
          选择题冲刺，或闪卡快速过概念
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => switchMode("quiz")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              mode === "quiz"
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted",
            )}
          >
            抽题挑战
          </button>
          <button
            type="button"
            onClick={() => switchMode("flash")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              mode === "flash"
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted",
            )}
          >
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3 w-3" />
              闪卡
            </span>
          </button>
        </div>
      </header>

      {done ? (
        <section className="rounded-xl border border-border bg-surface p-6 text-center">
          {mode === "quiz" ? (
            <>
              <p className="font-mono text-3xl font-semibold text-primary">
                {score}/{pack.length}
              </p>
              <p className="mt-2 text-sm text-muted">
                {score === pack.length
                  ? "全对，状态拉满"
                  : "错题已进入错题本，可去复习"}
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-3xl font-semibold text-primary">
                {known}/{pack.length}
              </p>
              <p className="mt-2 text-sm text-muted">标记为「已会」的卡片数</p>
            </>
          )}
          <Button className="mt-5" onClick={() => resetRound()}>
            <Shuffle className="h-4 w-4" />
            再来一组
          </Button>
        </section>
      ) : mode === "flash" && current ? (
        <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
          <div className="mb-3 flex justify-between text-xs text-muted">
            <span>
              卡 {idx + 1} / {pack.length}
            </span>
            <span className="text-primary">{current.lessonTitle}</span>
          </div>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="min-h-[10rem] w-full rounded-xl border border-border bg-surface-2 px-4 py-8 text-left transition-colors hover:border-border-strong"
          >
            {!flipped ? (
              <p className="text-base font-medium text-fg">{current.question}</p>
            ) : (
              <div>
                <p className="text-sm font-medium text-primary">
                  {current.options[current.answer]}
                </p>
                <p className="mt-2 text-sm text-muted">{current.explain}</p>
              </div>
            )}
            <p className="mt-6 text-center text-[10px] text-subtle">
              点击翻转
            </p>
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={!flipped}
              onClick={() => flashNext(false)}
            >
              还要练
            </Button>
            <Button disabled={!flipped} onClick={() => flashNext(true)}>
              已会
            </Button>
          </div>
        </section>
      ) : current ? (
        <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between text-xs text-muted">
            <span>
              第 {idx + 1} / {pack.length} 题
            </span>
            <span className="text-primary">{current.lessonTitle}</span>
          </div>
          <p className="text-base font-medium text-fg">{current.question}</p>
          <div className="mt-4 grid gap-2">
            {current.options.map((opt, oi) => {
              let cls =
                "border-border bg-surface-2 hover:border-border-strong";
              if (revealed) {
                if (oi === current.answer)
                  cls = "border-primary/50 bg-primary-soft";
                else if (oi === choice) cls = "border-danger/40 bg-danger/10";
                else cls = "border-border bg-surface-2 opacity-70";
              } else if (choice === oi) {
                cls = "border-primary bg-primary-soft";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={revealed}
                  onClick={() => setChoice(oi)}
                  className={cn(
                    "rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                    cls,
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {revealed ? (
            <p className="mt-3 text-sm text-muted">{current.explain}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {!revealed ? (
              <Button onClick={submit} disabled={choice === null}>
                提交答案
              </Button>
            ) : (
              <Button onClick={next}>
                {idx >= pack.length - 1 ? "查看结果" : "下一题"}
              </Button>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
