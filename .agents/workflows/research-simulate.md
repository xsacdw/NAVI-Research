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

**⚠️ 분량별 Step 적용 규칙:**

| 규칙 | S(퀵) | M(표준) | L(풀) |
|------|:-----:|:------:|:----:|
| 6개 하위 쿼리 검색 | ✅ | ✅ | ✅ |
| `{cite_XXX}` 토큰 → Step 7 치환 | ✅ | ✅ | ✅ |
| CITATION RESTRICTION 블록 | ✅ | ✅ | ✅ |
| 환각 방지 10줄 | ✅ | ✅ | ✅ |
| 다이어그램 생성 (Step 5) | ✅ | ✅ | ✅ |
| 7중 QA (Step 6) | ✅ | ✅ | ✅ |
| 컨텍스트 체인 (이전 2000자) | ❌ | ✅ | ✅ |
| per_section_tips 체크리스트 | ❌ | ✅ | ✅ |
| 2회 리파인먼트 | ❌ | ✅ | ✅ |
| PDF/DOCX 변환 | ❌ | ✅ | ✅ |

> 정확성 규칙(상단 6개)은 **모든 모드에서 필수**. 생략 불가.
> 품질 향상 규칙(하단 4개)은 **표준(M) 이상**에서만 적용.

---

## Step 1: 📚 문헌 검색

1. 주제에서 **6개 하위 검색 쿼리**를 자동 생성한다 (OpenDraft 방식):
   - `"{주제} fundamentals and theoretical background"`
   - `"{주제} current state of research and recent advances"`
   - `"{주제} methodology and approaches"`
   - `"{주제} applications and case studies"`
   - `"{주제} challenges and limitations"`
   - `"{주제} future directions and open problems"`
2. 각 쿼리로 `navi-research search "{쿼리}" --limit 10` 실행 (총 ~60편 수집)
3. 중복 제거 후 최종 30~40편 선별
4. `docs/sessions/_search-cache/results.json` 읽기 (navi-research 기본 출력 경로)
5. 세션 폴더 생성: `docs/sessions/{주제-slug}_{YYYY-MM-DD}/`
6. 검색 결과(`results.json`, `results.bib`, `results.md`)를 세션 폴더에 복사

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

**섹션별 순차 작성 (컨텍스트 체인):**
다음 순서로 한 섹션씩 작성하며, 각 섹션은 이전 섹션의 **마지막 2000자**를 컨텍스트로 참조한다:

1. **Abstract** — 전체 논문의 요약 (마지막에 다시 수정)
2. **Introduction** — 배경, 동기, 연구 질문, 기여점
3. **Related Work / Literature Review** — 선행 연구 정리 + 갭 식별
4. **Methodology** — 접근법, 프레임워크, 분석 방법
5. **Results / Findings** — 핵심 발견사항
6. **Discussion** — 해석, 시사점, 한계
7. **Conclusion** — 요약 + 향후 연구 방향

**컨텍스트 체인 규칙:**
- 각 섹션 작성 시, 바로 이전 섹션에서 작성된 내용의 마지막 2000자를 프롬프트에 포함
- 섹션 간 용어, 약어, 개념이 일관되게 유지되어야 함
- Related Work에서 언급된 연구 갭이 Methodology에서 다뤄져야 함
- Introduction의 연구 질문이 Results에서 답변되어야 함

**인용 관리 시스템 (CitationDatabase):**
- Step 1에서 복사된 `results.json`을 읽어 논문마다 순번 ID 부여:
  - 1번째 논문 → `{cite_001}`, 2번째 → `{cite_002}` ...
  - 매핑 기준: results.json 배열 순서 (인용 수 내림차순 정렬됨)
- 초안 작성 시 인용은 반드시 `{cite_XXX}` 토큰으로 삽입
- 각 섹션 작성 전, 인용 가능 논문 목록을 프롬프트에 첨부:
  ```
  ⚠️ CITATION RESTRICTION ⚠️
  아래 목록의 논문만 인용할 수 있습니다:
  {cite_001}: Kim et al. (2025) "Title..." — Abstract 첫 100자
  {cite_002}: Lee et al. (2024) "Title..." — Abstract 첫 100자
  ...
  이 목록에 없는 논문을 인용하면 안 됩니다.
  ```
