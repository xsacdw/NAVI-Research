import asyncio

from navi_research.dedup import deduplicate
from navi_research.models import Paper
from navi_research.sources.arxiv_api import ArxivSource
from navi_research.sources.core_api import CoreSource
from navi_research.sources.crossref import CrossrefSource
from navi_research.sources.openalex import OpenAlexSource
from navi_research.sources.semantic import SemanticScholarSource


class SearchOrchestrator:
    """5개 소스를 병렬 호출하고 결과를 통합"""

    def __init__(self):
        self.openalex = OpenAlexSource()
        self.semantic = SemanticScholarSource()
        self.arxiv = ArxivSource()
        self.core = CoreSource()
        self.crossref = CrossrefSource()

    async def search(
        self,
        query: str,
        limit: int = 20,
        year: str | None = None,
        sources: list[str] | None = None,
    ) -> list[Paper]:
        active = self._get_active_sources(sources)
        tasks = [s.search(query, limit=limit) for s in active]

        results_nested = await asyncio.gather(*tasks, return_exceptions=True)

        all_papers: list[Paper] = []
        for result in results_nested:
            if isinstance(result, list):
                all_papers.extend(result)

        deduped = deduplicate(all_papers)
        return deduped[:limit]

    def _get_active_sources(self, names: list[str] | None):
        source_map = {
            "openalex": self.openalex,
            "semantic": self.semantic,
            "arxiv": self.arxiv,
            "core": self.core,
            "crossref": self.crossref,
        }
        if names:
            return [source_map[n] for n in names if n in source_map]
        return list(source_map.values())
