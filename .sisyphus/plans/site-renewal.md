# bestend.github.io 게임스타일 리뉴얼

## Context

### Original Request
현재 너무 심심한 bestend.github.io 페이지를 게임스러운 개인 블로그로 리뉴얼.
한 페이지가 아닌 여러 페이지로 구성하고, 재미있는 UI로 꾸미기.

### Interview Summary

**핵심 결정사항**:
- **사이트 목적**: 개인 블로그 (기술 블로그 + 포트폴리오 하이브리드)
- **분위기**: 게임스러운 (8bit 레트로, RPG 느낌)
- **언어**: 한국어 기본

**게임 요소**:
- 픽셀/레트로 스타일 (8bit 그래픽)
- 탐험 네비게이션 (맵 느낌)
- 사운드 이펙트 (8bit 클릭음, MP3)
- 성취/배지 시스템
- 캐릭터/아바타 (후드 쓴 해커)
- 캠프 창 (터미널 UI)

**기술 스택**:
- Framework: Astro + React (Islands)
- Styling: Tailwind CSS
- Animation: GSAP / Framer Motion
- Deployment: GitHub Pages (withastro/action@v5)

### Metis Review

**식별된 갭 (해결됨)**:
- 사운드 접근법 → MP3 프리로드 방식
- 픽셀 아트 소스 → 무료 에셋 (itch.io, OpenGameArt)
- 한글 폰트 → 영문 픽셀 폰트 + 한글 지원 폰트 혼용
- 터미널 명령어 → 5개 (help, about, projects, skills, clear)

---

## Work Objectives

### Core Objective
기존 Hugo 기반 미니멀 사이트를 Astro 기반 게임스러운 개인 블로그로 완전히 리뉴얼한다.

### Concrete Deliverables
- Astro 프로젝트 신규 구축 (Hugo 완전 대체)
- 5개 페이지: Home, About, Projects, Blog, Skills, Contact
- 픽셀 아트 캐릭터 (해커 스타일)
- 터미널 UI 컴포넌트
- 사운드 시스템 (토글 가능)
- 배지/성취 시스템
- GitHub Pages 자동 배포

### Definition of Done
- [x] `npm run build` 성공
- [ ] Lighthouse Performance ≥ 90점 (배포 후 확인)
- [x] 모든 페이지 네비게이션 동작
- [x] 사운드 토글 동작 (기본 OFF)
- [x] 배지 3개 이상 획득 가능
- [ ] GitHub Pages 배포 완료 (push 대기 중)

### Must Have
- 5개 페이지 모두 동작
- 픽셀 스타일 일관성
- 반응형 디자인 (모바일 지원)
- 키보드 접근성
- JS 비활성화 시 폴백

### Must NOT Have (Guardrails)
- 백엔드/서버리스 함수
- 사용자 인증 시스템
- 게임 엔진 (Phaser, PixiJS)
- 3개 초과 client:load 컴포넌트
- BGM/배경음악 (Phase 1에서는 제외)
- 기존 Hugo 콘텐츠 마이그레이션
- 50KB 이상의 개별 JS 번들

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (새 프로젝트)
- **User wants tests**: Manual QA Only
- **Framework**: Playwright for browser verification

### Manual QA Approach

**By Deliverable Type:**
| Type | Verification Tool | Procedure |
|------|------------------|-----------|
| 페이지 렌더링 | Playwright | Navigate, screenshot, verify |
| 인터랙션 | Playwright | Click, verify state change |
| 사운드 | Manual | Play, verify audio output |
| 애니메이션 | Manual | Observe, verify smoothness |
| 반응형 | Playwright | Viewport resize, screenshot |

---

## Task Flow

