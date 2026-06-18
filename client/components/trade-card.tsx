import { Sparkles } from "lucide-react";

export type TradeCardProps = {
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

export function TradeCard({
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
          ? "gradient-border shadow-[0_24px_80px_-24px_rgba(100,100,255,0.25)]"
          : "glass-card hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      )}

      <div className={`relative ${compact ? "p-4" : "p-5 md:p-6"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-sm font-semibold text-zinc-200">
                {initials}
              </div>
              {featured && (
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
              )}
            </div>
            <div>
              <p className="font-medium tracking-tight text-white">{name}</p>
              <p className="text-xs text-white/40">{role}</p>
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

        <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-medium text-white/60">
            {amount}
          </span>
          <span className="text-white/20">·</span>
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
              <span className="text-xs text-white/30">/10</span>
            </div>
          </div>
          <SignalBar score={score} />
          {!compact && (
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { SignalBar };
