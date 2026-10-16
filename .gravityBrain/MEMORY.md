# 프로젝트 메모리 (MEMORY.md)

## 1. 현재 진행 상황
- **작업명**: 알리 공식 전회원 쿠폰팩 받기 배너 탑재 (레퍼럴 극대화) 완료
- **상태**: Phase 1 ~ Phase 3 전 항목 완료 및 코드 컴파일/문법 검증 완료
- **최신 성과**:
  - **레퍼럴 쿠키 활성화율 극대화 (100% 합법적 윈-윈 구조)**:
    - 혜택 탭 최상단에 눈에 띄는 **`🎟️ 이달의 공식 전회원 쿠폰팩`** 배너 카드 탑재.
    - 클릭 시 알리 공식 이벤트/쿠폰 페이지로 이동하며 본인 제휴 링크(`https://s.click.aliexpress.com/e/_c3OgBvzx`)를 자연스럽게 경유.
    - 브라우저 제휴 쿠키가 활성화되어 사용자의 모든 장바구니 결제 건에 대해 정당한 커미션 창출.
  - **완전 무인 GitHub Actions 봇과 100% 연동**:
    - [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 및 [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)에 `couponCenter` 스키마가 완벽 통합되어 매달 자동 롤링.
  - **시각적 완성도**:
    - [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css) 오렌지 글래스모피즘 + 쉬머 광택 호버 효과 + 다국어(KO/EN) 완벽 대응.

## 2. 사용 가이드
- 브라우저의 `chrome://extensions`에서 새로고침 후 즉시 사용 가능합니다.
- 알리익스프레스 검색 페이지에서 `[🎁 혜택 & 핫딜]` 탭을 열면 최상단에 쿠폰팩 배너가 표시됩니다.
