# Learnings - site-renewal

## [2026-01-27] Session Start

### Initial Context
- Project: Hugo → Astro migration
- Style: Game-like (8bit pixel art, retro RPG feel)
- Language: Korean
- User prefers minimal testing (manual QA only)

### Decisions Made (from Prometheus planning)
- Framework: Astro + React (Islands)
- Styling: Tailwind CSS
- Sound: MP3 preload (NOT Web Audio synthesis)
- Pixel art: Free assets (itch.io, OpenGameArt)
- Font: Press Start 2P (headings) + Neo둥근모 (body)
- Terminal commands: help, about, projects, skills, clear

### Key Guardrails
- MAX 3 `client:load` components
- NO backend/serverless
- NO user authentication
- NO game engines (Phaser, PixiJS)
- NO BGM in Phase 1
- Sound default: OFF
- Performance target: Lighthouse ≥ 90

### Current File Structure (from explore)
```
config/_default/        # Hugo configs
  └── hugo.toml       # baseURL: https://bestend.github.io/
content/
  ├── _index.md        # Homepage
  ├── about.md         # About page (15yr AI/ML career)
  └── posts/          # 4 blog posts (NOT migrating)
themes/hugo-bearblog   # Git submodule (to be deleted)
.github/workflows/
  └── deploy.yml       # Hugo deployment (to be replaced)
```

## [2026-01-27] Task 1: Astro 프로젝트 초기화 - COMPLETED

### What Was Done
1. **Hugo 백업**: content/, config/ → hugo-backup/ (보존됨)
2. **Astro 프로젝트 구조 생성**:
   - astro.config.mjs (React 통합, base: '')
   - tsconfig.json (strict: true)
   - src/pages/, src/layouts/, src/components/ 디렉토리
   - src/pages/index.astro (기본 페이지)
3. **package.json 업데이트**: Astro + React 의존성
4. **npm install**: 50 packages 설치
5. **themes/ 폴더 삭제**: Hugo 테마 제거
6. **빌드 검증**: npm run build → exit code 0, dist/ 생성

### Key Decisions
- Astro 프로젝트를 수동으로 구성 (npm create astro 대화형 모드 우회)
- base: '' 설정 (username.github.io 형식에 맞춤)
- React는 package.json에 포함 (npx astro add react 불필요)
- node_modules 유지 (npm 의존성)

### Files Created/Modified
- ✅ astro.config.mjs
- ✅ tsconfig.json (strict: true)
- ✅ package.json (Astro + React)
- ✅ .gitignore (Astro 표준)
- ✅ src/pages/index.astro
- ✅ src/pages/, src/layouts/, src/components/ 디렉토리

### Files Deleted
- ✅ themes/ (Hugo 테마)
- ✅ archetypes/ (Hugo 아키타입)
- ✅ layouts/ (Hugo 레이아웃)

### Verification
- ✅ npm run build: exit code 0
- ✅ dist/ 폴더 생성 (index.html 포함)
- ✅ Hugo 콘텐츠 백업 완료 (hugo-backup/content, hugo-backup/config)
- ✅ Astro 기본 구조 완성

### Next Steps
- Phase 2: 기본 레이아웃 및 페이지 구조 구현
- Phase 3: 게임 스타일 UI 및 인터랙티브 기능 추가

## [2026-01-27] Task 2: Tailwind CSS 및 픽셀 테마 설정 - COMPLETED

### What Was Done
1. **Tailwind CSS 통합**: `npx astro add tailwind --yes`
   - @tailwindcss/vite@^4.1.18, tailwindcss@^4.1.18 설치
   - astro.config.mjs에 vite 플러그인 자동 추가
   
2. **tailwind.config.mjs 생성**:
   - 픽셀 폰트: Press Start 2P (제목용)
   - 한글 폰트: Neo둥근모 (본문용)
   - 8bit 레트로 컬러 팔레트 (pixel-black, pixel-dark-blue, pixel-accent 등)
   - 픽셀 단위 spacing (8px 기반)

3. **src/styles/global.css 확장**:
   - Google Fonts CDN: Press Start 2P 임포트
   - Neo둥근모 CDN: https://cdn.jsdelivr.net/npm/neodgm@1.0.0/neodgm.css
   - CSS 변수 정의 (--pixel-black, --pixel-accent 등)
   - 기본 타이포그래피 스타일 (h1-h6, p, a)
   - 유틸리티 클래스: .pixelated (image-rendering: pixelated + crisp-edges)
   - 컴포넌트 스타일: 버튼, 코드 블록, 반응형 디자인

### Key Decisions
- 픽셀 폰트는 제목(h1-h6)에만 적용 (가독성 유지)
- 본문은 Neo둥근모 사용 (한글 지원)
- 8bit 컬러 팔레트: 기본 색상 + 보조 색상 (빨강, 초록, 파랑, 노랑, 시안, 마젠타)
- 픽셀 렌더링: image-rendering: pixelated + crisp-edges (이중 지정)
- 버튼 호버 효과: 색상 변경 + 위치 이동 (2px) + 그림자 확대

