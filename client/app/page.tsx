import {
  Brain,
  ChevronRight,
  Database,
  Eye,
  Lamp,
  Menu,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

type TradeCardProps = {
  name: string;
  role: string;
  initials: string;
  ticker: string;
  action: "BUY" | "SELL";
  amount: string;
  date: string;
  score: number;
  signal: string;
  summary: string;
  featured?: boolean;
  compact?: boolean;
};

function SignalBar({ score }: { score: number }) {
  return (
    <div className="score-bar w-full">
      <div
        className="score-bar-fill transition-all duration-700"
        style={{ width: `${score * 10}%` }}
      />
    </div>
  );
}

function TradeCard({
  name,
  role,
  initials,
  ticker,
  action,
  amount,
  date,
  score,
  signal,
  summary,
  featured = false,
  compact = false,
}: TradeCardProps) {
  const isBuy = action === "BUY";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        featured
          ? "gradient-border shadow-[0_24px_80px_-24px_rgba(59,130,246,0.35)]"
          : "glass-card hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
      )}

      <div className={`relative ${compact ? "p-4" : "p-5 md:p-6"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-sm font-semibold text-zinc-200">
                {initials}
              </div>
              {featured && (
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-navy-700 bg-emerald-400" />
              )}
            </div>
            <div>
              <p className="font-medium tracking-tight text-white">{name}</p>
              <p className="text-xs text-zinc-500">{role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-zinc-200">
              {ticker}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide ${
                isBuy
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                  : "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
              }`}
            >
              {action}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-medium text-zinc-400">
            {amount}
          </span>
          <span className="text-zinc-700">·</span>
          <span>{date}</span>
        </div>

        <div className="mt-4 rounded-xl accent-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              </div>
              <span className="text-xs font-medium text-gold-300/90">
                {signal}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-gold-400">
                {score}
              </span>
              <span className="text-xs text-zinc-600">/10</span>
            </div>
          </div>
          <SignalBar score={score} />
          {!compact && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="section-label">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.1]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-zinc-500 md:text-lg">
        {description}
      </p>
    </div>
  );
}

const marqueeItems = [
  "200+ politicians tracked",
  "500+ executives",
  "SEC EDGAR filings",
  "House & Senate disclosures",
  "Updated daily",
  "Powered by Claude AI",
  "Real-time signal scoring",
  "Public data only",
];