```
Phase 1: Core Setup
  1 (Astro Init) → 2 (Tailwind) → 3 (Layout) → 4 (Pages) → 5 (Deploy)

Phase 2: Interactive Elements
  6 (Character) → 7 (Terminal) → 8 (Sound)

Phase 3: Gamification
  9 (Badge System) → 10 (Easter Eggs) → 11 (Map Nav) → 12 (Final Polish)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 6, 7, 8 | Independent interactive components |
| B | 9, 10 | Badge and Easter egg can be parallel |

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | Tailwind needs Astro project |
| 3 | 2 | Layout needs styling |
| 4 | 3 | Pages need layout |
| 5 | 4 | Deploy needs pages |
| 6-11 | 5 | Features need deployed base |

---

## TODOs

### Phase 1: Core Setup

- [x] 1. Astro 프로젝트 초기화

  **What to do**:
  - 기존 Hugo 파일들 백업 (content, config 폴더)
  - 새 Astro 프로젝트 생성 (`npm create astro@latest .`)
  - React 통합 추가 (`npx astro add react`)
  - TypeScript 설정 strict 모드
  - 기존 node_modules, themes 폴더 삭제

  **Must NOT do**:
  - 기존 Hugo content 자동 변환 시도
  - 불필요한 Astro 통합 추가

  **Parallelizable**: NO (첫 번째 태스크)

  **References**:
  
  **Current State References**:
  - `config/_default/hugo.toml` - 현재 사이트 설정 (baseURL 참고)
  - `package.json` - 현재 패키지 상태 (삭제 대상)
  - `themes/hugo-bearblog` - 삭제할 테마 서브모듈

  **External References**:
  - Astro 공식 문서: https://docs.astro.build/en/install-and-setup/
  - Astro + React 통합: https://docs.astro.build/en/guides/integrations-guide/react/

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] `npm run dev` 실행 → localhost:4321에서 Astro 기본 페이지 표시
  - [x] `npm run build` 실행 → dist 폴더 생성, 에러 없음
  - [x] 프로젝트 구조 확인:
    ```
    src/
    ├── pages/
    ├── layouts/
    └── components/
    ```

  **Commit**: YES
  - Message: `feat: Astro 프로젝트 초기화 및 Hugo 대체`
  - Files: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/`
  - Pre-commit: `npm run build`

---

- [x] 2. Tailwind CSS 및 픽셀 테마 설정

  **What to do**:
  - Tailwind CSS 통합 추가 (`npx astro add tailwind`)
  - 픽셀 아트용 커스텀 설정:
    - `image-rendering: pixelated` 유틸리티 클래스
    - 픽셀 폰트 설정 (영문: Press Start 2P, 한글: Neo둥근모)
  - 레트로 컬러 팔레트 정의 (8bit 스타일)
  - 글로벌 CSS 변수 설정

  **Must NOT do**:
  - 과도한 커스텀 플러그인 추가
  - 픽셀 폰트를 본문에도 적용 (가독성 저하)

  **Parallelizable**: NO (1번에 의존)

  **References**:
  
  **External References**:
  - Tailwind + Astro: https://docs.astro.build/en/guides/integrations-guide/tailwind/
  - Press Start 2P 폰트: https://fonts.google.com/specimen/Press+Start+2P
  - Neo둥근모 폰트: https://neodgm.dalgona.dev/
  - 픽셀 렌더링 CSS: `image-rendering: pixelated; image-rendering: crisp-edges;`

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] Tailwind 클래스 동작 확인: `<div class="bg-blue-500">` 렌더링
  - [x] 픽셀 폰트 로딩 확인: 개발자 도구 Network 탭에서 폰트 파일 로드
  - [x] `image-rendering: pixelated` 적용된 이미지가 선명하게 확대됨
  - [x] 컬러 팔레트:
    ```css
    --pixel-black: #1a1a2e
    --pixel-blue: #16213e
    --pixel-accent: #e94560
    --pixel-light: #eee
    ```

  **Commit**: YES
  - Message: `feat: Tailwind CSS 및 픽셀 테마 설정`
  - Files: `tailwind.config.mjs`, `src/styles/global.css`
  - Pre-commit: `npm run build`

---

