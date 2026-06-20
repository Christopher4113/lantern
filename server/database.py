import os
from urllib.parse import parse_qs, urlparse, urlunparse

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

load_dotenv()


def _build_engine_config() -> tuple[str, dict]:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    if url.startswith("postgresql://"):
        async_url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgres://"):
        async_url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    else:
        async_url = url

    parsed = urlparse(async_url)
    query = parse_qs(parsed.query)
    connect_args: dict = {}

    ssl_mode = query.get("sslmode", [""])[0]
    if ssl_mode in {"require", "verify-ca", "verify-full"}:
        connect_args["ssl"] = True

    clean_url = urlunparse(parsed._replace(query=""))
    return clean_url, connect_args


DATABASE_URL, CONNECT_ARGS = _build_engine_config()

engine = create_async_engine(DATABASE_URL, connect_args=CONNECT_ARGS, echo=False)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
