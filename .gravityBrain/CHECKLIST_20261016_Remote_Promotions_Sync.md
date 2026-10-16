# 체크리스트: 원격 프로모션 JSON 동기화 & 실시간 갱신 시스템 구축

- **작업명**: Remote_Promotions_Sync
- **목표**: 크롬 웹스토어 재심사 없이, GitHub의 `promotions.json` 갱신만으로 모든 사용자에게 최신 할인코드 & 핫딜 실시간 자동 배포
- **상태**: 🟢 전 항목 구현 및 검증 완료

---

## 1. MASC 협의체 분석 결과

### 🎯 [PM] 프로덕트 관점
- **핵심 가치**: 매달 바뀌는 알리 프로모션 코드 및 긴급 타임세일 핫딜을 1분 만에 전 세계 사용자에게 실시간 무중단 배포.
- **UX 요구사항**:
  - 앱 로딩 시 지연 없이 즉각 표시 (로컬 캐시 즉시 렌더링).
  - 백그라운드에서 주기적으로 원격 데이터 페치 후 조용히 캐시 업데이트.
  - 네트워크 단절 시에도 기존 내장 데이터로 100% 정상 작동 (Graceful Fallback).

### 🏛️ [아키텍트] 구조 설계
- **데이터 흐름**:
  1. `chrome.storage.local`에서 캐시 확인 (`lastSyncTime`, `promoData`).
  2. 캐시가 없거나 유효기간(TTL: 6시간) 경과 시 원격 `promotions.json` 비동기 `fetch()`.
  3. 성공 시 `chrome.storage.local` 업데이트 및 UI 동기화.
  4. 실패 시 기본 내장 [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js) 데이터 사용.
- **저장소 접근 권한**:
  - GitHub 저장소를 Public으로 전환 완료하여 `raw.githubusercontent.com` 무제한 접근 정상 확인.

### 🛡️ [보안 & 안정성] 리스크 차단
- **XSS 방지**: 원격 데이터는 오직 순수 JSON 데이터만 취급하며, UI 렌더링 시 HTML 주입 없이 안전 필드 매핑.
- **데이터 스키마 검증**: `promotions.json` 파싱 시 필수 필드(`coupons`, `hotdeals`) 유효성 검증 후 캐시 저장.
- **Manifest V3 준수**: `manifest.json`의 `host_permissions`에 원격 데이터 도메인 명시.

---

## 2. 세부 구현 단계 (체크리스트)

### Phase 1. 원격 데이터 파일 생성 및 GitHub 업로드
- [x] 1-1. 최신 규격의 [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json) 파일 생성 (기존 promotions.js 데이터 기반 순수 JSON화)
- [x] 1-2. GitHub 저장소에 `promotions.json` 커밋 및 푸시
- [x] 1-3. 저장소 공개 여부 확인 및 Raw 접근성 검증 (Node.js & Invoke-RestMethod 검증 통과)

### Phase 2. 매니페스트 권한 및 원격 동기화 엔진 구현
- [x] 2-1. [manifest.json](file:///c:/AI/Chrome/AliFilter/manifest.json)에 `host_permissions` 추가 (`https://raw.githubusercontent.com/*`)
- [x] 2-2. [scripts/promotions.js](file:///c:/AI/Chrome/AliFilter/scripts/promotions.js) 고도화:
  - 원격 JSON 페치 함수 (`fetchRemotePromotions`)
  - 로컬 캐시 관리 (`chrome.storage.local`, TTL 6시간 체크)
  - 안전한 Fallback 및 스키마 검증 로직 구현
  - 이벤트 리스너 구독 시스템 (`subscribe`)

### Phase 3. 플로팅 패널 UI 연동 및 실시간 반영
- [x] 3-1. [scripts/content.js](file:///c:/AI/Chrome/AliFilter/scripts/content.js)의 프로모션 렌더링 로직을 비동기 프로모션 데이터 로더와 연결
- [x] 3-2. 로딩 완료 시 쿠폰 & 핫딜 리스트 즉시 갱신 (반응형 구독)
- [x] 3-3. '최신 업데이트 일시' 표시 및 원클릭 '새로고침' 수동 동기화 버튼 탑재
- [x] 3-4. [styles/content.css](file:///c:/AI/Chrome/AliFilter/styles/content.css) 상태 배지 및 애니메이션 회전 스타일 추가

### Phase 4. 종합 테스트 및 검증
- [x] 4-1. 온라인 정상 페치 및 캐싱 동작 테스트 (`test/test_sync.js` 검증 통과)
- [x] 4-2. 네트워크 오프라인 시 Fallback 동작 코드 검증
- [x] 4-3. 문법 검사(`node -c`) 통과
- [x] 4-4. 최종 커밋 & 푸시 및 메모리 동기화