- Step 7에서 `{cite_XXX}` → `(Kim et al., 2025)` 형식으로 변환 + BibTeX 키와 매핑

**🚨 ANTI-HALLUCINATION 규칙 (모든 섹션 작성 시 준수):**
1. 절대로 "우리가 연구를 수행했다", "실험을 진행했다"고 쓰지 않는다
2. 절대로 데이터셋, 벤치마크, 실험 결과를 지어내지 않는다
3. 인용 문헌에서 설명된 방법론만 기술한다
4. 수치나 통계를 인용할 때 반드시 출처를 명시한다
5. "연구에 따르면", "~에서 보고된 바와 같이" 등 출처 귀속 표현을 사용한다
6. "혁신적", "획기적", "최초의" 등 검증 불가능한 수식어를 쓰지 않는다
7. 비교 분석 시 원문에 없는 우열 판단을 하지 않는다
8. 일반화 표현 ("모든 연구에서", "항상") 대신 제한적 표현 사용
9. 확실하지 않은 내용은 "~로 추정된다", "~할 가능성이 있다"로 표현
10. LLM 학습 데이터에서 기억한 인용을 사용하지 않는다 — 반드시 results.json의 논문만 인용

**기본 규칙:**
- 모든 주장에는 인용 필수
- 과장 표현 금지 ("모든", "완벽하게", "반드시", "절대")
- 한국어로 작성

**섹션별 체크리스트 (per_section_tips):**

| 섹션 | 필수 체크 항목 |
|------|--------------|
| Abstract | 연구 목적, 방법, 핵심 결과, 시사점이 모두 포함? (150~300자) |
| Introduction | 배경→문제→갭→연구 질문→기여점 순서? 인용 3개+? |
| Related Work | 최소 10편 인용? 비판적 분석? 갭과 자연스럽게 연결? |
| Methodology | 재현 가능한 수준의 상세함? 선택 근거 제시? |
| Results | 모든 연구 질문에 대한 답변? 표/그림 참조? |
| Discussion | 결과 해석? 선행연구와 비교? 한계점 명시? |
| Conclusion | 복붙이 아닌 새로운 관점의 요약? 후속 연구 제안? |

**2회 리파인먼트 (AI Scientist 방식):**

**1차 리파인 (섹션별):** 각 섹션 작성 직후 즉시 검토
- per_section_tips 체크리스트 대조
- 부족한 부분 보완

**2차 리파인 (전체):** 전체 초안 완성 후 통합 검토
- 전체 논문을 처음부터 끝까지 읽으며 일관성 점검
- Abstract를 본문 내용에 맞게 최종 수정
- 용어/약어 통일
- 중복 내용 제거
- 논리적 흐름 최종 점검

**출력:** `sessions/{name}/draft.md`

**단계별 모드:** 섹션 하나 완료마다 확인
**자동 모드:** 전체 작성 후 한 번에 저장

---

## Step 5: 🖼️ 다이어그램 생성

PaperBanana 에이전트 방법론으로 학회 수준 다이어그램 생성:

### 5-1: 다이어그램 식별
논문에서 다이어그램이 필요한 섹션 식별:
- Architecture / Framework 개요도
- 비교 분석 표 / 차트
- 프로세스 파이프라인
- 데이터 흐름도

### 5-2: Planner → Stylist → Visualizer → Critic 파이프라인

**Planner:** 방법론 섹션 + 캡션 → 다이어그램 상세 설명 생성
- 각 요소와 연결 관계를 의미적으로 명확히 기술
- 배경, 색상, 선 두께, 아이콘 스타일 등 형식도 상세히 명시

