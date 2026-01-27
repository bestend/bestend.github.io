# Issues - site-renewal

## [2026-01-27] Planning Session

### None Yet
No issues encountered during planning phase.

## [2026-01-27] Implementation Status

### Completed Tasks
- ✅ Task 1-5: Phase 1 완료 (Astro 초기화, Tailwind, 레이아웃, 페이지, 배포 설정)
- ✅ Task 8: 사운드 시스템 (SoundManager, SoundToggle)
- ✅ Task 9: 배지 시스템 (BadgeManager, BadgeToast, BadgeList)
- ✅ Favicon 생성 (픽셀 스타일 SVG)

### Pending Tasks
- ⏳ Task 6: 픽셀 캐릭터 컴포넌트 (스프라이트 에셋 필요)
- ⏳ Task 7: 터미널 UI 컴포넌트
- ⏳ Task 10-12: 이스터에그, 맵 네비게이션, 최종 폴리싱 (체크박스는 완료로 표시됨)
- ⏳ 404 페이지

### Known Issues
1. **CSS @import 경고**: global.css에서 @import가 다른 규칙 뒤에 위치 (비치명적)
2. **모바일 메뉴**: Nav.astro의 모바일 메뉴가 토글 기능 없음 (버튼만 있음)
3. **배지 통합**: 배지 시스템이 구현되었지만 페이지에 통합되지 않음
4. **사운드 파일**: public/assets/sounds/ 디렉토리는 있지만 실제 사운드 파일 확인 필요

### Git Status
- 8개 커밋이 로컬에만 존재 (아직 push 안 됨)
- 작업 디렉토리 깨끗함

## [2026-01-27] Task 6 Blocker

### Task 6: 픽셀 캐릭터 컴포넌트 - BLOCKED
**Reason**: 
- 서브에이전트 세션 실패 (JSON Parse error)
- 스프라이트 에셋 다운로드 불가능
- CSS 기반 구현 시도했으나 실패

**Decision**: 
- Task 6 스킵하고 Task 7로 진행
- 나중에 수동으로 간단한 캐릭터 추가 가능
- 핵심 기능 아님 (선택적)

**Workaround**:
- About 페이지에 이모지 캐릭터 사용 가능 (👨‍💻, 🎮)
- 또는 CSS 픽셀 아트를 수동으로 추가

