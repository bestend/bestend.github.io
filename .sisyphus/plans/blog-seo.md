# Blog Content Connection + SEO Enhancement

## TL;DR

> **Quick Summary**: content/posts/의 4개 블로그 포스트를 Astro Content Collections로 연결하고, SEO 메타 태그(OG, Twitter, sitemap, robots.txt)를 추가하여 검색 엔진 및 SNS 공유 최적화
> 
> **Deliverables**:
> - Content Collections 설정 및 포스트 이동
> - 블로그 목록 페이지 (카드형 그리드)
> - 개별 포스트 페이지 (동적 라우팅)
> - SEO 메타 태그 (OG, Twitter Card)
> - sitemap.xml 자동 생성
> - robots.txt 파일
> - 기본 OG 이미지 (1200x630)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2/3 → Task 4 → Task 5/6 → Task 7

---

## Context

### Original Request
1. 블로그 콘텐츠 연결 - content/posts/의 4개 마크다운 포스트를 blog.astro 페이지에 연결
2. SEO 메타 태그 추가 - Open Graph, Twitter Card, sitemap.xml, robots.txt

### Interview Summary
**Key Discussions**:
- 블로그 목록 디자인: 카드형 그리드 (2-3열)
- OG 이미지: 사이트 전체 공통 기본 이미지 1개
- 테스트 전략: 수동 검증 + Playwright 스크린샷
- Content 위치: src/content/posts/로 이동 (Astro 5 표준)
- description: 본문 첫 160자 자동 추출
- URL 구조: 파일명 기반 (/blog/confee-introduction)

**Research Findings**:
- 프레임워크: Astro 5.16.15 + React 18.3.1 + Tailwind CSS 4.1.18
- 기존 포스트: 4개 (confee, s3lync, fastapi-bootstrap, kidsnote)
- 포스트 frontmatter: title, date만 존재
- BaseLayout.astro: 기본 meta 태그만, OG/Twitter 없음
- @astrojs/sitemap 미설치

### Metis Review
**Identified Gaps** (addressed):
- Content 경로 비표준: src/content/posts/로 이동하여 해결
- description 없음: 본문 첫 160자 자동 추출로 해결
- OG 이미지 없음: placeholder 이미지 생성으로 해결

---

## Work Objectives

### Core Objective
블로그 포스트를 웹사이트에 표시하고, 검색 엔진과 SNS 공유에 최적화된 메타 태그를 추가한다.

### Concrete Deliverables
- `src/content/config.ts` - Content Collections 스키마 정의
- `src/content/posts/*.md` - 이동된 포스트 파일 (4개)
- `src/pages/blog.astro` - 카드형 그리드 목록 페이지
- `src/pages/blog/[slug].astro` - 개별 포스트 페이지
- `src/layouts/BaseLayout.astro` - OG/Twitter 메타 태그 추가
- `public/og-image.png` - 기본 OG 이미지 (1200x630)
- `public/robots.txt` - 검색 엔진 크롤링 규칙
- `astro.config.mjs` - @astrojs/sitemap 통합

### Definition of Done
- [ ] `npm run build` 성공 (에러 없음)
- [ ] 블로그 목록 페이지에 4개 포스트 카드 표시
- [ ] 모든 4개 개별 포스트 페이지 접근 가능
- [ ] OG/Twitter 메타 태그가 HTML에 렌더링됨
- [ ] sitemap-index.xml 접근 가능 (200 응답)
- [ ] robots.txt에 Sitemap URL 포함

### Must Have
- Astro Content Collections 설정
- 4개 포스트 전체 연결
- OG (og:title, og:description, og:image, og:url, og:type)
- Twitter Card (twitter:card, twitter:title, twitter:description)
- sitemap.xml 자동 생성
- robots.txt

### Must NOT Have (Guardrails)
- 마크다운 스타일링 커스터마이징 (기본 렌더링만)
- 태그, 카테고리, 검색, 페이지네이션 기능
- RSS 피드 생성
- 기존 페이지(index, projects, about, skills, contact) 로직 수정 (BaseLayout 제외)
- 포스트 본문 내용 수정
- 다국어 SEO (hreflang)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: none (수동 검증 + Playwright 스크린샷)

