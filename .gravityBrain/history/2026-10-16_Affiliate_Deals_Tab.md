# 작업 기록: AliFilter 제휴 혜택 & 핫딜 추천 탭 (2026-10-16)

## 1. 개요 및 배경
- **일시**: 2026-10-16 10:35
- **프로젝트**: AliFilter (알리 정밀 검색 필터 Chrome Extension)
- **작업명**: 합법적 제휴(AliExpress Portals) 수익화 탭 및 쿠폰/핫딜 추천 기능 구현
- **검색 태그**: `affiliate`, `deals`, `coupons`, `portals`, `tracking-id`, `i18n`

---

## 2. 사용자 요청 요약
1. "여기에 알리 포탈에서 가입한 뭔가 코드 연동이 가능한가? 그럼 알리필터 써서 주문하면 나에게 뭔가 들어오게 할수잇나? 가입은 했는데 코드등 어디서 보는지 모르겠네"
2. 스크린샷 확인 후 본인 트래킹 ID(`alifilter`) 및 제휴 링크(`https://s.click.aliexpress.com/e/_c3OgBvzx`) 안내.
3. 부정행위(쿠키 스터핑/납치)가 아닌 100% 합법적 윈-윈 비즈니스 모델(프로모션 코드 원클릭 복사 & 5성급 핫딜 추천 탭) 구현 요청 승인 ("해보자").

---

## 3. 핵심 변경 및 구현 사항
1. **데이터 모델 모듈 분리 (`scripts/promotions.js`)**:
   - `coupons`: 이달의 알리 프로모션 코드 모음 (할인 금액, 코드, 뱃지, 설명)
   - `hotdeals`: AliFilter 검증 5성급 핫딜 목록 (상품명, 평점, 판매량, 할인가, 사용자의 제휴 딥링크 `link`)
   - 사용자가 언제든 메모장/에디터로 상품과 링크, 코드를 손쉽게 교체할 수 있는 구조.
2. **다국어(I18N) 사전 확장 (`scripts/content.js`)**:
   - `tabFilter`, `tabDeals`, `couponsSecTitle`, `hotdealsSecTitle`, `copyCodeBtn`, `copiedToast`, `viewDealBtn`, `affiliateNotice` 등 한국어/영어 양방향 완벽 대응.
3. **플로팅 패널 서브 탭 네비게이션 (`content.js` / `content.css`)**:
   - 패널 헤더 하단에 `[🔍 정밀 필터]` / `[🎁 혜택 & 핫딜]` 2개 탭 바 추가.
   - 탭 클릭 시 부드럽게 필터 뷰와 혜택 뷰 전환.
4. **쿠폰 원클릭 복사 및 피드백**:
   - [복사] 버튼 클릭 시 클립보드 복사(`navigator.clipboard` 및 fallback), 버튼 '복사됨!' 피드백 및 토스트 노출.
5. **투명성 고지 (FTC & 웹스토어 정책 준수)**:
   - "안내: 제휴 링크 경유 시 구매 금액에 따라 AliFilter 개발자에게 소정의 커미션이 지급될 수 있습니다." 안내 문구 탑재.

---

## 4. 수정 및 생성된 파일 목록
- `scripts/promotions.js` (신규)
- `manifest.json` (업데이트: `scripts/promotions.js` 추가)
- `scripts/content.js` (업데이트: 서브탭 전환, 렌더링, 클립보드 복사, 다국어 동기화)
- `styles/content.css` (업데이트: 서브탭, 쿠폰 카드, 핫딜 카드, 복사 버튼 스타일링)
- `test/demo_usd.html`, `test/demo_aliexpress.html` (테스트 페이지 업데이트)
- `.gravityBrain/CHECKLIST_20261016_Affiliate_Deals_Tab.md` (체크리스트 생성)
- `.gravityBrain/MEMORY.md` (메모리 갱신)