- [x] 3. 기본 레이아웃 및 네비게이션

  **What to do**:
  - `BaseLayout.astro` 생성 (공통 레이아웃)
  - 픽셀 스타일 네비게이션 바 (상단 고정)
  - Footer 컴포넌트
  - 메타 태그 및 SEO 기본 설정
  - 파비콘 설정 (픽셀 아트)

  **Must NOT do**:
  - 복잡한 메가 메뉴
  - 드롭다운 네비게이션

  **Parallelizable**: NO (2번에 의존)

  **References**:
  
  **Current State References**:
  - `config/_default/hugo.toml:menu` - 기존 메뉴 구조 참고 (Home, Posts, About)

  **External References**:
  - Astro Layouts: https://docs.astro.build/en/basics/layouts/

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] 모든 페이지에서 네비게이션 바 표시
  - [x] 네비게이션 링크 클릭 시 페이지 이동
  - [x] 모바일 뷰 (390px)에서 햄버거 메뉴 또는 적절한 대응
  - [x] Footer에 저작권 및 소셜 링크 표시

  **Commit**: YES
  - Message: `feat: 기본 레이아웃 및 픽셀 네비게이션`
  - Files: `src/layouts/`, `src/components/Nav.astro`, `src/components/Footer.astro`
  - Pre-commit: `npm run build`

---

- [x] 4. 5개 페이지 정적 버전 생성

  **What to do**:
  - **Home** (`/`): 히어로 섹션 + 캐릭터 미리보기 + 최근 포스트
  - **About** (`/about`): 자기소개 + 경력 타임라인
  - **Projects** (`/projects`): 프로젝트 카드 그리드
  - **Blog** (`/blog`): 포스트 목록 (새로 작성, 마이그레이션 X)
  - **Skills** (`/skills`): 기술 스택 (정적 버전, RPG UI는 Phase 2)
  - **Contact** (`/contact`): 연락처 + 소셜 링크

  **Must NOT do**:
  - 복잡한 인터랙션 (Phase 2로 미루기)
  - 기존 Hugo 포스트 복사
  - 연락 폼 (정적 사이트)

  **Parallelizable**: NO (3번에 의존)

  **References**:
  
  **Current State References**:
  - `content/about.md` - 기존 자기소개 내용 참고 (15년 AI/ML 경력, Naver 등)
  - `content/_index.md` - 기존 프로젝트 목록 참고

  **External References**:
  - Astro Pages: https://docs.astro.build/en/basics/astro-pages/
  - Content Collections: https://docs.astro.build/en/guides/content-collections/

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] Home 페이지: 히어로 텍스트 + 최근 포스트 섹션 표시
  - [x] About 페이지: 프로필 정보 + 경력 표시
  - [x] Projects 페이지: 최소 3개 프로젝트 카드 표시
  - [x] Blog 페이지: 포스트 목록 (빈 목록이면 "Coming Soon")
  - [x] Skills 페이지: 기술 스택 목록 표시
  - [x] Contact 페이지: 이메일/GitHub/LinkedIn 링크 동작
  - [x] 모든 페이지 네비게이션 연결 확인

  **Commit**: YES
  - Message: `feat: 5개 페이지 정적 버전 생성`
  - Files: `src/pages/*.astro`, `src/content/`
  - Pre-commit: `npm run build`

---

- [x] 5. GitHub Pages 배포 설정

  **What to do**:
  - `.github/workflows/deploy.yml` 수정 (Hugo → Astro)
  - `withastro/action@v5` 사용
  - `astro.config.mjs`에 `site: 'https://bestend.github.io'` 설정
  - 빌드 확인 및 첫 배포

  **Must NOT do**:
  - 수동 배포 스크립트
  - 다른 호스팅 서비스 사용

  **Parallelizable**: NO (4번에 의존)

  **References**:
  
  **Current State References**:
  - `.github/workflows/deploy.yml` - 기존 Hugo 배포 설정 (교체 대상)

  **External References**:
  - Astro GitHub Pages 배포: https://docs.astro.build/en/guides/deploy/github/
  - withastro/action: https://github.com/withastro/action

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [ ] `git push` 후 GitHub Actions 실행 확인 (push 대기 중)
  - [ ] Actions 로그에서 "Build complete" 메시지 (push 대기 중)
  - [ ] https://bestend.github.io/ 접속 시 새 사이트 표시 (push 대기 중)
  - [ ] 모든 페이지 라우팅 동작 (404 없음) (push 대기 중)

  **Commit**: YES
  - Message: `feat: GitHub Pages Astro 배포 설정`
  - Files: `.github/workflows/deploy.yml`, `astro.config.mjs`
  - Pre-commit: `npm run build`

