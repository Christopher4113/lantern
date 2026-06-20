from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from models import (
    AssetType,
    InsiderType,
    RecommendedAction,
    TradeAction,
    TradeSource,
)


class AnnotationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    trade_id: str = Field(serialization_alias="tradeId")
    significance_score: int = Field(serialization_alias="significanceScore")
    summary: str
    signal_category: list[str] = Field(serialization_alias="signalCategory")
    recommended_action: RecommendedAction = Field(serialization_alias="recommendedAction")
    reasoning: Optional[str] = None
    model_version: Optional[str] = Field(default=None, serialization_alias="modelVersion")
    generated_at: datetime = Field(serialization_alias="generatedAt")


class InsiderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    type: InsiderType
    image_url: Optional[str] = Field(default=None, serialization_alias="imageUrl")
    metadata: dict[str, Any] = Field(validation_alias="metadata_")
    created_at: datetime = Field(serialization_alias="createdAt")


class InsiderDetailResponse(InsiderResponse):
    trades: list["TradeResponse"] = []


class TickerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    symbol: str
    company_name: Optional[str] = Field(default=None, serialization_alias="companyName")
    sector: Optional[str] = None
    industry: Optional[str] = None
    cached_price: Optional[Decimal] = Field(default=None, serialization_alias="cachedPrice")
    price_updated_at: Optional[datetime] = Field(
        default=None, serialization_alias="priceUpdatedAt"
    )
    created_at: datetime = Field(serialization_alias="createdAt")

    @field_serializer("cached_price")
    def serialize_cached_price(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None


class TradeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    insider_id: str = Field(serialization_alias="insiderId")
    ticker: Optional[str] = None
    asset_name: str = Field(serialization_alias="assetName")
    asset_type: AssetType = Field(serialization_alias="assetType")
    action: TradeAction
    amount_low: Optional[int] = Field(default=None, serialization_alias="amountLow")
    amount_high: Optional[int] = Field(default=None, serialization_alias="amountHigh")
    traded_at: datetime = Field(serialization_alias="tradedAt")
    reported_at: datetime = Field(serialization_alias="reportedAt")
    source: TradeSource
    source_url: Optional[str] = Field(default=None, serialization_alias="sourceUrl")
    source_filing_id: Optional[str] = Field(
        default=None, serialization_alias="sourceFilingId"
    )
    raw_data: Optional[dict[str, Any]] = Field(default=None, serialization_alias="rawData")
    created_at: datetime = Field(serialization_alias="createdAt")
    insider: Optional[InsiderResponse] = None
    annotation: Optional[AnnotationResponse] = None
    ticker_record: Optional[TickerResponse] = Field(
        default=None, serialization_alias="tickerRecord"
    )

    @field_serializer("amount_low", "amount_high")
    def serialize_bigint(self, value: Optional[int]) -> Optional[int]:
        return int(value) if value is not None else None


class PaginatedTradesResponse(BaseModel):
    items: list[TradeResponse]
    limit: int
    offset: int
    count: int


InsiderDetailResponse.model_rebuild()
