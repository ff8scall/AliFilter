# 작업 기록: 한/영 인터랙티브 도움말 가이드 (? 버튼 & 최초 1회 온보딩)

- **일시**: 2026-10-15
- **프로젝트**: AliFilter (`c:\AI\Chrome\aliexpress`)
- **작업명**: Help_Guide_Modal
- **검색 태그**: `help-guide`, `onboarding`, `bilingual`, `question-btn`, `verified`

---

## 1. 사용자 요청 요약
- "도움말 간단히 만들수있을까? ?버튼 작게 만들어서 누르면 간단히 설명이 나오는.. 최초 설치시에 한번 나와도 좋고. 그후 ? 누르면 또볼수있고? 한/영 두가지로.."

---

## 2. 주요 조치 및 적용 로직

### 1) 패널 헤더 액션 영역에 미니멀 `?` 버튼 탑재
- `[KO/EN]` 버튼 바로 옆에 단정하고 세련된 원형 물음표 아이콘 버튼(`aliHelpBtn`) 배치.

### 2) 패널 일체형 다크 글래스모피즘 가이드 모달 (`#aliHelpOverlay`)
- 알리 화면 전체를 가리는 난잡한 방식 대신, 플로팅 패널 내부를 부드럽게 덮는 캡슐형 오버레이 카드(Linear/Raycast 감성).
- 5대 핵심 팁(1. 필수 키워드, 2. 제외 키워드, 3. 판매량/평점, 4. 가격대 자동감지, 5. 단축키 및 드래그 이동)을 번호 뱃지와 함께 일목요연하게 표시.
- 상단 `×` 닫기 버튼 및 하단 풀 와이드 액션 버튼(`시작하기` / `Got it`) 제공.

### 3) 최초 1회 온보딩 자동 노출 & 기억
- `chrome.storage.local.get({ hasSeenGuide: false })`
- 최초 방문 시 패널이 펼쳐지면 자동으로 가이드가 열려 핵심 사용법을 즉시 인지할 수 있도록 유도.
- 닫으면 `hasSeenGuide: true`로 기록되어 이후에는 불필요하게 뜨지 않음.
- 이후 언제든지 헤더의 `?` 버튼을 누르면 즉시 재열람 가능.

### 4) 실시간 한/영 2개 국어 완벽 연동
- 모달이 열려 있는 상태에서 헤더의 `[KO]` / `[EN]` 버튼을 클릭해도 가이드 제목, 5대 설명 문구, 하단 시작 버튼 텍스트가 0.01초 만에 즉시 실시간 전환됨.

---

## 3. 브라우저 실동작 검증 결과
- **데모 페이지**: `demo_usd.html`
- **검증 1**: 패널 헤더에 `[KO]`, `[?]` 버튼 정상 표시 확인.
- **검증 2**: `?` 클릭 시 한글 가이드('AliFilter 사용 가이드', 5대 항목, '시작하기') 팝업 확인.
- **검증 3**: 모달 열린 상태에서 `[KO]` 클릭 시 즉시 영문 가이드('AliFilter Quick Guide', 'Got it')로 실시간 전환 확인.
- **검증 4**: `Got it` 클릭 시 모달이 부드럽게 닫히며 원래 필터 패널로 복귀 확인.
- **검증 5**: 다시 `?` 클릭 시 언제든 가이드가 재오픈됨을 확인.

---

## 4. 수정 및 생성된 파일 목록
- [scripts/content.js](file:///c:/AI/Chrome/aliexpress/scripts/content.js) (도움말 다국어 텍스트, 모달 마크업, 이벤트 및 최초 자동 오픈 로직)
- [styles/content.css](file:///c:/AI/Chrome/aliexpress/styles/content.css) (`.ali-help-overlay` 및 가이드 카드 스타일)
- [.gravityBrain/CHECKLIST_20261015_AliFilter.md](file:///c:/AI/Chrome/aliexpress/.gravityBrain/CHECKLIST_20261015_AliFilter.md) (Phase 11 완료)
- [.gravityBrain/history_index.json](file:///c:/AI/Chrome/aliexpress/.gravityBrain/history_index.json) (인덱스 등록)