### Automated Verification (ALWAYS include)

**모든 Task는 다음 검증 방식 중 하나를 사용:**

| Type | Tool | Procedure |
|------|------|-----------|
| 빌드 검증 | Bash | `npm run build` 실행, 에러 없음 확인 |
| 페이지 렌더링 | Bash (curl) | curl로 페이지 접근, 특정 문자열 grep |
| 시각 검증 | Playwright | 스크린샷 캡처 → .sisyphus/evidence/ 저장 |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Content Collections 설정 및 포스트 이동

Wave 2 (After Wave 1):
├── Task 2: 개별 포스트 페이지 (blog/[slug].astro)
└── Task 3: 블로그 목록 페이지 (blog.astro)

Wave 3 (After Wave 2):
└── Task 4: SEO 메타 태그 (BaseLayout.astro)

Wave 4 (After Wave 3):
├── Task 5: sitemap.xml (@astrojs/sitemap)
└── Task 6: OG 이미지 + robots.txt

Wave 5 (Final):
└── Task 7: 통합 검증 + 커밋

Critical Path: Task 1 → Task 2 → Task 4 → Task 7
Parallel Speedup: ~30% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3 | None |
| 2 | 1 | 4, 7 | 3 |
| 3 | 1 | 7 | 2 |
| 4 | 2 | 7 | 5, 6 |
| 5 | 4 | 7 | 6 |
| 6 | None | 7 | 5 |
| 7 | 2, 3, 4, 5, 6 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1 | delegate_task(category="quick", load_skills=[], run_in_background=false) |
| 2 | 2, 3 | dispatch parallel with run_in_background=true |
| 3 | 4 | delegate_task(category="quick", ...) |
| 4 | 5, 6 | dispatch parallel with run_in_background=true |
| 5 | 7 | final verification task |

---

## TODOs

### Task 1: Content Collections 설정 및 포스트 이동

- [ ] 1. Content Collections 설정 및 포스트 이동

  **What to do**:
  - `src/content/` 디렉토리 생성
  - `src/content/config.ts` 파일 생성하여 posts collection 스키마 정의
  - `content/posts/` 폴더의 4개 마크다운 파일을 `src/content/posts/`로 이동
  - 기존 `content/` 폴더 정리 (about.md, _index.md는 별도 처리 불필요)

  **Must NOT do**:
  - 포스트 본문 내용 수정
  - description frontmatter 추가 (자동 추출 예정)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 파일 이동과 간단한 config 생성, 10분 미만 작업
  - **Skills**: `[]`
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (단독)
  - **Blocks**: Task 2, Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/pages/index.astro:1-20` - Astro 페이지 frontmatter 패턴

  **API/Type References**:
  - Astro Content Collections docs: https://docs.astro.build/en/guides/content-collections/

  **Source Files**:
  - `content/posts/confee-introduction.md` - 이동 대상 (frontmatter: title, date)
  - `content/posts/s3lync-introduction.md` - 이동 대상
  - `content/posts/fastapi-bootstrap-introduction.md` - 이동 대상
  - `content/posts/kidsnote-introduction.md` - 이동 대상

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 디렉토리 존재 확인
  ls src/content/posts/
  # Assert: 4개 .md 파일 존재 (confee-introduction.md, s3lync-introduction.md, fastapi-bootstrap-introduction.md, kidsnote-introduction.md)

  # 2. config.ts 존재 확인
  cat src/content/config.ts
  # Assert: posts collection 정의 존재

  # 3. 빌드 성공 확인
  npm run build
  # Assert: 에러 없이 완료
  ```

  **Evidence to Capture:**
  - [ ] `ls -la src/content/posts/` 출력
  - [ ] `npm run build` 성공 로그

  **Commit**: YES
  - Message: `feat(blog): add Content Collections configuration and move posts`
  - Files: `src/content/config.ts`, `src/content/posts/*.md`
  - Pre-commit: `npm run build`

---

### Task 2: 개별 포스트 페이지 생성

