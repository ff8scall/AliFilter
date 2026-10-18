# 체크리스트: 알리익스프레스 프로모션 코드 만료 수정 & 실사용 유효 코드 연동

- **작업명**: Fix_Expired_Promotions
- **목표**: 
  1. 가상 코드(ALIFILTER...)를 실제 알리익스프레스 유효 프로모션 코드로 전면 교체
  2. 자동 갱신 봇(`scripts/auto_updater.js`)이 가짜 코드를 찍어내지 않고 실제 유효 코드를 보존/연동하도록 로직 개선
  3. UI상에 선착순 만료 주의사항 및 상단 공식 쿠폰팩 안내 팁박스 추가
- **상태**: 🟢 전 항목 구현 및 검증 완료

---

## 세부 구현 항목

### Phase 1. 실제 유효 프로모션 코드로 데이터 교체 (요청 1)
- [x] 1-1. [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)의 `ALIFILTER...` 가상 코드를 실제 사용 가능한 공식 코드(`GCAP04`, `GCAP09`, `GCAP15`, `GCAP36`)로 교체
- [x] 1-2. [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)의 내장 `FALLBACK_PROMOTIONS`에도 동일한 실제 유효 코드 반영

### Phase 2. 자동 갱신 봇 로직 개선 (요청 2)
- [x] 2-1. [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)에서 가상 문자열 조립(`ALIFILTER${monthStr}03`) 로직 전면 제거
- [x] 2-2. 기존의 유효한 실사용 코드가 존재할 경우 덮어쓰지 않고 안전하게 보존(Preserve)하는 메커니즘 구축
- [x] 2-3. 기본 시즌별 코드 풀 또한 실사용 검증 코드로 정규화

### Phase 3. UI 선착순 만료 안내 및 쿠폰팩 이용 안내 팁 추가 (요청 4)
- [x] 3-1. [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js) 다국어(I18N ko/en)에 쿠폰 이용 안내 문구 추가
- [x] 3-2. [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js) `renderCouponsView` 하단에 안내 팁 박스 렌더링 추가
- [x] 3-3. [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)에 Raycast/Linear 감성의 슬릭한 팁 박스 스타일 추가

### Phase 4. 검증 및 Git 푸시 동기화
- [x] 4-1. `node scripts/auto_updater.js` 로컬 실행 및 멱등성 검증 완료
- [x] 4-2. JSON 유효성 및 JS 문법 검사(node -c) 통과
- [x] 4-3. Git commit & push로 GitHub 원격 저장소(`raw.githubusercontent.com`) 즉시 동기화 완료
- [x] 4-4. `.gravityBrain/` 히스토리 및 메모리 최신화 완료
