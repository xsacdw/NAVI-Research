import xml.etree.ElementTree as ET
from typing import Any
from urllib.parse import quote

import httpx

from navi_research.models import Paper

BASE_URL = "http://export.arxiv.org/api/query"
NS = {"atom": "http://www.w3.org/2005/Atom"}


class ArxivSource:
    """arXiv API — CS/물리/수학 프리프린트"""

    async def _fetch_xml(self, params: dict[str, Any]) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.get(BASE_URL, params=params, timeout=30)
            resp.raise_for_status()
            return resp.text

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params: dict[str, Any] = {
            "search_query": f"all:{quote(query)}",
            "start": 0,
            "max_results": min(limit, 50),
            "sortBy": "relevance",
        }
        xml_text = await self._fetch_xml(params)
        return self._parse(xml_text, limit)

    def _parse(self, xml_text: str, limit: int) -> list[Paper]:
        root = ET.fromstring(xml_text)
        papers: list[Paper] = []
        entries = root.findall("atom:entry", NS)
        for entry in entries[:limit]:
            arxiv_id_raw = entry.findtext("atom:id", "", NS) or ""
            arxiv_id = arxiv_id_raw.split("/abs/")[-1].rstrip("v0123456789").rstrip("/")

            pdf_link: str | None = None
            for link in entry.findall("atom:link", NS):
                if link.get("type") == "application/pdf":
                    pdf_link = link.get("href")

            authors = [a.findtext("atom:name", "", NS) or "" for a in entry.findall("atom:author", NS)]
            published = entry.findtext("atom:published", "", NS) or ""
            year = int(published[:4]) if published else 0

            title_text = entry.findtext("atom:title", "Untitled", NS) or "Untitled"
            papers.append(Paper(
                title=title_text.strip(),
                authors=authors,
                year=year,
                source="arxiv",
                abstract=entry.findtext("atom:summary", None, NS),
                url=f"https://arxiv.org/abs/{arxiv_id}",
                pdf_url=pdf_link,
                arxiv_id=arxiv_id,
            ))
        return papers