- [ ] 2. 개별 포스트 페이지 (blog/[slug].astro)

  **What to do**:
  - `src/pages/blog/[slug].astro` 동적 라우팅 페이지 생성
  - `getStaticPaths()`로 모든 포스트 slug 생성
  - 마크다운 본문 렌더링 (기본 스타일)
  - BaseLayout 사용하여 레이아웃 적용
  - 포스트 제목, 날짜 표시

  **Must NOT do**:
  - 코드 하이라이팅 커스터마이징
  - 댓글, 공유 버튼 추가
  - 이전/다음 포스트 네비게이션

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 동적 라우팅 페이지 1개 생성, Astro 표준 패턴
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 4, Task 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/pages/about.astro:1-50` - 페이지 레이아웃 패턴 (BaseLayout 사용)
  - `src/layouts/BaseLayout.astro:1-31` - 레이아웃 props 인터페이스

  **API/Type References**:
  - Astro getStaticPaths: https://docs.astro.build/en/guides/routing/#static-ssg-mode
  - Astro Content Collections render: https://docs.astro.build/en/guides/content-collections/#rendering-content-to-html

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 페이지 파일 존재 확인
  cat src/pages/blog/\[slug\].astro
  # Assert: getStaticPaths 함수 존재

  # 2. 빌드 후 개별 포스트 라우팅 확인
  npm run build
  ls dist/blog/
  # Assert: confee-introduction/, s3lync-introduction/, fastapi-bootstrap-introduction/, kidsnote-introduction/ 디렉토리 존재

  # 3. dev 서버에서 접근 확인 (선택)
  # npm run dev &
  # curl -sf http://localhost:4321/blog/confee-introduction/ > /dev/null && echo "OK"
  ```

  **Evidence to Capture:**
  - [ ] `ls dist/blog/` 출력 (4개 디렉토리)
  - [ ] 빌드 성공 로그

  **Commit**: NO (Task 3과 함께 커밋)

---

### Task 3: 블로그 목록 페이지 수정

- [ ] 3. 블로그 목록 페이지 (blog.astro)

  **What to do**:
  - `src/pages/blog.astro` 수정
  - Content Collections에서 모든 포스트 가져오기
  - 날짜순 정렬 (최신순 DESC)
  - 카드형 그리드 레이아웃 (2-3열, 반응형)
  - 각 카드: 제목, 날짜, 본문 첫 160자 (description 자동 추출)
  - "Coming Soon" 플레이스홀더 제거

  **Must NOT do**:
  - 태그, 카테고리 필터
  - 검색 기능
  - 페이지네이션 (4개 포스트이므로 불필요)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 기존 페이지 수정, Tailwind 카드 그리드
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/pages/projects.astro:1-100` - 카드 그리드 레이아웃 패턴 (참고용)
  - `src/pages/index.astro:1-50` - Tailwind 스타일링 패턴

  **API/Type References**:
  - Astro getCollection: https://docs.astro.build/en/guides/content-collections/#querying-collections

  **Source Files**:
  - `src/pages/blog.astro:1-27` - 현재 "Coming Soon" 상태, 전면 수정 필요

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 빌드 후 blog/index.html 확인
  npm run build
  grep -c "confee-introduction" dist/blog/index.html
  # Assert: >= 1 (포스트 링크 존재)

  # 2. "Coming Soon" 텍스트 제거 확인
  grep -c "Coming Soon" dist/blog/index.html
  # Assert: 0

  # 3. 카드 그리드 스타일 확인 (grid 클래스)
  grep -c "grid" dist/blog/index.html
  # Assert: >= 1
  ```

  **Evidence to Capture:**
  - [ ] `grep "confee-introduction" dist/blog/index.html` 출력
  - [ ] 빌드 성공 로그

  **Commit**: YES (Task 2와 함께)
  - Message: `feat(blog): add post list page and individual post pages`
  - Files: `src/pages/blog.astro`, `src/pages/blog/[slug].astro`
  - Pre-commit: `npm run build`

---

### Task 4: SEO 메타 태그 추가

