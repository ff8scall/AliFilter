# 작업 체크리스트 (CHECKLIST_20261016_Affiliate_Deals_Tab.md)

## 1. 작업 개요
- **작업명**: AliFilter 제휴 혜택 & 핫딜 추천 탭 (쿠폰 안내 & 5성급 핫딜 큐레이션)
- **목표**: 
  - 알리 제휴(AliExpress Portals) 약관 및 구글 웹스토어 정책을 100% 준수한 합법적 수익화 모델 구현
  - 플로팅 패널 내 `[필터]` / `[혜택 & 핫딜]` 2개 탭 시스템 구축
  - 이달의 알리 할인 프로모션 코드 (원클릭 복사 지원)
  - 검증된 가성비 5성급 추천 핫딜 카드 (사용자의 트래킹 ID 제휴 링크 연동)
  - 한/영(KO/EN) 실시간 다국어 지원 및 손쉬운 커스텀 데이터 구조 분리

---

## 2. 세부 태스크 (Checklist)

- [x] **Phase 1: 데이터 모델 설계 및 모듈 분리**
  - [x] `scripts/promotions.js` 데이터 파일 생성 (쿠폰 목록, 핫딜 추천 목록, 제휴 링크 관리)
  - [x] 사용자 트래킹 딥링크(`https://s.click.aliexpress.com/e/_c3OgBvzx`) 기본값 등록
  - [x] `manifest.json`에 `scripts/promotions.js` 추가 및 CSP 검증

- [x] **Phase 2: 다국어(I18N) 사전 확장**
  - [x] `content.js`의 `I18N.ko`, `I18N.en`에 혜택 탭, 쿠폰 복사, 핫딜 관련 레이블 추가

- [x] **Phase 3: 플로팅 패널 UI 탭 구조 개편**
  - [x] 패널 헤더 아래 서브 탭 네비게이션 추가 (`[필터]`, `[혜택 & 핫딜]`)
  - [x] 필터 영역(`ali-view-filters`)과 혜택 영역(`ali-view-deals`) 컨테이너 분리
  - [x] 탭 클릭 시 뷰 전환 애니메이션 및 이벤트 바인딩

- [x] **Phase 4: 혜택 & 핫딜 뷰 상세 컴포넌트 렌더링**
  - [x] 프로모션 코드 리스트 카드 (할인 조건, 프로모코드, 원클릭 복사 버튼 및 복사 완료 피드백)
  - [x] 엄선된 추천 핫딜 카드 (제품 뱃지, 평점/주문수, 할인가, '특가 보러가기' 제휴 링크 버튼)

- [x] **Phase 5: 스타일링 (CSS) - Linear / Raycast 다크 글래스모피즘**
  - [x] 탭 스위치 버튼 스타일링
  - [x] 쿠폰 카드 및 프로모코드 뱃지 스타일링
  - [x] 핫딜 상품 카드 썸네일, 타이틀, 가격표, 클릭 버튼 스타일링

- [x] **Phase 6: 코드 검증 및 단위 테스트**
  - [x] `node.js` 기반 `promotions.js` 및 `content.js` 문법/컴파일 100% 정상 검증 통과
  - [x] `test/demo_usd.html` 및 `test/demo_aliexpress.html` 스크립트 연결 완료

- [x] **Phase 7: 메모리 동기화 및 작업 히스토리 기록**
  - [x] `.gravityBrain/MEMORY.md`, `history_index.json`, 히스토리 문서 작성
