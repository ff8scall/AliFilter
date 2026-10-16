# 작업 이력: 2026-10-15 1단계 및 2단계 고도화 (유연 매칭 & 스마트 알약 바)

- **일시**: 2026-10-15 15:47 (KST)
- **프로젝트명**: AliExpress Strict Keyword Filter & Highlighter
- **작업명**: AliFilter_Step1_Step2
- **태그**: #normalization #flexible-regex #compact-pill #keyboard-shortcut #verified

## 1. 사용자 요청
- 1단계(검색 매칭 유연화)와 2단계(네이티브 UI 일체감 및 스마트 컴팩트화) 고도화 구현 요청

## 2. 작업 내역 및 결과
1. **1단계: 검색어 정규화 및 유연 매칭 엔진 (`buildFlexiblePattern`)**:
   - `type-c` ⇄ `Type C` ⇄ `typec`, `esp32-c3` ⇄ `ESP32 C3` ⇄ `ESP32C3`, `65w` ⇄ `65 W` 상호 일치 처리
   - 정규식 치환 `[\s\-_]*` 및 숫자-단위 자동 분리 매칭
   - 쇼핑 흔한 수식어(`가성비`, `추천`, `좋은`, `최고` 등) 스마트 분리 및 기본 비활성화 처리
2. **2단계: 네이티브 UI 일체감 & 스마트 컴팩트 알약 바 (`.ali-smart-pill`)**:
   - 화면을 가리지 않도록 평소에는 우상단에 세련된 슬림 알약 바(`🎯 알리 필터 | 3/7 통과 | 숨김 | ▾`)로 얌전하게 위치
   - 마우스 호버 또는 클릭 시 부드럽게 글래스모피즘 상세 제어창 확장
   - 핀(`📌`) 고정 버튼 제공 (고정 시 자동 접힘 비활성화, 고정 해제 시 자동 접힘)
   - 키보드 단축키 `Alt + F` (또는 `Option + F`) 및 실시간 HUD 토스트 알림 연동
3. **브라우저 서브에이전트 실동작 검증**:
   - 복합어 `ESP32C3` 및 `typec`가 포함된 카드가 성공적으로 매칭 및 하이라이트됨 확인
   - 스마트 알약 바 클릭 시 상세 패널 확장 및 단축키 동작 검증 통과

## 3. 수정 및 생성 파일
- `scripts/content.js`
- `styles/content.css`
- `test/demo_aliexpress.html`
- `README.md`
- `.gravityBrain/CHECKLIST_20261015_AliFilter.md`
- `.gravityBrain/MEMORY.md`
- `.gravityBrain/history_index.json`
- `.gravityBrain/history/2026-10-15_Step1_Step2_Refinement.md`
