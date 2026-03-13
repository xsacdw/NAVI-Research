from typing import Any

import httpx

from navi_research.models import Paper

BASE_URL = "https://api.semanticscholar.org/graph/v1"
FIELDS = "paperId,title,authors,year,externalIds,abstract,url,citationCount,tldr,venue,isOpenAccess,openAccessPdf"


class SemanticScholarSource:
    """Semantic Scholar API — AI 요약(TLDR) + 추천"""

    async def _fetch(self, params: dict[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/paper/search",
                params=params,
                timeout=30,
            )
            resp.raise_for_status()
            result: dict[str, Any] = resp.json()
            return result

    async def search(self, query: str, limit: int = 20, year: str | None = None) -> list[Paper]:
        params: dict[str, Any] = {
            "query": query,
            "limit": min(limit, 100),
            "fields": FIELDS,
        }
        if year:
            params["year"] = year

        data = await self._fetch(params)
        items: list[dict[str, Any]] = data.get("data", [])
        return [self._to_paper(p) for p in items[:limit]]

    def _to_paper(self, item: dict[str, Any]) -> Paper:
        ext_ids: dict[str, Any] = item.get("externalIds") or {}
        oa_pdf: dict[str, Any] = item.get("openAccessPdf") or {}
        tldr_obj: dict[str, Any] = item.get("tldr") or {}

        return Paper(
            title=item.get("title", "Untitled"),
            authors=[a["name"] for a in item.get("authors", [])],
            year=item.get("year", 0),
            source="semantic_scholar",
            doi=ext_ids.get("DOI"),
            abstract=item.get("abstract"),
            url=item.get("url"),
            pdf_url=oa_pdf.get("url"),
            citation_count=item.get("citationCount"),
            tldr=tldr_obj.get("text"),
            venue=item.get("venue"),
            arxiv_id=ext_ids.get("ArXiv"),
        )
