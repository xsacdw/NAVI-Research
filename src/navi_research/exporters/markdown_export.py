from datetime import datetime

from navi_research.models import Paper


def export_markdown(papers: list[Paper], query: str = "") -> str:
    """논문 목록을 Markdown 문자열로 변환"""
    lines = []
    lines.append(f"# 검색 결과: \"{query}\"")
    lines.append(f"검색일: {datetime.now().strftime('%Y-%m-%d %H:%M')} | 총 {len(papers)}건\n")
    lines.append("---\n")

    for i, p in enumerate(papers, 1):
        lines.append(f"## {i}. {p.title}")
        lines.append(f"- **저자:** {', '.join(p.authors)}")
        lines.append(f"- **연도:** {p.year}")
        if p.venue:
            lines.append(f"- **학회/저널:** {p.venue}")
        if p.citation_count is not None:
            lines.append(f"- **인용:** {p.citation_count:,}회")
        if p.doi:
            lines.append(f"- **DOI:** {p.doi}")
        if p.tldr:
            lines.append(f"- **TLDR:** {p.tldr}")
        if p.abstract:
            lines.append(f"- **초록:** {p.abstract[:300]}...")
        if p.url:
            lines.append(f"- **URL:** {p.url}")
        if p.pdf_url:
            lines.append(f"- **PDF:** {p.pdf_url}")
        lines.append(f"- **소스:** {p.source}")
        lines.append("")

    return "\n".join(lines)
