"""
Lantern database seed script.

Run from the server/ directory with DATABASE_URL set in .env:

    python seed.py

Requires the same Neon pooled DATABASE_URL used by the FastAPI app.
The script is idempotent — it clears existing seed-related rows before inserting.
"""

import asyncio
import uuid
from datetime import datetime, timedelta

from sqlalchemy import delete

from database import AsyncSessionLocal
from models import (
    Annotation,
    AssetType,
    Insider,
    InsiderType,
    RecommendedAction,
    Ticker,
    Trade,
    TradeAction,
    TradeSource,
)

NOW = datetime(2026, 6, 19, 12, 0, 0)


def new_id() -> str:
    return str(uuid.uuid4())


def days_ago(days: int, hour: int = 10) -> datetime:
    return NOW - timedelta(days=days, hours=NOW.hour - hour)


INSIDERS = [
    {
        "key": "pelosi",
        "name": "Nancy Pelosi",
        "type": InsiderType.POLITICIAN,
        "metadata": {
            "party": "Democrat",
            "chamber": "House",
            "state": "CA",
            "district": "11",
            "committees": ["Financial Services"],
        },
    },
    {
        "key": "tuberville",
        "name": "Tommy Tuberville",
        "type": InsiderType.POLITICIAN,
        "metadata": {
            "party": "Republican",
            "chamber": "Senate",
            "state": "AL",
            "district": None,
            "committees": ["Armed Services", "Agriculture"],
        },
    },
    {
        "key": "nadella",
        "name": "Satya Nadella",
        "type": InsiderType.EXECUTIVE,
        "metadata": {
            "company": "Microsoft Corporation",
            "ticker": "MSFT",
            "role": "Chief Executive Officer",
            "companySector": "Technology",
        },
    },
    {
        "key": "cook",
        "name": "Tim Cook",
        "type": InsiderType.EXECUTIVE,
        "metadata": {
            "company": "Apple Inc.",
            "ticker": "AAPL",
            "role": "Chief Executive Officer",
            "companySector": "Technology",
        },
    },
    {
        "key": "wood",
        "name": "Cathie Wood",
        "type": InsiderType.FUND_MANAGER,
        "metadata": {
            "fundName": "ARK Investment Management",
            "aumRange": "$10B–$15B",
            "strategy": "Disruptive innovation, high-conviction growth",
        },
    },
]

TICKERS = [
    {"symbol": "NVDA", "company_name": "NVIDIA Corporation", "sector": "Technology", "industry": "Semiconductors"},
    {"symbol": "AAPL", "company_name": "Apple Inc.", "sector": "Technology", "industry": "Consumer Electronics"},
    {"symbol": "TSLA", "company_name": "Tesla, Inc.", "sector": "Consumer Cyclical", "industry": "Auto Manufacturers"},
    {"symbol": "MSFT", "company_name": "Microsoft Corporation", "sector": "Technology", "industry": "Software"},
    {"symbol": "GOOGL", "company_name": "Alphabet Inc.", "sector": "Technology", "industry": "Internet Content & Information"},
]

