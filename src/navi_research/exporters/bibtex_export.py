from navi_research.models import Paper


def export_bibtex(papers: list[Paper]) -> str:
    """논문 목록을 BibTeX 문자열로 변환"""
    entries = []
    for i, p in enumerate(papers, 1):
        first_author = p.authors[0].split(",")[0].split()[-1].lower() if p.authors else "unknown"
        key = f"{first_author}{p.year}_{i}"

        entry_lines = [f"@article{{{key},"]
        entry_lines.append(f"  title = {{{p.title}}},")
        entry_lines.append(f"  author = {{{' and '.join(p.authors)}}},")
        entry_lines.append(f"  year = {{{p.year}}},")
        if p.doi:
            entry_lines.append(f"  doi = {{{p.doi}}},")
        if p.url:
            entry_lines.append(f"  url = {{{p.url}}},")
        if p.venue:
            entry_lines.append(f"  journal = {{{p.venue}}},")
        if p.abstract:
            entry_lines.append(f"  abstract = {{{p.abstract[:500]}}},")
        entry_lines.append("}")
        entries.append("\n".join(entry_lines))

    return "\n\n".join(entries) + "\n"
