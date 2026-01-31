
## Content Collections 설정 (2026-01-31)

### 패턴
- `src/content/config.ts` 파일에 collections 정의
- `defineCollection`과 `z.object`로 스키마 정의
- `type: 'content'`는 Markdown/MDX 파일용

### 스키마 예시
```typescript
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { posts };
```

### 파일 구조
```
src/content/
├── config.ts
└── posts/
    ├── confee-introduction.md
    ├── fastapi-bootstrap-introduction.md
    ├── kidsnote-introduction.md
    └── s3lync-introduction.md
```

### 빌드 확인
- `npm run build`로 성공 여부 확인
- Content Collections가 없으면 빌드 실패하지 않지만 타입 안정성 없음

## Blog 목록 페이지 구현 (2026-01-31)

### 작업 내용
- `src/pages/blog.astro`를 "Coming Soon" 상태에서 Content Collections 기반 블로그 목록 페이지로 전면 수정
- `getCollection('posts')`로 모든 포스트 가져오기
- 날짜순 정렬 (최신순 DESC)
- 카드형 그리드 레이아웃 구현 (2열 md, 3열 lg)

### 패턴
```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

function getExcerpt(body: string, length: number = 160): string {
  return body.slice(0, length).replace(/\n/g, ' ').trim() + '...';
}
---
```

### Tailwind 클래스 사용
- 그리드: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- 카드 스타일: `border border-border bg-bg-secondary rounded-lg p-6`
- 호버 효과: `hover:border-border-hover hover:-translate-y-2 hover:shadow-lg transition-all duration-300`

### 검증 결과
- ✅ 빌드 성공
- ✅ confee-introduction 링크 존재 (grep: 1)
- ✅ "Coming Soon" 제거됨 (grep: 0)
- ✅ grid 그리드 레이아웃 적용됨

### LSP 경고 참고
- Content Collections 타입 설정으로 인한 LSP 에러 발생하지만, 실제 런타임에서는 정상 동작
- Astro 빌드 시 자동 타입 생성으로 해결됨


## 개별 포스트 페이지 구현 (2026-01-31)

### 작업 내용
- `src/pages/blog/[slug].astro` 생성
- getStaticPaths()로 posts collection의 모든 slug 반환
- entry.render()로 마크다운 본문 렌더링
- BaseLayout 사용하여 레이아웃 적용

### 패턴
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <div class="container mx-auto px-4 py-12">
    <article class="max-w-3xl">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-text-primary mb-4">
          {post.data.title}
        </h1>
        <time class="text-text-tertiary">
          {post.data.date.toLocaleDateString('ko-KR')}
        </time>
      </header>

      <div class="prose prose-lg max-w-none text-text-secondary">
        <Content />
      </div>
    </article>
  </div>
</BaseLayout>
```

### Tailwind 클래스 사용
- 컨테이너: `container mx-auto px-4 py-12`
- 본문 최대 너비: `max-w-3xl`
- 제목 스타일: `text-4xl font-bold text-text-primary mb-4`
- 날짜 스타일: `text-text-tertiary`
- 본문 영역: `prose prose-lg max-w-none text-text-secondary`

### 검증 결과
- ✅ 빌드 성공
- ✅ 4개 포스트 디렉토리 생성됨:
  - confee-introduction
  - fastapi-bootstrap-introduction
  - kidsnote-introduction
  - s3lync-introduction


## SEO 메타 태그 구현 (2026-01-31)

### 작업 내용
- `src/layouts/BaseLayout.astro`에 Open Graph 및 Twitter Card 메타 태그 추가
- Props 인터페이스 확장 (image, url, type)
- Canonical URL 태그 추가
- 모든 페이지에 자동으로 SEO 메타 태그 적용

### 패턴
```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const { title, description = 'Default description', image = '/og-image.png', url = Astro.url, type = 'website' } = Astro.props;
---

<head>
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image, Astro.site).toString()} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(image, Astro.site).toString()} />

  <!-- Canonical URL -->
  <link rel="canonical" href={url} />
</head>
```

### Props 기본값
- `image`: `/og-image.png` (OG 이미지 기본 경로)
- `url`: `Astro.url` (현재 페이지 URL)
- `type`: `'website'` (OG 타입 기본값)

### Astro 기능 활용
- `Astro.site`: 사이트 기본 URL (astro.config.ts에서 설정)
- `new URL(image, Astro.site).toString()`: 상대 경로를 절대 경로로 변환
- `Astro.url`: 현재 페이지의 절대 URL

### 검증 결과
- ✅ 빌드 성공
- ✅ dist/index.html에 OG 태그 존재 (og:title, og:description, og:image, og:url, og:type)
- ✅ Twitter Card 태그 존재 (twitter:card, twitter:title, twitter:description, twitter:image)
- ✅ Canonical URL 태그 존재

### 빌드 검증 커맨드
```bash
npm run build
grep 'property="og:title"' dist/index.html
grep 'name="twitter:card"' dist/index.html
grep 'rel="canonical"' dist/index.html
```

### 주의사항
- `Astro.site`이 astro.config.ts에서 올바르게 설정되어 있어야 함
- OG 이미지 파일이 `/public` 디렉토리에 존재해야 함
- 개별 페이지에서 Props를 전달하여 맞춤 SEO 설정 가능