**Stylist:** NeurIPS 2025 스타일 가이드 적용
- 배경: 파스텔 (크림 `#F5F5DC`, 아이스블루 `#E6F3FF`, 민트 `#E0F2F1`)
- 컴포넌트: 둥근 사각형(R5-10px), 3D큐보이드=텐서, 실린더=DB
- 화살표: 직각=아키텍처, 베지에=데이터흐름, 점선=그래디언트
- 폰트: 라벨=산세리프(Arial), 수식=세리프(Times) — 절대 혼용 금지
- 아이콘: 🔥학습중, ❄️프로즌, 🔍검사, ⚙️연산
- 금지: 네온 색상, 검은 배경, PowerPoint 기본 스타일, 혼합 폰트
- **라벨 언어:** 논문 언어와 동일 (한국어 논문 → 한국어 라벨 + 괄호 안 영어 원어)
  - 예: "힘에의 의지 (Wille zur Macht)", "영원회귀 (Eternal Recurrence)"
  - 화살표 라벨도 한국어: "윤리적 이상", "존재론적 시험" 등

**Visualizer:** generate_image 도구로 이미지 생성

**Critic:** 생성된 이미지를 다음 기준으로 평가 (최대 3라운드):
1. **Faithfulness** — 방법론과 일치? 환각 요소 없음?
2. **Conciseness** — 시각적 신호/잡음 비율 적절?
3. **Readability** — 겹침, 읽기 어려운 텍스트 없음?
4. **Aesthetics** — 학회 출판 수준 품질?
→ "No changes needed" 판정까지 반복 (최대 3라운드)

**출력:** `sessions/{name}/figures/`

**단계별 모드:** 각 다이어그램 확인
**자동 모드:** 전부 생성 후 저장

---

## Step 6: 🔍 품질 검증 (7중 QA)

### QA-1: GRA (근거 검증)
- 초안에서 모든 `{cite_XXX}` 토큰 추출
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

### QA-4: Thread (서사 일관성)
논문의 서사적 일관성을 검증한다:
- **모순 탐지:** 섹션 간 상충되는 주장 식별
- **교차 참조:** "앞서 언급한", "후술할" 등의 참조가 실제로 존재하는지 확인
- **용어 일관성:** 같은 개념에 다른 용어를 사용하지 않았는지 확인
- **논리 흐름:** Introduction의 연구 질문 → Results에서 답변 → Conclusion에서 요약

### QA-5: FactCheck (사실 검증)
핵심 주장 최대 10개를 추출하여 개별 검증한다:
- 각 주장에서 "사실 진술(fact claim)"을 분리
- 인용된 논문의 원문과 대조하여 정확성 검증
- 수치/통계가 원문과 일치하는지 확인
- 검증 결과: ✅ 확인됨 / ⚠️ 불확실 / ❌ 불일치
- 불일치 항목은 수정 제안 포함

### QA-6: Peer Review (NeurIPS 스타일)
논문 전체를 학술 리뷰어 관점에서 평가한다:
- **Originality (1-4):** 새로운 관점이나 기여가 있는가?
- **Quality (1-4):** 분석의 깊이와 엄밀성은?
- **Clarity (1-4):** 읽기 쉽고 논리적으로 구성되었는가?
- **Significance (1-4):** 학술적/실무적 의의가 있는가?
- **Overall (1-10):** 종합 점수
- **Accept/Reject 판정** + 근거 (강점 3개, 약점 3개, 개선 제안 3개)

### QA-7: Diagram QA (4축 다이어그램 평가)
각 다이어그램을 4개 기준으로 평가한다:
- **Faithfulness:** 방법론과 정확히 일치? 환각 모듈/연결 없음?
- **Conciseness:** 텍스트 과부하(15단어+) 없음? 수식 덤프 없음?
- **Readability:** 화살표 겹침, 읽기 어려운 폰트, 검은 배경 없음?
- **Aesthetics:** 격자 흔적, 네온 색상, 아마추어 스타일 없음?
→ 실패 항목이 있으면 Step 5로 돌아가 해당 다이어그램만 재생성

**출력:** `sessions/{name}/qa-report.md`

