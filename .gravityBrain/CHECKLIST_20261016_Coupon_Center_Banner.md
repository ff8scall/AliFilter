# 체크리스트: 알리 공식 전회원 쿠폰팩 받기 배너 탑재 (레퍼럴 극대화)

- **작업명**: Coupon_Center_Banner
- **목표**: 혜택 & 핫딜 탭 상단에 알리 공식 프로모션 쿠폰팩 수령 제휴 배너를 탑재하여 사용자에게 실질적 혜택을 제공하고 제휴 쿠키 활성화율을 극대화
- **상태**: 🟢 전 항목 구현 및 검증 완료

---

## 1. 세부 구현 단계

### Phase 1. 데이터 스키마 확장
- [x] 1-1. [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)에 `couponCenter` 필드 추가 (제목, 설명, 버튼명, 제휴 링크)
- [x] 1-2. [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)의 `FALLBACK_PROMOTIONS` 및 자동 갱신 봇([scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js))에 스키마 동기화

### Phase 2. UI 및 스타일링 구현
- [x] 2-1. [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)에 프리미엄 쿠폰팩 배너 스타일(`ali-coupon-center-banner`) 추가 (오렌지 글래스모피즘 + 클릭 유도 호버 효과)
- [x] 2-2. [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)의 혜택 탭 상단에 배너 렌더링 로직 연동 및 한/영 다국어 지원

### Phase 3. 종합 검증 및 Git 동기화
- [x] 3-1. 문법 검사(`node -c`) 및 `auto_updater.js` 정상 롤링 테스트 통과
- [x] 3-2. 변경사항 Git 커밋 및 GitHub 원격 푸시 완료
- [x] 3-3. 메모리 및 히스토리 기록 갱신
