from unittest.mock import AsyncMock, patch

import pytest

from navi_research.models import Paper
from navi_research.sources.arxiv_api import ArxivSource

SAMPLE_XML = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Attention Is All You Need</title>
    <author><name>Ashish Vaswani</name></author>
    <author><name>Noam Shazeer</name></author>
    <published>2017-06-12T00:00:00Z</published>
    <summary>The dominant sequence transduction models...</summary>
    <id>http://arxiv.org/abs/1706.03762v1</id>
    <link href="http://arxiv.org/pdf/1706.03762v1" type="application/pdf"/>
  </entry>
</feed>"""


@pytest.mark.asyncio
async def test_search_returns_papers():
    source = ArxivSource()
    with patch.object(source, "_fetch_xml", new_callable=AsyncMock, return_value=SAMPLE_XML):
        papers = await source.search("attention mechanism", limit=5)

    assert len(papers) == 1
    assert papers[0].source == "arxiv"
    assert papers[0].arxiv_id is not None
    assert papers[0].pdf_url is not None