export default function Home() {
  const feedTrades: TradeCardProps[] = [
    {
      name: "Nancy Pelosi",
      role: "U.S. Representative · CA-11",
      initials: "NP",
      ticker: "NVDA",
      action: "BUY",
      amount: "$1M – $5M",
      date: "Mar 12, 2026",
      score: 9,
      signal: "High Signal · Committee Alignment",
      summary:
        "Pelosi sits on committees overseeing tech policy — this NVDA purchase aligns with her legislative access.",
    },
    {
      name: "Tim Cook",
      role: "CEO · Apple Inc.",
      initials: "TC",
      ticker: "AAPL",
      action: "SELL",
      amount: "$10M – $50M",
      date: "Mar 10, 2026",
      score: 6,
      signal: "Moderate Signal · Planned Sale",
      summary:
        "Pre-scheduled 10b5-1 sale — routine diversification, not a bearish signal on fundamentals.",
    },
    {
      name: "Cathie Wood",
      role: "CEO · ARK Invest",
      initials: "CW",
      ticker: "TSLA",
      action: "BUY",
      amount: "$500K – $1M",
      date: "Mar 8, 2026",
      score: 7,
      signal: "Notable · Thematic Conviction",
      summary:
        "ARK adding to TSLA after recent dip — consistent with their autonomous driving thesis.",
    },
  ];

  const stats = [
    { value: "200+", label: "Politicians" },
    { value: "500+", label: "Executives" },
    { value: "Daily", label: "Updates" },
    { value: "AI", label: "Annotated" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-navy-900 text-slate-100">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-50" />

      {/* Navbar */}
      <nav className="fixed top-0 z-40 w-full px-4 pt-4 md:px-6">
        <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/[0.1] px-4 md:px-5">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-gold-500/30">
              <Lamp className="h-4 w-4 text-gold-400" />
            </div>
            <span className="text-base font-semibold tracking-tight">Lantern</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid-bg absolute inset-0" />
        <div className="mesh-bg absolute inset-0" />
        <div className="animate-glow-pulse absolute top-[30%] left-1/2 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.12] blur-[140px]" />
        <div className="absolute top-20 right-[10%] h-32 w-32 rounded-full bg-gold-400/10 blur-[60px] animate-float" />
        <div className="absolute bottom-32 left-[8%] h-24 w-24 rounded-full bg-blue-700/15 blur-[50px] animate-float-slow" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
              </span>
              <span className="text-xs font-medium text-gold-300/90">
                Now tracking congressional &amp; SEC filings
              </span>
            </div>

            <h1 className="animate-fade-in-up text-4xl font-semibold tracking-tight md:text-7xl md:leading-[1.05] [animation-delay:80ms]">
              <span className="text-gradient-subtle">They trade on what</span>
              <br />
              <span className="text-gradient-subtle">they know.</span>{" "}
              <span className="text-gradient">Now you can see it.</span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg [animation-delay:160ms]">
              Lantern tracks stock trades from politicians, executives, and fund
              managers — and uses AI to tell you what it actually means.
            </p>

            <div className="animate-fade-in-up mt-10 flex justify-center [animation-delay:240ms]">
              <a
                href="#how-it-works"
                className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-navy-900"
              >
                See How It Works
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Dashboard mock frame */}
          <div className="animate-fade-in-up relative mx-auto mt-16 max-w-3xl [animation-delay:320ms]">
            <div className="animate-float-slow">
              <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-navy-800/90 shadow-[0_40px_120px_-40px_rgba(10,18,32,0.9)] ring-1 ring-blue-500/10">
                <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-white/[0.04] text-[10px] text-zinc-600">
                    app.lantern.finance/feed
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <TradeCard {...feedTrades[0]} featured />
                </div>
              </div>
            </div>

            {/* Floating stat chips */}
            <div className="absolute -left-4 top-1/4 hidden rounded-xl border border-white/[0.1] bg-navy-800/95 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-left-16">
              <p className="font-mono text-2xl font-bold text-gold-400">9.2</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Avg signal score
              </p>
            </div>
            <div className="absolute -right-4 bottom-1/4 hidden rounded-xl border border-blue-500/20 bg-navy-800/95 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-right-12">
              <p className="text-xs font-medium text-blue-400">● Live</p>
              <p className="mt-0.5 text-[10px] text-zinc-500">12 trades today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="relative border-y border-white/[0.06] py-5">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-3 text-sm text-zinc-600"
              >
                <span className="h-1 w-1 rounded-full bg-blue-400/60" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-navy-800 px-6 py-8 text-center transition-colors hover:bg-navy-700/50"
            >
              <p className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            label="Features"
            title="Everything insiders do, in one place"
            description="Stop digging through SEC filings and congressional disclosures. Lantern surfaces what matters."
          />

          <div className="mt-16 grid gap-4 md:grid-cols-2 md:grid-rows-2">
            {/* Large feature card */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 md:row-span-2">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-gold-500/25">
                <TrendingUp className="h-5 w-5 text-gold-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                Unified Insider Feed
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
                All trades from politicians, executives, and hedge fund managers in
                one chronological feed — no more switching between data sources.
              </p>

              {/* Mini feed preview inside card */}
              <div className="mt-8 space-y-2">
                {feedTrades.slice(0, 3).map((t) => (
                  <div
                    key={t.ticker + t.name}
                    className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-medium text-zinc-400">
                        {t.initials}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-zinc-300">
                          {t.name.split(" ").pop()}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-600">
                          {t.ticker}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold ${
                          t.action === "BUY"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {t.action}
                      </span>
                      <span className="font-mono text-xs font-semibold text-gold-400/80">
                        {t.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-gold-500/25">
                <Brain className="h-5 w-5 text-gold-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">
                AI Trade Annotations
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Every trade gets a significance score, signal category, and
                plain-English explanation — so you understand the &ldquo;why&rdquo;
                behind each move.
              </p>
              <div className="mt-6 rounded-xl accent-surface p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  <span className="text-xs text-gold-300/80">
                    High Signal · Committee Alignment
                  </span>
                </div>
                <SignalBar score={9} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-gold-500/25">
                <Zap className="h-5 w-5 text-gold-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">
                Recommended Actions
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                AI tells you if a trade is worth following, monitoring, or
                ignoring — tailored for the average investor.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Follow", "Monitor", "Ignore"].map((action, i) => (
                  <span
                    key={action}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      i === 0
                        ? "bg-blue-500/20 text-gold-300 ring-1 ring-gold-500/30"
                        : "bg-white/[0.04] text-zinc-500 ring-1 ring-white/[0.06]"
                    }`}
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — timeline */}
      <section
        id="how-it-works"
        className="relative border-t border-white/[0.06] py-20 md:py-28"
      >
        <div className="mesh-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeader
            label="How it works"
            title="From filing to insight in three steps"
            description="Public data in. Actionable intelligence out."
          />

          <div className="relative mt-20">
            <div className="absolute top-8 right-[16.67%] left-[16.67%] hidden h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent md:block" />

            <div className="grid gap-8 md:grid-cols-3 md:gap-6">
              {[
                {
                  step: "01",
                  icon: Database,
                  title: "We collect",
                  desc: "Public filings from the House Clerk, Senate eFD, and SEC EDGAR — aggregated into a single pipeline.",
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "AI analyzes",
                  desc: "Claude cross-references each trade against committee assignments, legislation, and market context.",
                },
                {
                  step: "03",
                  icon: Eye,
                  title: "You decide",
                  desc: "Clear signal ratings and plain-English summaries so you can act with confidence.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="glass-card group relative rounded-2xl p-8 text-center transition-transform duration-300 hover:-translate-y-1 md:text-left"
                >
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center md:mx-0">
                    <div className="animate-pulse-ring absolute inset-0 rounded-2xl bg-blue-500/10" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/25 to-gold-500/10">
                      <item.icon className="h-6 w-6 text-gold-400" />
                    </div>
                  </div>
                  <p className="font-mono text-xs text-gold-400/60">
                    Step {item.step}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mock Feed — dashboard layout */}
      <section className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            label="Live preview"
            title="Your insider feed, illuminated"
            description="Every trade annotated with AI-powered context — not just raw data."
          />

          <div className="mt-16 overflow-hidden rounded-2xl border border-white/[0.1] bg-navy-800 shadow-[0_40px_100px_-40px_rgba(10,18,32,0.8)]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="text-xs text-zinc-600">Lantern Dashboard</span>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <aside className="hidden w-56 shrink-0 border-r border-white/[0.06] bg-white/[0.01] p-4 md:block">
                <div className="flex items-center gap-2 px-2 py-1">
                  <Lamp className="h-4 w-4 text-gold-400" />
                  <span className="text-sm font-semibold">Lantern</span>
                </div>
                <nav className="mt-6 space-y-1">
                  {["Feed", "Politicians", "Executives", "Funds", "Alerts"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          i === 0
                            ? "bg-blue-500/15 font-medium text-gold-300"
                            : "text-zinc-500"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </nav>
                <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Today&apos;s signals
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-white">
                    12
                  </p>
                  <p className="text-[10px] text-blue-400">+3 vs yesterday</p>
                </div>
              </aside>

              {/* Feed */}
              <div className="custom-scrollbar flex-1 p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-300">
                    Insider Feed
                  </h3>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {feedTrades.map((trade) => (
                    <TradeCard
                      key={trade.ticker + trade.name}
                      {...trade}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-gold-500/20">
              <Lamp className="h-3.5 w-3.5 text-gold-400" />
            </div>
            <p className="text-sm text-zinc-500">
              Lantern © 2026 · Not financial advice · Data sourced from public
              filings
            </p>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {link}
              </a>
            ))}
            <a
              href="https://github.com"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
