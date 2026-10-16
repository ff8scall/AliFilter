# 작업 히스토리: GitHub Actions 완전 무인 자동 프로모션 갱신 봇 구축

- **일시**: 2026-10-16 12:48 (KST)
- **프로젝트**: AliFilter (알리익스프레스 필터 크롬 확장 프로그램)
- **작업명**: GitHub_Actions_Auto_Updater
- **태그**: `github-actions`, `cron-batch`, `zero-touch`, `auto-commit`, `verified`

---

## 1. 사용자 요청
- 사용자가 직접 매달 커밋하는 것이 아닌, GitHub Actions 배치를 통해 완전 자동으로 프로모션 코드를 갱신하고 자동 커밋/푸시까지 처리하는 시스템 구축 요청.

## 2. 작업 내용 및 결과
1. **스마트 롤링 & 자동 갱신 스크립트 구현 ([scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js))**:
   - 한국 표준시(KST) 기준 날짜를 계산하여 1월부터 12월까지 알리 공식 세일 테마(11월 광군제/블랙프라이데이, 3월 창립세일, 6월/8월 메가세일 등)를 스마트 자동 감지.
   - 쿠폰 코드와 혜택 텍스트를 최신 시즌에 맞게 자동 롤링.
   - 사용자의 제휴 트래킹 ID(`alifilter`) 및 5성급 핫딜 딥링크 무손실 보존.
   - 데이터 변경 시에만 파일 갱신하는 멱등성 검증 완료.
2. **GitHub Actions 크론 워크플로우 구성 ([.github/workflows/update_promotions.yml](file:///c:/AI/Chrome/AliFilter/.github/workflows/update_promotions.yml))**:
   - 스케줄 트리거: 매일 자정(한국시간 00:00 KST = 15:00 UTC) 자동 기상.
   - 수동 즉시 실행 트리거: `workflow_dispatch` 지원.
   - 권한: `contents: write` 부여로 `github-actions[bot]`이 자동으로 `promotions.json`을 `git commit & push`.

## 3. 수정 및 추가된 파일
- [.github/workflows/update_promotions.yml](file:///c:/AI/Chrome/AliFilter/.github/workflows/update_promotions.yml)
- [scripts/auto_updater.js](file:///c:/AI/Chrome/AliFilter/scripts/auto_updater.js)
- [promotions.json](file:///c:/AI/Chrome/AliFilter/promotions.json)
- [.gravityBrain/CHECKLIST_20261016_GitHub_Actions_Auto_Updater.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/CHECKLIST_20261016_GitHub_Actions_Auto_Updater.md)
- [.gravityBrain/MEMORY.md](file:///c:/AI/Chrome/AliFilter/.gravityBrain/MEMORY.md)
- [.gravityBrain/history_index.json](file:///c:/AI/Chrome/AliFilter/.gravityBrain/history_index.json)
