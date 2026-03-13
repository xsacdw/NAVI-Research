# 대시보드 세션 관리 UI 설계

> **날짜:** 2026-03-13
> **상태:** 설계 중

## 목표

대시보드 UI에서 연구 세션을 폴더로 구분하여 관리 (생성, 삭제, 이동)

## 제약 사항

- Cloudflare Pages = **정적 호스팅**, 서버 API 없음
- 현재 데이터: `data.ts`에 하드코딩 + `docs/sessions/` 파일 시스템
- **해결:** `sessions.json`을 유일한 데이터 소스로 사용, `folder` 필드 추가

## 데이터 모델 변경

```json
// sessions.json
{
  "folders": [
    { "id": "default", "name": "기본" },
    { "id": "medical", "name": "의학" },
    { "id": "ai", "name": "AI" }
  ],
  "sessions": [
    {
      "id": "sleep-cycle",
      "folderId": "default",
      ...기존 필드
    }
  ]
}
```

## UI 설계

### 메인 페이지 (`page.tsx`)

```
┌─────────────────────────────────┐
│ NAVI Research          [+ 폴더] │
├─────────────────────────────────┤
│ 📁 기본 (2)            [⋮ 메뉴] │
│   ├─ 수면 사이클 카드    [⋮]    │
│   └─ 미래 기술 혁신 카드  [⋮]    │
│                                 │
│ 📁 AI (1)              [⋮ 메뉴] │
│   └─ AI 시대의 경제 미래  [⋮]    │
│                                 │
│ 📁 미분류 (1)                    │
│   └─ LLM Agents Survey  [⋮]    │
└─────────────────────────────────┘
```

### 세션 카드 [⋮] 메뉴
- 📂 이동 → 폴더 선택 다이얼로그
- 🗑️ 삭제 → 확인 다이얼로그

### 폴더 [⋮] 메뉴
- ✏️ 이름 변경
- 🗑️ 삭제 (세션은 "미분류"로 이동)

### [+ 폴더] 버튼
- 폴더 이름 입력 다이얼로그

## 구현 방식

**클라이언트 사이드 (localStorage):**
- 폴더 구성, 세션-폴더 매핑을 `localStorage`에 저장
- 서버 변경 없이 즉시 동작
- 기기별로 다름 (OK — 개인용)

**장점:** API 라우트 불필요, Cloudflare Pages 그대로
**단점:** 기기간 동기화 안 됨

## 변경 파일

| 파일 | 변경 |
|------|------|
| `lib/folder-store.ts` | 신규 — localStorage CRUD |
| `components/folder-section.tsx` | 신규 — 폴더별 세션 그룹 |
| `components/session-menu.tsx` | 신규 — 이동/삭제 메뉴 |
| `components/folder-dialog.tsx` | 신규 — 폴더 생성/이름 변경 |
| `app/page.tsx` | 수정 — 폴더 기반 레이아웃 |
