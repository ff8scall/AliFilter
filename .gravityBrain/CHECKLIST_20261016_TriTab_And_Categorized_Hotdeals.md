# 체크리스트: 3단 탭(필터/쿠폰/핫딜) 분리 및 카테고리별 핫딜 셔플 큐레이션 구축

- **작업명**: TriTab_And_Categorized_Hotdeals
- **목표**: 탭을 3개([정밀 필터] / [할인 쿠폰] / [5성급 핫딜])로 분리하여 쾌적한 뷰를 제공하고, 핫딜 탭에 카테고리별 칩 및 랜덤 셔플 새로고침 기능을 탑재하여 사용자 체류 시간과 레퍼럴 클릭률 극대화
- **상태**: 🟢 전 항목 구현 및 검증 완료

---

## 1. 세부 구현 단계

### Phase 1. 핫딜 데이터 풀 확장 및 카테고리 분류
- [x] 1-1. [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)의 `hotdeals` 항목에 카테고리 태그(`category: 'charging' | 'pc' | 'audio' | 'life'`) 및 엄선된 베스트셀러 핫딜 풀 확장 (총 8종 탑재)
- [x] 1-2. [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)의 Fallback 데이터 및 [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js) 스키마 동기화

### Phase 2. UI 3단 탭 분리 및 다국어 지원
- [x] 2-1. [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)의 네비게이션 탭 바를 3단 탭(`aliNavTabFilters`, `aliNavTabCoupons`, `aliNavTabDeals`)으로 개편
- [x] 2-2. 뷰 분리: `aliViewFilters` (검색 필터), `aliViewCoupons` (쿠폰팩 배너 + 공식 코드), `aliViewDeals` (카테고리 칩 + 핫딜 카드 + 셔플 버튼)
- [x] 2-3. i18n 언어 사전(KO/EN)에 3단 탭 및 핫딜 카테고리/셔플 텍스트 추가

### Phase 3. 카테고리별 필터링 & 핫딜 랜덤 셔플 기능 구현
- [x] 3-1. 카테고리 칩 클릭 시 해당 분야 상품 실시간 필터 렌더링 (`all`, `charging`, `pc`, `audio`, `life`)
- [x] 3-2. '🎲 다른 핫딜 추천' 클릭 시 카드 목록 랜덤 셔플 및 회전 애니메이션 연동
- [x] 3-3. [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css) 3단 탭 바, 카테고리 칩, 셔플 버튼 스타일링

### Phase 4. 종합 테스트 및 Git 동기화
- [x] 4-1. 문법 검사(`node -c`) 및 `auto_updater.js` 멱등성 검증 통과
- [x] 4-2. Git 커밋 및 GitHub 원격 푸시 완료
- [x] 4-3. 메모리 및 히스토리 기록 동기화