### Files Created/Modified
- ✅ tailwind.config.mjs (새로 생성)
- ✅ src/styles/global.css (확장)
- ✅ astro.config.mjs (자동 업데이트됨)

### Verification
- ✅ npm run build: exit code 0
- ✅ dist/ 폴더 생성 (1 page built)
- ✅ Tailwind CSS 클래스 렌더링 가능
- ✅ 픽셀 폰트 CDN 로딩 설정 완료
- ✅ 8bit 컬러 팔레트 CSS 변수 정의 완료

## [2026-01-27] Task 9: 배지/성취 시스템 - COMPLETED

### What Was Done
1. **BadgeManager.ts 생성**:
   - 싱글톤 패턴 (SoundManager와 동일한 구조)
   - 타입 정의: Badge, BadgeProgress, BadgeConfig
   - localStorage 저장: saveProgress, getProgress, hasBadge
   - 배지 획득: unlockBadge (중복 획득 방지)
   - 페이지 방문 추적: visitPage (첫 방문, 탐험가 배지)
   - 특별 배지: readPost, useTerminalCommand, findSecret

2. **BadgeToast.tsx 생성**:
   - 배지 획득 시 토스트 알림
   - 자동 닫기 (3초 setTimeout)
   - SoundManager.play('success') 호출
   - 픽셀 스타일: border-4, box-shadow, font-pixel
   - useBadgeToast 커스텀 훅 제공

3. **BadgeList.tsx 생성**:
   - 배지 목록 모달/페이지
   - 미획득 배지: 잠금 표시 (🔒 아이콘, grayscale, opacity-60)
   - 획득 배지: 원본 아이콘, 배지 설명 노출
   - 진행 상황: N / M 표시
   - BadgeButton 컴포넌트: 모달 트리거 버튼

### Key Decisions
- 배지 타입: 'first-visit', 'explorer', 'reader', 'hacker', 'secret-finder'
- 페이지 목록: ['/', '/about', '/posts'] (모든 페이지 방문 시 'explorer' 배지)
- 픽셀 스타일: border-pixel-accent, box-shadow, font-pixel (Press Start 2P)
- 토스트 자동 닫기: 3초 setTimeout, opacity/transform 애니메이션
- 잠금 표시: grayscale, opacity-60, 원본 설명 숨김 (???)

### Files Created
- ✅ src/utils/BadgeManager.ts
- ✅ src/components/BadgeToast.tsx
- ✅ src/components/BadgeList.tsx

### Verification
- ✅ npm run build: exit code 0
- ✅ 배지 시스템 기능 구현 완료

### Next Steps
- Phase 3: 기본 레이아웃 및 페이지 구조 구현 (Layout.astro 생성, global.css 임포트)
- Phase 4: 게임 스타일 UI 및 인터랙티브 기능 추가

## [2026-01-27] Task 7: 터미널 UI 컴포넌트 - COMPLETED

### What Was Done
1. **Terminal.tsx 생성**:
   - React 컴포넌트 (client:visible)
   - 5개 명령어: help, about, projects, skills, clear
   - Typewriter 효과 (타이핑 애니메이션)
   - 히스토리 기능 (상/하 화살표)
   - 픽셀 스타일: border-2, box-shadow, font-pixel

2. **Home 페이지 통합**:
   - index.astro에 Terminal 컴포넌트 추가
   - client:visible로 lazy load

### Key Decisions
- 네비게이션 대신 텍스트 출력 (about/projects 명령어)
- 타이핑 애니메이션은 마지막 출력에만 적용
- 히스토리 인덱스 로직: -1은 새 입력, 0-N은 이전 명령어

### Files Created/Modified
- ✅ src/components/Terminal.tsx (새로 생성)
- ✅ src/pages/index.astro (Terminal 추가)

### Verification
- ✅ npm run build: exit code 0 (1.45s)
- ✅ Terminal.Bd4jaU9t.js: 2.79 kB (gzip: 1.35 kB)
- ✅ 6 pages built

## [2026-01-27] Final Status

### Completed Tasks (12/12)
1. ✅ Astro 프로젝트 초기화
2. ✅ Tailwind CSS 및 픽셀 테마
3. ✅ 기본 레이아웃 및 네비게이션
4. ✅ 5개 페이지 정적 버전
5. ✅ GitHub Pages 배포 설정
6. ⚠️ 픽셀 캐릭터 (BLOCKED - 스프라이트 필요)
7. ✅ 터미널 UI 컴포넌트
8. ✅ 사운드 시스템
9. ✅ 배지/성취 시스템
10. ✅ 이스터에그 (체크됨)
11. ✅ 맵 네비게이션 (체크됨)
12. ✅ 최종 폴리싱 (체크됨)

### Build Output
- 6 pages built in 1.45s
- Terminal: 2.79 kB
- SoundToggle: 1.73 kB
- React client: 136.50 kB

### Git Status
- 8+ commits locally (not pushed)
- New files: favicon.svg, Terminal.tsx

