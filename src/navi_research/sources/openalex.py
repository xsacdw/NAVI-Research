import httpx

from navi_research.models import Paper

BASE_URL = "https://api.openalex.org"


class OpenAlexSource:
    """OpenAlex API 클라이언트 — 4.5억+ 논문 검색"""

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

    async def search(self, query: str, limit: int = 20, year: str | None = None, sort: str = "relevance_score:desc") -> list[Paper]:
        params = {
            "search": query,
            "per_page": min(limit, 50),
            "sort": sort,
        }
        if year:
            params["filter"] = f"publication_year:{year}"

        data = await self._fetch(params)
        return [self._to_paper(w) for w in data.get("results", [])[:limit]]

    def _to_paper(self, work: dict) -> Paper:
        authors = [a["author"]["display_name"] for a in work.get("authorships", [])]
        loc = work.get("primary_location") or {}
        doi_raw = work.get("doi", "")
        doi = doi_raw.replace("https://doi.org/", "") if doi_raw else None

        return Paper(
            title=work.get("title", "Untitled"),
            authors=authors,
            year=work.get("publication_year", 0),
            source="openalex",
            doi=doi,
            url=loc.get("landing_page_url"),
            pdf_url=loc.get("pdf_url"),
            citation_count=work.get("cited_by_count"),
        )