- [ ] 4. SEO 메타 태그 (BaseLayout.astro)

  **What to do**:
  - `src/layouts/BaseLayout.astro` Props 인터페이스 확장
    - `image?: string` (OG 이미지 URL)
    - `url?: string` (Canonical URL)
    - `type?: string` (og:type, 기본값 'website')
  - Open Graph 메타 태그 추가 (og:title, og:description, og:image, og:url, og:type)
  - Twitter Card 메타 태그 추가 (twitter:card, twitter:title, twitter:description, twitter:image)
  - Canonical URL 태그 추가
  - 기본값 설정: image는 `/og-image.png`, url은 `Astro.url`

  **Must NOT do**:
  - 다국어 SEO (hreflang)
  - JSON-LD 구조화 데이터
  - 기타 페이지 로직 수정

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일 수정, 메타 태그 추가만
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (단독)
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/layouts/BaseLayout.astro:1-31` - 현재 레이아웃 구조

  **API/Type References**:
  - Open Graph Protocol: https://ogp.me/
  - Twitter Card: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 빌드 후 OG 태그 확인
  npm run build
  grep 'property="og:title"' dist/index.html
  # Assert: 태그 존재

  # 2. Twitter 태그 확인
  grep 'name="twitter:card"' dist/index.html
  # Assert: 태그 존재

  # 3. Canonical URL 확인
  grep 'rel="canonical"' dist/index.html
  # Assert: 태그 존재
  ```

  **Evidence to Capture:**
  - [ ] OG 태그 grep 출력
  - [ ] Twitter 태그 grep 출력
  - [ ] 빌드 성공 로그

  **Commit**: YES
  - Message: `feat(seo): add Open Graph and Twitter Card meta tags`
  - Files: `src/layouts/BaseLayout.astro`
  - Pre-commit: `npm run build`

---

### Task 5: sitemap.xml 자동 생성

