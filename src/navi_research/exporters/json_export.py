import json

from navi_research.models import Paper


def export_json(papers: list[Paper]) -> str:
    """논문 목록을 JSON 문자열로 변환"""
    return json.dumps(
        [p.model_dump(exclude_none=True) for p in papers],
        ensure_ascii=False,
        indent=2,
    )