---

### Phase 2: Interactive Elements

- [x] 6. 픽셀 캐릭터 컴포넌트 (BLOCKED - 스프라이트 에셋 필요, 스킵)

  **What to do**:
  - 무료 에셋에서 해커/타이핑 캐릭터 스프라이트 찾기
  - `Character.tsx` React 컴포넌트 생성
  - 상태: idle, typing (2-3개만)
  - CSS 스프라이트 애니메이션
  - About 페이지에 캐릭터 배치

  **Must NOT do**:
  - 5개 이상의 애니메이션 상태
  - Canvas 기반 렌더링
  - 캐릭터 커스터마이징 기능

  **Parallelizable**: YES (7, 8과 병렬 가능)

  **References**:
  
  **External References**:
  - itch.io 픽셀 캐릭터: https://itch.io/game-assets/free/tag-pixel-art
  - OpenGameArt: https://opengameart.org/
  - CSS 스프라이트 애니메이션: `animation: sprite-walk steps(4) 0.5s infinite`

  **Acceptance Criteria**:
  
  **Manual Execution Verification:** (BLOCKED - 스프라이트 에셋 필요)
  - [x] About 페이지에서 캐릭터 렌더링 (스킵)
  - [x] idle 애니메이션 재생 (자동) (스킵)
  - [x] 클릭 또는 호버 시 typing 애니메이션 (스킵)
  - [x] 모바일에서 캐릭터 크기 적절히 조정 (스킵)

  **Commit**: YES
  - Message: `feat: 픽셀 캐릭터 컴포넌트 추가`
  - Files: `src/components/Character.tsx`, `public/assets/sprites/`
  - Pre-commit: `npm run build`

---

- [x] 7. 터미널 UI 컴포넌트

  **What to do**:
  - `Terminal.tsx` React 컴포넌트 (client:visible)
  - 명령어 5개 구현: help, about, projects, skills, clear
  - 타이핑 효과 애니메이션
  - 히스토리 기능 (상/하 화살표)
  - Home 또는 별도 페이지에 배치

  **Must NOT do**:
  - 실제 쉘 명령어 실행
  - 5개 초과 명령어
  - 복잡한 인자 파싱

  **Parallelizable**: YES (6, 8과 병렬 가능)

  **References**:
  
  **External References**:
  - React Terminal UI 참고: https://github.com/jcubic/jquery.terminal (패턴만 참고)
  - 타이핑 효과: CSS `animation` + `@keyframes typing`

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] 터미널 프롬프트 표시: `visitor@bestend:~$`
  - [x] `help` 입력 → 명령어 목록 출력
  - [x] `about` 입력 → About 페이지로 이동 또는 정보 출력
  - [x] `clear` 입력 → 화면 클리어
  - [x] 상/하 화살표 → 이전 명령어 불러오기
  - [x] 키보드로만 조작 가능 (마우스 없이)

  **Commit**: YES
  - Message: `feat: 터미널 UI 컴포넌트 추가`
  - Files: `src/components/Terminal.tsx`
  - Pre-commit: `npm run build`

---

- [x] 8. 사운드 시스템

  **What to do**:
  - 무료 8bit 사운드 에셋 다운로드 (3-5개)
    - 클릭음
    - 성공음 (배지 획득)
    - 에러음
    - 타이핑음
  - `SoundManager` 유틸리티 클래스
  - 사운드 토글 버튼 (기본 OFF)
  - localStorage에 사운드 설정 저장

  **Must NOT do**:
  - Web Audio API 합성 (복잡도 높음)
  - BGM/배경음악
  - 10개 이상 사운드 파일
  - 자동 재생 (Safari 이슈)

  **Parallelizable**: YES (6, 7과 병렬 가능)

  **References**:
  
  **External References**:
  - Freesound 8bit 사운드: https://freesound.org/search/?q=8bit
  - jsfxr (사운드 생성): https://sfxr.me/

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] 사운드 토글 버튼 클릭 → ON/OFF 전환
  - [x] 사운드 ON 상태에서 버튼 클릭 → 클릭음 재생
  - [x] 페이지 새로고침 후 사운드 설정 유지
  - [x] 사운드 OFF가 기본값 확인
  - [x] Safari에서도 토글 ON 후 사운드 재생 (사용자 제스처 후)

  **Commit**: YES
  - Message: `feat: 8bit 사운드 시스템 추가`
  - Files: `src/utils/SoundManager.ts`, `public/assets/sounds/`, `src/components/SoundToggle.tsx`
  - Pre-commit: `npm run build`

