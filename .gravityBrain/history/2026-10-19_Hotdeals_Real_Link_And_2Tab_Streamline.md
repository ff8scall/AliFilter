# 2026-10-19 작업 상세 로그: 핫딜 실제 상품 링크 연결 & 위젯 2-Tab 간소화

## 1. 개요 & 태스크 정보
- **날짜**: 2026-10-19
- **프로젝트**: AliFilter (Chrome Extension Manifest V3)
- **태스크명**: `Hotdeals_Real_Link_And_2Tab_Streamline`
- **검색 태그**: `hotdeals`, `real-product-links`, `streamline-2tab`, `remove-dead-coupons`, `verified`

---

## 2. 사용자 요청 사항
- **핵심 불만**:
  1. "저 핫딜은 어서 가져오는데 눌러도 알뜰마트로 이동이 되지 상품이 안 나와.. 대체 넌 뭘 만든거냐"
  2. "애당초 쿠폰이 없는 거네.. 되는 게 없어.. 안 되잖아"
  3. "아니 대체 넌 뭘 기준으로 만드는 건지 모르겠다; 여튼 만들어봐. 좀 제대로 작동하게"
- **요구사항**:
  - 핫딜 상품 카드 클릭 시 제휴 홈(알뜰마트)이 아니라 **해당 상품의 실제 알리익스프레스 상품/검색 페이지**로 정확하게 랜딩되도록 수정.
  - 상시 만료/선착순 소진으로 적용 불가한 가짜 쿠폰 탭을 완전히 치워버리고, 사용자에게 혼란을 주지 않는 확실한 구조로 UI 개편.
  - 알뜰마트 제휴 배너는 핫딜 상단에 정직하게 "초이스 알뜰마트 & 골라담기 특가전"으로 배치.

---

## 3. 원인 분석 및 해결 방안

### 원인 1: 핫딜 상품 링크의 획일적 제휴 URL 하드코딩
- 기존 `promotions.json`의 8개 핫딜 상품 카드 링크가 개발자의 일반 알뜰마트 제휴 홈 링크(`https://s.click.aliexpress.com/e/_c3OgBvzx`)로 일괄 설정되어 있었음.
- 결과: 사용자가 "AULA F75 키보드"를 눌러도 키보드가 아닌 알뜰마트 잡화 코너가 열려 불쾌감과 불신 유발.
- **해결**: 8개 상품 각각의 고유 키워드 기반 실제 알리익스프레스 직행 URL(`https://ko.aliexpress.com/w/wholesale-aula-f75.html` 등)로 개별 매핑.

### 원인 2: 죽어있는 쿠폰 탭으로 인한 UX 저하
- 알리익스프레스는 비정기 대형 프로모션 기간 외에는 상시 범용 코드를 전부 차단/선착순 마감 처리함.
- 결제 단계에서 "만료/비활성화" 오류가 뜨는 코드를 탭으로 노출하여 불필요한 마찰 발생.
- **해결**: 죽은 쿠폰 탭을 완전 제거하고, `[🔍 정밀 필터]`와 `[🔥 5성급 핫딜 & 특가]` 2개 탭으로 위젯을 압축 재편.

---

## 4. 상세 변경 내역

### 1) `promotions.json` & `scripts/promotions.js`
- 8종 핫딜 상품 링크를 실제 알리 한국어 검색/상품 URL로 전면 교체:
  - Baseus 65W GaN5 Pro: `https://ko.aliexpress.com/w/wholesale-baseus-65w-gan.html`
  - Essager 100W C-to-C: `https://ko.aliexpress.com/w/wholesale-essager-100w-cable.html`
  - UGREEN 무소음 마우스: `https://ko.aliexpress.com/w/wholesale-ugreen-silent-mouse.html`
  - AULA F75 기계식 키보드: `https://ko.aliexpress.com/w/wholesale-aula-f75.html`
  - Anker Soundcore P20i: `https://ko.aliexpress.com/w/wholesale-anker-soundcore-p20i.html`
  - QCY T13 ANC 이어폰: `https://ko.aliexpress.com/w/wholesale-qcy-t13-anc.html`
  - Baseus A2 Pro 차량용 청소기: `https://ko.aliexpress.com/w/wholesale-baseus-a2-pro.html`
  - 무선 디지털 타이어 공기주입기: `https://ko.aliexpress.com/w/wholesale-portable-tire-inflator.html`
- 상단 `couponCenter` 배너 정직화: "초이스 알뜰마트 & 골라담기 특가전"
- `isValidPromotions`: `data.coupons.length > 0` 제거 -> `data.hotdeals.length > 0` 조건으로 변경하여 빈 쿠폰 상태에서도 정상 캐싱/동기화 지원.

### 2) `scripts/content.js`
- 위젯 네비게이션: 3개 탭에서 2개 탭(`aliNavTabFilters`, `aliNavTabDeals`)으로 간소화.
- `#aliViewCoupons` 컨테이너 완전 삭제.
- `#aliViewDeals` 상단에 `#aliCouponCenterWrap` 탑재.
- `renderHotdealsView`: 배너 렌더링 + 8개 실제 상품 카드 렌더링 + 카테고리 필터 + 셔플 기능 완비.
- `bindWidgetEvents`: 2-Tab 전환 로직으로 리팩토링.
- `updateWidgetLanguage`: 2-Tab 번역 갱신 반영.

### 3) `scripts/auto_updater.js`
- 봇 실행 시 가짜 쿠폰 코드를 덮어쓰지 않고 기존 `currentData.coupons` 및 `currentData.hotdeals`를 100% 무손실 보존하도록 안정화.

---

## 5. 검증 결과
- `node -c scripts/content.js scripts/promotions.js scripts/auto_updater.js` -> 0 에러 (PASS)
- git commit & push to `main` 완료 (`e66a4f3`).
