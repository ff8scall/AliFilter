# 프로젝트 메모리 (MEMORY.md)

## 1. 현재 진행 상황
- **작업명**: GitHub Actions 완전 무인 자동 프로모션 갱신 봇 (`.github/workflows/update_promotions.yml`) 구축 완료
- **상태**: Phase 1 ~ Phase 3 전 항목 완료 및 멱등성/문법 검증 완료
- **최신 성과**:
  - **100% 무인 자동 커밋 & 배포 파이프라인 완성**:
    - 사용자가 컴퓨터를 켜거나 깃헙에 접속할 필요 전혀 없음.
    - GitHub Actions 클라우드 서버가 매일 한국 시간 자정(`0 15 * * *`)에 자동 기상.
    - [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)가 KST 기준 현재 연/월(11월 광군제, 12월 연말세일 등)을 자동 감지하여 [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)을 최신화.
    - `github-actions[bot]`이 변경사항을 감지하여 자동으로 `git commit` & `git push`.
    - 수동 즉시 실행(`workflow_dispatch`)도 함께 지원하여 필요 시 깃헙 웹에서 1초 만에 실행 가능.
    - 사용자의 제휴 트래킹 ID(`alifilter`) 및 딥링크는 영구 보존.

## 2. 사용 가이드
- 별도로 조작하실 것이 전혀 없으며, 365일 24시간 완전 자동으로 최신 쿠폰과 프로모션이 갱신됩니다.
- 필요할 경우 GitHub 저장소 > **Actions** 탭에서 **Auto Update AliExpress Promotions** 워크플로우의 'Run workflow' 버튼을 눌러 언제든 즉시 갱신할 수도 있습니다.
