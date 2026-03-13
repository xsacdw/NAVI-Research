import httpx

from navi_research.models import Paper

BASE_URL = "https://api.core.ac.uk/v3"


class CoreSource:
    """CORE API — OA 풀텍스트 최대 규모"""

    async def _fetch(self, params: dict) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/search/works",
                params=params,
                timeout=30,
            )
            resp.raise_for_status()
            return resp.json()

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params = {"q": query, "limit": min(limit, 50)}
        try:
            data = await self._fetch(params)
        except (httpx.HTTPStatusError, httpx.ConnectError):
            return []  # CORE가 응답하지 않으면 빈 결과
        return [self._to_paper(r) for r in data.get("results", [])[:limit]]

    def _to_paper(self, item: dict) -> Paper:
        return Paper(
            title=item.get("title", "Untitled"),
            authors=[a.get("name", "") for a in item.get("authors", [])],
            year=item.get("yearPublished", 0) or 0,
            source="core",
            doi=item.get("doi"),
            abstract=item.get("abstract"),
            url=item.get("downloadUrl") or item.get("sourceFulltextUrls", [None])[0] if item.get("sourceFulltextUrls") else None,
            pdf_url=item.get("downloadUrl"),
        )