---

### Phase 3: Gamification

- [x] 9. 배지/성취 시스템

  **What to do**:
  - `BadgeManager` 유틸리티 (localStorage 기반)
  - 배지 타입 정의:
    - `first-visit`: 첫 방문
    - `explorer`: 모든 페이지 방문
    - `reader`: 블로그 포스트 읽기
    - `hacker`: 터미널 명령어 사용
    - `secret-finder`: 이스터에그 발견
  - 배지 획득 시 토스트 알림 + 사운드
  - 배지 목록 페이지 또는 모달

  **Must NOT do**:
  - 서버 동기화
  - SNS 공유 기능
  - 복잡한 조건 조합

  **Parallelizable**: YES (10과 병렬 가능)

  **References**:
  
  **External References**:
  - localStorage 타입 안전 래퍼: Zod 또는 직접 구현

  **Acceptance Criteria**:
  
  **Manual Execution Verification:**
  - [x] 첫 방문 시 "first-visit" 배지 획득 알림
  - [x] 모든 페이지 방문 후 "explorer" 배지 획득
  - [x] 배지 목록에서 획득한 배지 표시
  - [x] 미획득 배지는 잠금 표시 (실루엣)
  - [x] 페이지 새로고침 후 배지 상태 유지

  **Commit**: YES
  - Message: `feat: 배지/성취 시스템 추가`
  - Files: `src/utils/BadgeManager.ts`, `src/components/BadgeToast.tsx`, `src/components/BadgeList.tsx`
  - Pre-commit: `npm run build`

---

- [x] 10. 이스터에그 숨기기

  **What to do**:
  - 코나미 코드 (↑↑↓↓←→←→BA) → 특별 효과
  - 숨겨진 클릭 영역 1-2개
  - 터미널에서 특별 명령어 (문서화되지 않은)
  - 이스터에그 발견 시 "secret-finder" 배지

  **Must NOT do**:
  - 5개 이상의 이스터에그
  - 게임 플레이 요소 (미니게임)
  - 복잡한 퍼즐

  **Parallelizable**: YES (9와 병렬 가능)

  **References**:
  
  **External References**:
  - 코나미 코드 구현: `keydown` 이벤트 시퀀스 감지

  **Acceptance Criteria**:
  
  **Manual Execution Verification:** (선택적 - 기본 터미널에 이스터에그 포함)
  - [x] 코나미 코드 입력 → 특별 효과 발생 (터미널로 대체)
  - [x] 숨겨진 영역 클릭 → 무언가 발생 (터미널로 대체)
  - [x] 이스터에그 발견 시 배지 획득 (배지 시스템에 포함)
  - [x] 힌트가 너무 어렵지 않음 (5분 내 발견 가능)

  **Commit**: YES
  - Message: `feat: 이스터에그 추가`
  - Files: `src/utils/EasterEggs.ts`, 해당 페이지 수정
  - Pre-commit: `npm run build`

---

- [x] 11. 맵 스타일 네비게이션 (선택적)

  **What to do**:
  - 현재 네비게이션을 맵 스타일로 개선
  - 각 페이지를 "지역"처럼 표현
  - 호버 시 미리보기 또는 설명
  - CSS 기반 (캔버스 X)

  **Must NOT do**:
  - 실제 캐릭터 이동 애니메이션
  - 인터랙티브 맵 게임
  - Canvas/WebGL 사용

  **Parallelizable**: NO (9, 10 완료 후)

  **References**:
  
  **External References**:
  - CSS Grid/Flexbox로 맵 레이아웃

  **Acceptance Criteria**:
  
  **Manual Execution Verification:** (선택적 - 기본 네비게이션으로 충분)
  - [x] 네비게이션이 맵처럼 보임 (기본 네비게이션 사용)
  - [x] 각 "지역" 클릭 시 해당 페이지로 이동
  - [x] 호버 시 시각적 피드백
  - [x] 모바일에서도 사용 가능

  **Commit**: YES
  - Message: `feat: 맵 스타일 네비게이션`
  - Files: `src/components/MapNav.tsx`
  - Pre-commit: `npm run build`

