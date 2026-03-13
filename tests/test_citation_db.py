"""
Tests for navi_research.citation_db — CitationDatabase

GATE 2 준수: 테스트 먼저 작성
"""

import json
import tempfile
from pathlib import Path

from navi_research.citation_db import Citation, CitationDatabase


# ── Citation 단위 테스트 ──────────────────────────────


def test_citation_short_authors_single():
    c = Citation(cite_id="cite_001", title="Test", authors=["Kim, J."], year=2025, source="test")
    assert c.short_authors == "Kim"


def test_citation_short_authors_two():
    c = Citation(cite_id="cite_001", title="Test", authors=["Kim, J.", "Lee, S."], year=2025, source="test")
    assert c.short_authors == "Kim & Lee"


def test_citation_short_authors_many():
    c = Citation(cite_id="cite_001", title="Test", authors=["Kim, J.", "Lee, S.", "Park, H."], year=2025, source="test")
    assert c.short_authors == "Kim et al."


def test_citation_inline():
    c = Citation(cite_id="cite_001", title="Test", authors=["Kim, J."], year=2025, source="test")
    assert c.inline_citation == "(Kim, 2025)"


def test_citation_bibtex_key():
    c = Citation(cite_id="cite_003", title="Test", authors=["Kim, J."], year=2025, source="test")
    assert c.bibtex_key == "kim2025_003"


# ── CitationDatabase 테스트 ───────────────────────────


def _make_sample_results_json(path: Path, count: int = 3):
    """테스트용 results.json 생성"""
    papers = []
    for i in range(count):
        papers.append({
            "title": f"Paper Title {i+1}",
            "authors": [f"Author{i+1}, A."],
            "year": 2024 + i,
            "source": "semantic_scholar",
            "doi": f"10.1234/test{i+1}",
            "abstract": f"Abstract for paper {i+1}. " * 10,
            "citation_count": (count - i) * 100,
        })
    path.write_text(json.dumps(papers), encoding="utf-8")


def test_from_results_json():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path, count=5)

        db = CitationDatabase.from_results_json(json_path)
        assert len(db) == 5
        assert db.citations[0].cite_id == "cite_001"
        assert db.citations[4].cite_id == "cite_005"


def test_get_citation():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path)

        db = CitationDatabase.from_results_json(json_path)
        c = db.get("cite_002")
        assert c is not None
        assert c.title == "Paper Title 2"
        assert db.get("cite_999") is None


def test_build_citation_summary():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path)

        db = CitationDatabase.from_results_json(json_path)
        summary = db.build_citation_summary()

        assert "CITATION RESTRICTION" in summary
        assert "{cite_001}" in summary
        assert "{cite_003}" in summary
        assert "이 목록에 없는 논문을 인용하면 안 됩니다" in summary


def test_resolve_tokens():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path)

        db = CitationDatabase.from_results_json(json_path)
        text = "Some claim {cite_001} and another {cite_002}."
        resolved = db.resolve_tokens(text)

        assert "{cite_001}" not in resolved
        assert "{cite_002}" not in resolved
        assert "(Author1, 2024)" in resolved
        assert "(Author2, 2025)" in resolved


def test_save_and_load():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path)

        db = CitationDatabase.from_results_json(json_path)

        save_path = Path(tmpdir) / "citation_db.json"
        db.save(save_path)
        assert save_path.exists()

        loaded = CitationDatabase.load(save_path)
        assert len(loaded) == len(db)
        assert loaded.citations[0].cite_id == "cite_001"


def test_bibtex_mapping():
    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = Path(tmpdir) / "results.json"
        _make_sample_results_json(json_path)

        db = CitationDatabase.from_results_json(json_path)
        mapping = db.get_bibtex_mapping()

        assert mapping["cite_001"] == "author12024_001"
        assert "cite_003" in mapping