TRADE_SPECS = [
    {
        "insider_key": "pelosi",
        "ticker": "NVDA",
        "asset_name": "NVIDIA Corporation",
        "action": TradeAction.BUY,
        "amount_low": 100_001,
        "amount_high": 250_000,
        "traded_days_ago": 28,
        "reported_delay_days": 12,
        "source": TradeSource.HOUSE_CLERK,
        "filing_suffix": "pelosi-nvda-buy",
        "annotate": True,
    },
    {
        "insider_key": "pelosi",
        "ticker": "AAPL",
        "asset_name": "Apple Inc.",
        "action": TradeAction.SELL,
        "amount_low": 50_001,
        "amount_high": 100_000,
        "traded_days_ago": 21,
        "reported_delay_days": 8,
        "source": TradeSource.HOUSE_CLERK,
        "filing_suffix": "pelosi-aapl-sell",
        "annotate": False,
    },
    {
        "insider_key": "tuberville",
        "ticker": "MSFT",
        "asset_name": "Microsoft Corporation",
        "action": TradeAction.BUY,
        "amount_low": 15_001,
        "amount_high": 50_000,
        "traded_days_ago": 24,
        "reported_delay_days": 35,
        "source": TradeSource.HOUSE_CLERK,
        "filing_suffix": "tuberville-msft-buy",
        "annotate": True,
    },
    {
        "insider_key": "tuberville",
        "ticker": "GOOGL",
        "asset_name": "Alphabet Inc.",
        "action": TradeAction.BUY,
        "amount_low": 1_001,
        "amount_high": 15_000,
        "traded_days_ago": 14,
        "reported_delay_days": 5,
        "source": TradeSource.HOUSE_CLERK,
        "filing_suffix": "tuberville-googl-buy",
        "annotate": False,
    },
    {
        "insider_key": "nadella",
        "ticker": "MSFT",
        "asset_name": "Microsoft Corporation",
        "action": TradeAction.SELL,
        "amount_low": 500_001,
        "amount_high": 1_000_000,
        "traded_days_ago": 18,
        "reported_delay_days": 2,
        "source": TradeSource.SEC_FORM4,
        "filing_suffix": "nadella-msft-sell",
        "annotate": True,
    },
    {
        "insider_key": "cook",
        "ticker": "AAPL",
        "asset_name": "Apple Inc.",
        "action": TradeAction.SELL,
        "amount_low": 250_001,
        "amount_high": 500_000,
        "traded_days_ago": 9,
        "reported_delay_days": 1,
        "source": TradeSource.SEC_FORM4,
        "filing_suffix": "cook-aapl-sell",
        "annotate": False,
    },
    {
        "insider_key": "cook",
        "ticker": "AAPL",
        "asset_name": "Apple Inc.",
        "action": TradeAction.BUY,
        "amount_low": 100_001,
        "amount_high": 250_000,
        "traded_days_ago": 3,
        "reported_delay_days": 2,
        "source": TradeSource.SEC_FORM4,
        "filing_suffix": "cook-aapl-buy",
        "annotate": False,
    },
    {
        "insider_key": "wood",
        "ticker": "TSLA",
        "asset_name": "Tesla, Inc.",
        "action": TradeAction.BUY,
        "amount_low": 1_000_000,
        "amount_high": None,
        "traded_days_ago": 27,
        "reported_delay_days": 42,
        "source": TradeSource.SEC_13F,
        "filing_suffix": "wood-tsla-buy",
        "annotate": False,
    },
    {
        "insider_key": "wood",
        "ticker": "NVDA",
        "asset_name": "NVIDIA Corporation",
        "action": TradeAction.BUY,
        "amount_low": 500_001,
        "amount_high": 1_000_000,
        "traded_days_ago": 11,
        "reported_delay_days": 18,
        "source": TradeSource.SEC_13F,
        "filing_suffix": "wood-nvda-buy",
        "annotate": True,
    },
    {
        "insider_key": "wood",
        "ticker": "GOOGL",
        "asset_name": "Alphabet Inc.",
        "action": TradeAction.SELL,
        "amount_low": 50_001,
        "amount_high": 100_000,
        "traded_days_ago": 6,
        "reported_delay_days": 14,
        "source": TradeSource.SEC_13F,
        "filing_suffix": "wood-googl-sell",
        "annotate": False,
    },
]

ANNOTATIONS = {
    "pelosi-nvda-buy": {
        "significance_score": 8,
        "summary": (
            "Pelosi opened a sizable NVDA position shortly before renewed AI "
            "infrastructure spending headlines. The trade size sits in her upper "
            "disclosure bracket and aligns with Financial Services committee exposure."
        ),
        "signal_category": ["committee_alignment", "thematic_conviction"],
        "recommended_action": RecommendedAction.STRONG_FOLLOW,
        "reasoning": (
            "Historical pattern shows Pelosi NVDA buys preceding sector momentum. "
            "Committee jurisdiction overlaps with fintech and payments regulation "
            "affecting AI supply chains. Score elevated due to size and timing."
        ),
    },
    "tuberville-msft-buy": {
        "significance_score": 5,
        "summary": (
            "A mid-range MSFT purchase filed after a prolonged reporting delay. "
            "The position size is moderate for a Senate portfolio and may reflect "
            "routine diversification rather than a directional macro bet."
        ),
        "signal_category": ["routine_diversification"],
        "recommended_action": RecommendedAction.MONITOR,
        "reasoning": (
            "Late filing reduces signal freshness. No direct defense-contractor "
            "link in this specific trade, though Armed Services membership provides "
            "peripheral tech policy context."
        ),
    },
    "nadella-msft-sell": {
        "significance_score": 3,
        "summary": (
            "Scheduled executive sale under a 10b5-1 plan at the top disclosure "
            "bracket. These transactions are typically pre-programmed and carry "
            "limited informational value about near-term outlook."
        ),
        "signal_category": ["routine_diversification"],
        "recommended_action": RecommendedAction.IGNORE,
        "reasoning": (
            "Form 4 shows plan-driven disposition. CEO sales of this magnitude "
            "recur quarterly; not indicative of incremental bearishness."
        ),
    },
    "wood-nvda-buy": {
        "significance_score": 9,
        "summary": (
            "ARK increased NVDA exposure in a top-tier 13F bracket, consistent "
            "with their public AI thesis. The fund has been vocal on semiconductor "
            "demand, making this a high-conviction portfolio move."
        ),
        "signal_category": ["cluster_buy", "thematic_conviction"],
        "recommended_action": RecommendedAction.STRONG_FOLLOW,
        "reasoning": (
            "13F increase aligns with stated strategy and prior quarter additions. "
            "Wood's NVDA positioning is a flagship signal for ARK holders; "
            "significance elevated due to fund's transparent thesis-driven style."
        ),
    },
}


