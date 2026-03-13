"""
citation_db — results.json → {cite_XXX} 매핑 + 인용 프롬프트 생성

Usage:
    python -m navi_research.citation_db docs/sessions/my-topic_2026-03-13/results.json

참조: OpenDraft citation_database.py (595줄 → 경량화)
"""

import json
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class Citation:
    """인용 메타데이터. navi-research Paper 모델과 1:1 매핑."""

    cite_id: str           # cite_001, cite_002, ...
    title: str
    authors: list[str]
    year: int
    source: str            # openalex, semantic_scholar, arxiv, ...

    doi: Optional[str] = None
    abstract: Optional[str] = None
    url: Optional[str] = None
    citation_count: Optional[int] = None
    venue: Optional[str] = None

    @property
    def short_authors(self) -> str:
        """Kim et al. (2025) 형식"""
        if not self.authors:
            return "Unknown"
        first = self.authors[0].split(",")[0].split()[-1]
        if len(self.authors) > 2:
            return f"{first} et al."
        elif len(self.authors) == 2:
            second = self.authors[1].split(",")[0].split()[-1]
            return f"{first} & {second}"
        return first

    @property
    def inline_citation(self) -> str:
        """(Kim et al., 2025) 형식"""
        return f"({self.short_authors}, {self.year})"

    @property
    def bibtex_key(self) -> str:
        """kim2025_1 형식"""
        first = self.authors[0].split(",")[0].split()[-1].lower() if self.authors else "unknown"
        num = self.cite_id.replace("cite_", "")
        return f"{first}{self.year}_{num}"


class CitationDatabase:
    """results.json → {cite_XXX} 매핑 + 인용 프롬프트 생성"""

    def __init__(self, citations: list[Citation]):
        self.citations = citations
        self._index = {c.cite_id: c for c in citations}

    # ── 팩토리 ────────────────────────────────────────────

    @staticmethod
    def from_results_json(path: Path) -> "CitationDatabase":
        """navi-research의 results.json → CitationDatabase 변환"""
        with open(path, "r", encoding="utf-8") as f:
            papers = json.load(f)

        citations = []
        for i, p in enumerate(papers, 1):
            cite_id = f"cite_{i:03d}"
            citations.append(Citation(
                cite_id=cite_id,
                title=p.get("title", ""),
                authors=p.get("authors", []),
                year=p.get("year", 0),
                source=p.get("source", ""),
                doi=p.get("doi"),
                abstract=p.get("abstract"),
                url=p.get("url"),
                citation_count=p.get("citation_count"),
                venue=p.get("venue"),
            ))

        return CitationDatabase(citations)

    # ── 조회 ──────────────────────────────────────────────

    def get(self, cite_id: str) -> Optional[Citation]:
        return self._index.get(cite_id)

    def __len__(self) -> int:
        return len(self.citations)

    # ── LLM 프롬프트 생성 ─────────────────────────────────

    def build_citation_summary(self, max_abstract_chars: int = 100) -> str:
        """Step 4 워크플로우의 ⚠️ CITATION RESTRICTION 블록 생성"""
        lines = ["⚠️ CITATION RESTRICTION ⚠️", "아래 목록의 논문만 인용할 수 있습니다:", ""]

        for c in self.citations:
            abstract_preview = ""
            if c.abstract:
                abstract_preview = c.abstract[:max_abstract_chars].replace("\n", " ")
                if len(c.abstract) > max_abstract_chars:
                    abstract_preview += "..."

            cites_str = f" [인용 {c.citation_count}회]" if c.citation_count else ""
            lines.append(
                f"{{{c.cite_id}}}: {c.short_authors} ({c.year}) "
                f'"{c.title[:80]}"{cites_str} — {abstract_preview}'
            )

        lines.append("")
        lines.append("이 목록에 없는 논문을 인용하면 안 됩니다.")
        return "\n".join(lines)

    # ── 토큰 치환 ─────────────────────────────────────────

    def resolve_tokens(self, text: str) -> str:
        """
        {cite_XXX} 토큰을 (저자, 연도) 형식으로 변환.
        Step 7에서 최종 논문 생성 시 사용.
        """
        for c in self.citations:
            token = f"{{{c.cite_id}}}"
            if token in text:
                text = text.replace(token, c.inline_citation)
        return text

    # ── 저장/불러오기 ─────────────────────────────────────

    def save(self, path: Path) -> None:
        """citation_db.json으로 저장"""
        data = {
            "total": len(self.citations),
            "citations": [asdict(c) for c in self.citations],
        }
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    @staticmethod
    def load(path: Path) -> "CitationDatabase":
        """citation_db.json에서 불러오기"""
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        citations = [Citation(**c) for c in data["citations"]]
        return CitationDatabase(citations)

    # ── BibTeX 키 매핑 ────────────────────────────────────

    def get_bibtex_mapping(self) -> dict[str, str]:
        """cite_XXX → bibtex_key 매핑 딕셔너리"""
        return {c.cite_id: c.bibtex_key for c in self.citations}


# ── CLI ───────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m navi_research.citation_db <results.json>")
        sys.exit(1)

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Error: {path} not found")
        sys.exit(1)

    db = CitationDatabase.from_results_json(path)
    print(f"📚 {len(db)} citations loaded\n")
    print(db.build_citation_summary())
