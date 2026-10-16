# 작업 이력: 2026-10-15 알리익스프레스 필수 검색어 필터링 및 하이라이트 기획

- **일시**: 2026-10-15 15:22 (KST)
- **프로젝트명**: AliExpress Strict Keyword Filter & Highlighter
- **작업명**: AliFilter_Planning
- **태그**: #aliexpress #chrome-extension #manifest-v3 #filter #highlight

## 1. 사용자 요청
- 알리익스프레스에서 검색 시 입력한 검색어 중 진짜 필수 검색어만 포함된 상품을 다시 걸러주거나, 최소한 하이라이트라도 해주는 기능 구현 가능 여부 및 제작 요청

## 2. 조치 및 설계 내용
- **구현 가능 여부**: 100% 가능하며 필터링과 하이라이트 두 기능을 동시에 유기적으로 연동 가능
- **아키텍처 설계**:
  - Chrome Manifest V3 기반 확장 프로그램
  - 알리익스프레스 검색 페이지(`aliexpress.com/w/wholesale-*` 등)에 주입되는 Content Script
  - 검색어 자동 토큰화 및 웹페이지 우상단/상단 플로팅 툴바를 통한 즉각적인 키워드 On/Off 토글
  - DOM 파싱 및 MutationObserver를 통한 무한 스크롤 실시간 감지
  - 하이라이트(노란색/연두색 형광펜) + 필터링(미포함 상품 숨기기 또는 반투명화 토글)
- **MASC 분석 수행**:
  - PM: 사용자가 쇼핑 중 탭을 열지 않고도 화면 내 플로팅 바에서 원클릭으로 켜고 끌 수 있어야 함
  - 아키텍트: 알리의 동적 클래스명(난독화 대응)에 대비해 안정적인 DOM 셀렉터 구조(시맨틱 태그 및 링크 앵커 기반) 및 디바운스 적용
  - 보안: 외부 네트워크 통신이 전혀 없는 100% 로컬 DOM 조작 방식 적용 (개인정보 및 보안 위협 원천 차단)

## 3. 수정 및 생성 파일
- `.gravityBrain/MEMORY.md`
- `.gravityBrain/SYSTEM_MAP.md`
- `.gravityBrain/CORE_LOGIC.md`
- `.gravityBrain/history_index.json`
- `.gravityBrain/history/2026-10-15_AliFilter_Planning.md`
- `.gravityBrain/CHECKLIST_20261015_AliFilter.md`
