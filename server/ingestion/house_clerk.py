"""
House Clerk Periodic Transaction Report (PTR) ingestion — step 1.

Fetch and identify PTR filings from the annual House Clerk XML index.
PDF parsing and database insertion are handled in later pipeline steps.

Run directly to inspect the current year's feed:

    python -m ingestion.house_clerk

Or from server/:

    python ingestion/house_clerk.py
"""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Any

import httpx

HOUSE_CLERK_XML_URL = (
    "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}FD.xml"
)
HOUSE_CLERK_PTR_PDF_URL = (
    "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/{year}/{doc_id}.pdf"
)
HOUSE_CLERK_FINANCIAL_PDF_URL = (
    "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}/{doc_id}.pdf"
)

PTR_FILING_TYPES = frozenset({"P", "X"})
DEFAULT_TIMEOUT_SECONDS = 30.0


class HouseClerkFetchError(Exception):
    """Raised when the House Clerk XML feed cannot be fetched."""


def fetch_house_clerk_xml(year: int, timeout: float = DEFAULT_TIMEOUT_SECONDS) -> bytes:
    """
    Fetch the raw annual financial disclosure XML index for a given year.

    Raises HouseClerkFetchError on network or HTTP failures.
    """
    url = HOUSE_CLERK_XML_URL.format(year=year)

    try:
        with httpx.Client(timeout=timeout, follow_redirects=True) as client:
            response = client.get(url)
            response.raise_for_status()
            return response.content
    except httpx.HTTPStatusError as exc:
        raise HouseClerkFetchError(
            f"House Clerk XML request failed with status {exc.response.status_code}: {url}"
        ) from exc
    except httpx.RequestError as exc:
        raise HouseClerkFetchError(
            f"Network error while fetching House Clerk XML: {exc}"
        ) from exc


def _element_to_dict(element: ET.Element) -> dict[str, Any]:
    """Convert a single XML element and its direct children into a flat dict."""
    record: dict[str, Any] = {"_tag": element.tag}

    for child in element:
        text = child.text.strip() if child.text and child.text.strip() else None
        record[child.tag] = text

    return record


def parse_filing_index(xml_bytes: bytes) -> list[dict[str, Any]]:
    """
    Parse the House Clerk XML feed into a list of filing records.

    Each record is a dict of all direct child fields on the filing element
    (typically <Member>), plus a `_tag` key with the element name.
    """
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as exc:
        raise ValueError(f"Failed to parse House Clerk XML: {exc}") from exc

    return [_element_to_dict(child) for child in root]


def filter_ptr_filings(filings: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Return only Periodic Transaction Report filings (FilingType P or X)."""
    return [
        filing
        for filing in filings
        if filing.get("FilingType") in PTR_FILING_TYPES
    ]


def format_member_name(filing: dict[str, Any]) -> str:
    """Build a readable member name from Prefix / First / Last / Suffix fields."""
    parts = [
        filing.get("Prefix"),
        filing.get("First"),
        filing.get("Last"),
        filing.get("Suffix"),
    ]
    return " ".join(part for part in parts if part)


def build_pdf_url(filing: dict[str, Any], year: int) -> str:
    """
    Construct the PDF URL for a filing based on its FilingType.

    Verified patterns (2025 feed):
    - P filings: /public_disc/ptr-pdfs/{year}/{DocID}.pdf
    - X filings: /public_disc/financial-pdfs/{year}/{DocID}.pdf
    """
    doc_id = filing.get("DocID")
    if not doc_id:
        raise ValueError("Filing is missing DocID — cannot build PDF URL")

    filing_type = filing.get("FilingType")
    filing_year = filing.get("Year")
    resolved_year = int(filing_year) if filing_year else year

    if filing_type == "P":
        return HOUSE_CLERK_PTR_PDF_URL.format(year=resolved_year, doc_id=doc_id)

    return HOUSE_CLERK_FINANCIAL_PDF_URL.format(year=resolved_year, doc_id=doc_id)


def _print_sample_filings(filings: list[dict[str, Any]], year: int, limit: int = 5) -> None:
    print(f"\nFirst {limit} PTR filings:")
    for index, filing in enumerate(filings[:limit], start=1):
        print(f"\n--- {index} ---")
        print(f"Member:      {format_member_name(filing)}")
        print(f"Filing type: {filing.get('FilingType')}")
        print(f"Filing date: {filing.get('FilingDate')}")
        print(f"Doc ID:      {filing.get('DocID')}")
        print(f"State/Dist:  {filing.get('StateDst')}")
        print(f"PDF URL:     {build_pdf_url(filing, year)}")


def main() -> int:
    year = datetime.now().year
    print(f"Fetching House Clerk disclosure index for {year}...")

    try:
        xml_bytes = fetch_house_clerk_xml(year)
    except HouseClerkFetchError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    filings = parse_filing_index(xml_bytes)
    ptr_filings = filter_ptr_filings(filings)

    print(f"Total filings in XML:     {len(filings)}")
    print(f"PTR filings (P + X):      {len(ptr_filings)}")

    filing_types: dict[str, int] = {}
    for filing in filings:
        filing_type = filing.get("FilingType") or "UNKNOWN"
        filing_types[filing_type] = filing_types.get(filing_type, 0) + 1

    print("\nFiling type breakdown:")
    for filing_type, count in sorted(filing_types.items()):
        print(f"  {filing_type}: {count}")

    if ptr_filings:
        _print_sample_filings(ptr_filings, year)
    else:
        print("\nNo PTR filings found for this year.")

    if filings:
        print("\nSample raw filing record (first entry, all XML fields):")
        print(json.dumps(filings[0], indent=2))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
