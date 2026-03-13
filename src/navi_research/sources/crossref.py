from typing import Any

import httpx

from navi_research.models import Paper

BASE_URL = "https://api.crossref.org"


class CrossrefSource:
    """Crossref API — DOI 메타데이터 + 인용 정보"""

    async def _fetch(self, params: dict[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/works",
                params=params,
                headers={"User-Agent": "navi-research/0.1 (mailto:user@example.com)"},
                timeout=30,
            )
            resp.raise_for_status()
            result: dict[str, Any] = resp.json()
            return result

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params: dict[str, Any] = {
            "query": query,
            "rows": min(limit, 50),
            "sort": "relevance",
        }
        try:
            data = await self._fetch(params)
        except (httpx.HTTPStatusError, httpx.ConnectError):
            return []
        items: list[dict[str, Any]] = data.get("message", {}).get("items", [])
        return [self._to_paper(item) for item in items[:limit]]

    def _to_paper(self, item: dict[str, Any]) -> Paper:
        title_list: list[str] = item.get("title", ["Untitled"])
        title = title_list[0] if title_list else "Untitled"

        authors: list[str] = []
        for a in item.get("author", []):
            name = f"{a.get('given', '')} {a.get('family', '')}".strip()
            if name:
                authors.append(name)

        published: dict[str, Any] = item.get("published-print") or item.get("published-online") or {}
        date_parts: list[list[int]] = published.get("date-parts", [[0]])
        year = date_parts[0][0] if date_parts and date_parts[0] else 0

        container: list[str] = item.get("container-title", [])
        venue = container[0] if container else None

        return Paper(
            title=title,
            authors=authors or ["Unknown"],
            year=year,
            source="crossref",
            doi=item.get("DOI"),
            url=item.get("URL"),
            citation_count=item.get("is-referenced-by-count"),
            venue=venue,
        )
