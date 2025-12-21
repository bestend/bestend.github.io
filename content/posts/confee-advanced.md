---
title: "Advanced Confee Usage"
description: "Advanced features and patterns in Confee"
date: 2025-12-21T11:00:00+09:00
draft: false
tags: ["python", "confee", "configuration", "advanced"]
categories: ["Python Development"]
---

# Advanced Confee Usage

In the previous post, we explored the basic features of Confee. Now let's dive into more powerful capabilities.

## 🔐 Validation Modes (Strict/Non-Strict)

### Strict Mode (Default)

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

# Error when unknown fields are passed!
config = AppConfig.load(
    cli_args=["name=myapp", "unknown_field=true"],
    strict=True  # default
)
# ValidationError raised!
```

### Non-Strict Mode

```python
# Ignore unknown fields
config = AppConfig.load(
    cli_args=["name=myapp", "unknown_field=true"],
    strict=False
)
# unknown_field is ignored, loads normally
print(config.name)  # "myapp"
```

## 🔄 Configuration Inheritance and Merging

### override_with() Method

```python
from confee import ConfigBase

class BaseConfig(ConfigBase):
    app_name: str = "MyApp"
    debug: bool = False
    workers: int = 4

# Partial config
class DevConfig(BaseConfig):
    debug: bool = True
    workers: int = 1

base = BaseConfig(app_name="Production")
dev = DevConfig(app_name="Development")

# Merge with new config
merged = base.override_with(dev)

print(merged.app_name)   # "Development"
print(merged.debug)      # True
print(merged.workers)    # 1
```

## 📁 Advanced File References

### Load External Files

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
print(config.app.secret)  # Contents of secrets/api_key.txt
```

## 🌍 Customizing Environment Variables

### Using Custom Prefix

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    port: int = 8000

# Use MYAPP_ prefix
config = AppConfig.load(env_prefix="MYAPP_")

# Now this works:
# export MYAPP_NAME=myapp
# export MYAPP_PORT=9000
```

### Using Environment Variables Without Prefix

```python
# All uppercase field names become environment variables
config = AppConfig.load(env_prefix="")

# Can use NAME=myapp PORT=9000
```

## 🎯 Controlling Source Order

### Customize Priority

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

# Priority: CLI > Environment > File
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["cli", "env", "file"]
)

# Priority: File > Environment > CLI (suitable for servers)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["file", "env", "cli"]
)

# Exclude CLI (useful for FastAPI)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]
)
```

## 🧩 Real-World Use Cases

### 1. FastAPI Application

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

# Load without CLI (environment and file only)
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]
)

app = FastAPI(
    title=config.title,
    version=config.version,
    debug=config.debug
)

# Database connection
db_url = f"postgresql://{config.database.host}:{config.database.port}/{config.database.name}"
```

### 2. Microservice Configuration

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

# Kubernetes-style environment variables
config = ClusterConfig.load(
    config_file="cluster.yaml",
    env_prefix="K8S_"
)

for service in config.services:
    print(f"{service.name}: {service.port} (×{service.replicas})")
```

### 3. CLI Tool (with Typer)

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

## 🧪 Using in Tests

### Test Fixtures

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

## 📊 Leveraging Pydantic Validation Rules

### Range Validation

```python
from confee import ConfigBase
from pydantic import Field

class AppConfig(ConfigBase):
    workers: int = Field(ge=1, le=128)      # 1~128
    timeout: float = Field(gt=0, lt=300)    # 0 < timeout < 300
    port: int = Field(ge=1024, le=65535)    # Valid port range
```

### Regex Validation

```python
from confee import ConfigBase
from pydantic import Field

class AppConfig(ConfigBase):
    email: str = Field(pattern=r"[^@]+@[^@]+\.[^@]+")
    version: str = Field(pattern=r"^\d+\.\d+\.\d+$")
```

### Custom Validation

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

## 🐛 Debugging and Logging

### Inspect All Source Values

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False

config = AppConfig.load(config_file="config.yaml")

# Print loaded values
print(config.model_dump())  # {'name': '...', 'debug': False}
print(config.model_dump_json(indent=2))  # JSON format
```

### Detailed Logging

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

## ✅ Best Practices

1. **Always use type hints** - For IDE autocomplete and type safety
2. **Separate configs by environment** - `dev.yaml`, `prod.yaml`, `test.yaml`
3. **Leverage environment variables** - Exclude CLI in production
4. **Provide default values** - For all optional fields
5. **Define validation rules** - Use Pydantic Field and validators
6. **Document fields** - Add docstrings to config fields

---

**Experience safer and cleaner configuration management with Confee!**

