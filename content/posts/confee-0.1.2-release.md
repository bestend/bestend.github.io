---
title: "Confee 0.1.2 릴리즈 노트"
description: "Confee의 첫 안정 릴리즈 발표"
date: 2025-12-21T10:00:00+09:00
draft: false
tags: ["confee", "release", "python"]
categories: ["Open Source"]
---

# Confee 0.1.2 - 첫 안정 릴리즈 🎉

환영합니다! **Confee 0.1.2**는 프로젝트의 첫 번째 공식 안정 릴리즈입니다.

## 🎯 릴리즈 하이라이트

이번 릴리즈에서는 다음과 같은 완전한 기능 세트를 제공합니다:

### ✨ 핵심 기능
- **타입 안전한 설정 관리** - Pydantic V2와의 완벽한 통합
- **다중 소스 지원** - YAML/JSON 파일, 환경 변수, CLI 인자의 유연한 조합
- **중첩된 설정** - 닷 표기법(dot notation)을 사용한 깊은 필드 접근
- **파일 참조** - `@file:` 및 `@config:` 프리픽스를 통한 동적 로드
- **설정 상속** - `override_with()` 메서드로 설정 병합
- **검증 모드** - 엄격한(strict) 또는 비엄격한(non-strict) 검증

### 🎓 개발자 경험
- **자동 도움말 생성** - `--help` 플래그로 모든 옵션과 기본값 표시
- **색상 코딩된 터미널 출력** - 읽기 쉬운 에러 메시지
- **환경 변수 커스텀 프리픽스** - `CONFEE_` 대신 자신의 프리픽스 사용 가능
- **유연한 소스 순서** - 파일/환경/CLI의 우선순위 제어

## 📊 품질 지표

| 지표 | 수치 |
|------|------|
| 코드 커버리지 | **91%** |
| 테스트 케이스 | **116개** |
| Python 버전 | 3.8+ |
| 주요 의존성 | Pydantic V2, Typer |

## 🚀 주요 개선사항

### Python 3.9 호환성 개선
Python 3.9에서의 타입 힌트 호환성을 개선했습니다:
```python
# ✅ 이제 3.9에서도 동작합니다
class Config(ConfigBase):
    optional_value: Optional[str] = None
```

### 태그 패턴 유연성
GitHub 릴리즈 태그가 더 유연해졌습니다:
- ✅ `v0.1.2` 형식
- ✅ `0.1.2` 형식

모두 자동으로 인식됩니다!

## 📚 문서 및 리소스

이번 릴리즈와 함께 제공되는 완전한 문서:

### 📖 공식 문서
- **README** - 빠른 시작 가이드 및 기본 사용법
- **Comparison with OmegaConf** - Confee vs OmegaConf 비교 분석
- **Development Guide** - 프로젝트 기여 가이드

### 🌐 언어 지원
- **English** - 영문 문서
- **한국어** - 한글 문서 (README.ko.md)

## 🔧 설치 방법

### pip를 사용한 설치
```bash
pip install confee
```

### uv를 사용한 설치
```bash
uv pip install confee
```

### 소스에서 설치 (개발자용)
```bash
git clone https://github.com/bestend/confee.git
cd confee
pip install -e .
```

## 📝 사용 예제

### 기본 설정 로드
```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    workers: int = 4

# 파일, 환경 변수, CLI 인자에서 자동 로드
config = AppConfig.load(config_file="config.yaml")
```

### 다중 소스 우선순위 제어
```python
# CLI가 가장 높은 우선순위
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["cli", "env", "file"]
)
```

### 중첩된 설정
```python
class DatabaseConfig(ConfigBase):
    host: str = "localhost"
    port: int = 5432

class AppConfig(ConfigBase):
    name: str
    database: DatabaseConfig

# CLI에서 사용
# python app.py database.host=prod.db
```

## 🎉 감사의 말

이 릴리즈가 가능하게 한 모든 분들께 감사드립니다:
- **Pydantic** 팀 - 훌륭한 검증 라이브러리
- **Typer** 팀 - CLI 구현에서의 영감
- **모든 테스터와 피드백 제공자들** - 지속적인 개선

## 🔮 미래 계획

향후 릴리즈에서 계획 중인 기능들:

- [ ] TOML 파일 지원
- [ ] 더 강화된 플러그인 시스템
- [ ] 설정 템플릿 및 제너레이터
- [ ] 웹 기반 설정 UI
- [ ] 더 많은 예제 및 튜토리얼

## 🤝 기여 방법

Confee에 기여하고 싶으신가요?

1. 저장소를 포크(fork)하세요
2. 새로운 기능 브랜치를 만드세요
3. 변경 사항에 대한 테스트를 작성하세요
4. Pull Request를 제출하세요

자세한 내용은 [Development Guide](https://github.com/bestend/confee/blob/main/development.md)를 참조하세요.

## 📞 피드백

질문이나 제안이 있으신가요?

- 🐛 **Issues**: [GitHub Issues](https://github.com/bestend/confee/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/bestend/confee/discussions)
- 📧 **Email**: [이슈 트래커를 통해 연락주세요]

---

**Confee 0.1.2을 다운로드하고 타입 안전한 설정 관리의 세계에 들어오세요!**

👉 [PyPI에서 설치](https://pypi.org/project/confee/)
👉 [GitHub 저장소](https://github.com/bestend/confee)

