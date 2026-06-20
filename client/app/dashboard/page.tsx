"use client";

import { Lamp, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  FeedFilters,
  filtersToApiParams,
  type FeedFiltersState,
} from "@/components/feed-filters";
import { TradeCard, TradeCardSkeleton } from "@/components/trade-card";
import {
  ApiError,
  fetchTradesPaginated,
  NetworkError,
  type Trade,
} from "@/lib/api";

const PAGE_SIZE = 20;

export default function DashboardPage() {
  const { data: session } = useSession();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<NetworkError | ApiError | null>(null);

  const [tickerInput, setTickerInput] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [filters, setFilters] = useState<FeedFiltersState>({});

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ticker: tickerInput.trim() || undefined,
      }));
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [tickerInput]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      action: actionFilter !== "all" ? actionFilter : undefined,
      source: sourceFilter !== "all" ? sourceFilter : undefined,
    }));
  }, [actionFilter, sourceFilter]);

  const loadTrades = useCallback(
    async ({ append = false, nextOffset = 0 }: { append?: boolean; nextOffset?: number }) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const apiFilters = filtersToApiParams(filters);
        const data = await fetchTradesPaginated({
          limit: PAGE_SIZE,
          offset: nextOffset,
          ...apiFilters,
        });

        setTrades((prev) => (append ? [...prev, ...data.items] : data.items));
        setTotalCount(data.count);
        setOffset(nextOffset);
      } catch (err) {
        if (err instanceof NetworkError || err instanceof ApiError) {
          setError(err);
          if (!append) {
            setTrades([]);
            setTotalCount(0);
          }
        } else {
          setError(new ApiError(500, "Unknown Error", "Something went wrong loading trades"));
          if (!append) {
            setTrades([]);
            setTotalCount(0);
          }
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    void loadTrades({ append: false, nextOffset: 0 });
  }, [loadTrades]);

  const handleRetry = () => {
    void loadTrades({ append: false, nextOffset: 0 });
  };

  const handleLoadMore = () => {
    void loadTrades({ append: true, nextOffset: offset + PAGE_SIZE });
  };

  const showLoadMore = !loading && !error && trades.length > 0 && trades.length < totalCount;

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-900 text-slate-100">
      <div className="mesh-bg absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-6 py-8 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-gold-500/30">
              <Lamp className="h-4 w-4 text-gold-400" />
            </div>
            <span className="text-base font-semibold tracking-tight">Lantern</span>
          </Link>

          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? "User avatar"}
                className="h-8 w-8 rounded-full border border-white/[0.1] object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-xs font-medium text-gold-300">
                {(session?.user?.name ?? session?.user?.email ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">
                {session?.user?.name ?? "Signed in"}
              </p>
              <p className="text-xs text-zinc-500">{session?.user?.email}</p>
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="mt-10">
          <div className="mb-6">
            <p className="section-label">Insider feed</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Trades worth watching
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Live trades from politicians, executives, and fund managers with AI annotations.
            </p>
          </div>

          <FeedFilters
            tickerInput={tickerInput}
            onTickerInputChange={setTickerInput}
            action={actionFilter}
            onActionChange={setActionFilter}
            source={sourceFilter}
            onSourceChange={setSourceFilter}
          />

          {error instanceof NetworkError && (
            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
              <p className="text-sm font-medium text-amber-200">
                Can&apos;t reach the Lantern backend. Is the server running?
              </p>
              <p className="mt-1 text-sm text-amber-200/70">{error.message}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="btn-ghost mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-amber-100"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          {error instanceof ApiError && (
            <div className="mt-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
              <p className="text-sm font-medium text-red-200">
                Something went wrong loading trades.
              </p>
              <p className="mt-1 text-sm text-red-200/70">
                Status {error.status} {error.statusText}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="btn-ghost mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-100"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TradeCardSkeleton key={`skeleton-${index}`} />
              ))}

            {!loading &&
              !error &&
              trades.map((trade) => <TradeCard key={trade.id} trade={trade} />)}

            {!loading && !error && trades.length === 0 && (
              <div className="glass-card rounded-2xl px-6 py-12 text-center">
                <p className="text-base font-medium text-white">No trades match your filters</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Try clearing the ticker search or broadening your source and action filters.
                </p>
              </div>
            )}
          </div>

          {showLoadMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
