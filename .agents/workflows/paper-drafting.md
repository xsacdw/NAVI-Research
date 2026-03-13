---
description: 논문 초안 생성 — OpenDraft 6단계 방법론으로 학술 논문 초안을 작성하는 워크플로우
---

# 📄 Paper Drafting — 논문 초안 생성

navi-research CLI로 수집한 논문 데이터를 기반으로, OpenDraft의 6단계 방법론을 따라 학술 논문 초안을 생성합니다.

## 언제 사용하나
- "논문 초안 만들어줘"
- "이 검색 결과로 리뷰 논문 써줘"
- "literature review 작성해줘"
- "연구 보고서 만들어줘"

## 전제 조건
- `navi-research search "주제"` 결과가 `./navi-results/`에 있어야 함
- 없으면 먼저 검색을 안내: "먼저 `navi-research search '주제'`를 실행해주세요"

## ⛔ 규칙
- 모든 인용은 **실제 논문만** 사용 (수집된 데이터에 있는 것만)
- 인용을 **절대 만들어내지 않음** (hallucination 금지)
- 각 섹션 완료 후 **사용자 확인** 받고 다음 진행

---

## 6단계 파이프라인

### Phase 1: 📚 RESEARCH — 수집 결과 분석
1. `navi-results/results.json` 파일 읽기
2. 논문들을 주제별로 클러스터링
3. 핵심 논문(high citation), 최신 논문, 서베이 논문 구분
4. 연구 갭(gap) 식별

**사용자에게 보고:**
```
수집된 논문 N편을 분석했습니다.

주요 클러스터:
1. [주제 A] — N편 (핵심: Author et al., 20XX)
2. [주제 B] — N편 (핵심: Author et al., 20XX)
3. [주제 C] — N편

발견된 연구 갭:
- [갭 설명]

이 분석이 맞습니까?
```

### Phase 2: 🏗️ STRUCTURE — 아웃라인 생성
논문 유형에 따른 아웃라인 템플릿:

**Research Paper (5~10페이지):**
```
1. Introduction
2. Related Work
3. Methodology
4. Experiments / Results
5. Discussion
6. Conclusion
References
```

**Literature Review (10~30페이지):**
```
1. Introduction
   1.1. Scope and Objectives
   1.2. Search Methodology
2. Background
3. [Theme 1]
4. [Theme 2]
5. [Theme 3]
6. Discussion
   6.1. Key Findings
   6.2. Research Gaps
   6.3. Future Directions
7. Conclusion
References
```

**사용자에게 제시:**
- 아웃라인 구조
- 각 섹션의 예상 길이
- 어떤 논문이 어디서 인용될지 매핑

"이 구조로 진행할까요? 수정할 부분이 있으면 말씀해주세요."

### Phase 3: ✍️ WRITING — 섹션별 초안 작성
**각 섹션마다:**
1. 해당 섹션에 관련된 논문들만 집중적으로 참조
2. 학술 톤으로 작성 (3인칭, 수동태, 객관적)
3. 인용은 `(Author et al., 20XX)` 형식
4. 하나의 섹션 완료 후 사용자에게 보여줌

"Section 2: Related Work 초안입니다. 확인해주세요."

**작성 원칙:**
- 인용된 모든 논문이 실제 수집 데이터에 존재하는지 확인
- 문장 끝에 인용이 없는 주장은 하지 않음
- 비교 테이블, 분류 체계 등 구조적 요소 적극 활용

### Phase 4: 🔍 CITATION — 인용 검증
**모든 초안 완료 후:**
1. 초안에서 사용된 모든 인용 추출
2. 각 인용이 `results.json`에 존재하는지 확인
3. DOI가 CrossRef에서 유효한지 API로 검증
4. 존재하지 않는 인용 → 삭제 또는 대체

**사용자에게 보고:**
```
인용 검증 결과:
- 총 인용: N개
- 검증 완료: N개 ✅
- 문제 발견: N개 ⚠️
  - [Author, 20XX] — DOI를 찾을 수 없음 → 삭제 권장
```

### Phase 5: ✨ POLISH — 다듬기
1. 전체 흐름 일관성 확인
2. 중복 표현 제거
3. 전환 문장(transition) 추가
4. 그림/표 번호 일관성

### Phase 6: 📄 EXPORT — 출력
**Markdown으로 저장:** `docs/drafts/YYYY-MM-DD-<title>.md`

**포함 요소:**
- 제목, 저자(사용자), 날짜
- 초록(Abstract)
- 본문
- References (BibTeX 키 연결)

**사용자에게 제시:**
"초안을 `docs/drafts/`에 저장했습니다. LaTeX 변환이 필요하면 말씀해주세요."

---

## PaperBanana 다이어그램 통합
Method 섹션이나 Architecture 섹션에서 다이어그램이 필요할 때:
1. 다이어그램 설명을 텍스트로 작성
2. PaperBanana가 설치되어 있으면 자동 변환 안내
3. 없으면 Mermaid 다이어그램으로 대체

## 핵심 원칙
- **인용 정직:** 없는 논문 인용 금지
- **섹션별 확인:** 한 번에 전체를 쏟아내지 않음
- **인터랙티브:** 사용자가 방향을 수정할 수 있도록
- **학술 품질:** 학술 톤, 적절한 인용 밀도, 논리적 흐름
