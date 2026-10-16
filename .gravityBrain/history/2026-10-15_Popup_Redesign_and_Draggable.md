# 이력: 상단 팝업창 일관 리디자인 및 플로팅 바 드래그 앤 드롭 (장바구니 가림 방지)

- **일시**: 2026-10-15 16:53
- **프로젝트**: AliExpress Precision Filter & Highlighting Extension
- **작업명**: Popup Redesign & Draggable Safe Placement
- **태그**: `popup-redesign`, `draggable`, `safe-placement`, `unblock-cart`, `verified`

---

## 1. 사용자 요구사항
1. **상단 팝업창 미반영 문제**:
   - "아래(웹페이지 내 위젯)는 바뀌었는데 위(브라우저 상단 확장 프로그램 팝업창)는 안 바뀜.. 맞아?"
   - 사용자가 확장 프로그램 아이콘을 눌렀을 때 뜨는 `popup.html` 창이 여전히 구버전(촌스러운 이모지 🚫, 👻, ✨ 및 형광색 원색)으로 남아있었던 현상.
2. **장바구니/로그아웃 버튼 가림 문제**:
   - "그리고 필터 표시 좋긴한데 위치가.. 로그아웃이나 그런 장바구니 버튼을 가려버리는데.. 좋은 방법 없나"
   - 웹페이지 상단 우측(`top: 16px; right: 20px;`)에 스마트 알약이 뜨면서 알리익스프레스 글로벌 헤더의 계정/로그인/장바구니 버튼을 가리는 UX 충돌.

---

## 2. 해결 및 구현 내용

### 1) 상단 팝업창 전면 리디자인 (`popup.html`, `popup.css`, `popup.js`)
- **이모지 100% 제거**: 🚫, 👻, ✨ 이모지를 전면 제거하고 1.5px 정밀 SVG 벡터 아이콘으로 교체.
- **Linear 감성 다크 테마 일치**: `content.css`와 완벽히 동일한 다크 글래스모피즘(`--af-bg-base: #0c0e12;`), 커스텀 다크 라디오 카드, 세그먼트 컨트롤 버튼, 모던 체크박스 적용.
- **슬림 스크롤바 & 여백 최적화**: 팝업창 내부 스크롤바가 거슬리지 않도록 초슬림 반투명 스크롤바로 디자인하고 타이포그래피 정돈.

### 2) 안전 기본 영역 (Safe Zone) 하향 배치
- 알리익스프레스 상단 글로벌 바(로그인/계정, 주문내역, 장바구니 등 높이 약 80px) 영역을 침범하지 않도록 **기본 시작 위치를 `top: 130px; right: 24px;`로 안전하게 하향 조정**.
- 장바구니나 로그인 버튼을 전혀 가리지 않는 쾌적한 뷰 제공.

### 3) 자유로운 드래그 앤 드롭 (Draggable) 및 위치 영구 저장
- **드래그 핸들**: 접힌 상태의 알약 바 `#aliSmartPill` 또는 펼쳐진 상태의 패널 헤더 `.ali-panel-header`를 잡고 마우스로 끌면 화면 어디든 자유롭게 이동 가능.
- **포인터 이벤트 기반 안정성**: 4px 이상 마우스 이동 시에만 드래그로 판정하여 단순 클릭(패널 열기/닫기)과 충돌 방지.
- **자동 저장**: 드래그 완료 시 좌표(`{ top, left }`)를 `chrome.storage.local.widgetPosition`에 영구 저장하여, 다음 페이지 이동이나 새로고침 시에도 사용자가 둔 위치를 그대로 기억.
- **원클릭 복구 (Double Click Reset)**: 패널 헤더를 더블클릭하면 즉시 기본 안전 위치(`top: 130px, right: 24px`)로 리셋.

---

## 3. 수정된 파일
- `c:\AI\Chrome\aliexpress\popup\popup.html`
- `c:\AI\Chrome\aliexpress\popup\popup.css`
- `c:\AI\Chrome\aliexpress\popup\popup.js`
- `c:\AI\Chrome\aliexpress\styles\content.css`
- `c:\AI\Chrome\aliexpress\scripts\content.js`

---

## 4. 시각적 검증 결과
- `popup.html`: 이모지 없는 정밀 Linear 스타일 다크 테마 확인 완료.
- `demo_usd.html`: 알약 바 및 패널이 상단 헤더(장바구니 영역) 아래로 안전하게 배치되어 헤더가 100% 노출되는 것을 확인 완료.
