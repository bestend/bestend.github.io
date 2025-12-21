---
title: "Introduction to Confee - Type-Safe Configuration Management"
description: "Confee library features and how to use it"
date: 2025-12-21T09:00:00+09:00
slug: "confee-introduction"
draft: false
tags: ["python", "confee", "configuration", "pydantic"]
categories: ["Python Development"]
---

# Introduction to Confee - Type-Safe Configuration Management

Hello! Today, I'd like to introduce **Confee**, a configuration management library I developed.

## 🤔 Why I Created Confee

When developing Python applications, configuration management has always been challenging:

- 😕 Reading YAML/JSON files as dictionaries loses type information
- 😤 Managing priorities of environment variables, CLI arguments, and configuration files is complex
- 😩 High risk of runtime errors when configuration changes

Existing solutions like **Hydra** and **OmegaConf** are powerful, but require significant boilerplate code.

## ✨ Key Features of Confee

### 1. **Type Safety** (with Pydantic V2)

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    workers: int = 4

config = AppConfig.load(config_file="config.yaml")

# IDE autocomplete support!
print(config.name)    # str
print(config.debug)   # bool
print(config.workers) # int
```

### 2. **Multi-Source Support**

Manage all configurations from one place:

```python
# config.yaml
name: my-app
debug: false
workers: 8
```

```bash
# Override with environment variables
export CONFEE_DEBUG=true
export CONFEE_WORKERS=16

# Override with CLI arguments
python app.py debug=true workers=32
```

### 3. **Nested Configuration Structure**

```python
class DatabaseConfig(ConfigBase):
    host: str = "localhost"
    port: int = 5432

class AppConfig(ConfigBase):
    name: str
    database: DatabaseConfig

# Access with dot notation
# python app.py database.host=prod.db database.port=3306
```

### 4. **File Reference Support**

```yaml
# config.yaml
name: my-app
api_key: "@file:secrets/api_key.txt"
database_config: "@config:configs/database.yaml"
```

### 5. **Auto Help Generation**

```bash
python app.py --help

# Automatically displays all configuration options and defaults!
```

## 🚀 Getting Started

### Installation

```bash
pip install confee
# or
uv pip install confee
```

### Basic Usage

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    app_name: str
    debug: bool = False
    port: int = 8000

# Load configuration
config = AppConfig.load(config_file="config.yaml")

# Access type-safely
if config.debug:
    print(f"Debug mode enabled on {config.app_name}")
```

## 📊 Feature Comparison

| Feature | Confee | Hydra | OmegaConf |
|---------|--------|-------|-----------|
| Pydantic Integration | ✅ | ⚠️ | ❌ |
| Type Safety | ✅ | ❌ | ❌ |
| Auto Help | ✅ | ⚠️ | ❌ |
| Simple API | ✅ | ❌ | ⚠️ |
| Nested Field Access | ✅ | ✅ | ✅ |

## 🎯 Use Cases

### Using with FastAPI

```python
from fastapi import FastAPI
from confee import ConfigBase

class AppConfig(ConfigBase):
    title: str = "My API"
    debug: bool = False

config = AppConfig.load(
    config_file="config.yaml",
    source_order=["env", "file"]  # Exclude CLI
)

app = FastAPI(title=config.title, debug=config.debug)
```

### Environment-Specific Configuration

```python
import os
from confee import ConfigBase

env = os.getenv("APP_ENV", "dev")
config = AppConfig.load(config_file=f"{env}.yaml")
```

### Configuration Validation

```python
from pydantic import Field

class AppConfig(ConfigBase):
    workers: int = Field(ge=1, le=128)  # 1~128 range
    timeout: float = Field(gt=0)         # Positive only
```

## 📈 Release Information

**Current Version: 0.1.2** (2025-12-21)

### Latest Features (0.1.2)
- ✅ Initial stable release
- ✅ Full Pydantic V2 support
- ✅ Multi-source configuration (file/environment/CLI)
- ✅ Dot notation nested field access
- ✅ File reference support (@file:, @config:)
- ✅ Configuration inheritance (override_with())
- ✅ Strict/non-strict validation modes
- ✅ Auto help generation
- ✅ 91% code coverage (116 tests)

## 🔗 Learn More

- 📖 [GitHub Repository](https://github.com/bestend/confee)
- 📦 [PyPI Package](https://pypi.org/project/confee/)
- 📚 [Comparison Document](https://github.com/bestend/confee/blob/main/comparison.md)
- 🏗️ [Development Guide](https://github.com/bestend/confee/blob/main/development.md)

---

**In the next post, I'll explore Confee's advanced features in detail!**

