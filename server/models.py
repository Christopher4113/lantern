import enum
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class InsiderType(str, enum.Enum):
    POLITICIAN = "POLITICIAN"
    EXECUTIVE = "EXECUTIVE"
    FUND_MANAGER = "FUND_MANAGER"


class AssetType(str, enum.Enum):
    STOCK = "STOCK"
    OPTION = "OPTION"
    BOND = "BOND"
    ETF = "ETF"
    OTHER = "OTHER"


class TradeAction(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    EXCHANGE = "EXCHANGE"


class TradeSource(str, enum.Enum):
    HOUSE_CLERK = "HOUSE_CLERK"
    SENATE_EFD = "SENATE_EFD"
    SEC_FORM4 = "SEC_FORM4"
    SEC_13F = "SEC_13F"


class RecommendedAction(str, enum.Enum):
    STRONG_FOLLOW = "STRONG_FOLLOW"
    WEAK_FOLLOW = "WEAK_FOLLOW"
    MONITOR = "MONITOR"
    IGNORE = "IGNORE"


insider_type_enum = Enum(
    InsiderType,
    name="InsiderType",
    create_type=False,
    values_callable=lambda enum_cls: [member.value for member in enum_cls],
)

asset_type_enum = Enum(
    AssetType,
    name="AssetType",
    create_type=False,
    values_callable=lambda enum_cls: [member.value for member in enum_cls],
)

trade_action_enum = Enum(
    TradeAction,
    name="TradeAction",
    create_type=False,
    values_callable=lambda enum_cls: [member.value for member in enum_cls],
)

trade_source_enum = Enum(
    TradeSource,
    name="TradeSource",
    create_type=False,
    values_callable=lambda enum_cls: [member.value for member in enum_cls],
)

recommended_action_enum = Enum(
    RecommendedAction,
    name="RecommendedAction",
    create_type=False,
    values_callable=lambda enum_cls: [member.value for member in enum_cls],
)


class Insider(Base):
    __tablename__ = "Insider"

    id: Mapped[str] = mapped_column("id", String, primary_key=True)
    name: Mapped[str] = mapped_column("name", String, nullable=False)
    type: Mapped[InsiderType] = mapped_column("type", insider_type_enum, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column("imageUrl", String, nullable=True)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=False), nullable=False
    )

    trades: Mapped[list["Trade"]] = relationship(
        "Trade", back_populates="insider", cascade="all, delete-orphan"
    )


class Ticker(Base):
    __tablename__ = "Ticker"

    symbol: Mapped[str] = mapped_column("symbol", String, primary_key=True)
    company_name: Mapped[Optional[str]] = mapped_column("companyName", String, nullable=True)
    sector: Mapped[Optional[str]] = mapped_column("sector", String, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column("industry", String, nullable=True)
    cached_price: Mapped[Optional[Decimal]] = mapped_column(
        "cachedPrice", Numeric(18, 4), nullable=True
    )
    price_updated_at: Mapped[Optional[datetime]] = mapped_column(
        "priceUpdatedAt", DateTime(timezone=False), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=False), nullable=False
    )

    trades: Mapped[list["Trade"]] = relationship(
        "Trade",
        back_populates="ticker_record",
        foreign_keys="Trade.ticker",
    )


class Trade(Base):
    __tablename__ = "Trade"

    id: Mapped[str] = mapped_column("id", String, primary_key=True)
    insider_id: Mapped[str] = mapped_column(
        "insiderId", String, ForeignKey("Insider.id", ondelete="CASCADE"), nullable=False
    )
    ticker: Mapped[Optional[str]] = mapped_column(
        "ticker",
        String,
        ForeignKey("Ticker.symbol", ondelete="SET NULL"),
        nullable=True,
    )
    asset_name: Mapped[str] = mapped_column("assetName", String, nullable=False)
    asset_type: Mapped[AssetType] = mapped_column("assetType", asset_type_enum, nullable=False)
    action: Mapped[TradeAction] = mapped_column("action", trade_action_enum, nullable=False)
    amount_low: Mapped[Optional[int]] = mapped_column("amountLow", BigInteger, nullable=True)
    amount_high: Mapped[Optional[int]] = mapped_column("amountHigh", BigInteger, nullable=True)
    traded_at: Mapped[datetime] = mapped_column("tradedAt", DateTime(timezone=False), nullable=False)
    reported_at: Mapped[datetime] = mapped_column(
        "reportedAt", DateTime(timezone=False), nullable=False
    )
    source: Mapped[TradeSource] = mapped_column("source", trade_source_enum, nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column("sourceUrl", String, nullable=True)
    source_filing_id: Mapped[Optional[str]] = mapped_column(
        "sourceFilingId", String, nullable=True, unique=True
    )
    raw_data: Mapped[Optional[dict]] = mapped_column("rawData", JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=False), nullable=False
    )

    insider: Mapped["Insider"] = relationship("Insider", back_populates="trades")
    ticker_record: Mapped[Optional["Ticker"]] = relationship(
        "Ticker",
        back_populates="trades",
        foreign_keys=[ticker],
    )
    annotation: Mapped[Optional["Annotation"]] = relationship(
        "Annotation",
        back_populates="trade",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Annotation(Base):
    __tablename__ = "Annotation"

    id: Mapped[str] = mapped_column("id", String, primary_key=True)
    trade_id: Mapped[str] = mapped_column(
        "tradeId",
        String,
        ForeignKey("Trade.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    significance_score: Mapped[int] = mapped_column("significanceScore", Integer, nullable=False)
    summary: Mapped[str] = mapped_column("summary", Text, nullable=False)
    signal_category: Mapped[list[str]] = mapped_column(
        "signalCategory", ARRAY(String), nullable=False
    )
    recommended_action: Mapped[RecommendedAction] = mapped_column(
        "recommendedAction", recommended_action_enum, nullable=False
    )
    reasoning: Mapped[Optional[str]] = mapped_column("reasoning", Text, nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column("modelVersion", String, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(
        "generatedAt", DateTime(timezone=False), nullable=False
    )

    trade: Mapped["Trade"] = relationship("Trade", back_populates="annotation")
