# navi-research 구현 계획

> **실행 방법:** `/executing-plans` 워크플로우를 사용하여 이 계획을 구현합니다.

**목표:** 5개 무료 학술 API에서 논문을 검색·수집하여 JSON/Markdown/BibTeX로 출력하는 CLI 도구
**아키텍처:** 모듈러 소스 클라이언트 → 통합 Paper 모델 → 중복 제거 → 다중 형식 출력
**기술 스택:** Python 3.12+, uv, httpx, pydantic, rich, pytest

---

## Task 1: 프로젝트 초기화

**Files:**
- Create: `pyproject.toml`
- Create: `src/navi_research/__init__.py`
- Create: `tests/__init__.py`

- [ ] **Step 1: uv 프로젝트 초기화**

Run:
```bash
cd /Users/junseong/NAVI-PJ
uv init --name navi-research --python 3.12
```

- [ ] **Step 2: pyproject.toml 설정**

```toml
[project]
name = "navi-research"
version = "0.1.0"
description = "Academic paper search CLI using free scholarly APIs"
requires-python = ">=3.12"
dependencies = [
    "httpx>=0.27",
    "pydantic>=2.0",
    "rich>=13.0",
]

[project.scripts]
navi-research = "navi_research.cli:main"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]

[dependency-groups]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
]
```

- [ ] **Step 3: 디렉토리 구조 생성**

```bash
mkdir -p src/navi_research/sources
mkdir -p src/navi_research/exporters
mkdir -p tests/test_sources
mkdir -p tests/test_exporters
touch src/navi_research/__init__.py
touch src/navi_research/sources/__init__.py
touch src/navi_research/exporters/__init__.py
touch tests/__init__.py
touch tests/test_sources/__init__.py
touch tests/test_exporters/__init__.py
```

- [ ] **Step 4: 의존성 설치**

```bash
uv sync
```

- [ ] **Step 5: 커밋**

```bash
git init
git add .
git commit -m "chore: initialize navi-research project"
```

---

## Task 2: Paper 데이터 모델

**Files:**
- Create: `src/navi_research/models.py`
- Create: `tests/test_models.py`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_models.py
from navi_research.models import Paper


def test_paper_creation_with_required_fields():
    paper = Paper(
        title="Attention Is All You Need",
        authors=["Vaswani, A.", "Shazeer, N."],
        year=2017,
        source="openalex",
    )
    assert paper.title == "Attention Is All You Need"
    assert paper.year == 2017
    assert paper.source == "openalex"


def test_paper_creation_with_all_fields():
    paper = Paper(
        title="BERT",
        authors=["Devlin, J."],
        year=2019,
        source="semantic_scholar",
        doi="10.18653/v1/N19-1423",
        abstract="We introduce BERT...",
        url="https://arxiv.org/abs/1810.04805",
        pdf_url="https://arxiv.org/pdf/1810.04805",
        citation_count=50000,
        tldr="BERT는 양방향 트랜스포머 기반 언어 모델",
    )
    assert paper.doi == "10.18653/v1/N19-1423"
    assert paper.citation_count == 50000
    assert paper.tldr is not None


def test_paper_doi_is_optional():
    paper = Paper(
        title="No DOI Paper",
        authors=["Unknown"],
        year=2024,
        source="arxiv",
    )
    assert paper.doi is None
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

Run: `uv run pytest tests/test_models.py -v`
Expected: FAIL (ImportError: cannot import 'Paper')

- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/models.py
from pydantic import BaseModel


class Paper(BaseModel):
    """통합 논문 데이터 모델. 모든 소스가 이 모델로 변환됨."""

    title: str
    authors: list[str]
    year: int
    source: str  # openalex, semantic_scholar, arxiv, core, crossref

    doi: str | None = None
    abstract: str | None = None
    url: str | None = None
    pdf_url: str | None = None
    citation_count: int | None = None
    tldr: str | None = None  # Semantic Scholar AI 요약
    venue: str | None = None  # 저널/학회명
    arxiv_id: str | None = None
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `uv run pytest tests/test_models.py -v`
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/navi_research/models.py tests/test_models.py
git commit -m "feat: add Paper data model"
```

---

## Task 3: OpenAlex API 클라이언트

**Files:**
- Create: `src/navi_research/sources/openalex.py`
- Create: `tests/test_sources/test_openalex.py`
- Create: `tests/fixtures/openalex_response.json`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_sources/test_openalex.py
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
        papers = await source.search("attention", limit=3)

    assert len(papers) <= 3
```

