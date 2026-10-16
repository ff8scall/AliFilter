# 코어 로직 및 데이터 흐름 (CORE_LOGIC.md)

## 1. 키워드 추출 (Keyword Extraction)
1. **검색어 획득**:
   - 현재 페이지 URL의 쿼리 스트링(`searchText`, `SearchText`) 또는 알리 상단 검색 인풋 태그(`input[type="text"].search-key-box`) 값 파싱
2. **토큰화 (Tokenization)**:
   - 공백 및 특수문자 기준 분리
   - 영문 대소문자 정규화 (Case-Insensitive)
   - 불용어(Stopwords) 기본 필터링 (옵션)
   - 각 토큰을 독립적인 '필수 태그(Chips)'로 관리

## 2. 매칭 알고리즘 (Strict Matching Logic)
- **대상**: 검색 결과 카드 내 상품 제목 (`h1`, `h3`, `div[class*="title"]` 등)
- **검사 방식**:
  - `AND` 조건: 지정된 모든 필수 키워드가 제목 텍스트에 포함되어 있는가?
  - `OR` 조건 / 부분 일치율 계산: 일치 키워드 수 / 전체 키워드 수 (예: 2/3 일치)
- **예외 처리**:
  - 알리익스프레스의 스폰서 광고(Sponsored/Ad) 카드 별도 라벨링 또는 즉시 제거

## 3. 렌더링 & 하이라이팅 (DOM Mutation & Highlighting)
1. **텍스트 하이라이트**:
   - 정규식 `new RegExp(`(${escapedKeywords.join('|')})`, 'gi')`를 통해 텍스트 노드를 `<mark class="ali-highlight">`로 래핑
   - 원본 DOM 이벤트 및 링크 손상을 방지하기 위해 `TreeWalker` 또는 안전한 텍스트 치환 적용
2. **필터링 액션**:
   - 모드 1: **완전 숨김 (`display: none`)** - 일치하지 않는 상품을 완전히 가림
   - 모드 2: **반투명 흐리게 (`opacity: 0.15; filter: grayscale(80%)`)** - 완전히 사라지는 게 불안할 때 누락 상품을 흐리게만 처리
3. **무한 스크롤 방어 (`MutationObserver`)**:
   - 카드가 동적으로 추가될 때마다 디바운스(Debounce: 100ms)를 적용하여 성능 저하 없이 신규 카드만 선별 처리

## 4. 프로모션 & 핫딜 원격 동기화 엔진 (Remote Promotions Sync Engine)
1. **무중단 원격 배포 (Zero-Rebuild Deployment)**:
   - 구글 웹스토어 재심사(1~3일) 없이, GitHub 저장소의 `promotions.json`을 수정하는 즉시 전 세계 모든 사용자에게 최신 할인코드 및 핫딜 반영.
2. **다계층 캐시 & Fallback 구조**:
   - 1계층: `window.__ALI_PROMOTIONS__` 동기 전역 변수 (초기 렌더링 지연 제로)
   - 2계층: `chrome.storage.local` 비동기 영구 캐시 (TTL 6시간 유효성 검사)
   - 3계층: `fetch('https://raw.githubusercontent.com/.../promotions.json?_t=timestamp')` 원격 실시간 갱신 (CDN 캐시 버스팅)
   - 안전망: 네트워크 실패, 깃헙 장애, 오프라인 시 내장 `FALLBACK_PROMOTIONS`로 100% Graceful Fallback
3. **반응형 이벤트 구독 (`subscribe`)**:
   - 백그라운드 페치 완료 시 등록된 UI 뷰에 자동 알림 통지 및 실시간 리렌더링
4. **보안 & 신뢰성**:
   - 정적 JSON 규격 스키마 검증 (`coupons`, `hotdeals` 유효성) 통과 시에만 스토리지 반영
   - XSS 차단을 위한 DOM 텍스트 안전 삽입 원칙 준수
