# 체크리스트: GitHub Actions 완전 무인 자동 프로모션 갱신 봇 구축

- **작업명**: GitHub_Actions_Auto_Updater
- **목표**: 사용자의 개입 0%로, GitHub 클라우드 서버(GitHub Actions)가 주기적으로 프로모션/핫딜 데이터를 자동 갱신하고 커밋/푸시하는 무인 파이프라인 완성
- **상태**: 🟢 전 항목 구현 및 검증 완료

---

## 1. 세부 구현 단계

### Phase 1. 스마트 롤링 & 자동 갱신 스크립트 작성
- [x] 1-1. [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js) 작성
  - KST 기준 현재 연/월 기준 시즌 테마(11월 광군제, 12월 연말세일 등) 자동 감지
  - 쿠폰 코드 및 할인 혜택 데이터 정규화
  - 제휴 트래킹 ID(`alifilter`) 및 딥링크 무손실 보존
  - 데이터 변경 여부 검증 (불필요한 중복 커밋 방지)
- [x] 1-2. 로컬 Node.js 환경에서 스크립트 동작 및 멱등성 검증 완료

### Phase 2. GitHub Actions 크론 워크플로우 구축
- [x] 2-1. [.github/workflows/update_promotions.yml](file:///c:/AI/Chrome/AliFilter/.github/workflows/update_promotions.yml) 생성
  - 매일 자정(KST) 자동 실행 크론 스케줄링 (`0 15 * * *`)
  - 수동 즉시 실행 트리거 (`workflow_dispatch`)
  - `github-actions[bot]` 자동 커밋 & 푸시 권한(`contents: write`) 설정

### Phase 3. 배포 및 저장소 푸시
- [x] 3-1. GitHub 저장소에 워크플로우 및 스크립트 커밋 & 푸시
- [x] 3-2. 워크플로우 정상 등록 확인 및 메모리/히스토리 갱신