- [ ] **Step 2: 테스트 픽스처 생성**

```json
// tests/fixtures/openalex_response.json
{
  "results": [
    {
      "title": "Attention Is All You Need",
      "authorships": [
        {"author": {"display_name": "Ashish Vaswani"}},
        {"author": {"display_name": "Noam Shazeer"}}
      ],
      "publication_year": 2017,
      "doi": "https://doi.org/10.48550/arXiv.1706.03762",
      "primary_location": {
        "landing_page_url": "https://arxiv.org/abs/1706.03762",
        "pdf_url": "https://arxiv.org/pdf/1706.03762"
      },
      "cited_by_count": 120000,
      "abstract_inverted_index": null
    },
    {
      "title": "BERT: Pre-training of Deep Bidirectional Transformers",
      "authorships": [
        {"author": {"display_name": "Jacob Devlin"}}
      ],
      "publication_year": 2019,
      "doi": "https://doi.org/10.18653/v1/N19-1423",
      "primary_location": {
        "landing_page_url": "https://arxiv.org/abs/1810.04805",
        "pdf_url": null
      },
      "cited_by_count": 50000,
      "abstract_inverted_index": null
    }
  ]
}
```

- [ ] **Step 3: 테스트 실행 → 실패 확인**

Run: `uv run pytest tests/test_sources/test_openalex.py -v`
Expected: FAIL (ImportError)

- [ ] **Step 4: 최소 구현**

```python
# src/navi_research/sources/openalex.py
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
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `uv run pytest tests/test_sources/test_openalex.py -v`
Expected: PASS (2 tests)

- [ ] **Step 6: 커밋**

```bash
git add src/navi_research/sources/openalex.py tests/test_sources/test_openalex.py tests/fixtures/
git commit -m "feat: add OpenAlex API source client"
```

---

## Task 4: Semantic Scholar API 클라이언트

**Files:**
- Create: `src/navi_research/sources/semantic.py`
- Create: `tests/test_sources/test_semantic.py`
- Create: `tests/fixtures/semantic_response.json`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_sources/test_semantic.py
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
    # Semantic Scholar는 TLDR을 제공해야 함
    has_tldr = any(p.tldr is not None for p in papers)
    assert has_tldr
```

- [ ] **Step 2: 테스트 픽스처 및 테스트 실패 확인**

```json
// tests/fixtures/semantic_response.json
{
  "data": [
    {
      "paperId": "abc123",
      "title": "Attention Is All You Need",
      "authors": [{"name": "Ashish Vaswani"}],
      "year": 2017,
      "externalIds": {"DOI": "10.48550/arXiv.1706.03762", "ArXiv": "1706.03762"},
      "abstract": "The dominant sequence transduction models...",
      "url": "https://www.semanticscholar.org/paper/abc123",
      "citationCount": 120000,
      "tldr": {"text": "A new network architecture based on attention mechanisms."},
      "venue": "NeurIPS",
      "isOpenAccess": true,
      "openAccessPdf": {"url": "https://arxiv.org/pdf/1706.03762"}
    }
  ]
}
```

Run: `uv run pytest tests/test_sources/test_semantic.py -v`
Expected: FAIL

- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/sources/semantic.py
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
```

- [ ] **Step 4: 테스트 통과 확인 & 커밋**

Run: `uv run pytest tests/test_sources/test_semantic.py -v`
Expected: PASS

```bash
git add src/navi_research/sources/semantic.py tests/test_sources/test_semantic.py tests/fixtures/semantic_response.json
git commit -m "feat: add Semantic Scholar API source client"
```

---

## Task 5: arXiv API 클라이언트

**Files:**
- Create: `src/navi_research/sources/arxiv_api.py`
- Create: `tests/test_sources/test_arxiv.py`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_sources/test_arxiv.py
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
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `uv run pytest tests/test_sources/test_arxiv.py -v`
Expected: FAIL

- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/sources/arxiv_api.py
import xml.etree.ElementTree as ET
from urllib.parse import quote

import httpx

from navi_research.models import Paper

BASE_URL = "http://export.arxiv.org/api/query"
NS = {"atom": "http://www.w3.org/2005/Atom"}


class ArxivSource:
    """arXiv API — CS/물리/수학 프리프린트"""

    async def _fetch_xml(self, params: dict) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.get(BASE_URL, params=params, timeout=30)
            resp.raise_for_status()
            return resp.text

    async def search(self, query: str, limit: int = 20) -> list[Paper]:
        params = {
            "search_query": f"all:{quote(query)}",
            "start": 0,
            "max_results": min(limit, 50),
            "sortBy": "relevance",
        }
        xml_text = await self._fetch_xml(params)
        return self._parse(xml_text, limit)

    def _parse(self, xml_text: str, limit: int) -> list[Paper]:
        root = ET.fromstring(xml_text)
        papers = []
        for entry in root.findall("atom:entry", NS)[:limit]:
            arxiv_id = entry.findtext("atom:id", "", NS).split("/abs/")[-1].replace("v1", "").strip()
            pdf_link = None
            for link in entry.findall("atom:link", NS):
                if link.get("type") == "application/pdf":
                    pdf_link = link.get("href")

            authors = [a.findtext("atom:name", "", NS) for a in entry.findall("atom:author", NS)]
            published = entry.findtext("atom:published", "", NS)
            year = int(published[:4]) if published else 0

            papers.append(Paper(
                title=entry.findtext("atom:title", "Untitled", NS).strip(),
                authors=authors,
                year=year,
                source="arxiv",
                abstract=entry.findtext("atom:summary", None, NS),
                url=f"https://arxiv.org/abs/{arxiv_id}",
                pdf_url=pdf_link,
                arxiv_id=arxiv_id,
            ))
        return papers
```

- [ ] **Step 4: 테스트 통과 확인 & 커밋**

Run: `uv run pytest tests/test_sources/test_arxiv.py -v`
Expected: PASS

```bash
git add src/navi_research/sources/arxiv_api.py tests/test_sources/test_arxiv.py
git commit -m "feat: add arXiv API source client"
```

---

## Task 6: CORE + Crossref 클라이언트

**Files:**
- Create: `src/navi_research/sources/core_api.py`
- Create: `src/navi_research/sources/crossref.py`
- Create: `tests/test_sources/test_core.py`
- Create: `tests/test_sources/test_crossref.py`

같은 TDD 패턴으로 구현. OpenAlex/Semantic Scholar와 동일한 구조:
- `_fetch()` 메서드로 API 호출
- `search()` 메서드로 검색
- `_to_paper()` 메서드로 Paper 모델 변환

*(코드는 Task 3~4와 같은 패턴이므로 구현 시 상세 작성)*

- [ ] **Step 1~4: CORE 구현 + 테스트**
- [ ] **Step 5~8: Crossref 구현 + 테스트**
- [ ] **Step 9: 커밋**

```bash
git add src/navi_research/sources/core_api.py src/navi_research/sources/crossref.py tests/test_sources/
git commit -m "feat: add CORE and Crossref API source clients"
```

---

## Task 7: 중복 제거 모듈

**Files:**
- Create: `src/navi_research/dedup.py`
- Create: `tests/test_dedup.py`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_dedup.py
from navi_research.dedup import deduplicate
from navi_research.models import Paper


def test_removes_duplicate_by_doi():
    papers = [
        Paper(title="Paper A", authors=["X"], year=2024, source="openalex", doi="10.1234/a"),
        Paper(title="Paper A (copy)", authors=["X"], year=2024, source="semantic_scholar", doi="10.1234/a"),
        Paper(title="Paper B", authors=["Y"], year=2024, source="openalex", doi="10.1234/b"),
    ]
    result = deduplicate(papers)
    assert len(result) == 2


