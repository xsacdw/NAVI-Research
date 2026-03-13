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
    papers = [
        Paper(title="P", authors=["X"], year=2024, source="crossref", doi="10.1/a"),
        Paper(title="P", authors=["X"], year=2024, source="semantic_scholar", doi="10.1/a", citation_count=100, tldr="요약"),
    ]
    result = deduplicate(papers)
    assert len(result) == 1
    assert result[0].source == "semantic_scholar"
