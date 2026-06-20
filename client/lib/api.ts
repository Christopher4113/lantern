const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type InsiderType = "POLITICIAN" | "EXECUTIVE" | "FUND_MANAGER";

export type AssetType = "STOCK" | "OPTION" | "BOND" | "ETF" | "OTHER";

export type TradeAction = "BUY" | "SELL" | "EXCHANGE";

export type TradeSource =
  | "HOUSE_CLERK"
  | "SENATE_EFD"
  | "SEC_FORM4"
  | "SEC_13F";

export type RecommendedAction =
  | "STRONG_FOLLOW"
  | "WEAK_FOLLOW"
  | "MONITOR"
  | "IGNORE";

export interface Insider {
  id: string;
  name: string;
  type: InsiderType;
  imageUrl: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Annotation {
  id: string;
  tradeId: string;
  significanceScore: number;
  summary: string;
  signalCategory: string[];
  recommendedAction: RecommendedAction;
  reasoning: string | null;
  modelVersion: string | null;
  generatedAt: string;
}

export interface Trade {
  id: string;
  insiderId: string;
  insider: Insider;
  ticker: string | null;
  assetName: string;
  assetType: AssetType;
  action: TradeAction;
  amountLow: number | null;
  amountHigh: number | null;
  tradedAt: string;
  reportedAt: string;
  source: TradeSource;
  sourceUrl: string | null;
  annotation: Annotation | null;
}

/** Paginated trades response from GET /trades */
export interface PaginatedTrades {
  items: Trade[];
  limit: number;
  offset: number;
  /** Total number of trades matching the current filters */
  count: number;
}

export interface InsiderWithTrades extends Insider {
  trades: Trade[];
}

export type FetchTradesParams = {
  limit?: number;
  offset?: number;
  ticker?: string;
  action?: string;
  source?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `API request failed with status ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }
}

export class NetworkError extends Error {
  constructor(message = "Unable to reach the Lantern API. Is the backend running?") {
    super(message);
    this.name = "NetworkError";
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch a paginated list of trades with optional filters.
 * Returns the `items` array from the paginated response.
 *
 * @example
 * const trades = await fetchTrades({ limit: 20, ticker: "NVDA", action: "buy" });
 */
export async function fetchTrades(
  params: FetchTradesParams = {}
): Promise<Trade[]> {
  const query = buildQuery({
    limit: params.limit,
    offset: params.offset,
    ticker: params.ticker,
    action: params.action,
    source: params.source,
  });

  const data = await apiFetch<PaginatedTrades>(`/trades${query}`);
  return data.items;
}

/**
 * Fetch a single trade by ID, including nested insider and annotation data.
 *
 * @example
 * const trade = await fetchTrade("abc123");
 */
export async function fetchTrade(id: string): Promise<Trade> {
  try {
    return await apiFetch<Trade>(`/trades/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(404, error.statusText, `Trade not found: ${id}`);
    }
    throw error;
  }
}

/**
 * Fetch all insiders, optionally filtered by insider type.
 *
 * @example
 * const politicians = await fetchInsiders("POLITICIAN");
 */
export async function fetchInsiders(type?: InsiderType): Promise<Insider[]> {
  const query = buildQuery({ type });
  return apiFetch<Insider[]>(`/insiders${query}`);
}

/**
 * Fetch a single insider profile with their trades included.
 *
 * @example
 * const insider = await fetchInsider("abc123");
 */
export async function fetchInsider(id: string): Promise<InsiderWithTrades> {
  try {
    return await apiFetch<InsiderWithTrades>(
      `/insiders/${encodeURIComponent(id)}`
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(404, error.statusText, `Insider not found: ${id}`);
    }
    throw error;
  }
}
