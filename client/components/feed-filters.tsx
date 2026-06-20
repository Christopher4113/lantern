"use client";

import { Search } from "lucide-react";

export type FeedFiltersState = {
  ticker?: string;
  action?: string;
  source?: string;
};

type FeedFiltersProps = {
  tickerInput: string;
  onTickerInputChange: (value: string) => void;
  action: string;
  onActionChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
};

const ACTION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
] as const;

const SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "HOUSE_CLERK", label: "House Clerk" },
  { value: "SENATE_EFD", label: "Senate eFD" },
  { value: "SEC_FORM4", label: "SEC Form 4" },
  { value: "SEC_13F", label: "SEC 13F" },
] as const;

export function filtersToApiParams(
  filters: FeedFiltersState
): FeedFiltersState {
  return {
    ticker: filters.ticker?.trim() || undefined,
    action: filters.action && filters.action !== "all" ? filters.action : undefined,
    source: filters.source && filters.source !== "all" ? filters.source : undefined,
  };
}

export function FeedFilters({
  tickerInput,
  onTickerInputChange,
  action,
  onActionChange,
  source,
  onSourceChange,
}: FeedFiltersProps) {
  return (
    <div className="glass rounded-2xl border border-white/[0.1] p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => onTickerInputChange(e.target.value)}
            placeholder="Search by ticker (e.g. NVDA)"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-gold-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ACTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onActionChange(option.value)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                action === option.value
                  ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/30"
                  : "border border-white/[0.08] bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          className="rounded-xl border border-white/[0.1] bg-navy-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold-500/40"
        >
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