def test_keeps_paper_without_doi():
    papers = [
        Paper(title="No DOI 1", authors=["X"], year=2024, source="arxiv"),
        Paper(title="No DOI 2", authors=["Y"], year=2024, source="core"),
    ]
    result = deduplicate(papers)
    assert len(result) == 2


def test_prefers_source_with_more_metadata():
    """같은 DOI면 인용수/초록 등 메타데이터가 많은 쪽을 유지"""
    papers = [
        Paper(title="P", authors=["X"], year=2024, source="crossref", doi="10.1/a"),
        Paper(title="P", authors=["X"], year=2024, source="semantic_scholar", doi="10.1/a", citation_count=100, tldr="요약"),
    ]
    result = deduplicate(papers)
    assert len(result) == 1
    assert result[0].source == "semantic_scholar"
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `uv run pytest tests/test_dedup.py -v`
Expected: FAIL

- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/dedup.py
from navi_research.models import Paper


def _metadata_score(paper: Paper) -> int:
    """메타데이터 풍부함 점수: 높을수록 정보가 많음"""
    score = 0
    if paper.abstract:
        score += 2
    if paper.citation_count is not None:
        score += 1
    if paper.tldr:
        score += 2
    if paper.pdf_url:
        score += 1
    if paper.venue:
        score += 1
    return score


def deduplicate(papers: list[Paper]) -> list[Paper]:
    """DOI 기반 중복 제거. 같은 DOI면 메타데이터가 더 풍부한 쪽 유지."""
    seen_dois: dict[str, Paper] = {}
    no_doi: list[Paper] = []

    for paper in papers:
        if paper.doi:
            doi_lower = paper.doi.lower()
            if doi_lower in seen_dois:
                existing = seen_dois[doi_lower]
                if _metadata_score(paper) > _metadata_score(existing):
                    seen_dois[doi_lower] = paper
            else:
                seen_dois[doi_lower] = paper
        else:
            no_doi.append(paper)

    return list(seen_dois.values()) + no_doi
```

- [ ] **Step 4: 테스트 통과 확인 & 커밋**

Run: `uv run pytest tests/test_dedup.py -v`
Expected: PASS (3 tests)

```bash
git add src/navi_research/dedup.py tests/test_dedup.py
git commit -m "feat: add DOI-based deduplication"
```

---

## Task 8: 통합 검색 오케스트레이터

**Files:**
- Create: `src/navi_research/search.py`
- Create: `tests/test_search.py`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_search.py
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
```

- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/search.py
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
```

- [ ] **Step 4: 테스트 통과 확인 & 커밋**

```bash
git add src/navi_research/search.py tests/test_search.py
git commit -m "feat: add search orchestrator with parallel API calls"
```

---

## Task 9: Exporter 모듈 (JSON + Markdown + BibTeX)

**Files:**
- Create: `src/navi_research/exporters/json_export.py`
- Create: `src/navi_research/exporters/markdown_export.py`
- Create: `src/navi_research/exporters/bibtex_export.py`
- Create: `tests/test_exporters/test_json.py`
- Create: `tests/test_exporters/test_markdown.py`
- Create: `tests/test_exporters/test_bibtex.py`

각 exporter는 같은 패턴:
- 입력: `list[Paper]`
- 출력: `str` (파일 내용)

- [ ] **Step 1~3: JSON exporter TDD**
- [ ] **Step 4~6: Markdown exporter TDD**
- [ ] **Step 7~9: BibTeX exporter TDD**
- [ ] **Step 10: 커밋**

```bash
git add src/navi_research/exporters/ tests/test_exporters/
git commit -m "feat: add JSON, Markdown, and BibTeX exporters"
```

---

## Task 10: CLI 진입점

**Files:**
- Create: `src/navi_research/cli.py`
- Create: `tests/test_cli.py`

- [ ] **Step 1: 실패하는 테스트 작성**

```python
# tests/test_cli.py
import subprocess


