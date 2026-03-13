import json
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

from navi_research.models import Paper
from navi_research.sources.semantic import SemanticScholarSource


@pytest.fixture
def sample_response():
    fixture = Path(__file__).parent.parent / "fixtures" / "semantic_response.json"
    return json.loads(fixture.read_text())


@pytest.mark.asyncio
async def test_search_returns_papers_with_tldr(sample_response):
    source = SemanticScholarSource()
    with patch.object(source, "_fetch", new_callable=AsyncMock, return_value=sample_response):
        papers = await source.search("transformer", limit=5)

    assert len(papers) > 0
    assert all(isinstance(p, Paper) for p in papers)
    assert all(p.source == "semantic_scholar" for p in papers)
    has_tldr = any(p.tldr is not None for p in papers)
    assert has_tldr
