import httpx

from navi_research.models import Paper

BASE_URL = "https://api.semanticscholar.org/graph/v1"
FIELDS = "paperId,title,authors,year,externalIds,abstract,url,citationCount,tldr,venue,isOpenAccess,openAccessPdf"


class SemanticScholarSource:
    """Semantic Scholar API — AI 요약(TLDR) + 추천"""

    async def _fetch(self, params: dict) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/paper/search",
                params=params,
                timeout=30,
            )
            resp.raise_for_status()
            return resp.json()

    async def search(self, query: str, limit: int = 20, year: str | None = None) -> list[Paper]:
        params = {
            "query": query,
            "limit": min(limit, 100),
            "fields": FIELDS,
        }
        if year:
            params["year"] = year

        data = await self._fetch(params)
        return [self._to_paper(p) for p in data.get("data", [])[:limit]]

    def _to_paper(self, item: dict) -> Paper:
        ext_ids = item.get("externalIds") or {}
        oa_pdf = item.get("openAccessPdf") or {}
        tldr_obj = item.get("tldr") or {}

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
