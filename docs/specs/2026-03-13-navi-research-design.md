# navi-research — Phase 1: 리서치 엔진 설계

> **상태:** 승인됨 (2026-03-13)
> **범위:** Phase 1 of 3 (Phase 2: 논문 작성기, Phase 3: 통합 대시보드)

## 목표

주제를 입력하면 5개 무료 학술 API에서 논문을 검색·수집하고, 구조화된 형태(JSON/Markdown/BibTeX)로 출력하는 CLI 도구.
분석·리포트 생성은 Antigravity(AI)가 담당하므로 LLM 백엔드 불필요.

## 아키텍처

```
navi-research (CLI)
│
├── 검색 레이어 (5개 무료 API 통합)
│   ├── OpenAlex     → 메인 검색 (4.5억 논문, 시맨틱 검색)
│   ├── Semantic Scholar → AI 요약(TLDR) + 추천 + 임베딩
│   ├── arXiv        → CS/물리/수학 프리프린트
│   ├── CORE         → OA 풀텍스트
│   └── Crossref     → DOI 메타데이터 + 인용 정보 + 철회 표시
│
├── 수집 레이어
│   ├── 메타데이터 통합 (제목, 저자, 초록, DOI, 연도)
│   ├── PDF 링크 수집 (Unpaywall + CORE)
│   └── 중복 제거 (DOI 기반)
│
└── 출력 레이어
    ├── JSON (구조화 데이터)
    ├── Markdown (Antigravity 분석용)
    └── BibTeX (LaTeX 인용용)
```

## CLI 명령어

```bash
navi-research <command> [options]
```

| 명령어 | 기능 | 예시 |
|--------|------|------|
| `search` | 주제로 논문 검색 | `navi-research search "LLM agents" --limit 30` |
| `fetch` | DOI로 특정 논문 상세 조회 | `navi-research fetch 10.1234/abcd` |
| `related` | 특정 논문의 관련 논문 찾기 | `navi-research related 10.1234/abcd` |
| `export` | 수집된 결과를 파일로 내보내기 | `navi-research export --format bibtex` |

### 주요 옵션

```bash
--limit N          # 결과 수 (기본 20)
--year 2024-2026   # 연도 범위
--sort cited       # 정렬: cited(인용순), recent(최신순), relevant(관련순)
--source all       # 소스: all, openalex, semantic, arxiv, core, crossref
--output ./results # 저장 경로 (기본: ./navi-results/)
```

## 파일 구조

```
NAVI-PJ/
├── src/
│   └── navi_research/
│       ├── __init__.py
│       ├── cli.py              # CLI 진입점 (argparse)
│       ├── search.py           # 통합 검색 오케스트레이터
│       ├── sources/
│       │   ├── __init__.py
│       │   ├── openalex.py     # OpenAlex API 클라이언트
│       │   ├── semantic.py     # Semantic Scholar API 클라이언트
│       │   ├── arxiv_api.py    # arXiv API 클라이언트
│       │   ├── core_api.py     # CORE API 클라이언트
│       │   └── crossref.py     # Crossref API 클라이언트
│       ├── models.py           # Paper 데이터 모델 (Pydantic)
│       ├── dedup.py            # DOI 기반 중복 제거
│       └── exporters/
│           ├── __init__.py
│           ├── json_export.py
│           ├── markdown_export.py
│           └── bibtex_export.py
├── tests/
│   ├── test_search.py
│   ├── test_sources/
│   │   ├── test_openalex.py
│   │   ├── test_semantic.py
│   │   ├── test_arxiv.py
│   │   ├── test_core.py
│   │   └── test_crossref.py
│   └── test_exporters/
│       ├── test_json.py
│       ├── test_markdown.py
│       └── test_bibtex.py
├── pyproject.toml
└── README.md
```

## 기술 스택

- **Python 3.12+** — uv로 패키지 관리
- **httpx** — 비동기 HTTP 클라이언트 (5개 API 병렬 호출)
- **pydantic** — Paper 데이터 모델 검증
- **rich** — 터미널 컬러 출력, 프로그레스 바
- **pytest + pytest-asyncio** — TDD 테스트

## 설계 원칙

1. **모듈러 소스:** 각 API 클라이언트가 독립 모듈. 새 API 추가 시 `sources/` 에 파일 하나 추가.
2. **통일 모델:** 모든 소스가 동일한 `Paper` Pydantic 모델로 변환. 사용하는 쪽에서 소스 구분 불필요.
3. **API 키 불필요:** 5개 API 모두 무료+키 없이 사용. `.env` 설정 없이 `pip install` 후 바로 사용.
4. **LLM 불필요:** 분석·생성은 Antigravity가 담당. CLI는 데이터 수집에 집중.
5. **Phase 확장 대비:** JSON 출력이 Phase 2(논문 작성기), Phase 3(대시보드)의 입력이 됨.

## 비기능 요구사항

- 5개 API 동시 호출 시 2~5초 내 응답
- Rate limit 존중 (각 API별 polite 호출)
- 오프라인 테스트 가능 (API 응답 fixtures)
