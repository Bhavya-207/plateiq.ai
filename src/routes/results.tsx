import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Leaf,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Sprout,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import heroPlate from "@/assets/hero-plate.jpg";
import { Reveal } from "@/components/Reveal";
import { analyzeMeal, type MealAnalysis } from "@/lib/analyze-meal.functions";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Meal Analysis — PlateIQ" },
      {
        name: "description",
        content:
          "AI-powered nutrition report for your meal: calories, macros, health score, and personalised guidance from PlateIQ.",
      },
      { property: "og:title", content: "Your Meal Analysis — PlateIQ" },
      {
        property: "og:description",
        content:
          "Calories, macros, health score and Mom's Wisdom for your latest meal.",
      },
    ],
  }),
  component: ResultsPage,
});

type NutRow = {
  key: string;
  value: string;
  unit: string;
  emoji: string;
  Icon: typeof Flame;
  tone: "primary" | "accent";
};

function buildRows(a: MealAnalysis): NutRow[] {
  const fmt = (n: number) =>
    Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
  return [
    { key: "Calories", value: fmt(a.calories), unit: "kcal", emoji: "🔥", Icon: Flame, tone: "primary" },
    { key: "Protein", value: fmt(a.protein), unit: "g", emoji: "💪", Icon: Dumbbell, tone: "accent" },
    { key: "Carbs", value: fmt(a.carbs), unit: "g", emoji: "🥖", Icon: Wheat, tone: "primary" },
    { key: "Fat", value: fmt(a.fat), unit: "g", emoji: "🥑", Icon: Droplet, tone: "accent" },
    { key: "Fiber", value: fmt(a.fiber), unit: "g", emoji: "🌾", Icon: Sprout, tone: "primary" },
  ];
}

function ResultsPage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeMeal);

  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Load image + cached result from sessionStorage and run analysis if needed.
  useEffect(() => {
    const img = sessionStorage.getItem("plateiq:image");
    if (!img) {
      navigate({ to: "/upload" });
      return;
    }
    setImage(img);

    const cached = sessionStorage.getItem("plateiq:result");
    if (cached) {
      try {
        setResult(JSON.parse(cached) as MealAnalysis);
        setLoading(false);
        return;
      } catch {
        // fall through to re-analyze
      }
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await analyze({ data: { imageDataUrl: img } });
        if (cancelled) return;
        sessionStorage.setItem("plateiq:result", JSON.stringify(data));
        setResult(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not analyse this meal.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [analyze, navigate]);

  // Animate health score in once result is ready.
  useEffect(() => {
    if (!result) return;
    const target = result.healthScore;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(parseFloat((eased * target).toFixed(1)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result]);

  const rows = useMemo(() => (result ? buildRows(result) : []), [result]);

  if (loading) return <LoadingState />;
  if (error)
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          sessionStorage.removeItem("plateiq:result");
          location.reload();
        }}
      />
    );
  if (!result) return null;

  const pct = (animatedScore / 10) * 100;
  const circumference = 2 * Math.PI * 52;
  const dash = (pct / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">PlateIQ</span>
        </Link>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Upload another
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground md:mx-0 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Analysis complete
            </span>
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
              Your meal, decoded.
            </h1>
            <p className="text-muted-foreground">
              Here's the full nutrition breakdown — with a little wisdom on the side.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <img
                  src={image ?? heroPlate}
                  alt="Your analyzed meal"
                  className="aspect-square w-full object-cover animate-fade-in"
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <article className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Detected items</h2>
                  <span className="text-xs text-muted-foreground">
                    {result.foodItems.length} found
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {result.foodItems.map((d, i) => (
                    <li
                      key={`${d}-${i}`}
                      style={{ animationDelay: `${i * 80}ms` }}
                      className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm animate-fade-in"
                    >
                      <span className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="font-medium capitalize">{d}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">identified</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:col-span-7">
            <Reveal>
              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Nutrition</h2>
                  <span className="text-xs text-muted-foreground">per serving</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {rows.map((n, i) => (
                    <div
                      key={n.key}
                      style={{ animationDelay: `${i * 70}ms` }}
                      className="group rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow animate-fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-xl ${
                            n.tone === "primary"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/15 text-accent"
                          }`}
                        >
                          <n.Icon className="h-4 w-4" />
                        </span>
                        <span aria-hidden className="text-base">{n.emoji}</span>
                      </div>
                      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                        {n.key}
                      </p>
                      <p className="mt-0.5 font-display text-2xl font-semibold">
                        {n.value}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          {n.unit}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={80}>
              <section className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/60 p-8 shadow-soft sm:flex-row sm:gap-8">
                <div className="relative h-36 w-36 shrink-0">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      strokeWidth="10"
                      className="fill-none stroke-secondary"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - dash}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-3xl font-semibold">
                      {animatedScore.toFixed(1)}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      / 10
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
                    Health score
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold">
                    {scoreLabel(result.healthScore)}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Based on macro balance, fibre, and overall meal composition.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal delay={120}>
              <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-leaf-soft/60 via-card to-zest-soft/40 p-7 shadow-soft">
                <div
                  aria-hidden
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-2xl"
                />
                <div className="relative flex items-center gap-2">
                  <span aria-hidden className="text-xl">🏡</span>
                  <h3 className="font-display text-xl font-semibold">Mom's Wisdom</h3>
                </div>
                <p className="relative mt-3 text-base leading-relaxed text-foreground/85">
                  “{result.momsWisdom}”
                </p>
              </section>
            </Reveal>

            <Reveal delay={160}>
              <section className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Healthy Alternative</h3>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                    Smart swap
                  </span>
                </div>
                <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-border bg-secondary/50 p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Instead of
                    </p>
                    <p className="mt-2 text-3xl">{result.healthyAlternative.instead.emoji}</p>
                    <p className="mt-1 font-display text-lg font-semibold capitalize">
                      {result.healthyAlternative.instead.name}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-primary">Try</p>
                    <p className="mt-2 text-3xl">{result.healthyAlternative.tryThis.emoji}</p>
                    <p className="mt-1 font-display text-lg font-semibold capitalize">
                      {result.healthyAlternative.tryThis.name}
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center">
            <Link
              to="/upload"
              onClick={() => {
                sessionStorage.removeItem("plateiq:image");
                sessionStorage.removeItem("plateiq:result");
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-5 text-base font-medium text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Analyze Another Meal
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              Your reports stay private to you.
            </p>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

function scoreLabel(score: number) {
  if (score >= 8.5) return "Excellent meal";
  if (score >= 7) return "Solid choice";
  if (score >= 5) return "Could be better";
  return "Needs balancing";
}

function LoadingState() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <span className="absolute inset-2 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-6 w-6" />
          </span>
        </div>
        <h2 className="mt-8 font-display text-2xl font-semibold">
          Analyzing your meal…
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Detecting ingredients, calculating macros and crafting personalised tips.
        </p>
        <div className="mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 animate-[slide-in-right_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="flex max-w-md flex-col items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold">
          We couldn't analyse that meal
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
          >
            Try again
          </button>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary"
          >
            Upload a different photo
          </Link>
        </div>
      </div>
    </div>
  );
}
