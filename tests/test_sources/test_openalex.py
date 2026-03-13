import json
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

from navi_research.models import Paper
from navi_research.sources.openalex import OpenAlexSource


@pytest.fixture
def sample_response():
    fixture = Path(__file__).parent.parent / "fixtures" / "openalex_response.json"
    return json.loads(fixture.read_text())


@pytest.mark.asyncio
async def test_search_returns_papers(sample_response):
    source = OpenAlexSource()
    with patch.object(source, "_fetch", new_callable=AsyncMock, return_value=sample_response):
        papers = await source.search("attention mechanism", limit=5)

    assert len(papers) > 0
    assert all(isinstance(p, Paper) for p in papers)
    assert all(p.source == "openalex" for p in papers)


@pytest.mark.asyncio
async def test_search_respects_limit(sample_response):
    source = OpenAlexSource()
    with patch.object(source, "_fetch", new_callable=AsyncMock, return_value=sample_response):
        papers = await source.search("attention", limit=1)

    assert len(papers) <= 1