**단계별 모드:** QA 결과 보여주고 "수정할까요?"
**자동 모드 재시도 로직 (OpenClaw-RL PRM 패턴 적용):**
1. **1차 시도:** Step 4~6 실행
2. **QA 통과 조건:** PTCS 70%+ AND FactCheck 불일치 0개 AND Peer Review Overall 5+
3. **QA 실패 시 — 구체적 수정 힌트 생성:**
   각 실패 항목에서 "무엇을 어떻게 고쳐야 하는지" 구체적 힌트를 추출한다:
   - GRA 실패 → "Section 3에 cite_012, cite_015 추가 가능 (주제 일치)"
   - PTCS < 70% → "Section 5 인용 밀도 1.2/page → 기준 3/page, 관련 논문: cite_008, cite_021"
   - FactCheck ❌ → "L42 '85%' 수치 → cite_003 원문에서는 '78%', 수정 필요"
   - Peer Review 약점 → "Methodology 섹션의 분석 근거가 부족 → cite_009의 프레임워크 참조"
   - Thread 불일치 → "Introduction L12 '3가지 질문' → Results에서 2번째 질문 미답변"
   **힌트 포함하여 실패 섹션만 재작성** (전체 재작성 금지)
4. **2차 시도:** 수정된 섹션으로 QA 재실행 → 통과 시 Step 7, 미통과 시 3차 시도
5. **3차 시도:** 최종 QA → 통과 여부 무관하게 결과와 함께 완료
6. **최대 재시도: 2회** (무한루프 방지)

---

## Step 7: 📄 최종 출력

1. 초안의 `{cite_XXX}` 토큰을 `(저자, 연도)` 형식으로 치환
2. 논문 + 다이어그램 + References를 합쳐 최종본 생성 (한국어)
3. Step 1에서 생성된 `results.bib`를 세션 output으로 복사 (이미 navi-research가 생성)
4. PDF/DOCX 변환 (pandoc):
   ```bash
   # PDF (한국어 폰트 지원)
   pandoc thesis.md -o thesis.pdf \
     --pdf-engine=xelatex \
     --variable mainfont="Noto Sans CJK KR" \
     -V geometry:margin=2.5cm -V fontsize=11pt \
     --citeproc --bibliography=references.bib
   
   # DOCX
   pandoc thesis.md -o thesis.docx \
     --citeproc --bibliography=references.bib
   ```
   ⚠️ pandoc 미설치 시 MD만 출력하고 안내 메시지 표시
5. `docs/sessions/index.md`에 이번 세션 정보 추가 (없으면 새로 생성)

**출력:**
```
docs/sessions/{주제}_{날짜}/output/
├── thesis.md           ← 최종 논문 (한국어, 인용 치환 완료)
├── thesis.pdf          ← PDF (pandoc, 한국어 폰트)
├── thesis.docx         ← DOCX (pandoc)
├── references.bib      ← BibTeX (Step 1에서 복사)
├── figures/             ← 다이어그램 파일
├── qa-report.md        ← QA 결과
└── prompt-log.json     ← 프롬프트 + QA 점수 기록
```

### Step 7.5: 📊 프롬프트 기록 (OpenClaw-RL record 패턴)

각 섹션별 작성 파라미터와 QA 결과를 기록한다:

```json
{
  "session_id": "{주제}_{날짜}",
  "timestamp": "2026-03-13T21:00:00",
  "sections": [
    {
      "name": "Introduction",
      "citations_used": 5,
      "word_count": 1200,
      "retries": 0,
      "qa_notes": "통과"
    },
    {
      "name": "Related Work",
      "citations_used": 12,
      "word_count": 3500,
      "retries": 1,
      "qa_notes": "1차 인용밀도 부족 → cite_008 추가 후 통과"
    }
  ],
  "overall": {
    "ptcs": 78,
    "peer_review": 6,
    "total_retries": 1,
    "total_words": 15000,
    "total_citations": 25
  }
}
```

**출력:** `sessions/{name}/output/prompt-log.json`

다음 논문 생성 시, 이전 세션의 `prompt-log.json`을 참조하여:
- 고득점 섹션의 인용 밀도/분량 패턴 재사용
- 재시도가 잦았던 섹션 유형에 사전 보강

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

