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
