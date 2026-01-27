# 블로그 디자인 전면 개편: 8-bit → 미니멀 다크

## Context

### Original Request
사용자가 현재 8-bit 픽셀 스타일 블로그 디자인이 "촌스럽고 병신같다"고 평가. 현대적이고 깔끔한 개발자 블로그로 전면 개편 요청.

### Interview Summary
**Key Discussions**:
- 폰트: Pretendard 선택 (한글/영문 통합, 현대적)
- 색상: 미니멀 다크 + 차분한 블루 억센트 (#3B82F6)
- 터미널 UI: "젤 구려 재미없다" → 깔끔한 Hero 섹션으로 대체
- 게이미피케이션: 전체 제거 (배지, 사운드, 코나미코드)
- 디자인 스타일: 미니멀 다크 (GitHub/Vercel 스타일)

**Research Findings**:
- Pretendard: 한국 개발자 블로그에서 가장 인기
- GitHub Dark Theme: 프로페셔널하고 가독성 좋음
- 참고: zoomkoding-gatsby-blog, tailwind-nextjs-starter-blog

### Metis Review
**Identified Gaps** (addressed):
- 반응형 브레이크포인트: Tailwind 기본값 사용
- 다크모드 토글: 단일 다크모드로 확정
- 접근성: 색상 대비 4.5:1 이상 보장
- 페이지 로드 성능: LCP < 2.5s 목표

---

## Work Objectives

### Core Objective
8-bit 픽셀 스타일을 완전히 제거하고, Pretendard 폰트와 GitHub-style 다크 테마를 적용한 현대적이고 깔끔한 개발자 블로그로 전환한다.

### Concrete Deliverables
- 새로운 global.css (미니멀 다크 테마)
- 새로운 tailwind.config.mjs (모던 컬러 팔레트)
- 재설계된 Nav.astro (텍스트 잘림 해결)
- 재설계된 Footer.astro
- 새로운 Hero 섹션 (홈페이지)
- 업데이트된 6개 페이지 스타일
- 게이미피케이션 관련 파일 삭제 (7개)

### Definition of Done
- [ ] 모든 Press Start 2P / Neo둥근모 폰트 참조 제거됨
- [ ] 모든 pixel-* 색상 클래스 제거됨
- [ ] 네비게이션 텍스트가 잘리지 않음
- [ ] 한글 가독성 개선됨 (Pretendard 적용)
- [ ] 모바일 반응형 정상 동작 (320px~)
- [ ] 페이지 빌드 성공 (`npm run build`)
- [ ] 개발 서버 정상 동작 (`npm run dev`)

### Must Have
- Pretendard 폰트 (CDN)
- JetBrains Mono 폰트 (코드용)
- GitHub-style 다크 테마 컬러
- 반응형 네비게이션 (모바일 햄버거 메뉴)
- 깔끔한 Hero 섹션 (홈페이지)

### Must NOT Have (Guardrails)
- ❌ 새로운 기능 추가 (Hero 외)
- ❌ 라이트 모드 구현
- ❌ 블로그 포스팅 시스템
- ❌ 댓글/검색 기능
- ❌ 페이지 전환 애니메이션
- ❌ 픽셀/8-bit 스타일 요소 잔존
- ❌ 과도한 그림자/장식 효과

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: N/A

### Manual QA Procedure
모든 TODO는 Playwright 브라우저 자동화를 통해 검증합니다.

**검증 항목**:
1. 네비게이션 텍스트 렌더링 (잘림 없음)
2. 폰트 로딩 확인 (Pretendard, JetBrains Mono)
3. 색상 팔레트 적용 확인
4. 모바일 반응형 (320px, 768px, 1024px)
5. 모든 링크 동작 확인

---

## Task Flow

```
Phase 1: 설정 파일 업데이트
  Task 0 (CSS 변수/폰트) → Task 1 (Tailwind 설정)

Phase 2: 게이미피케이션 제거
  Task 2 (컴포넌트 삭제) → Task 3 (참조 정리)

Phase 3: 핵심 컴포넌트 재설계
  Task 4 (BaseLayout) → Task 5 (Nav) → Task 6 (Footer)

Phase 4: 페이지 업데이트
  Task 7 (Hero/홈) → Task 8~12 (나머지 페이지) [병렬 가능]

Phase 5: 최종 검증
  Task 13 (빌드/QA)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 8, 9, 10, 11, 12 | 각 페이지 독립적 |

| Task | Depends On | Reason |
|------|------------|--------|
| 1 | 0 | CSS 변수 정의 후 Tailwind 설정 |
| 3 | 2 | 컴포넌트 삭제 후 참조 정리 |
| 5, 6 | 4 | BaseLayout 완성 후 Nav/Footer |
| 7~12 | 5, 6 | 컴포넌트 완성 후 페이지 |
| 13 | 7~12 | 모든 페이지 완성 후 검증 |

---

## TODOs

---

### - [ ] 0. 새로운 글로벌 CSS 및 폰트 시스템 구축

**What to do**:
- Press Start 2P, Neo둥근모 폰트 import 제거
- Pretendard CDN import 추가
- JetBrains Mono (Google Fonts) import 추가
- 8-bit CSS 변수 전체 제거
- 새로운 미니멀 다크 CSS 변수 정의
- 기본 타이포그래피 스타일 재정의
- 픽셀 관련 유틸리티 클래스 제거

**Must NOT do**:
- 새로운 애니메이션 추가
- 복잡한 그라데이션/쉐도우

**Parallelizable**: NO (첫 번째 작업)

**References**:

**Pattern References**:
- `src/styles/global.css:1-213` - 현재 전체 CSS (전면 재작성 대상)

**External References**:
- Pretendard CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`
- JetBrains Mono: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap`
- GitHub Dark 참고: 배경 #0d1117, 텍스트 #e6edf3

**WHY Each Reference Matters**:
- global.css: 현재 픽셀 스타일 전체가 여기 있음. 전면 재작성 필요
- Pretendard CDN: 정확한 URL로 폰트 로딩
- JetBrains Mono: 코드 블록용 monospace 폰트

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/`
  - Verify: 폰트가 Pretendard로 렌더링됨 (개발자도구 Computed Style 확인)
  - Verify: Press Start 2P 폰트 로드 요청 없음 (Network 탭)
  - Screenshot: `.sisyphus/evidence/0-font-loaded.png`

**Evidence Required:**
- [ ] 개발자도구에서 font-family 확인 스크린샷

**Commit**: YES
- Message: `refactor(styles): replace 8-bit theme with minimal dark theme`
- Files: `src/styles/global.css`
- Pre-commit: `npm run build` (빌드 성공 확인)

---

### - [ ] 1. Tailwind 설정 파일 현대화

**What to do**:
- pixel 폰트 정의 제거 (font-pixel, font-korean)
- 새 폰트 정의 추가 (font-sans: Pretendard, font-mono: JetBrains Mono)
- pixel-* 색상 팔레트 전체 제거
- 새 색상 팔레트 정의 (bg, text, border, accent)
- px-* 스페이싱 제거 (Tailwind 기본값 사용)

**Must NOT do**:
- 복잡한 커스텀 플러그인 추가
- 사용하지 않을 색상 정의

**Parallelizable**: NO (Task 0 완료 후)

**References**:

**Pattern References**:
- `tailwind.config.mjs:1-40` - 현재 Tailwind 설정 (전면 재작성)

**External References**:
- Tailwind CSS v4 공식 문서: https://tailwindcss.com/docs
- zoomkoding 색상 시스템 참고

**WHY Each Reference Matters**:
- tailwind.config.mjs: 현재 pixel-* 색상과 폰트가 정의됨. 모든 컴포넌트가 이를 참조
- Tailwind v4: 현재 프로젝트가 v4.1.18 사용 중

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] `npm run dev` 실행 → 에러 없이 시작됨
- [ ] Browser에서 Tailwind 클래스 동작 확인 (bg-primary, text-primary 등)

