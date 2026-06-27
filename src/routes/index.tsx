import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  Sparkles,
  BarChart3,
  Heart,
  Leaf,
  Upload,
  Brain,
  Lightbulb,
  ScanSearch,
  Salad,
  ShieldCheck,
} from "lucide-react";
import heroPlate from "@/assets/hero-plate.jpg";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlateIQ — Know Your Plate. Eat Smarter." },
      {
        name: "description",
        content:
          "Snap a photo of your Indian meal and get instant AI-powered nutrition insights, a health score, and personalised tips.",
      },
      { property: "og:title", content: "PlateIQ — Know Your Plate. Eat Smarter." },
      {
        property: "og:description",
        content:
          "Snap a photo of your Indian meal and get instant AI-powered nutrition insights, a health score, and personalised tips.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Camera,
    title: "AI Food Detection",
    desc: "Point, shoot, done. Our vision model identifies ingredients down to the garnish.",
  },
  {
    icon: BarChart3,
    title: "Nutrition Analysis",
    desc: "Calories, macros and micros — broken down per dish in seconds.",
  },
  {
    icon: Sparkles,
    title: "Health Score",
    desc: "A single number that tells you how well this plate fits your goals.",
  },
  {
    icon: Heart,
    title: "Mom's Wisdom",
    desc: "Warm, practical advice that feels less like a lecture and more like home.",
  },
];

const steps = [
  {
    icon: Camera,
    emoji: "📸",
    title: "Upload Food",
    desc: "Snap or upload a photo of your plate — thali, dosa, anything.",
  },
  {
    icon: Brain,
    emoji: "🤖",
    title: "AI Detects Ingredients",
    desc: "Our model recognises every dish, sabzi and garnish in seconds.",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Nutrition Analysis",
    desc: "See calories, macros and micros mapped to each item.",
  },
  {
    icon: Lightbulb,
    emoji: "💡",
    title: "Personalized Health Tips",
    desc: "Tailored, doable suggestions for your next meal.",
  },
];

const why = [
  {
    icon: ScanSearch,
    title: "Accurate AI Food Recognition",
    desc: "Trained on thousands of dishes — from rajma chawal to masala dosa — for high-precision detection.",
  },
  {
    icon: Salad,
    title: "Nutrition Insights for Indian Cuisine",
    desc: "A nutrition database built around Indian ingredients, spices and regional staples.",
  },
  {
    icon: ShieldCheck,
    title: "Simple & Personalized Recommendations",
    desc: "No jargon. Just clean, actionable guidance shaped to your goals and lifestyle.",
  },
];

const trustBadges = [
  { emoji: "🇮🇳", label: "Optimized for Indian Meals" },
  { emoji: "🤖", label: "AI-Powered Analysis" },
  { emoji: "⚡", label: "Results in Seconds" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">PlateIQ</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition hover:text-foreground">How it works</a>
          <a href="#why" className="transition hover:text-foreground">Why PlateIQ</a>
          <a href="#features" className="transition hover:text-foreground">Features</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AI-powered nutrition, beautifully simple
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
              Know Your Plate.{" "}
              <span className="italic text-primary">Eat Smarter.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Upload a photo of any Indian meal and PlateIQ instantly breaks down its
              nutrition, scores its healthiness, and shares personalised guidance.
            </p>

            <div id="upload" className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/upload"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-medium text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_color-mix(in_oklab,var(--leaf)_55%,transparent)] active:scale-[0.98]"
              >
                <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Analyze My Meal
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-medium text-foreground/80 transition hover:text-foreground"
              >
                See how it works →
              </a>
            </div>

            {/* Trust badges */}
            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {trustBadges.map((b) => (
                <li
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-card"
                >
                  <span aria-hidden="true">{b.emoji}</span>
                  {b.label}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div>
                <div className="font-display text-2xl text-foreground">2M+</div>
                meals analyzed
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="font-display text-2xl text-foreground">98%</div>
                ingredient accuracy
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-leaf-soft via-cream-deep to-zest-soft blur-2xl opacity-70" />
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition-transform duration-700 hover:scale-[1.01]">
                <img
                  src={heroPlate}
                  alt="An elegant Indian thali with dal, paneer curry, basmati rice, raita and roti"
                  width={1280}
                  height={1280}
                  className="aspect-square w-full object-cover"
                />
              </div>

              {/* Floating macros card */}
              <div className="absolute -bottom-6 -left-4 hidden w-60 rounded-2xl border border-border bg-card/95 p-4 shadow-soft backdrop-blur-md animate-[fade-in_0.6s_ease-out_both] sm:block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nutrition
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    8.9/10
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: "Protein", v: "28g" },
                    { k: "Carbs", v: "52g" },
                    { k: "Fiber", v: "8g" },
                  ].map((m) => (
                    <div key={m.k} className="rounded-xl bg-secondary/60 px-2 py-2">
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {m.k}
                      </dt>
                      <dd className="mt-0.5 font-display text-base font-semibold">{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Health Score</span>
                  <span className="font-medium text-foreground">Excellent</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[89%] rounded-full bg-primary" />
                </div>
              </div>

              <div className="absolute -right-3 top-6 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-soft backdrop-blur-md animate-[fade-in_0.8s_ease-out_both] sm:block">
                <div className="flex items-center gap-2 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium">512 kcal</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
            From photo to plate insights in four taps.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <article className="group relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-medium text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">{s.emoji}</span>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why PlateIQ */}
      <section id="why" className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
              Why PlateIQ
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
              Built for the way India eats.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/60 p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
                  />
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-6 font-display text-xl font-semibold">{w.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {w.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            What's inside
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
            A pocket nutritionist, served warm.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="group relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                    i % 2 === 0
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-lg font-semibold">PlateIQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PlateIQ. Made with good ingredients.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition hover:text-foreground">Privacy</a>
            <a href="#" className="transition hover:text-foreground">Terms</a>
            <a href="#" className="transition hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
