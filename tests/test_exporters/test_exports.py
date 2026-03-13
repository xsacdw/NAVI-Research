import json

from navi_research.exporters.json_export import export_json
from navi_research.exporters.markdown_export import export_markdown
from navi_research.exporters.bibtex_export import export_bibtex
from navi_research.models import Paper


def _sample_papers():
    return [
        Paper(
            title="Attention Is All You Need",
            authors=["Vaswani, A.", "Shazeer, N."],
            year=2017,
            source="openalex",
            doi="10.48550/arXiv.1706.03762",
            citation_count=120000,
            venue="NeurIPS",
        ),
        Paper(
            title="BERT",
            authors=["Devlin, J."],
            year=2019,
            source="semantic_scholar",
            doi="10.18653/v1/N19-1423",
            tldr="양방향 트랜스포머 언어 모델",
        ),
    ]


def test_json_export():
    result = export_json(_sample_papers())
    data = json.loads(result)
    assert len(data) == 2
    assert data[0]["title"] == "Attention Is All You Need"


def test_markdown_export():
    result = export_markdown(_sample_papers(), query="transformer")
    assert "Attention Is All You Need" in result
    assert "transformer" in result
    assert "120,000" in result


def test_bibtex_export():
    result = export_bibtex(_sample_papers())
    assert "@article{" in result
    assert "Attention Is All You Need" in result
    assert "doi" in result
