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

    # export command
    ep = sub.add_parser("export", help="Re-export results in different format")
    ep.add_argument("--format", choices=["json", "markdown", "bibtex"], default="markdown")
    ep.add_argument("--input", default="./navi-results/results.json", help="Input JSON file")

    args = parser.parse_args()

    if args.command == "search":
        asyncio.run(_search(args))
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
        papers = await orch.search(args.query, limit=args.limit, sources=sources)

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


def _export(args: Any) -> None:
    console.print("[yellow]Export command coming in next update[/yellow]")


if __name__ == "__main__":
    main()
