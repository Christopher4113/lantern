import { Clock3, Sparkles } from "lucide-react";
import type { InsiderType, RecommendedAction, Trade } from "@/lib/api";

type TradeCardProps = {
  trade: Trade;
  featured?: boolean;
  compact?: boolean;
};

const INSIDER_TYPE_LABELS: Record<InsiderType, string> = {
  POLITICIAN: "Politician",
  EXECUTIVE: "Executive",
  FUND_MANAGER: "Fund Manager",
};

const RECOMMENDED_ACTION_LABELS: Record<RecommendedAction, string> = {
  STRONG_FOLLOW: "Strong follow",
  WEAK_FOLLOW: "Weak follow",
  MONITOR: "Monitor",
  IGNORE: "Ignore",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `$${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatAmountRange(
  amountLow: number | null,
  amountHigh: number | null
): string {
  if (amountLow === null && amountHigh === null) {
    return "Amount undisclosed";
  }
  if (amountLow !== null && amountHigh === null) {
    return `${formatCurrency(amountLow)}+`;
  }
  if (amountLow !== null && amountHigh !== null) {
    return `${formatCurrency(amountLow)}–${formatCurrency(amountHigh)}`;
  }
  if (amountHigh !== null) {
    return `Up to ${formatCurrency(amountHigh)}`;
  }
  return "Amount undisclosed";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSignalCategory(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInsiderRole(trade: Trade): string {
  const metadata = trade.insider.metadata;

  if (trade.insider.type === "POLITICIAN") {
    const party = typeof metadata.party === "string" ? metadata.party : null;
    const chamber = typeof metadata.chamber === "string" ? metadata.chamber : null;
    const state = typeof metadata.state === "string" ? metadata.state : null;
    return [party, chamber, state].filter(Boolean).join(" · ") || INSIDER_TYPE_LABELS.POLITICIAN;
  }

  if (trade.insider.type === "EXECUTIVE") {
    const role = typeof metadata.role === "string" ? metadata.role : null;
    const company = typeof metadata.company === "string" ? metadata.company : null;
    return [role, company].filter(Boolean).join(" · ") || INSIDER_TYPE_LABELS.EXECUTIVE;
  }

  const fundName = typeof metadata.fundName === "string" ? metadata.fundName : null;
  return fundName ?? INSIDER_TYPE_LABELS.FUND_MANAGER;
}

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

function RecommendedActionBadge({ action }: { action: RecommendedAction }) {
  const styles: Record<RecommendedAction, string> = {
    STRONG_FOLLOW: "bg-gold-500/15 text-gold-300 ring-gold-500/25",
    WEAK_FOLLOW: "bg-blue-500/15 text-blue-300 ring-blue-500/25",
    MONITOR: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
    IGNORE: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/25",
  };

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide ring-1 ${styles[action]}`}
    >
      {RECOMMENDED_ACTION_LABELS[action]}
    </span>
  );
}

export function TradeCard({ trade, featured = false, compact = false }: TradeCardProps) {
  const isBuy = trade.action === "BUY";
  const isSell = trade.action === "SELL";
  const displaySymbol = trade.ticker ?? trade.assetName;
  const annotation = trade.annotation;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        featured
          ? "gradient-border shadow-[0_24px_80px_-24px_rgba(245,158,11,0.2)]"
          : "glass-card hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold-500/10 blur-3xl" />
      )}

      <div className={`relative ${compact ? "p-4" : "p-5 md:p-6"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-sm font-semibold text-zinc-200">
                {getInitials(trade.insider.name)}
              </div>
              {featured && (
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-navy-800 bg-emerald-400" />
              )}
            </div>
            <div>
              <p className="font-medium tracking-tight text-white">{trade.insider.name}</p>
              <p className="text-xs text-zinc-500">{getInsiderRole(trade)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="max-w-[10rem] truncate rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-zinc-200">
              {displaySymbol}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide ${
                isBuy
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                  : isSell
                    ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
                    : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20"
              }`}
            >
              {trade.action}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-medium text-zinc-300">
            {formatAmountRange(trade.amountLow, trade.amountHigh)}
          </span>
          <span className="text-zinc-700">·</span>
          <span>Traded {formatDate(trade.tradedAt)}</span>
          <span className="text-zinc-700">·</span>
          <span>Filed {formatDate(trade.reportedAt)}</span>
        </div>

        {annotation ? (
          <div className="mt-4 rounded-xl accent-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                </div>
                {annotation.signalCategory.map((category) => (
                  <span
                    key={category}
                    className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium tracking-wide text-gold-300/90 uppercase"
                  >
                    {formatSignalCategory(category)}
                  </span>
                ))}
                <RecommendedActionBadge action={annotation.recommendedAction} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-gold-400">
                  {annotation.significanceScore}
                </span>
                <span className="text-xs text-zinc-500">/10</span>
              </div>
            </div>
            <SignalBar score={annotation.significanceScore} />
            {!compact && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {annotation.summary}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 className="h-4 w-4 text-zinc-600" />
              <span>Analysis pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TradeCardSkeleton() {
  return (
    <div className="glass-card animate-pulse overflow-hidden rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-white/[0.06]" />
            <div className="h-3 w-24 rounded bg-white/[0.04]" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-14 rounded-lg bg-white/[0.06]" />
          <div className="h-7 w-12 rounded-lg bg-white/[0.06]" />
        </div>
      </div>
      <div className="mt-4 h-4 w-48 rounded bg-white/[0.04]" />
      <div className="mt-4 rounded-xl bg-white/[0.03] p-4">
        <div className="h-4 w-full rounded bg-white/[0.05]" />
        <div className="mt-3 h-3 w-full rounded bg-white/[0.04]" />
        <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

export { SignalBar };
