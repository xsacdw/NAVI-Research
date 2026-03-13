"""
Tests for navi_research.cli — search-multi subcommand

GATE 2 준수: 테스트 먼저 작성
"""

import asyncio
from unittest.mock import AsyncMock, patch, MagicMock

from navi_research.cli import SUB_QUERY_TEMPLATES, _search_multi


def test_sub_query_templates_count():
    """6개 하위 쿼리 템플릿이 존재해야 함"""
    assert len(SUB_QUERY_TEMPLATES) == 6


def test_sub_query_templates_format():
    """모든 템플릿이 {topic} 플레이스홀더를 포함해야 함"""
    for t in SUB_QUERY_TEMPLATES:
        assert "{topic}" in t


def test_sub_query_templates_generate():
    """주제를 넣으면 6개 쿼리 문자열이 생성됨"""
    queries = [t.format(topic="sleep cycle") for t in SUB_QUERY_TEMPLATES]
    assert len(queries) == 6
    assert all("sleep cycle" in q for q in queries)
    assert "fundamentals" in queries[0]
    assert "future directions" in queries[5]


def test_sub_query_templates_unique():
    """6개 쿼리는 모두 서로 달라야 함"""
    queries = [t.format(topic="test") for t in SUB_QUERY_TEMPLATES]
    assert len(set(queries)) == 6
