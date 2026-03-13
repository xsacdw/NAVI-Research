from typing import Any

import httpx

from navi_research.models import Paper

BASE_URL = "https://api.core.ac.uk/v3"


class CoreSource:
    """CORE API — OA 풀텍스트 최대 규모"""

    async def _fetch(self, params: dict[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/search/works",
                params=params,
                timeout=30,
            )
            resp.raise_for_status()
            result: dict[str, Any] = resp.json()
            return result

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params: dict[str, Any] = {"q": query, "limit": min(limit, 50)}
        try:
            data = await self._fetch(params)
        except (httpx.HTTPStatusError, httpx.ConnectError):
            return []  # CORE가 응답하지 않으면 빈 결과
        results: list[dict[str, Any]] = data.get("results", [])
        return [self._to_paper(r) for r in results[:limit]]

    def _to_paper(self, item: dict[str, Any]) -> Paper:
        source_urls: list[str] = item.get("sourceFulltextUrls", [])
        url = item.get("downloadUrl") or (source_urls[0] if source_urls else None)

        return Paper(
            title=item.get("title", "Untitled"),
            authors=[a.get("name", "") for a in item.get("authors", [])],
            year=item.get("yearPublished", 0) or 0,
            source="core",
            doi=item.get("doi"),
            abstract=item.get("abstract"),
            url=url,
            pdf_url=item.get("downloadUrl"),
        )
