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
