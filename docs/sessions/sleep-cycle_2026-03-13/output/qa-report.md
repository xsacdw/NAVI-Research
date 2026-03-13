# QA Report — 수면 사이클 Research Paper

**모드:** 퀵 (2,000~5,000자)
**날짜:** 2026-03-13

---

## QA-1: GRA (Grounding 인용 검증)
| 인용 | results.json 존재 | 판정 |
|------|-------------------|------|
| Hill et al. (2018) | ✅ cite_007 | PASS |
| Lerman et al. (2012) | ✅ cite_011 | PASS |
| Wiggs & France (2000) | ✅ cite_013 | PASS |
| Alam et al. (2022) | ✅ cite_015 | PASS |
| Lee et al. (2021) | ✅ cite_016 | PASS |

**결과: PASS** — 허구 인용 0개

## QA-2: PTCS (Paragraph-Topic Consistency)
| 섹션 | 주제 일치 | 인용 유무 | 판정 |
|------|----------|----------|------|
| Abstract | ✅ | ✅ 2건 | PASS |
| 1. 서론 | ✅ | ✅ 2건 | PASS |
| 2.1 NREM | ✅ | ✅ 1건 | PASS |
| 2.2 REM | ✅ | ⚠️ 0건 | WARN |
| 2.3 수면 주기 | ✅ | ⚠️ 0건 | WARN |
| 3. 조절 메커니즘 | ✅ | ✅ 1건 | PASS |
| 4. 건강 영향 | ✅ | ✅ 3건 | PASS |
| 5. 결론 | ✅ | ✅ 1건 | PASS |

**결과: 75% PASS** (6/8 섹션) — 기준 70% 충족 ✅

## QA-3: SRCS (출처 일관성)
- 인용 5편 모두 results.json에 존재
- **결과: PASS**

## QA-4: Thread (서사 일관성)
- 서론의 연구질문 3개 → 본문에서 모두 답변됨 ✅
- 용어 통일: NREM/REM, 일주기 리듬, 서파수면 — 일관됨 ✅
- **결과: PASS**

## QA-5: FactCheck (사실 검증)
| 주장 | 판정 |
|------|------|
| 수면 주기 약 90분 | ✅ 의학 상식과 일치 |
| N2가 전체 수면 45~55% | ✅ 일반적 수치와 일치 |
| REM이 20~25% | ✅ 표준 수치 |
| VLPO flip-flop switch | ✅ cite_015 근거 |
| 교대 근무 사고 위험 2~3배 | ✅ cite_011 근거 |

**결과: PASS** — 불일치 0개

## QA-6: Peer Review (NeurIPS 스타일)
- **Soundness (1-4):** 3 — 체계적 구성, 다만 심층 분석 제한적
- **Presentation (1-4):** 3 — 명확한 서술, 논리적 흐름
- **Contribution (1-4):** 2 — 퀵 모드 특성상 독창적 기여 제한적
- **Overall (1-10):** 6 — 기준 5+ 충족 ✅
- **판정:** Borderline Accept

## QA-7: Diagram QA
- 다이어그램 없음 (퀵 모드 생략) — N/A

---

## 종합 판정

| 항목 | 결과 | 기준 |
|------|------|------|
| GRA | ✅ PASS | 허구 인용 0개 |
| PTCS | ✅ 75% | ≥70% |
| FactCheck | ✅ PASS | 불일치 0개 |
| Peer Review | ✅ 6/10 | ≥5 |

**🟢 QA 통과 — Step 7 진행**
