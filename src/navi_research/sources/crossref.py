import httpx

from navi_research.models import Paper

BASE_URL = "https://api.crossref.org"


class CrossrefSource:
    """Crossref API — DOI 메타데이터 + 인용 정보"""

    async def _fetch(self, params: dict) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/works",
                params=params,
                headers={"User-Agent": "navi-research/0.1 (mailto:user@example.com)"},
                timeout=30,
            )
            resp.raise_for_status()
            return resp.json()

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params = {
            "query": query,
            "rows": min(limit, 50),
            "sort": "relevance",
        }
        try:
            data = await self._fetch(params)
        except (httpx.HTTPStatusError, httpx.ConnectError):
            return []
        items = data.get("message", {}).get("items", [])
        return [self._to_paper(item) for item in items[:limit]]

    def _to_paper(self, item: dict) -> Paper:
        title_list = item.get("title", ["Untitled"])
        title = title_list[0] if title_list else "Untitled"

        authors = []
        for a in item.get("author", []):
            name = f"{a.get('given', '')} {a.get('family', '')}".strip()
            if name:
                authors.append(name)

        published = item.get("published-print") or item.get("published-online") or {}
        date_parts = published.get("date-parts", [[0]])[0]
        year = date_parts[0] if date_parts else 0

        return Paper(
            title=title,
            authors=authors or ["Unknown"],
            year=year,
            source="crossref",
            doi=item.get("DOI"),
            url=item.get("URL"),
            citation_count=item.get("is-referenced-by-count"),
            venue=item.get("container-title", [None])[0] if item.get("container-title") else None,
        )
