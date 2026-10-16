# 작업 히스토리: 원격 프로모션 JSON 동기화 & 실시간 갱신 시스템 구축

- **일시**: 2026-10-16 12:28 (KST)
- **프로젝트**: AliFilter (알리익스프레스 필터 크롬 확장 프로그램)
- **작업명**: Remote_Promotions_Sync
- **태그**: `promotions-sync`, `remote-json`, `cache-ttl`, `zero-downtime`, `fallback`, `verified`

---

## 1. 사용자 요청
- 정기적으로 변경되는 알리익스프레스 프로모션 코드 및 핫딜을 업데이트하기 위한 자동 배치 또는 동기화 설정 방안 문의.
- 가장 추천하는 원격 JSON 동기화 아키텍처 승인 및 GitHub 저장소 Public 전환 완료 후 전면 구현 요청.

## 2. 작업 내용 및 결과
1. **GitHub 원격 데이터 엔드포인트 구축**:
   - [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 순수 JSON 파일 생성 및 GitHub 원격 저장소(`https://raw.githubusercontent.com/ff8scall/AliFilter/main/promotions.json`) 배포 완료.
   - Node.js 및 REST 테스트로 무제한 Raw 접근 및 데이터 파싱 유효성 검증 완료.
2. **원격 동기화 & 캐싱 엔진 구현 ([scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js))**:
   - `AliPromotionsManager` 모듈 탑재:
     - 6시간 TTL 로컬 캐시 관리 (`chrome.storage.local`).
     - 캐시 버스팅(`?_t=timestamp`) 원격 비동기 페치.
     - 오프라인/네트워크 장애 시 100% 안전한 `FALLBACK_PROMOTIONS` 자동 전환.
     - 리액티브 `subscribe` 이벤트 알림 시스템 탑재.
3. **플로팅 UI 고도화 ([scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js), [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css))**:
   - 혜택 & 핫딜 탭 상단에 초록색 활성 인디케이터 + `업데이트: 2026-10` 상태 배지 추가.
   - 사용자용 원클릭 수동 `🔄 새로고침` 버튼 탑재 (애니메이션 스핀 및 토스트 안내).
   - 데이터 원격 갱신 시 실시간 자동 리렌더링 연동.
4. **Manifest V3 보안 권한 추가 ([manifest.json](file:///c:/AI/Chrome/AliFilter/manifest.json))**:
   - `host_permissions`에 `https://raw.githubusercontent.com/*` 등록.

## 3. 수정 및 추가된 파일
- [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)
- [manifest.json](file:///c:/AI/Chrome/AliFilter/manifest.json)
- [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js)
- [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)
- [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css)
- [test/test_sync.js](file:///c:/AI/Chrome/AliFilter/test/test_sync.js)
- [.gravityBrain/CHECKLIST_20261016_Remote_Promotions_Sync.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CHECKLIST_20261016_Remote_Promotions_Sync.md)
- [.gravityBrain/SYSTEM_MAP.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/SYSTEM_MAP.md)
- [.gravityBrain/CORE_LOGIC.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CORE_LOGIC.md)
- [.gravityBrain/MEMORY.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/MEMORY.md)
- [.gravityBrain/history_index.json](file:///c:/AI/Chrome/AliFilter/.gravityBrain/history_index.json)
