---
description: 논문 시뮬레이션 — 주제 입력만으로 검색→분석→집필→QA 전체 파이프라인 실행
---

# 🔬 Research Simulate — 논문 시뮬레이션

주제를 입력하면 검색부터 논문 완성까지 전 과정을 자동 수행합니다.

## 트리거
- "논문 시뮬레이션 해줘"
- "이 주제로 논문 만들어줘"
- "research simulate"

---

## Step 0: 모드 선택

사용자에게 다음을 질문한다:

```
📋 논문 시뮬레이션을 시작합니다.

주제: "{사용자가 입력한 주제}"

📏 분량:
  1. 퀵 (2,000~5,000자 / 약 2~5p) — 뼈대만, 아이디어 검증용
  2. 표준 (10,000~20,000자 / 약 10~20p) — 학회 논문 수준
  3. 풀 (50,000자+ / 약 50p+) — 학위 논문 수준, 여러 턴에 걸쳐 작성
  4. 사용자 설정 — 원하는 글자 수 직접 입력 (예: "4-8000자")

📝 논문 유형:
  1. Literature Review (서베이/리뷰)
  2. Research Paper (연구 논문)
  3. Report (보고서)

예시 응답: "2-1" → 표준 / Literature Review
```

사용자 응답을 받은 후 **자동 진행**한다. 논문은 항상 **한국어**로 작성한다.

**분량별 동작:**
- **S (퀵):** 1턴에 완료. 핵심 구조와 요약만.
- **M (표준):** 1~2턴에 완료. 섹션별 상세 작성.
- **L (풀):** 챕터별로 나눠 작성. 각 챕터를 별도 파일로 저장하고, 출력 토큰 상한에 도달하면 자동 저장 후 멈추지 않고 바로 이어서 작성한다. 사용자에게 "계속"을 요구하지 않는다.

---

## Step 1: 📚 문헌 검색

1. `navi-research search "{주제}" --limit 30` 실행
2. `navi-results/results.json` 읽기
3. 세션 폴더 생성: `docs/sessions/{주제-slug}_{YYYY-MM-DD}/` (예: `llm-agents_2026-03-13`)
4. 검색 결과를 세션에 복사

**단계별 모드:** "N편 수집 완료. 계속할까요?"
**자동 모드:** 바로 다음 단계

---

## Step 2: 🔍 문헌 분석

수집된 논문을 분석한다:
1. 주제별 클러스터링
2. 핵심 논문 식별 (고인용)
3. 최신 연구 트렌드
4. 연구 갭(gap) 도출

**출력:** `sessions/{name}/analysis.md`

**단계별 모드:** 분석 결과 보여주고 "이 방향으로 진행할까요?"
**자동 모드:** 바로 다음 단계

---

## Step 3: 🏗️ 연구 설계

1. 논문 유형에 맞는 아웃라인 생성
2. 각 섹션에 어떤 논문이 인용될지 매핑
3. 예상 분량 계산

**출력:** `sessions/{name}/outline.md`

**단계별 모드:** 아웃라인 보여주고 "수정할 부분 있나요?"
**자동 모드:** 바로 다음 단계

---

## Step 4: ✍️ 논문 집필

/paper-drafting 워크플로우를 내부적으로 호출한다.

1. 섹션별 순차 작성
2. 인용은 수집된 논문에서만 사용 (허구 인용 절대 금지)
3. 학술 톤 유지

**규칙:**
- 모든 주장에는 인용 필수
- 과장 표현 금지 ("모든", "완벽하게", "반드시", "절대")
- 한국어로 작성

**출력:** `sessions/{name}/draft.md`

**단계별 모드:** 섹션 하나 완료마다 확인
**자동 모드:** 전체 작성 후 한 번에 저장

---

## Step 5: 🖼️ 다이어그램 생성

PaperBanana 5에이전트 방법론으로 핵심 다이어그램 생성:

1. 논문에서 다이어그램 필요한 섹션 식별 (Architecture, Framework, 비교표 등)
2. Retriever → Planner → Stylist → Visualizer → Critic 순서
3. generate_image 도구로 이미지 생성
4. Critic이 평가 후 필요시 재생성

