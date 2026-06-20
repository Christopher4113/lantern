from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Insider, InsiderType, Trade
from schemas import InsiderDetailResponse, InsiderResponse, TradeResponse

router = APIRouter(prefix="/insiders", tags=["insiders"])


def _parse_type_filter(insider_type: Optional[str]) -> Optional[InsiderType]:
    if insider_type is None:
        return None

    normalized = insider_type.strip().upper()
    try:
        return InsiderType(normalized)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid type filter. Use POLITICIAN, EXECUTIVE, or FUND_MANAGER.",
        ) from exc


@router.get("", response_model=list[InsiderResponse])
async def list_insiders(
    type: Optional[str] = Query(default=None, alias="type"),
    db: AsyncSession = Depends(get_db),
):
    type_filter = _parse_type_filter(type)

    query = select(Insider).order_by(Insider.name.asc())
    if type_filter:
        query = query.where(Insider.type == type_filter)

    result = await db.execute(query)
    insiders = result.scalars().all()

    return [InsiderResponse.model_validate(insider) for insider in insiders]


@router.get("/{insider_id}", response_model=InsiderDetailResponse)
async def get_insider(insider_id: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Insider)
        .options(
            selectinload(Insider.trades).selectinload(Trade.annotation),
            selectinload(Insider.trades).selectinload(Trade.ticker_record),
        )
        .where(Insider.id == insider_id)
    )

    result = await db.execute(query)
    insider = result.scalar_one_or_none()

    if insider is None:
        raise HTTPException(status_code=404, detail="Insider not found")

    insider.trades.sort(key=lambda trade: trade.traded_at, reverse=True)

    insider_data = InsiderResponse.model_validate(insider)
    return InsiderDetailResponse(
        **insider_data.model_dump(),
        trades=[TradeResponse.model_validate(trade) for trade in insider.trades],
    )
