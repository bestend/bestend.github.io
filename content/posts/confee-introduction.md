---
title: "Confee 소개 - 타입 안전한 설정 관리"
description: "Confee 라이브러리의 기능과 사용 방법"
date: 2025-12-21T09:00:00+09:00
draft: false
tags: ["python", "confee", "configuration", "pydantic"]
categories: ["Python Development"]
---

# Confee 소개 - 타입 안전한 설정 관리

안녕하세요! 오늘은 제가 개발한 **Confee** 라이브러리를 소개드리겠습니다. 

## 🤔 왜 Confee를 만들었나?

Python 애플리케이션을 개발할 때, 설정 관리는 항상 어려운 부분이었습니다:

- 🙁 YAML/JSON 파일을 딕셔너리로 읽으면 타입 정보가 사라짐
- 😤 환경 변수, CLI 인자, 설정 파일의 우선순위 관리가 복잡함
- 😩 설정 변경 시 런타임 오류가 발생할 가능성이 높음

기존의 **Hydra**와 **OmegaConf**는 강력하지만, 많은 보일러플레이트 코드가 필요했습니다.

## ✨ Confee의 핵심 특징

### 1. **타입 안전성** (with Pydantic V2)

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    workers: int = 4

config = AppConfig.load(config_file="config.yaml")

# IDE 자동완성 지원!
print(config.name)    # str
print(config.debug)   # bool
print(config.workers) # int
```

### 2. **다중 소스 지원**

한 곳에서 모든 설정을 관리하세요:

```python
# config.yaml
name: my-app
debug: false
workers: 8
```

```bash
# 환경 변수로 오버라이드
export CONFEE_DEBUG=true
export CONFEE_WORKERS=16

# CLI 인자로 오버라이드
python app.py debug=true workers=32
```

### 3. **중첩된 설정 구조**

```python
class DatabaseConfig(ConfigBase):
    host: str = "localhost"
    port: int = 5432

class AppConfig(ConfigBase):
    name: str
    database: DatabaseConfig

# 닷 표기법으로 접근
# python app.py database.host=prod.db database.port=3306
```

### 4. **파일 참조 지원**

```yaml
# config.yaml
name: my-app
api_key: "@file:secrets/api_key.txt"
database_config: "@config:configs/database.yaml"
```

### 5. **자동 도움말 생성**

```bash
python app.py --help

# 모든 설정 옵션과 기본값을 자동으로 표시!
```

## 🚀 시작하기

### 설치

```bash
pip install confee
# 또는
uv pip install confee
```

### 기본 사용법

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    app_name: str
    debug: bool = False
    port: int = 8000

# 설정 로드
config = AppConfig.load(config_file="config.yaml")

# 타입 안전하게 접근
if config.debug:
    print(f"Debug mode enabled on {config.app_name}")
```

## 📊 특징 비교

| 기능 | Confee | Hydra | OmegaConf |
|------|--------|-------|-----------|
| Pydantic 통합 | ✅ | ⚠️ | ❌ |
| 타입 안전성 | ✅ | ❌ | ❌ |
| 자동 도움말 | ✅ | ⚠️ | ❌ |
| 간단한 API | ✅ | ❌ | ⚠️ |
| 중첩 필드 접근 | ✅ | ✅ | ✅ |

## 🎯 사용 사례

### FastAPI와 함께 사용

```python
from fastapi import FastAPI
from confee import ConfigBase

class AppConfig(ConfigBase):
    title: str = "My API"
    debug: bool = False

config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]  # CLI 제외
)

app = FastAPI(title=config.title, debug=config.debug)
```

### 환경별 설정

```python
import os
from confee import ConfigBase

env = os.getenv("APP_ENV", "dev")
config = AppConfig.load(config_file=f"{env}.yaml")
```

### 설정 검증

```python
from pydantic import Field

class AppConfig(ConfigBase):
    workers: int = Field(ge=1, le=128)  # 1~128 범위
    timeout: float = Field(gt=0)         # 양수만 허용
```

## 📈 릴리스 정보

**현재 버전: 0.1.2** (2025-12-21)

### 최신 기능 (0.1.2)
- ✅ 초기 안정 릴리스
- ✅ Pydantic V2 완벽 지원
- ✅ 다중 소스 설정 (파일/환경변수/CLI)
- ✅ 닷 표기법 중첩 필드 접근
- ✅ 파일 참조 지원 (@file:, @config:)
- ✅ 설정 상속 (override_with())
- ✅ 엄격한/비엄격한 검증 모드
- ✅ 자동 도움말 생성
- ✅ 91% 코드 커버리지 (116개 테스트)

## 🔗 더 알아보기

- 📖 [GitHub 저장소](https://github.com/bestend/confee)
- 📦 [PyPI 패키지](https://pypi.org/project/confee/)
- 📚 [비교 문서](https://github.com/bestend/confee/blob/main/comparison.md)
- 🏗️ [개발 가이드](https://github.com/bestend/confee/blob/main/development.md)

---

**다음 포스트에서는 Confee의 고급 기능을 자세히 살펴보겠습니다!**