**출력:** `sessions/{name}/figures/`

**단계별 모드:** 각 다이어그램 확인
**자동 모드:** 전부 생성 후 저장

---

## Step 6: 🔍 품질 검증 (3중 QA)

### QA-1: GRA (근거 검증)
- 초안에서 모든 인용 추출
- 각 인용이 수집 데이터(results.json)에 존재하는지 확인
- 인용 없는 주장 식별 → 인용 추가 또는 문장 수정
- DOI가 있는 경우 실재 여부 확인

### QA-2: PTCS (품질 점수)
다음 기준으로 0~100 점수 매기기:
- 구조 완성도 (섹션 누락 없음, 흐름 자연스러움)
- 인용 밀도 (페이지당 3개 이상)
- 방법론 적절성
- 논리 일관성
- → 종합 "투고 가능성: ___%"

### QA-3: SRCS (출처 신뢰도)
- 각 출처에 A/B/C 등급 부여
  - A: 저명 저널, 고인용 (100+)
  - B: 학회 논문, 중인용 (10~99)
  - C: 프리프린트, 저인용 (<10)
- C등급 비율이 30% 초과 시 경고

**출력:** `sessions/{name}/qa-report.md`

**단계별 모드:** QA 결과 보여주고 "수정할까요?"
**자동 모드:** 점수가 60% 이상이면 통과, 미만이면 Step 4로 돌아가 1회 재작성

---

## Step 7: 📄 최종 출력

1. 논문 + 다이어그램 + References를 합쳐 최종본 생성
2. 한국어로 출력
3. BibTeX 파일 생성
4. `docs/sessions/index.md`에 이번 세션 정보 추가 (없으면 새로 생성)

**출력:**
```
docs/sessions/{주제}_{날짜}/output/
├── thesis.md           ← 최종 논문 (한국어)
├── references.bib      ← BibTeX
├── figures/             ← 다이어그램 파일
└── qa-report.md        ← QA 결과
```

**index.md 자동 업데이트:**
```markdown
# 📚 Research Sessions

| # | 날짜 | 주제 | 분량 | PTCS | 언어 | 경로 |
|---|------|------|------|------|------|------|
| 1 | 2026-03-13 | LLM Agents | 표준 | 72% | 한국어 | [열기](llm-agents_2026-03-13/output/) |
```

---

## Step 8: 🌐 대시보드 배포

1. `dashboard/public/sessions.json`을 읽고, 이번 세션 메타데이터를 추가한다:
```json
{
  "id": "{주제-slug}",
  "title": "{논문 제목}",
  "subtitle": "{부제}",
  "date": "{YYYY-MM-DD}",
  "type": "{논문 유형}",
  "lang": "{언어}",
  "words": {단어수},
  "citations": {인용수},
  "ptcs": {PTCS점수},
  "diagrams": {다이어그램수},
  "abstract": "{초록}",
  "path": "docs/sessions/{주제}_{날짜}/output/thesis.md"
}
```
2. `dashboard/lib/data.ts`의 `sessionDetails`에 해당 세션의 본문(sections, references)을 추가한다.
3. Git commit + push:
```bash
git add docs/sessions/ dashboard/public/sessions.json dashboard/lib/data.ts
git commit -m "paper: {주제} — PTCS {N}%"
git push origin main
```
4. Cloudflare Pages가 자동으로 재빌드 → https://navi-pj.pages.dev 에 즉시 반영

**단계별 모드:** "대시보드에 등록하고 배포할까요?"
**자동 모드:** 자동 push

---

최종 보고:
```
✅ 시뮬레이션 완료!

📊 결과 요약:
   주제: {주제}
   단어 수: {N} words
   인용 논문: {N}편
   다이어그램: {N}개
   PTCS 점수: {N}% (투고 가능성)
   출처 등급: A:{N} B:{N} C:{N}

📁 저장 위치: docs/sessions/{주제}_{날짜}/output/
📋 전체 목록: docs/sessions/index.md
🌐 대시보드: https://navi-pj.pages.dev
```

