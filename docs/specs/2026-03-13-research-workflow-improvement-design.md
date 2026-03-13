# NAVI Research Workflow 개선 설계

> **날짜:** 2026-03-13
> **상태:** 승인 완료, 구현 완료

## 목표

6개 참조 프로젝트(OpenDraft, AI Scientist, PaperBanana, GPT Researcher, ScholarCopilot, SynapseFlow) 분석을 기반으로 NAVI 논문 시뮬레이션 워크플로우를 개선한다.

## 설계 결정

### Phase 1: 워크플로우 md 수정 (13개 항목)
- Step 1: 6개 하위 쿼리 자동 생성 (OpenDraft 방식)
- Step 4: 컨텍스트 체인 + CitationDB + 환각방지 + per_section_tips + 2회 리파인
- Step 5: NeurIPS 스타일 가이드 + Critic 4축 평가 3라운드
- Step 6: QA 3중 → 7중 확장 (Thread, FactCheck, Peer Review, Diagram QA)
- 재검토 수정: 경로(F1), cite 매핑(F2), BibTeX(F3)

### Phase 2: Python 코드 (2개 모듈)
- `search-multi` 서브커맨드 — 기존 navi-research CLI 확장
- `citation_db.py` — results.json ↔ {cite_XXX} 매핑

### Phase 3: 아키텍처 (2개 항목)
- Step 6: QA 재시도 5단계 로직
- Step 7: pandoc PDF/DOCX 변환

### 불필요 판정 (6개)
- search_papers.py (navi-research에 이미 존재)
- novelty_checker.py, factcheck_verifier.py (Antigravity가 직접 수행)
- DraftContext, Checkpoint (워크플로우+파일 저장이 대체)
- 비동기 병렬 검색 (navi-research에 이미 구현)

## 변경 파일

| 파일 | 변경 |
|------|------|
| `.agents/workflows/research-simulate.md` | 231 → 385줄 |
| `.agents/workflows/superpowers.md` | HARD GATE 3개 추가 |
| `src/navi_research/cli.py` | search-multi 서브커맨드 |
| `src/navi_research/citation_db.py` | 신규 170줄 |