**Evidence Required:**
- [ ] 개발 서버 시작 로그 (에러 없음)

**Commit**: YES
- Message: `refactor(config): modernize tailwind color palette and fonts`
- Files: `tailwind.config.mjs`
- Pre-commit: `npm run dev` (서버 시작 확인)

---

### - [ ] 2. 게이미피케이션 컴포넌트 및 유틸리티 삭제

**What to do**:
- `src/components/Terminal.tsx` 삭제
- `src/components/Gamification.tsx` 삭제
- `src/components/BadgeList.tsx` 삭제
- `src/components/BadgeToast.tsx` 삭제
- `src/components/SoundToggle.tsx` 삭제
- `src/utils/BadgeManager.ts` 삭제
- `src/utils/SoundManager.ts` 삭제
- `public/assets/sounds/` 디렉토리 삭제

**Must NOT do**:
- 다른 파일 수정 (참조 정리는 Task 3에서)

**Parallelizable**: NO (Task 1 완료 후)

**References**:

**Pattern References**:
- `src/components/Terminal.tsx` - 터미널 UI (삭제 대상)
- `src/components/Gamification.tsx` - 게이미피케이션 메인 (삭제 대상)
- `src/utils/BadgeManager.ts` - 배지 관리 (삭제 대상)
- `src/utils/SoundManager.ts` - 사운드 관리 (삭제 대상)

