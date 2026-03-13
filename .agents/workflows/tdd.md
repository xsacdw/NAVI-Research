---
description: Superpowers TDD — 테스트 주도 개발 RED-GREEN-REFACTOR 사이클
---

# 🔴🟢🔵 Test-Driven Development (TDD)

테스트를 먼저 쓰고, 실패를 확인하고, 최소 코드를 작성합니다.

## 핵심 원칙
> **테스트가 실패하는 것을 확인하지 않았다면, 올바른 것을 테스트하는지 알 수 없다.**

## 철칙
```
실패하는 테스트 없이 프로덕션 코드를 작성하지 않는다
```

**테스트 전에 코드를 먼저 썼다면?**
→ 삭제한다. "참고용"으로도 남기지 않는다. 보지도 않는다.
→ 테스트부터 새로 시작한다.

## 언제 사용하나
**항상:**
- 새 기능, 버그 수정, 리팩토링, 동작 변경

**예외 (사용자에게 물어볼 것):**
- 임시 프로토타입, 생성된 코드, 설정 파일

## RED-GREEN-REFACTOR 사이클

### 🔴 RED — 실패하는 테스트 작성
- 하나의 동작을 테스트
- 명확한 이름
- 실제 코드 사용 (mock은 불가피한 경우만)

```python
# ✅ 좋은 예
def test_search_returns_papers_for_valid_query():
    result = search("quantum computing")
    assert len(result) > 0
    assert "title" in result[0]

# ❌ 나쁜 예
def test_search_works():
    mock = MagicMock()
    mock.return_value = [{"title": "test"}]
    assert mock() is not None  # mock을 테스트하고 있음
```

### 🔴 확인 — 실패 관찰 (필수! 절대 스킵 금지)
```bash
pytest tests/test_search.py::test_search_returns_papers -v
```
확인할 것:
- 테스트가 에러가 아닌 **실패**로 끝나는가
- 실패 메시지가 예상과 일치하는가
- 기능이 없어서 실패하는가 (오타 때문이 아닌가)

### 🟢 GREEN — 최소 코드 작성
테스트를 통과시키는 **가장 단순한** 코드만 작성한다.

```python
# ✅ 좋은 예 — 딱 필요한 만큼
def search(query):
    response = requests.get(f"https://api.openalex.org/works?search={query}")
    return response.json()["results"]

# ❌ 나쁜 예 — 과도한 엔지니어링 (YAGNI)
def search(query, max_results=100, sort_by="relevance",
           filters=None, cache_ttl=3600, retry_count=3):
    # 요청하지 않은 기능들...
```

### 🟢 확인 — 통과 관찰 (필수!)
```bash
pytest tests/test_search.py -v
```
확인: 테스트 통과 + 다른 테스트도 여전히 통과 + 경고 없음

### 🔵 REFACTOR — 정리
GREEN 이후에만:
- 중복 제거
- 이름 개선
- 헬퍼 추출
- **테스트는 계속 GREEN 유지**
- 새 동작 추가 금지

### 🔄 반복
다음 기능을 위한 새 실패 테스트로 돌아간다.

## 위험 신호 — 멈추고 처음부터 다시
- 실패를 확인하지 않고 GREEN으로 넘어감
- 한 번에 여러 동작을 테스트
- 테스트를 코드에 맞춰 수정 (코드를 테스트에 맞춰야 함)
- "나중에 테스트 추가하겠다"
- 코드를 먼저 쓰고 "어차피 비슷하니까" 유지