def test_cli_help():
    result = subprocess.run(
        ["uv", "run", "navi-research", "--help"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0
    assert "search" in result.stdout


def test_cli_search_help():
    result = subprocess.run(
        ["uv", "run", "navi-research", "search", "--help"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0
    assert "--limit" in result.stdout
```

- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 최소 구현**

```python
# src/navi_research/cli.py
import argparse
import asyncio
import sys
from pathlib import Path

from rich.console import Console
from rich.progress import Progress

from navi_research.exporters.json_export import export_json
from navi_research.exporters.markdown_export import export_markdown
from navi_research.search import SearchOrchestrator

console = Console()


def main():
    parser = argparse.ArgumentParser(prog="navi-research", description="Academic paper search CLI")
    sub = parser.add_subparsers(dest="command")

    # search
    sp = sub.add_parser("search", help="Search papers by topic")
    sp.add_argument("query", help="Search query")
    sp.add_argument("--limit", type=int, default=20, help="Max results (default: 20)")
    sp.add_argument("--year", help="Year range, e.g. 2024-2026")
    sp.add_argument("--sort", default="relevant", choices=["cited", "recent", "relevant"])
    sp.add_argument("--source", default="all", help="Source: all, openalex, semantic, arxiv, core, crossref")
    sp.add_argument("--output", default="./navi-results", help="Output directory")

    # fetch
    fp = sub.add_parser("fetch", help="Fetch paper by DOI")
    fp.add_argument("doi", help="Paper DOI")

    args = parser.parse_args()

    if args.command == "search":
        asyncio.run(_search(args))
    elif args.command == "fetch":
        asyncio.run(_fetch(args))
    else:
        parser.print_help()


async def _search(args):
    orch = SearchOrchestrator()
    sources = None if args.source == "all" else [args.source]

    with Progress() as progress:
        task = progress.add_task("[cyan]Searching...", total=None)
        papers = await orch.search(args.query, limit=args.limit, sources=sources)
        progress.update(task, completed=True)

    console.print(f"\n[green]Found {len(papers)} papers[/green]\n")

    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)

    # JSON
    json_path = out / "results.json"
    json_path.write_text(export_json(papers))

    # Markdown
    md_path = out / "results.md"
    md_path.write_text(export_markdown(papers, query=args.query))

    console.print(f"📄 JSON:     {json_path}")
    console.print(f"📝 Markdown: {md_path}")


async def _fetch(args):
    console.print(f"Fetching DOI: {args.doi}")
    # Phase 1에서는 미구현 — placeholder
    console.print("[yellow]fetch command coming soon[/yellow]")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: 테스트 통과 확인 & 커밋**

```bash
git add src/navi_research/cli.py tests/test_cli.py
git commit -m "feat: add CLI entry point with search command"
```

---

## Task 11: 통합 테스트 (실제 API 호출)

**Files:**
- Create: `tests/test_integration.py`

- [ ] **Step 1: 통합 테스트 작성** (실제 API 호출, CI에서는 skip)

```python
# tests/test_integration.py
import pytest

from navi_research.search import SearchOrchestrator


@pytest.mark.integration
@pytest.mark.asyncio
async def test_real_search():
    """실제 API 호출 테스트 — pytest -m integration으로만 실행"""
    orch = SearchOrchestrator()
    papers = await orch.search("large language model", limit=5)

    assert len(papers) > 0
    assert papers[0].title
    assert papers[0].authors
```

- [ ] **Step 2: 실행 확인**

Run: `uv run pytest tests/test_integration.py -m integration -v`

- [ ] **Step 3: 커밋**

```bash
git add tests/test_integration.py
git commit -m "test: add integration test with real API calls"
```

---

## 최종 점검

- [ ] 전체 테스트 통과: `uv run pytest -v`
- [ ] CLI 동작 확인: `uv run navi-research search "attention mechanism" --limit 5`
- [ ] 출력 파일 확인: `cat navi-results/results.md`
