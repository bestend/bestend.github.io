---
title: "Confee 고급 사용법"
description: "Confee의 고급 기능과 패턴"
date: 2025-12-21T11:00:00+09:00
draft: false
tags: ["python", "confee", "configuration", "advanced"]
categories: ["Python Development"]
---

# Confee 고급 사용법

이전 포스트에서 Confee의 기본 기능을 살펴봤습니다. 이번에는 더 강력한 기능들을 알아보겠습니다.

## 🔐 검증 모드 (Strict/Non-Strict)

### 엄격한 모드 (Strict Mode) - 기본값

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

# 미지의 필드가 전달되면 에러 발생!
config = AppConfig.load(
    cli_args=["name=myapp", "unknown_field=true"],
    strict=True  # 기본값
)
# ValidationError 발생!
```

### 비엄격한 모드 (Non-Strict Mode)

```python
# 미지의 필드를 무시
config = AppConfig.load(
    cli_args=["name=myapp", "unknown_field=true"],
    strict=False
)
# unknown_field는 무시되고, 정상적으로 로드됨
print(config.name)  # "myapp"
```

## 🔄 설정 상속과 병합

### override_with() 메서드

```python
from confee import ConfigBase

class BaseConfig(ConfigBase):
    app_name: str = "MyApp"
    debug: bool = False
    workers: int = 4

# 부분 설정
class DevConfig(BaseConfig):
    debug: bool = True
    workers: int = 1

base = BaseConfig(app_name="Production")
dev = DevConfig(app_name="Development")

# 새로운 설정으로 병합
merged = base.override_with(dev)

print(merged.app_name)   # "Development"
print(merged.debug)      # True
print(merged.workers)    # 1
```

## 📁 파일 참조 심화

### 외부 파일 로드

```yaml
# config.yaml
app:
  name: MyApp
  secret: "@file:secrets/api_key.txt"
  db_config: "@config:configs/database.yaml"
```

```python
class AppConfig(ConfigBase):
    app: AppSettings

config = AppConfig.load(config_file="config.yaml")
print(config.app.secret)  # secrets/api_key.txt의 내용
```

## 🌍 환경 변수 커스타마이징

### 커스텀 프리픽스 사용

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    port: int = 8000

# MYAPP_ 프리픽스 사용
config = AppConfig.load(env_prefix="MYAPP_")

# 이제 다음이 동작함:
# export MYAPP_NAME=myapp
# export MYAPP_PORT=9000
```

### 프리픽스 없이 환경 변수 사용

```python
# 모든 대문자 필드명이 환경 변수가 됨
config = AppConfig.load(env_prefix="")

# NAME=myapp PORT=9000 처럼 사용 가능
```

## 🎯 소스 순서 제어

### 우선순위 커스터마이징

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

# 우선순위: CLI > 환경 > 파일
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["cli", "env", "file"]
)

# 우선순위: 파일 > 환경 > CLI (서버 애플리케이션에 적합)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["file", "env", "cli"]
)

# CLI 제외 (FastAPI 등에서 유용)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]
)
```

## 🧩 실제 사용 사례

### 1. FastAPI 애플리케이션

```python
from fastapi import FastAPI
from confee import ConfigBase
from pydantic import Field

class DatabaseConfig(ConfigBase):
    host: str = "localhost"
    port: int = 5432
    name: str = "mydb"

class AppConfig(ConfigBase):
    title: str = "My API"
    version: str = "1.0.0"
    debug: bool = False
    database: DatabaseConfig

# CLI 없이 로드 (환경 변수와 파일만)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]
)

app = FastAPI(
    title=config.title,
    version=config.version,
    debug=config.debug
)

# 데이터베이스 연결
db_url = f"postgresql://{config.database.host}:{config.database.port}/{config.database.name}"
```

### 2. 마이크로서비스 설정

```python
from confee import ConfigBase
from typing import List

class ServiceConfig(ConfigBase):
    name: str
    port: int
    replicas: int = 1

class ClusterConfig(ConfigBase):
    environment: str
    services: List[ServiceConfig]

# kubernetes 스타일의 환경 변수
config = ClusterConfig.load(
    config_file="cluster.yaml",
    env_prefix="K8S_"
)

for service in config.services:
    print(f"{service.name}: {service.port} (×{service.replicas})")
```

### 3. CLI 도구 (with Typer)

```python
import typer
from confee import ConfigBase

class ToolConfig(ConfigBase):
    output_dir: str = "./output"
    verbose: bool = False
    workers: int = 4

app = typer.Typer()
config = None

@app.callback()
def load_config(
    config_file: str = typer.Option("config.yaml")
):
    global config
    config = ToolConfig.load(config_file=config_file)

@app.command()
def process():
    if config.verbose:
        print(f"Using {config.workers} workers")
    print(f"Output to {config.output_dir}")

if __name__ == "__main__":
    app()
```

## 🧪 테스트에서의 활용

### 테스트 픽스처

```python
from confee import ConfigBase
import pytest

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    timeout: int = 30

@pytest.fixture
def test_config():
    return AppConfig(
        name="test-app",
        debug=True,
        timeout=10
    )

def test_app_with_config(test_config):
    assert test_config.name == "test-app"
    assert test_config.debug is True
    assert test_config.timeout == 10

def test_config_loading():
    config = AppConfig.load(
        config_file="tests/fixtures/test_config.yaml",
        cli_args=["debug=true"],
        strict=True
    )
    assert config.debug is True
```

## 📊 Pydantic 검증 규칙 활용

### 범위 검증

```python
from confee import ConfigBase
from pydantic import Field

class AppConfig(ConfigBase):
    workers: int = Field(ge=1, le=128)      # 1~128
    timeout: float = Field(gt=0, lt=300)    # 0 < timeout < 300
    port: int = Field(ge=1024, le=65535)    # 유효한 포트 범위
```

### 정규식 검증

```python
from confee import ConfigBase
from pydantic import Field

class AppConfig(ConfigBase):
    email: str = Field(pattern=r"[^@]+@[^@]+\.[^@]+")
    version: str = Field(pattern=r"^\d+\.\d+\.\d+$")
```

### 커스텀 검증

```python
from confee import ConfigBase
from pydantic import field_validator

class AppConfig(ConfigBase):
    name: str
    version: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("name cannot be empty")
        return v.strip()

    @field_validator("version")
    @classmethod
    def version_format(cls, v):
        parts = v.split(".")
        if len(parts) != 3:
            raise ValueError("version must be X.Y.Z format")
        return v
```

## 🐛 디버깅과 로깅

### 모든 소스 값 확인

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

config = AppConfig.load(config_file="config.yaml")

# 로드된 값 출력
print(config.model_dump())  # {'name': '...', 'debug': False}
print(config.model_dump_json(indent=2))  # JSON 형식
```

### 상세한 로깅

```python
import logging
from confee import ConfigBase

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

config = AppConfig.load(
    config_file="config.yaml",
    source_order=["cli", "env", "file"]
)

logger.debug(f"Loaded config: {config.model_dump()}")
```

## ✅ 모범 사례

1. **타입 힌트 항상 사용** - IDE 자동완성과 타입 안전성을 위해
2. **환경별 파일 분리** - `dev.yaml`, `prod.yaml`, `test.yaml`
3. **환경 변수 활용** - 배포 환경에서는 CLI 제외
4. **기본값 명시** - 모든 선택적 필드에 기본값 제공
5. **검증 규칙 정의** - Pydantic의 Field와 validator 활용
6. **문서화** - docstring으로 설정 필드 설명

---

**Confee를 통해 더 안전하고 깔끔한 설정 관리를 경험해보세요!**

