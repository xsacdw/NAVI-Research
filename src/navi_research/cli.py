import argparse
import asyncio
from pathlib import Path
from typing import Any

from rich.console import Console
from rich.table import Table

from navi_research.exporters.bibtex_export import export_bibtex
from navi_research.exporters.json_export import export_json
from navi_research.exporters.markdown_export import export_markdown
from navi_research.search import SearchOrchestrator

console = Console()


def main() -> None:
    parser = argparse.ArgumentParser(prog="navi-research", description="Academic paper search CLI — 5개 무료 학술 API 통합 검색")
    sub = parser.add_subparsers(dest="command")

    # search command
    sp = sub.add_parser("search", help="Search papers by topic")
    sp.add_argument("query", help="Search query")
    sp.add_argument("--limit", type=int, default=20, help="Max results (default: 20)")
    sp.add_argument("--year", help="Year range, e.g. 2024-2026")
    sp.add_argument("--source", default="all", help="Source: all, openalex, semantic, arxiv, core, crossref")
    sp.add_argument("--output", default="./docs/sessions/_search-cache", help="Output directory")

    # search-multi command (6개 하위 쿼리 자동 생성)
    smp = sub.add_parser("search-multi", help="Search with 6 auto-generated sub-queries (OpenDraft style)")
    smp.add_argument("topic", help="Research topic")
    smp.add_argument("--limit", type=int, default=40, help="Max total results after dedup (default: 40)")
    smp.add_argument("--per-query", type=int, default=10, help="Results per sub-query (default: 10)")
    smp.add_argument("--year", help="Year range, e.g. 2024-2026")
    smp.add_argument("--source", default="all", help="Source: all, openalex, semantic, arxiv, core, crossref")
    smp.add_argument("--output", default="./docs/sessions/_search-cache", help="Output directory")

    # export command
    ep = sub.add_parser("export", help="Re-export results in different format")
    ep.add_argument("--format", choices=["json", "markdown", "bibtex"], default="markdown")
    ep.add_argument("--input", default="./docs/sessions/_search-cache/results.json", help="Input JSON file")

    args = parser.parse_args()

    if args.command == "search":
        asyncio.run(_search(args))
    elif args.command == "search-multi":
        asyncio.run(_search_multi(args))
    elif args.command == "export":
        _export(args)
    else:
        parser.print_help()


async def _search(args: Any) -> None:
    orch = SearchOrchestrator()
    sources = None if args.source == "all" else [args.source]

    console.print(f"\n🔍 [bold cyan]Searching:[/bold cyan] \"{args.query}\"")
    console.print(f"   Sources: {'all (5 APIs)' if not sources else ', '.join(sources)}")
    console.print(f"   Limit: {args.limit}\n")

    with console.status("[bold green]Searching 5 APIs in parallel..."):
        papers = await orch.search(args.query, limit=args.limit, year=args.year, sources=sources)

    console.print(f"[green]✅ Found {len(papers)} papers[/green]\n")

    # Show table
    table = Table(title="Search Results", show_lines=True)
    table.add_column("#", style="dim", width=3)
    table.add_column("Title", max_width=50)
    table.add_column("Year", width=6)
    table.add_column("Citations", width=10)
    table.add_column("Source", width=12)

    for i, p in enumerate(papers[:20], 1):
        cites = f"{p.citation_count:,}" if p.citation_count else "-"
        table.add_row(str(i), p.title[:50], str(p.year), cites, p.source)

    console.print(table)

    # Save files
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)

    json_path = out / "results.json"
    json_path.write_text(export_json(papers), encoding="utf-8")

    md_path = out / "results.md"
    md_path.write_text(export_markdown(papers, query=args.query), encoding="utf-8")

    bib_path = out / "results.bib"
    bib_path.write_text(export_bibtex(papers), encoding="utf-8")

    console.print(f"\n📁 [bold]Saved to {out}/[/bold]")
    console.print(f"   📄 results.json     ({json_path.stat().st_size:,} bytes)")
    console.print(f"   📝 results.md       ({md_path.stat().st_size:,} bytes)")
    console.print(f"   📚 results.bib      ({bib_path.stat().st_size:,} bytes)")

SUB_QUERY_TEMPLATES = [
    "{topic} fundamentals and theoretical background",
    "{topic} current state of research and recent advances",
    "{topic} methodology and approaches",
    "{topic} applications and case studies",
    "{topic} challenges and limitations",
    "{topic} future directions and open problems",
]


async def _search_multi(args: Any) -> None:
    """6개 하위 쿼리로 자동 검색 (OpenDraft 방식)"""
    orch = SearchOrchestrator()
    sources = None if args.source == "all" else [args.source]
    per_query = getattr(args, "per_query", 10)

    sub_queries = [t.format(topic=args.topic) for t in SUB_QUERY_TEMPLATES]

    console.print(f"\n🔬 [bold cyan]Multi-Search:[/bold cyan] \"{args.topic}\"")
    console.print(f"   Sub-queries: {len(sub_queries)} | Per-query: {per_query}")
    console.print(f"   Target: ≤{args.limit} papers after dedup\n")

    all_papers: list = []
    for i, q in enumerate(sub_queries, 1):
        with console.status(f"[bold green][{i}/{len(sub_queries)}] {q[:60]}..."):
            try:
                papers = await orch.search(q, limit=per_query, year=args.year, sources=sources)
                all_papers.extend(papers)
                console.print(f"   ✅ [{i}] +{len(papers)} papers — {q[:50]}...")
            except Exception as e:
                console.print(f"   ⚠️  [{i}] Failed: {e}")

    # 통합 중복제거
    from navi_research.dedup import deduplicate
    deduped = deduplicate(all_papers)[:args.limit]

    console.print(f"\n[green]📊 수집 {len(all_papers)}편 → 중복제거 → [bold]{len(deduped)}편[/bold][/green]\n")

    # 테이블 출력
    table = Table(title=f"Multi-Search: {args.topic}", show_lines=True)
    table.add_column("#", style="dim", width=3)
    table.add_column("Title", max_width=50)
    table.add_column("Year", width=6)
    table.add_column("Citations", width=10)
    table.add_column("Source", width=12)

    for i, p in enumerate(deduped[:20], 1):
        cites = f"{p.citation_count:,}" if p.citation_count else "-"
        table.add_row(str(i), p.title[:50], str(p.year), cites, p.source)

    console.print(table)

    # 파일 저장
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)

    json_path = out / "results.json"
    json_path.write_text(export_json(deduped), encoding="utf-8")

    md_path = out / "results.md"
    md_path.write_text(export_markdown(deduped, query=args.topic), encoding="utf-8")

    bib_path = out / "results.bib"
    bib_path.write_text(export_bibtex(deduped), encoding="utf-8")

    console.print(f"\n📁 [bold]Saved to {out}/[/bold]")
    console.print(f"   📄 results.json     ({json_path.stat().st_size:,} bytes)")
    console.print(f"   📝 results.md       ({md_path.stat().st_size:,} bytes)")
    console.print(f"   📚 results.bib      ({bib_path.stat().st_size:,} bytes)")


def _export(args: Any) -> None:
    console.print("[yellow]Export command coming in next update[/yellow]")


if __name__ == "__main__":
    main()
