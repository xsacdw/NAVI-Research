# 🧭 NAVI-Research — AI 기반 학술 논문 연구 플랫폼

<p align="center">
  <img src="assets/og-image.png" alt="NAVI-Research OG Image" width="800">
</p>

> 주제 하나만 입력하면, 문헌 검색 → 분석 → 집필 → 다이어그램 생성 → 7중 품질 검증 → 대시보드 배포까지 자동으로 처리합니다.

[![Python](https://img.shields.io/badge/Python-3.12+-blue?logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-Dashboard-black?logo=next.js)](https://navi-research.pages.dev)

---

## 📖 목차

- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [핵심 사용법](#-핵심-사용법)
- [워크플로우](#-워크플로우)
- [세션 관리](#-세션-관리)
- [대시보드](#-대시보드)

---

## 📁 프로젝트 구조

```
NAVI-PJ/
├── src/navi_research/        # 핵심 CLI — 논문 검색 엔진
│   ├── cli.py                # CLI 엔트리포인트
│   ├── search.py             # OpenAlex API 검색
│   ├── citation_db.py        # 인용 데이터베이스 관리
│   ├── dedup.py              # 중복 논문 제거
│   ├── models.py             # 데이터 모델 (Pydantic)
│   ├── sources/              # 검색 소스 어댑터
│   └── exporters/            # BibTeX, Markdown 등 내보내기
│
├── docs/                     # 모든 문서와 연구 결과물
│   ├── sessions/             # 📚 논문 시뮬레이션 세션들
│   │   ├── index.md          # 전체 세션 목록
│   │   └── {주제}_{날짜}/    # 개별 세션 폴더
│   ├── specs/                # 설계 문서
│   ├── plans/                # 구현 계획
│   ├── drafts/               # 논문 초안
│   └── references/           # 참고 자료
│
├── dashboard/                # 🌐 Next.js 웹 대시보드 (Cloudflare Pages)
├── scripts/                  # 자동화 스크립트 (auto-commit 등)
├── tests/                    # pytest 테스트
├── .agents/workflows/        # 🤖 AI 워크플로우 정의 (아래 상세 설명)
└── pyproject.toml            # 프로젝트 설정
```

---

## 🚀 시작하기

### 설치

```bash
# Python 3.12+ 필요
git clone https://github.com/your-repo/NAVI-PJ.git
cd NAVI-PJ

# 의존성 설치 (uv 권장)
uv sync

# 또는 pip
pip install -e .
```

### 빠른 시작

```bash
# 논문 검색
navi-research search "quantum computing" --limit 20

# 결과 확인
cat docs/sessions/_search-cache/results.json
```

---

## 🎯 핵심 사용법

### 1. 논문 시뮬레이션 (전체 자동화)

Antigravity IDE에서 AI에게 자연어로 요청합니다:

```
"LLM Agent의 최신 연구 동향으로 논문 시뮬레이션 해줘"
"이 주제로 논문 만들어줘"
```

**요청 후 AI 응답 예시:**

AI가 요청을 인식하면 분량과 유형을 질문합니다:

```
📋 논문 시뮬레이션을 시작합니다.

주제: "LLM Agent의 최신 연구 동향"

📏 분량 (구글 독스 기준):
  1. 퀵 (약5,000자 / 약5p) — 뼈대만, 아이디어 검증용
  2. 표준 (약20,000자 / 약20) — 학회 논문 수준
  3. 풀 (약50,000자+ / 약50p+) — 학위 논문 수준
  4. 사용자 설정 — 원하는 글자 수 직접 입력 (예: 약100,000자 / 약100p)

📝 논문 유형:
  1. Literature Review (서베이/리뷰)
  2. Research Paper (연구 논문)
  3. Report (보고서)

예시 응답: "2-1" → 표준 / Literature Review
```

**답변 방법:** 숫자 조합으로 간단히 응답하면 됩니다.

| 응답 예시 | 의미 |
|-----------|------|
| `2-1` | 표준 분량 + Literature Review |
| `1-3` | 퀵 분량 + Report |
| `3-2` | 풀 분량 + Research Paper |

답변 후 AI가 자동으로 8단계 파이프라인을 실행합니다:

| 단계 | 과정 | 출력 파일 |
|:---:|------|----------|
| 1 | 📚 6개 하위 쿼리로 문헌 검색 (~60편 수집) | `results.json`, `results.bib` |
| 2 | 🔍 클러스터링 + 연구 갭 분석 | `analysis.md` |
| 3 | 🏗️ 논문 유형별 아웃라인 생성 | `outline.md` |
| 4 | ✍️ 섹션별 순차 집필 (컨텍스트 체인) | `draft.md` |
| 5 | 🖼️ 학회 수준 다이어그램 생성 | `figures/` |
| 6 | 🔍 7중 QA 검증 | `qa-report.md` |
| 7 | 📄 인용 치환 + PDF/DOCX 변환 | `thesis.md`, `.pdf`, `.docx` |
| 8 | 🌐 대시보드에 자동 배포 | `sessions.json` 업데이트 |

### 2. 논문 초안만 작성

검색 결과가 이미 있을 때 자연어로 요청합니다:

```
"이 검색 결과로 리뷰 논문 써줘"
"논문 초안 만들어줘"
```

OpenDraft 6단계 방법론으로 초안을 작성합니다:
1. **RESEARCH** — 수집 결과 분석 + 클러스터링
2. **STRUCTURE** — 논문 유형별 아웃라인
3. **WRITING** — 섹션별 초안 (사용자 확인)
4. **CITATION** — 인용 검증 (DOI CrossRef 검증)
5. **POLISH** — 흐름, 중복, 전환 문장 다듬기
6. **EXPORT** — `docs/drafts/`에 Markdown 저장

### 3. CLI 직접 사용

```bash
# 기본 검색
navi-research search "transformer architecture" --limit 30

# 결과 위치
ls docs/sessions/_search-cache/
```

---

## ⚡ 워크플로우

NAVI-PJ는 **Superpowers 프레임워크** 기반의 8개 AI 워크플로우를 내장하고 있습니다.
사용자가 Antigravity IDE에서 **자연어로 요청**하면, AI가 적절한 워크플로우를 자동으로 인식하여 진행합니다.

### 📑 논문 관련 워크플로우

| 워크플로우 | 이렇게 요청하세요 | 설명 |
|-----------|-------------------|------|
| 논문 시뮬레이션 | "이 주제로 논문 만들어줘" | 검색→분석→집필→QA→배포 전체 자동화 |
| 논문 초안 | "논문 초안 만들어줘" | 기존 검색 결과로 OpenDraft 6단계 집필 |

### 🛠️ 개발 워크플로우

| 워크플로우 | 이렇게 요청하세요 | 설명 |
|-----------|-------------------|------|
| 전체 개발 프로세스 | "이 기능 개발해줘" | 3개의 Hard Gate (설계→테스트→커밋) 준수 |
| 브레인스토밍 | "이 아이디어 설계해줘" | 아이디어를 설계 문서(`docs/specs/`)로 변환 |
| 계획 작성 | "구현 계획 작성해줘" | 설계를 2~5분 단위 실행 가능 태스크로 분해 |
| 계획 실행 | "이 계획 실행해줘" | 계획을 비판적 검토 후 순차 실행 |
| TDD | "테스트부터 작성해줘" | RED → GREEN → REFACTOR 사이클 |
| 체계적 디버깅 | "이 버그 원인 찾아줘" | 근본 원인 4단계 분석 (추측 수정 금지) |

### 워크플로우 흐름도

```
📝 논문 프로젝트:
  "논문 시뮬레이션 해줘" ──────────────────────▶ 완성된 논문 + 대시보드

🔧 개발 프로젝트:
  "아이디어 설계" → "계획 작성" → "계획 실행" → 완성
       │                              │
       └── Superpowers (전체 게이트) ──┘
                  │
       TDD (구현 시)    디버깅 (이슈 시)
```

> **💡 Tip:** 정확한 키워드가 아니어도 됩니다. AI가 의도를 파악하여 적절한 워크플로우를 적용합니다.
> 예: "이거 왜 안 돼?" → 체계적 디버깅, "새로운 기능 만들고 싶어" → 브레인스토밍

---

## 📂 세션 관리

논문 시뮬레이션의 결과물은 `docs/sessions/` 아래에 세션별로 저장됩니다.

```
docs/sessions/
├── index.md                              # 전체 세션 목록 (자동 업데이트)
├── nietzsche-philosophy_2026-03-13/      # 세션 예시
│   ├── results.json          # 검색 결과
│   ├── results.bib           # BibTeX
│   ├── analysis.md           # 문헌 분석
│   ├── outline.md            # 논문 아웃라인
│   ├── qa-report.md          # 7중 QA 보고서
│   └── output/
│       ├── thesis.md         # 최종 논문
│       ├── thesis.pdf        # PDF 변환본
│       ├── references.bib    # 참고문헌
│       ├── figures/          # 다이어그램
│       └── prompt-log.json   # 프롬프트 기록
└── ...
```

---

## 🌐 대시보드

논문 완성 후 자동으로 **Next.js 대시보드**에 등록되어 웹에서 열람할 수 있습니다.

- **배포 URL:** [navi-research.pages.dev](https://navi-research.pages.dev)
- **호스팅:** Cloudflare Pages (git push 시 자동 빌드)
- **기능:** 세션 목록, 논문 본문 열람, QA 점수 확인

```bash
# 로컬에서 대시보드 실행
cd dashboard
npm install
npm run dev
```

---

## 🔧 개발 가이드

### 테스트

```bash
# 전체 테스트
pytest tests/ -v

# 개별 테스트
pytest tests/test_search.py -v
```

### 컨벤션

- **커밋 메시지:** `feat|fix|docs|test: 한 줄 설명`
- **TDD 필수:** 테스트 먼저, 코드 나중
- **설계 문서:** `docs/specs/YYYY-MM-DD-<topic>-design.md`
- **구현 계획:** `docs/plans/YYYY-MM-DD-<feature>.md`

---

## 📄 라이선스

MIT License
