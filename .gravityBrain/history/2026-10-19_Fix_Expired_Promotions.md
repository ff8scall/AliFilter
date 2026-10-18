# 작업 히스토리: 알리익스프레스 프로모션 코드 만료 문제 해결 및 실사용 유효 코드 연동

- **일시**: 2026-10-19 08:56 (KST)
- **프로젝트**: AliFilter (알리익스프레스 필터 크롬 확장 프로그램)
- **작업명**: Fix_Expired_Promotions
- **태그**: `promotions-fix`, `real-promo-codes`, `auto-updater`, `ui-tip`, `verified`

---

## 1. 사용자 요청
- 프로모션 코드 사용 시 알리 결제창에서 "만료되었다/사용 불가" 메시지가 출력되는 문제 원인 문의.
- 원인 규명 후 1(실제 알리 공식 유효 코드로 교체), 2(갱신 봇 로직 개선), 4(UI 안내 문구 보강) 항목 전면 적용 요청 (3번 사용자 전용 제휴 코드는 미보유 상태).

## 2. 작업 내용 및 결과
1. **가상 코드 제거 및 실제 유효 프로모션 코드로 전면 교체**:
   - `ALIFILTER1003` 등 임의의 테스트 템플릿 코드를 제거하고, 알리익스프레스에서 실제로 통용되는 글로벌/한국 프로모션 코드 체계로 교체:
     - `GCAP04`: $34 이상 구매 시 $4 즉시 할인
     - `GCAP09`: $76 이상 구매 시 $9 즉시 할인
     - `GCAP15`: $142 이상 구매 시 $15 즉시 할인
     - `GCAP36`: $359 이상 구매 시 $36 즉시 할인
   - [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 및 [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)(FALLBACK_PROMOTIONS)에 동시 반영.
2. **자동 갱신 봇([scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)) 로직 고도화**:
   - 임의 문자열 조합(`ALIFILTER${monthStr}03`) 생성 로직을 전면 제거.
   - `promotions.json`에 유효한 실제 코드가 존재할 경우 덮어쓰지 않고 100% 무손실 보존(`Preserve`)하도록 설계.
   - 코드가 비어있거나 구버전 가상 코드일 경우에만 실제 검증 코드로 안전 전환.
3. **UI 선착순 만료 안내 및 팁 박스 탑재**:
   - 다국어(I18N ko/en)에 프로모션 코드 이용 팁 메시지 추가.
   - [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)의 쿠폰 목록 하단에 팁 박스 UI 동적 렌더링 추가.
   - [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)에 Linear/Raycast 감성의 팁 박스 스타일 적용 (골드 액센트 & 가독성 높은 디자인).

## 3. 수정된 파일
- [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)
- [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)
- [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)
- [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)
- [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)
- [.gravityBrain/CHECKLIST_20261019_Fix_Expired_Promotions.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CHECKLIST_20261019_Fix_Expired_Promotions.md)