**WHY Each Reference Matters**:
- 이 파일들이 8-bit 스타일의 핵심이며, 사용자가 "구리다"고 평가한 기능들

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] `ls src/components/` → Terminal.tsx, Gamification.tsx 등 없음
- [ ] `ls src/utils/` → BadgeManager.ts, SoundManager.ts 없음
- [ ] `ls public/assets/` → sounds 디렉토리 없음

**Evidence Required:**
- [ ] 삭제된 파일 목록 터미널 출력

**Commit**: YES
- Message: `refactor(cleanup): remove gamification components and utilities`
- Files: 삭제된 7개 파일 + sounds 디렉토리
- Pre-commit: 파일 삭제 확인

---

### - [ ] 3. 게이미피케이션 참조 정리

**What to do**:
- `src/layouts/BaseLayout.astro`에서 Gamification import/사용 제거
- `src/components/Nav.astro`에서 SoundToggle import/사용 제거
- `src/pages/index.astro`에서 Terminal import/사용 제거
- 삭제된 컴포넌트 참조하는 모든 import 문 제거

**Must NOT do**:
- 아직 스타일 변경하지 않음 (Task 4~에서)

**Parallelizable**: NO (Task 2 완료 후)

**References**:

**Pattern References**:
- `src/layouts/BaseLayout.astro:5,30` - Gamification import 및 사용
- `src/components/Nav.astro:2,41` - SoundToggle import 및 사용
- `src/pages/index.astro:3,19` - Terminal import 및 사용

**WHY Each Reference Matters**:
- 이 참조들을 제거하지 않으면 빌드 실패

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] `npm run build` → 빌드 성공 (import 에러 없음)
- [ ] `npm run dev` → 사이트 정상 로드

**Evidence Required:**
- [ ] 빌드 성공 로그

**Commit**: YES
- Message: `refactor(cleanup): remove gamification references from layouts and pages`
- Files: `BaseLayout.astro`, `Nav.astro`, `index.astro`
- Pre-commit: `npm run build`

---

### - [ ] 4. BaseLayout 현대화

**What to do**:
- body 클래스에서 픽셀 관련 클래스 제거 (`bg-pixel-black`, `font-korean` 등)
- 새로운 다크 테마 클래스 적용 (`bg-primary`, `text-primary`, `font-sans`)
- 기본 페이지 구조 유지 (Nav, main, Footer)
- 필요시 min-h-screen flex flex-col 유지

**Must NOT do**:
- Nav/Footer 내부 수정 (별도 Task)
- 새로운 레이아웃 요소 추가

**Parallelizable**: NO (Task 3 완료 후)

**References**:

**Pattern References**:
- `src/layouts/BaseLayout.astro:24` - body 클래스 (수정 대상)
- Task 0에서 정의한 CSS 변수/클래스

