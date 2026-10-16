# 프로젝트 메모리 (MEMORY.md)

## 1. 현재 진행 상황
- **작업명**: AliFilter 원격 프로모션 JSON 동기화 & 실시간 갱신 시스템 구축 완료
- **상태**: Phase 1 ~ Phase 4 전 항목 완료 및 GitHub 원격 연동/문법 검증 완료
- **최신 성과**:
  - **무중단 실시간 할인코드 & 핫딜 배포 아키텍처 확립**:
    - 구글 크롬 웹스토어 재심사(1~3일) 없이, GitHub의 `promotions.json`만 수정하면 전 세계 사용자에게 최신 할인코드 즉시 반영.
    - 다계층 캐싱 전략: `window.__ALI_PROMOTIONS__` 동기 즉시 렌더링 + `chrome.storage.local` 캐시(TTL 6시간) + 원격 백그라운드 페치.
    - 네트워크 장애/오프라인 시 100% 안전한 로컬 내장 Fallback 데이터 보장.
  - **UI 실시간 반영 및 수동 동기화**:
    - 혜택 & 핫딜 탭 상단에 초록색 활성 인디케이터 + '업데이트: 2026-10' 상태 배지 적용.
    - 원클릭 수동 새로고침 버튼(`🔄 새로고침`) 탑재 (클릭 시 토스트 피드백).
    - `AliPromotionsManager.subscribe` 리액티브 이벤트 시스템 적용으로 데이터 갱신 시 실시간 리렌더링.
  - **Manifest V3 보안 & 권한 준수**:
    - `manifest.json`의 `host_permissions`에 `https://raw.githubusercontent.com/*` 추가.

## 2. 사용 가이드
- **할인코드/핫딜 업데이트 방법**:
  - 브라우저나 GitHub 웹에서 [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 파일 내용만 수정하고 Commit/Push하면 끝납니다!
- 브라우저의 `chrome://extensions`에서 새로고침 후 즉시 사용 가능합니다.