- [ ] 5. sitemap.xml (@astrojs/sitemap)

  **What to do**:
  - `@astrojs/sitemap` 패키지 설치 (`npm install @astrojs/sitemap`)
  - `astro.config.mjs`에 sitemap 통합 추가
  - site URL은 이미 설정되어 있음 (https://bestend.github.io)

  **Must NOT do**:
  - RSS 피드 생성
  - sitemap 커스터마이징 (기본 설정 사용)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 패키지 설치 + config 1줄 추가
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:

  **Source Files**:
  - `astro.config.mjs:1-20` - 현재 Astro 설정

  **API/Type References**:
  - @astrojs/sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 패키지 설치 확인
  grep "@astrojs/sitemap" package.json
  # Assert: 존재

  # 2. 빌드 후 sitemap 파일 확인
  npm run build
  ls dist/sitemap*.xml
  # Assert: sitemap-index.xml 또는 sitemap-0.xml 존재

  # 3. sitemap 내용 확인
  cat dist/sitemap-index.xml
  # Assert: loc 태그에 사이트 URL 포함
  ```

  **Evidence to Capture:**
  - [ ] `cat dist/sitemap-index.xml` 출력
  - [ ] 빌드 성공 로그

  **Commit**: NO (Task 6과 함께 커밋)

---

### Task 6: OG 이미지 + robots.txt

- [ ] 6. OG 이미지 + robots.txt

  **What to do**:
  - `public/og-image.png` 생성 (1200x630, placeholder)
    - 단색 배경 + "Bestend Blog" 텍스트 (간단한 SVG를 PNG로 변환하거나 placeholder 이미지)
  - `public/robots.txt` 생성
    - User-agent: *
    - Allow: /
    - Sitemap: https://bestend.github.io/sitemap-index.xml

  **Must NOT do**:
  - 복잡한 이미지 디자인
  - 동적 OG 이미지 생성

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 정적 파일 2개 생성
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:

  **API/Type References**:
  - robots.txt 표준: https://developers.google.com/search/docs/crawling-indexing/robots/intro

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. OG 이미지 존재 확인
  ls -la public/og-image.png
  # Assert: 파일 존재, 크기 > 0

  # 2. robots.txt 내용 확인
  cat public/robots.txt
  # Assert: Sitemap URL 포함

  # 3. 빌드 후 dist에 복사 확인
  npm run build
  ls dist/og-image.png dist/robots.txt
  # Assert: 두 파일 모두 존재
  ```

  **Evidence to Capture:**
  - [ ] `cat public/robots.txt` 출력
  - [ ] `ls -la public/og-image.png` 출력

  **Commit**: YES (Task 5와 함께)
  - Message: `feat(seo): add sitemap.xml, robots.txt, and OG image`
  - Files: `astro.config.mjs`, `public/robots.txt`, `public/og-image.png`
  - Pre-commit: `npm run build`

---

### Task 7: 통합 검증 및 최종 커밋

- [ ] 7. 통합 검증 및 최종 커밋

  **What to do**:
  - 전체 빌드 검증
  - 모든 acceptance criteria 확인
  - Playwright로 주요 페이지 스크린샷 캡처
  - 필요시 최종 커밋

  **Must NOT do**:
  - 추가 기능 구현
  - 디자인 변경

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 검증만 수행
  - **Skills**: `["playwright"]`
    - playwright: 스크린샷 캡처 및 시각 검증

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (최종)
  - **Blocks**: None
  - **Blocked By**: Task 2, 3, 4, 5, 6

  **References**:

  **Acceptance Criteria**:

  ```bash
  # Agent 실행:
  # 1. 전체 빌드
  npm run build
  # Assert: 에러 없음

  # 2. 블로그 목록 확인
  grep -c "confee-introduction" dist/blog/index.html
  # Assert: >= 1

  # 3. 개별 포스트 확인
  for slug in confee-introduction s3lync-introduction fastapi-bootstrap-introduction kidsnote-introduction; do
    test -f "dist/blog/$slug/index.html" && echo "$slug: OK"
  done
  # Assert: 4개 모두 OK

  # 4. OG 태그 확인
  grep 'property="og:title"' dist/index.html
  # Assert: 존재

  # 5. sitemap 확인
  test -f dist/sitemap-index.xml && echo "sitemap: OK"
  # Assert: OK

  # 6. robots.txt 확인
  grep "Sitemap:" dist/robots.txt
  # Assert: Sitemap URL 포함
  ```

  **Playwright Visual Verification**:
  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:4321/blog
  2. Wait for: selector "article" or ".card" to be visible
  3. Screenshot: .sisyphus/evidence/blog-list.png
  4. Navigate to: http://localhost:4321/blog/confee-introduction
  5. Wait for: selector "h1" to be visible
  6. Screenshot: .sisyphus/evidence/blog-post.png
  ```

  **Evidence to Capture:**
  - [ ] 빌드 성공 로그
  - [ ] 각 검증 항목 출력
  - [ ] 스크린샷: .sisyphus/evidence/blog-list.png
  - [ ] 스크린샷: .sisyphus/evidence/blog-post.png

  **Commit**: YES (필요시)
  - Message: `chore: verify blog and SEO implementation`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(blog): add Content Collections configuration and move posts` | src/content/* | npm run build |
| 2+3 | `feat(blog): add post list page and individual post pages` | src/pages/blog.astro, src/pages/blog/[slug].astro | npm run build |
| 4 | `feat(seo): add Open Graph and Twitter Card meta tags` | src/layouts/BaseLayout.astro | npm run build |
| 5+6 | `feat(seo): add sitemap.xml, robots.txt, and OG image` | astro.config.mjs, public/* | npm run build |
| 7 | (필요시) `chore: verify blog and SEO implementation` | - | npm run build |

---

## Success Criteria

### Verification Commands
```bash
# 전체 검증 스크립트
npm run build

# 블로그 목록 (4개 포스트)
grep -c "confee-introduction" dist/blog/index.html  # >= 1

# 개별 포스트 (4개)
ls dist/blog/*/index.html | wc -l  # 4

# OG 메타 태그
grep 'property="og:title"' dist/index.html  # 존재

# Twitter 메타 태그
grep 'name="twitter:card"' dist/index.html  # 존재

# sitemap
test -f dist/sitemap-index.xml && echo "OK"  # OK

# robots.txt
grep "Sitemap:" dist/robots.txt  # Sitemap URL 포함
```

### Final Checklist
- [ ] 모든 "Must Have" 항목 완료
- [ ] 모든 "Must NOT Have" 항목 위반 없음
- [ ] 빌드 에러 없음
- [ ] 4개 포스트 전체 접근 가능
- [ ] SEO 메타 태그 렌더링됨
