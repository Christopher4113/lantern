from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Trade, TradeAction, TradeSource
from schemas import PaginatedTradesResponse, TradeResponse

router = APIRouter(prefix="/trades", tags=["trades"])


def _parse_action_filter(action: Optional[str]) -> Optional[TradeAction]:
    if action is None:
        return None

    normalized = action.strip().upper()
    try:
        return TradeAction(normalized)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid action filter. Use buy, sell, or exchange.",
        ) from exc


def _parse_source_filter(source: Optional[str]) -> Optional[TradeSource]:
    if source is None:
        return None

    normalized = source.strip().upper()
    try:
        return TradeSource(normalized)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid source filter. Use HOUSE_CLERK, SENATE_EFD, "
                "SEC_FORM4, or SEC_13F."
            ),
        ) from exc


@router.get("", response_model=PaginatedTradesResponse)
async def list_trades(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    ticker: Optional[str] = Query(default=None),
    action: Optional[str] = Query(default=None),
    source: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    action_filter = _parse_action_filter(action)
    source_filter = _parse_source_filter(source)

    filters = []
    if ticker:
        filters.append(Trade.ticker == ticker.upper())
    if action_filter:
        filters.append(Trade.action == action_filter)
    if source_filter:
        filters.append(Trade.source == source_filter)

    count_query = select(func.count()).select_from(Trade)
    if filters:
        count_query = count_query.where(*filters)

    total = await db.scalar(count_query) or 0

    query = (
        select(Trade)
        .options(
            selectinload(Trade.insider),
            selectinload(Trade.annotation),
            selectinload(Trade.ticker_record),
        )
        .order_by(Trade.traded_at.desc())
        .limit(limit)
        .offset(offset)
    )

    if filters:
        query = query.where(*filters)

    result = await db.execute(query)
    trades = result.scalars().unique().all()

    return PaginatedTradesResponse(
        items=[TradeResponse.model_validate(trade) for trade in trades],
        limit=limit,
        offset=offset,
        count=total,
    )


@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(trade_id: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Trade)
        .options(
            selectinload(Trade.insider),
            selectinload(Trade.annotation),
            selectinload(Trade.ticker_record),
        )
        .where(Trade.id == trade_id)
    )

    result = await db.execute(query)
    trade = result.scalar_one_or_none()

    if trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return TradeResponse.model_validate(trade)