**WHY Each Reference Matters**:
- BaseLayout은 모든 페이지의 기반. 여기서 기본 스타일 적용

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/`
  - Verify: 배경색이 다크 (#0d1117 계열)
  - Verify: 텍스트가 밝은 색 (#e6edf3 계열)
  - Screenshot: `.sisyphus/evidence/4-baselayout.png`

**Evidence Required:**
- [ ] 다크 테마 적용된 페이지 스크린샷

**Commit**: YES
- Message: `refactor(layout): apply minimal dark theme to BaseLayout`
- Files: `src/layouts/BaseLayout.astro`
- Pre-commit: `npm run dev` (시각적 확인)

---

### - [ ] 5. 네비게이션 재설계

**What to do**:
- font-pixel 클래스 → font-sans로 변경
- pixel-* 색상 → 새 색상 팔레트로 변경
- h-16 유지하되 폰트 크기 조정 (텍스트 잘림 해결)
- 호버 효과: text-accent-hover 사용
- 모바일 햄버거 메뉴 스타일 현대화
- SoundToggle 버튼 자리 제거

**Must NOT do**:
- 네비게이션 항목 변경 (Home, Blog, About, Projects, Skills, Contact 유지)
- 복잡한 드롭다운 메뉴 추가

**Parallelizable**: NO (Task 4 완료 후)

**References**:

**Pattern References**:
- `src/components/Nav.astro:14-64` - 현재 네비게이션 구조
- `src/components/Nav.astro:20` - 로고 스타일 (font-pixel 제거)
- `src/components/Nav.astro:31` - 메뉴 아이템 스타일

**External References**:
- tailwind-nextjs-starter-blog 네비게이션 패턴 참고

**WHY Each Reference Matters**:
- Nav.astro가 네비게이션 전체를 담당. 텍스트 잘림 문제의 원인

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/`
  - Verify: 네비게이션 텍스트가 완전히 보임 (잘림 없음)
  - Verify: 호버 시 색상 변화
  - Viewport 320px로 변경 → 모바일 메뉴 버튼 표시
  - Screenshot: `.sisyphus/evidence/5-nav-desktop.png`
  - Screenshot: `.sisyphus/evidence/5-nav-mobile.png`

**Evidence Required:**
- [ ] 데스크톱 네비게이션 스크린샷
- [ ] 모바일 네비게이션 스크린샷

**Commit**: YES
- Message: `refactor(nav): redesign navigation with modern styling`
- Files: `src/components/Nav.astro`
- Pre-commit: 시각적 확인

---

### - [ ] 6. 푸터 현대화

**What to do**:
- font-pixel → font-sans
- pixel-* 색상 → 새 색상 팔레트
- 심플한 디자인 유지 (저작권, 소셜 링크)
- border-pixel-accent → border-border

**Must NOT do**:
- 푸터 내용 변경
- 복잡한 푸터 레이아웃

**Parallelizable**: YES (Task 5와 병렬 가능, 단 Task 4 완료 후)

**References**:

**Pattern References**:
- `src/components/Footer.astro:4-37` - 현재 푸터 구조

**WHY Each Reference Matters**:
- Footer가 픽셀 스타일 사용 중. 일관성 위해 업데이트 필요

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/`
  - Scroll to bottom
  - Verify: 푸터 스타일이 미니멀 다크 테마와 일관
  - Screenshot: `.sisyphus/evidence/6-footer.png`

**Evidence Required:**
- [ ] 푸터 스크린샷

**Commit**: YES
- Message: `refactor(footer): apply minimal dark theme styling`
- Files: `src/components/Footer.astro`
- Pre-commit: 시각적 확인

---

### - [ ] 7. 홈페이지 Hero 섹션 구현

**What to do**:
- Terminal 컴포넌트 대신 깔끔한 Hero 섹션 생성
- 내용: 이름(JunSeok Kim), 직함(AI/ML Engineer), 간단 소개
- GitHub, LinkedIn 링크 버튼
- 미니멀 스타일: 충분한 여백, 큰 타이포그래피
- font-pixel → font-sans, font-semibold/font-bold

**Must NOT do**:
- 복잡한 애니메이션
- 타이핑 효과 (터미널 느낌 배제)
- 그라데이션 배경

**Parallelizable**: NO (Task 5, 6 완료 후)

**References**:

**Pattern References**:
- `src/pages/index.astro:1-21` - 현재 홈페이지 (전면 재작성)
- `src/pages/about.astro:17-19` - 이름/직함 정보 참고

**External References**:
- 미니멀 Hero 섹션 예시: 중앙 정렬, 큰 제목, 부제목, CTA 버튼

**WHY Each Reference Matters**:
- index.astro가 홈페이지. Terminal 대신 Hero 필요
- about.astro에서 이름/직함 정보 가져옴

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/`
  - Verify: Hero 섹션에 이름, 직함, 소개 표시
  - Verify: GitHub, LinkedIn 버튼 존재 및 클릭 가능
  - Verify: Terminal UI 없음
  - Screenshot: `.sisyphus/evidence/7-hero.png`

