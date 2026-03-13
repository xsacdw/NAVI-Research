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
