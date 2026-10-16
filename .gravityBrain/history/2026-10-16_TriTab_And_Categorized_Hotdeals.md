# 작업 히스토리: 3단 탭(필터/쿠폰/핫딜) 분리 및 카테고리별 핫딜 셔플 큐레이션 구축

- **일시**: 2026-10-16 13:12 (KST)
- **프로젝트**: AliFilter (알리익스프레스 필터 크롬 확장 프로그램)
- **작업명**: TriTab_And_Categorized_Hotdeals
- **태그**: `tri-tab`, `categorized-deals`, `shuffle-hotdeals`, `ux-redesign`, `referral-boost`, `verified`

---

## 1. 사용자 요청
- 핫딜 새로고침 및 분야별(카테고리별) 분류 제공 여부 문의.
- [정밀 필터] / [할인 쿠폰] / [5성급 핫딜] 3개 탭으로 분리 개편 요청.

## 2. 작업 내용 및 결과
1. **핫딜 데이터 풀 및 카테고리 태깅 확장 ([promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json), [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js))**:
   - `category` 필드(`charging`, `pc`, `audio`, `life`) 추가.
   - 검증된 인기 가성비 1티어 상품 8종 풀 구축 (Baseus 65W GaN, Essager 100W LED 케이블, UGREEN 무소음 마우스, AULA F75 기계식 키보드, Anker P20i 노캔, QCY T13 ANC, Baseus 차량 청소기, 스마트 무선 타이어 펌프).
2. **UI 3단 탭 독립 개편 ([scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js), [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css))**:
   - `ali-panel-nav`를 3단 탭 구조로 최적화: `[🔍 정밀 필터]`, `[🎟️ 할인 쿠폰]`, `[🔥 5성급 핫딜]`.
   - `aliViewFilters`, `aliViewCoupons`, `aliViewDeals`로 뷰를 물리적으로 분리하여 스크롤 부담 해소.
3. **카테고리 칩 및 랜덤 셔플 새로고침 엔진 탑재**:
   - 핫딜 탭 상단에 5종 카테고리 칩(`전체`, `⚡ 충전/케이블`, `🖱️ PC/주변기기`, `🎧 음향/이어폰`, `🚗 차량/생활`) 연동.
   - `🎲 다른 핫딜 추천` 버튼 클릭 시 핫딜 목록이 순환/회전하는 셔플 엔진 구현.
4. **한/영(KO/EN) 2개 국어 완벽 연동**:
   - 탭 이름, 카테고리 칩, 셔플 버튼 문구 실시간 전환 지원.

## 3. 수정 및 추가된 파일
- [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)
- [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)
- [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)
- [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)
- [.gravityBrain/CHECKLIST_20261016_TriTab_And_Categorized_Hotdeals.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CHECKLIST_20261016_TriTab_And_Categorized_Hotdeals.md)
- [.gravityBrain/MEMORY.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/MEMORY.md)
- [.gravityBrain/history_index.json](file:///c:/AI/Chrome/AliFilter/.gravityBrain/history_index.json)