async def clear_seed_data(session) -> None:
    await session.execute(delete(Annotation))
    await session.execute(delete(Trade))
    await session.execute(delete(Insider))
    await session.execute(delete(Ticker))
    await session.commit()


async def seed() -> None:
    insider_ids: dict[str, str] = {}
    trade_ids: list[str] = []

    async with AsyncSessionLocal() as session:
        await clear_seed_data(session)

        for spec in INSIDERS:
            insider_id = new_id()
            insider_ids[spec["key"]] = insider_id
            session.add(
                Insider(
                    id=insider_id,
                    name=spec["name"],
                    type=spec["type"],
                    image_url=None,
                    metadata_=spec["metadata"],
                    created_at=NOW,
                )
            )

        for spec in TICKERS:
            session.add(
                Ticker(
                    symbol=spec["symbol"],
                    company_name=spec["company_name"],
                    sector=spec["sector"],
                    industry=spec["industry"],
                    cached_price=None,
                    price_updated_at=None,
                    created_at=NOW,
                )
            )

        for trade_spec in TRADE_SPECS:
            trade_id = new_id()
            trade_ids.append(trade_id)
            traded_at = days_ago(trade_spec["traded_days_ago"])
            reported_at = traded_at + timedelta(days=trade_spec["reported_delay_days"])
            filing_id = f"seed-{trade_spec['filing_suffix']}"

            session.add(
                Trade(
                    id=trade_id,
                    insider_id=insider_ids[trade_spec["insider_key"]],
                    ticker=trade_spec["ticker"],
                    asset_name=trade_spec["asset_name"],
                    asset_type=AssetType.STOCK,
                    action=trade_spec["action"],
                    amount_low=trade_spec["amount_low"],
                    amount_high=trade_spec["amount_high"],
                    traded_at=traded_at,
                    reported_at=reported_at,
                    source=trade_spec["source"],
                    source_url=f"https://disclosures.example.com/{filing_id}",
                    source_filing_id=filing_id,
                    raw_data={"seed": True, "filingId": filing_id},
                    created_at=NOW,
                )
            )

            if trade_spec["annotate"]:
                annotation_spec = ANNOTATIONS[trade_spec["filing_suffix"]]
                session.add(
                    Annotation(
                        id=new_id(),
                        trade_id=trade_id,
                        significance_score=annotation_spec["significance_score"],
                        summary=annotation_spec["summary"],
                        signal_category=annotation_spec["signal_category"],
                        recommended_action=annotation_spec["recommended_action"],
                        reasoning=annotation_spec["reasoning"],
                        model_version="claude-sonnet-4-6",
                        generated_at=NOW,
                    )
                )

        await session.commit()

    annotated_count = sum(1 for spec in TRADE_SPECS if spec["annotate"])

    print("Seed complete.")
    print(f"  Insiders created: {len(insider_ids)}")
    print(f"  Tickers created:  {len(TICKERS)}")
    print(f"  Trades created:   {len(trade_ids)}")
    print(f"  Annotations:      {annotated_count} (remaining trades unannotated)")
    print()
    print("Insider IDs:")
    for key, insider_id in insider_ids.items():
        name = next(i["name"] for i in INSIDERS if i["key"] == key)
        print(f"  {name}: {insider_id}")
    print()
    print("Trade IDs:")
    for trade_id, trade_spec in zip(trade_ids, TRADE_SPECS, strict=True):
        annotated = " [annotated]" if trade_spec["annotate"] else ""
        print(
            f"  {trade_spec['insider_key']} {trade_spec['action'].value} "
            f"{trade_spec['ticker']}: {trade_id}{annotated}"
        )


if __name__ == "__main__":
    asyncio.run(seed())
