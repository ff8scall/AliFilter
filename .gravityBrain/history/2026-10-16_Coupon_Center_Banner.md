# 작업 히스토리: 알리 공식 전회원 쿠폰팩 받기 배너 탑재 (레퍼럴 극대화)

- **일시**: 2026-10-16 12:58 (KST)
- **프로젝트**: AliFilter (알리익스프레스 필터 크롬 확장 프로그램)
- **작업명**: Coupon_Center_Banner
- **태그**: `referral-boost`, `coupon-pack-banner`, `monetization`, `affiliate`, `glassmorphism`, `verified`

---

## 1. 사용자 요청
- 프로모션 코드의 실제 작동 원리 및 `alifilter` 사용 현황 질문.
- 쿠폰 복사와 핫딜 카드 외에 사용자가 자연스럽게 제휴 링크(레퍼럴)를 클릭하게 만들어 수익을 극대화할 수 있는 합법적 방안 요청.
- 1번 방안(이달의 알리 공식 전회원 쿠폰팩 받기 배너 탑재) 승인 및 구현 요청.

## 2. 작업 내용 및 결과
1. **스키마 및 데이터 확장 ([promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json), [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js))**:
   - `couponCenter` 데이터 객체 추가 (제목, 설명, 혜택 뱃지, 액션 버튼 문구, 제휴 딥링크).
   - [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js) 자동 갱신 봇에도 스키마를 보존하여 매달 시즌에 맞춰 무인 롤링 지원.
2. **UI & 스타일링 ([styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css))**:
   - `ali-coupon-center-banner` 클래스 설계: 오렌지 앰버 글래스모피즘 그라데이션, 광택 쉬머 호버 효과, 티켓 아이콘 및 원클릭 '쿠폰팩 받기' 액션 버튼.
3. **플로팅 위젯 연동 ([scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js))**:
   - 혜택 & 핫딜 탭 최상단에 배너 카드 마운트.
   - 클릭 시 사용자 본인의 제휴 딥링크(`https://s.click.aliexpress.com/e/_c3OgBvzx`)를 새 탭으로 열어 브라우저 제휴 쿠키를 합법적으로 활성화.
   - 실시간 한/영(KO/EN) 2개 국어 완벽 연동.

## 3. 수정 및 추가된 파일
- [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)
- [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)
- [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)
- [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)
- [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)
- [.gravityBrain/CHECKLIST_20261016_Coupon_Center_Banner.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CHECKLIST_20261016_Coupon_Center_Banner.md)
- [.gravityBrain/MEMORY.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/MEMORY.md)
- [.gravityBrain/history_index.json](file:///c:/AI/Chrome/AliFilter/.gravityBrain/history_index.json)