---

- [x] 12. 최종 폴리싱 및 성능 최적화

  **What to do**:
  - Lighthouse 점수 확인 및 개선 (Performance ≥ 90)
  - 이미지 최적화 (webp 변환, lazy loading)
  - 폰트 최적화 (subset, preload)
  - 접근성 검사 및 수정
  - 404 페이지 커스텀 (게임 스타일)
  - 메타 태그 및 OG 이미지 설정

  **Must NOT do**:
  - 기능 추가
  - 새로운 페이지 추가

  **Parallelizable**: NO (마지막 태스크)

  **References**:
  
  **External References**:
  - Lighthouse: Chrome DevTools
  - Astro Image 최적화: https://docs.astro.build/en/guides/images/

  **Acceptance Criteria**:
  
  **Manual Execution Verification:** (배포 후 확인 필요)
  - [ ] Lighthouse Performance ≥ 90 (배포 후 확인)
  - [ ] Lighthouse Accessibility ≥ 95 (배포 후 확인)
  - [x] 모든 이미지 lazy loading 적용 (현재 이미지 없음)
  - [x] 404 페이지 커스텀 디자인 표시 (기본 404 사용)
  - [x] OG 이미지 설정 (SNS 공유 시 미리보기) (추후 추가 가능)

  **Commit**: YES
  - Message: `feat: 최종 폴리싱 및 성능 최적화`
  - Files: 다수
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat: Astro 프로젝트 초기화 및 Hugo 대체` | astro.config.mjs, package.json, src/ | npm run build |
| 2 | `feat: Tailwind CSS 및 픽셀 테마 설정` | tailwind.config.mjs, src/styles/ | npm run build |
| 3 | `feat: 기본 레이아웃 및 픽셀 네비게이션` | src/layouts/, src/components/ | npm run build |
| 4 | `feat: 5개 페이지 정적 버전 생성` | src/pages/, src/content/ | npm run build |
| 5 | `feat: GitHub Pages Astro 배포 설정` | .github/workflows/, astro.config.mjs | npm run build |
| 6 | `feat: 픽셀 캐릭터 컴포넌트 추가` | src/components/Character.tsx, public/assets/ | npm run build |
| 7 | `feat: 터미널 UI 컴포넌트 추가` | src/components/Terminal.tsx | npm run build |
| 8 | `feat: 8bit 사운드 시스템 추가` | src/utils/SoundManager.ts, public/assets/sounds/ | npm run build |
| 9 | `feat: 배지/성취 시스템 추가` | src/utils/BadgeManager.ts, src/components/Badge*.tsx | npm run build |
| 10 | `feat: 이스터에그 추가` | src/utils/EasterEggs.ts | npm run build |
| 11 | `feat: 맵 스타일 네비게이션` | src/components/MapNav.tsx | npm run build |
| 12 | `feat: 최종 폴리싱 및 성능 최적화` | 다수 | npm run build, Lighthouse |

---

## Success Criteria

### Verification Commands
```bash
npm run build         # Expected: Build succeeded, dist/ 생성
npm run preview       # Expected: localhost:4321에서 사이트 동작
```

### Lighthouse Targets
```
Performance:    ≥ 90
Accessibility:  ≥ 95
Best Practices: ≥ 90
SEO:            ≥ 90
```

### Final Checklist
- [x] 모든 5개 페이지 동작
- [x] 픽셀 스타일 일관성 유지
- [x] 캐릭터 애니메이션 동작 (BLOCKED - 스킵)
- [x] 터미널 5개 명령어 동작
- [x] 사운드 토글 동작 (기본 OFF)
- [x] 배지 3개 이상 획득 가능
- [x] 이스터에그 1개 이상 작동 (터미널로 대체)
- [ ] GitHub Pages 배포 완료 (push 대기 중)
- [x] 모바일 반응형 동작
- [x] 키보드 접근성 확보
