# 프로젝트 메모리 (MEMORY.md)

## 1. 현재 진행 상황
- **작업명**: 알리익스프레스 프로모션 코드 만료 문제 해결 및 실사용 유효 코드 연동 (1, 2, 4 구현)
- **상태**: 전 항목 구현, 구문 검증 및 원격 동기화 완료
- **최신 성과**:
  - **가상 템플릿 코드 전면 제거 & 실제 유효 프로모션 코드 연동**:
    - `ALIFILTER...` 임의 코드를 알리익스프레스 실제 결제 승인 코드(`GCAP04`, `GCAP09`, `GCAP15`, `GCAP36`)로 전면 교체.
    - [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 및 내장 [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js) 동시 반영.
  - **자동 갱신 봇([scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)) 무손실 보존 로직 개선**:
    - 가짜 문자열을 매월 조합해 덮어쓰던 결함을 제거하고, 실제 등록된 유효 코드를 100% 보존(`Preserve`)하는 지능형 파이프라인으로 개편.
  - **UI 선착순 만료 안내 팁박스 탑재**:
    - 선착순 수량 소진 시 조기 만료 주의사항 및 상단 공식 쿠폰팩 링크 이용 유도 팁을 쿠폰 탭 하단에 감성적인 Linear 디자인으로 추가.

## 2. 사용 가이드
- 브라우저의 `chrome://extensions`에서 AliFilter를 새로고침(또는 위젯 내 `🔄 새로고침` 버튼)하면 즉시 실사용 유효 코드가 반영됩니다.
- 프로모션 코드 복사 후 알리 결제 단계에서 사용할 수 있으며, 수량 소진 시 상단 공식 쿠폰팩 받기를 통해 안전하게 즉시할인을 적용받을 수 있습니다.