**Evidence Required:**
- [ ] 새 홈페이지 스크린샷

**Commit**: YES
- Message: `feat(home): replace terminal with minimal hero section`
- Files: `src/pages/index.astro`
- Pre-commit: 시각적 확인

---

### - [ ] 8. About 페이지 스타일 업데이트

**What to do**:
- font-pixel → font-sans, font-semibold
- text-pixel-* → text-primary, text-secondary, text-accent
- border-pixel-accent → border-border
- bg-pixel-dark-blue → bg-secondary
- Career Timeline 카드 스타일 현대화

**Must NOT do**:
- 내용 변경
- 레이아웃 구조 변경

**Parallelizable**: YES (Task 9, 10, 11, 12와 병렬)

**References**:

**Pattern References**:
- `src/pages/about.astro:1-138` - About 페이지 전체

**WHY Each Reference Matters**:
- About 페이지가 가장 내용이 많음. 픽셀 클래스 다수 사용

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/about`
  - Verify: 모든 섹션 스타일이 미니멀 다크 테마와 일관
  - Verify: Career Timeline 가독성 좋음
  - Screenshot: `.sisyphus/evidence/8-about.png`

**Evidence Required:**
- [ ] About 페이지 스크린샷

**Commit**: YES (Task 9-12와 함께 그룹 커밋 가능)
- Message: `refactor(pages): apply minimal dark theme to about page`
- Files: `src/pages/about.astro`

---

### - [ ] 9. Blog 페이지 스타일 업데이트

**What to do**:
- 픽셀 관련 클래스 → 새 클래스
- "Coming Soon" 카드 스타일 현대화

**Must NOT do**:
- 블로그 기능 추가 (별도 작업)

**Parallelizable**: YES (Task 8, 10, 11, 12와 병렬)

**References**:

**Pattern References**:
- `src/pages/blog.astro:1-30` - Blog 페이지

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/blog`
  - Verify: Coming Soon 카드 스타일 현대화됨
  - Screenshot: `.sisyphus/evidence/9-blog.png`

**Commit**: YES (그룹 커밋)
- Message: `refactor(pages): apply minimal dark theme to blog page`
- Files: `src/pages/blog.astro`

---

### - [ ] 10. Projects 페이지 스타일 업데이트

**What to do**:
- 프로젝트 카드 스타일 현대화
- pixel-shadow → 미니멀 쉐도우 또는 border
- 태그 스타일 현대화 (bg-pixel-accent → bg-accent)

**Must NOT do**:
- 프로젝트 내용 변경

**Parallelizable**: YES (Task 8, 9, 11, 12와 병렬)

**References**:

**Pattern References**:
- `src/pages/projects.astro:1-110` - Projects 페이지
- `src/pages/projects.astro:13` - 카드 스타일 (pixel-shadow)

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/projects`
  - Verify: 프로젝트 카드 깔끔하게 표시
  - Verify: 태그 색상 새 팔레트 적용
  - Screenshot: `.sisyphus/evidence/10-projects.png`

**Commit**: YES (그룹 커밋)
- Message: `refactor(pages): apply minimal dark theme to projects page`
- Files: `src/pages/projects.astro`

---

### - [ ] 11. Skills 페이지 스타일 업데이트

**What to do**:
- 섹션 카드 스타일 현대화
- 스킬 태그 스타일 현대화
- "RPG 스타일 스탯창" 메시지 제거 (레트로 컨셉 제거)

**Must NOT do**:
- 스킬 목록 변경

**Parallelizable**: YES (Task 8, 9, 10, 12와 병렬)

**References**:

**Pattern References**:
- `src/pages/skills.astro:1-81` - Skills 페이지
- `src/pages/skills.astro:77` - RPG 관련 메시지 (제거)

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/skills`
  - Verify: 스킬 섹션 깔끔하게 표시
  - Verify: "RPG 스타일" 메시지 없음
  - Screenshot: `.sisyphus/evidence/11-skills.png`

