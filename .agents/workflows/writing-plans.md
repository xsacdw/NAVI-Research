---
description: Superpowers 계획 작성 — 설계를 실행 가능한 세부 계획으로 변환
---

# 📝 Writing Plans — 설계를 계획으로

승인된 설계를 기반으로, 컨텍스트 없는 엔지니어도 따를 수 있는 세부 실행 계획을 작성합니다.

## 시작 알림
"writing-plans 워크플로우를 사용하여 구현 계획을 작성합니다."라고 안내한다.

## 계획 저장 위치
`docs/plans/YYYY-MM-DD-<feature-name>.md`

## 스코프 체크
스펙이 여러 독립 서브시스템을 다루면, 서브시스템별로 별도 계획을 제안한다.
각 계획은 독립적으로 작동하고 테스트 가능한 소프트웨어를 생성해야 한다.

## 파일 구조 먼저
태스크 정의 전에, 생성/수정할 파일 목록과 각 파일의 책임을 매핑한다:
- 명확한 경계와 잘 정의된 인터페이스를 가진 단위로 설계
- 작고 집중된 파일 선호 (한 파일이 너무 많은 일을 하면 안 됨)
- 함께 변경되는 파일은 함께 위치

## 한 입 크기 태스크
**각 스텝은 하나의 행동 (2~5분):**
- "실패하는 테스트 작성" — 스텝
- "실행해서 실패 확인" — 스텝
- "테스트를 통과시키는 최소 코드 작성" — 스텝
- "테스트 실행해서 통과 확인" — 스텝
- "커밋" — 스텝

## 계획 문서 헤더 (필수)

```markdown
# [Feature Name] 구현 계획

> **실행 방법:** `/executing-plans` 워크플로우를 사용하여 이 계획을 구현합니다.

**목표:** [이것이 무엇을 만드는지 한 문장]
**아키텍처:** [접근법 설명 2~3 문장]
**기술 스택:** [핵심 기술/라이브러리]

---
```

## 태스크 구조

```markdown
### Task N: [컴포넌트 이름]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: 실패하는 테스트 작성**
  [완전한 테스트 코드]

- [ ] **Step 2: 테스트 실행 → 실패 확인**
  Run: `pytest tests/path/test.py::test_name -v`
  Expected: FAIL

- [ ] **Step 3: 최소 구현**
  [완전한 구현 코드]

- [ ] **Step 4: 테스트 통과 확인**
  Run: `pytest tests/path/test.py -v`
  Expected: PASS

- [ ] **Step 5: 커밋**
  `git add ... && git commit -m "feat: ..."`
```

## 필수 규칙
- 정확한 파일 경로 항상 명시
- 완전한 코드 포함 ("validation 추가" 같은 추상적 지시 금지)
- 정확한 명령어와 예상 출력
- DRY, YAGNI, TDD, 빈번한 커밋

## 계획 완료 후
**"계획 완료. `docs/plans/<filename>.md`에 저장했습니다. 실행할까요?"**
→ `/executing-plans` 워크플로우로 전환
