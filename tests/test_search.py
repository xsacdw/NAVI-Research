from unittest.mock import AsyncMock, patch

import pytest

from navi_research.models import Paper
from navi_research.search import SearchOrchestrator


def _mock_papers(source: str, count: int) -> list[Paper]:
    return [
        Paper(title=f"Paper {i}", authors=["Author"], year=2024, source=source, doi=f"10.{source}/{i}")
        for i in range(count)
    ]


@pytest.mark.asyncio
async def test_search_aggregates_from_multiple_sources():
    orch = SearchOrchestrator()

    with patch.object(orch.openalex, "search", new_callable=AsyncMock, return_value=_mock_papers("openalex", 3)), \
         patch.object(orch.semantic, "search", new_callable=AsyncMock, return_value=_mock_papers("semantic_scholar", 2)), \
         patch.object(orch.arxiv, "search", new_callable=AsyncMock, return_value=_mock_papers("arxiv", 1)), \
         patch.object(orch.core, "search", new_callable=AsyncMock, return_value=[]), \
         patch.object(orch.crossref, "search", new_callable=AsyncMock, return_value=[]):
        results = await orch.search("test query", limit=20)

    assert len(results) == 6
    sources = {p.source for p in results}
    assert "openalex" in sources
    assert "semantic_scholar" in sources