**Commit**: YES (그룹 커밋)
- Message: `refactor(pages): apply minimal dark theme to skills page`
- Files: `src/pages/skills.astro`

---

### - [ ] 12. Contact 페이지 스타일 업데이트

**What to do**:
- 연락처 버튼/카드 스타일 현대화
- 호버 효과 현대화

**Must NOT do**:
- 연락처 정보 변경

**Parallelizable**: YES (Task 8, 9, 10, 11과 병렬)

**References**:

**Pattern References**:
- `src/pages/contact.astro:1-66` - Contact 페이지

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `http://localhost:4321/contact`
  - Verify: 연락처 버튼 스타일 현대화됨
  - Screenshot: `.sisyphus/evidence/12-contact.png`

**Commit**: YES (그룹 커밋)
- Message: `refactor(pages): apply minimal dark theme to contact page`
- Files: `src/pages/contact.astro`

---

### - [ ] 13. 최종 빌드 검증 및 QA

**What to do**:
- `npm run build` 실행 → 빌드 성공 확인
- `npm run preview` 실행 → 프로덕션 빌드 미리보기
- 모든 페이지 수동 검증
- 모바일 반응형 검증 (320px, 768px, 1024px)
- 모든 링크 동작 확인

**Must NOT do**:
- 새로운 기능 추가
- 스타일 추가 변경 (버그 수정만)

**Parallelizable**: NO (마지막 작업)

**References**:

**Pattern References**:
- `package.json:7-9` - 빌드 스크립트

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] `npm run build` → 빌드 성공, 에러 없음
- [ ] `npm run preview` → 사이트 정상 로드
- [ ] Using playwright browser automation:
  - 모든 6개 페이지 순회
  - 각 페이지에서 네비게이션 링크 클릭 확인
  - Viewport 변경 (320px, 768px, 1024px) 각각 스크린샷
  - Screenshot: `.sisyphus/evidence/13-final-*.png`

**Evidence Required:**
- [ ] 빌드 성공 로그
- [ ] 모든 페이지 반응형 스크린샷

**Commit**: YES
- Message: `chore: complete blog redesign - verify build and QA`
- Files: (변경 없음, 커밋 메시지만)
- Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `refactor(styles): replace 8-bit theme with minimal dark theme` | global.css | build |
| 1 | `refactor(config): modernize tailwind color palette and fonts` | tailwind.config.mjs | dev |
| 2 | `refactor(cleanup): remove gamification components and utilities` | 7 files + sounds/ | ls |
| 3 | `refactor(cleanup): remove gamification references from layouts and pages` | 3 files | build |
| 4 | `refactor(layout): apply minimal dark theme to BaseLayout` | BaseLayout.astro | visual |
| 5 | `refactor(nav): redesign navigation with modern styling` | Nav.astro | visual |
| 6 | `refactor(footer): apply minimal dark theme styling` | Footer.astro | visual |
| 7 | `feat(home): replace terminal with minimal hero section` | index.astro | visual |
| 8-12 | `refactor(pages): apply minimal dark theme to all pages` | 5 page files | visual |
| 13 | `chore: complete blog redesign - verify build and QA` | - | build |

---

## Success Criteria

### Verification Commands
```bash
npm run build    # Expected: Build successful, no errors
npm run preview  # Expected: Site loads at localhost:4321
```

### Final Checklist
- [ ] **Must Have 충족**:
  - [ ] Pretendard 폰트 적용됨
  - [ ] JetBrains Mono (코드용) 적용됨
  - [ ] GitHub-style 다크 테마 적용됨
  - [ ] 반응형 네비게이션 동작함
  - [ ] 깔끔한 Hero 섹션 있음
- [ ] **Must NOT Have 부재**:
  - [ ] Press Start 2P / Neo둥근모 폰트 없음
  - [ ] pixel-* 색상 클래스 없음
  - [ ] 터미널 UI 없음
  - [ ] 배지/사운드 시스템 없음
  - [ ] 8-bit 스타일 요소 없음
- [ ] **Definition of Done**:
  - [ ] 네비게이션 텍스트 잘림 없음
  - [ ] 한글 가독성 개선됨
  - [ ] 모바일 반응형 정상 (320px~)
  - [ ] 빌드 성공
