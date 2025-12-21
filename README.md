# Bestend Blog 🚀

개인 기술 블로그로, Confee와 소프트웨어 개발에 관한 글을 공유합니다.

## 📋 소개

이 블로그는 Hugo를 기반으로 구축되었으며, 다음 주제들을 다룹니다:

- 🔧 **Confee** - 타입 안전한 설정 관리 라이브러리
- 🐍 **Python 개발** - Python 관련 팁과 경험
- ⚙️ **설정 관리** - 애플리케이션 설정 모범 사례
- 🔓 **오픈소스** - 오픈소스 프로젝트 개발 경험
- 🚀 **DevOps** - 배포 및 자동화

## 🛠 기술 스택

- **정적 사이트 생성기**: [Hugo](https://gohugo.io/)
- **테마**: [PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- **호스팅**: GitHub Pages
- **배포**: GitHub Actions (자동 빌드 및 배포)

## 🚀 로컬에서 실행하기

### 사전 요구사항
- Hugo 설치 (extended 버전 권장)
- Git

### 설치 및 실행

```bash
# 저장소 클론 (submodule 포함)
git clone --recurse-submodules https://github.com/bestend/bestend.github.io.git
cd bestend.github.io

# 로컬 서버 시작
hugo server -D

# 브라우저에서 http://localhost:1313 방문
```

### 새로운 포스트 작성

```bash
# 새로운 포스트 생성
hugo new posts/my-new-post.md

# content/posts/my-new-post.md 파일을 편집하고 저장
```

포스트 Frontmatter 예제:
```yaml
---
title: "포스트 제목"
description: "포스트 설명"
date: 2025-12-21T09:00:00+09:00
draft: false
tags: ["태그1", "태그2"]
categories: ["카테고리"]
---
```

## 📁 디렉토리 구조

```
.
├── content/           # 블로그 콘텐츠
│   ├── _index.md     # 홈페이지
│   ├── about.md      # 소개 페이지
│   └── posts/        # 블로그 포스트
├── static/           # 정적 자산 (이미지 등)
├── themes/           # Hugo 테마
│   └── PaperMod/     # PaperMod 테마
├── .github/
│   └── workflows/    # GitHub Actions 워크플로우
│       └── deploy.yml # 자동 배포 설정
├── hugo.toml         # Hugo 설정 파일
└── README.md         # 이 파일
```

## 🔄 배포 프로세스

이 블로그는 GitHub Actions를 사용하여 자동으로 배포됩니다:

1. **main 브랜치에 push** → 자동으로 Hugo 빌드 시작
2. **빌드 완료** → 정적 파일 생성 (`public/` 디렉토리)
3. **GitHub Pages에 배포** → `gh-pages` 브랜치로 자동 푸시

더 이상 수동으로 빌드하거나 배포할 필요가 없습니다! 🎉

### 워크플로우 파일
- `.github/workflows/deploy.yml` - 빌드 및 배포 자동화

## 📖 주요 포스트

### Confee 시리즈

1. **[Confee 소개](https://bestend.github.io/posts/confee-introduction/)** - Confee 라이브러리의 기능과 사용 방법
2. **[Confee 0.1.2 릴리즈 노트](https://bestend.github.io/posts/confee-0.1.2-release/)** - 첫 안정 릴리즈 발표
3. **[Confee 고급 사용법](https://bestend.github.io/posts/confee-advanced/)** - 고급 기능과 실제 사용 사례

## 🤝 기여하기

블로그의 오류나 개선 사항을 찾으셨나요?

1. [Issues](https://github.com/bestend/bestend.github.io/issues)를 통해 보고하기
2. Fork 후 Pull Request 제출하기

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 공개됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 📞 연락처

- GitHub: [@bestend](https://github.com/bestend)
- GitHub Issues: [Issues 트래커](https://github.com/bestend/bestend.github.io/issues)

---

**블로그 방문**: https://bestend.github.io

**Confee GitHub**: https://github.com/bestend/confee

**Confee PyPI**: https://pypi.org/project/confee/

