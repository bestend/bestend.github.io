---
title: "Introduction to Confee"
date: 2025-12-21T09:00:00+09:00
---

**Confee** is a type-safe configuration management library for Python applications.

## Why Confee?

Configuration management in Python can be challenging:

- Reading YAML/JSON files as dictionaries loses type information
- Managing environment variables, CLI arguments, and files is complex
- Runtime errors when configuration changes

## Key Features

### Type Safety with Pydantic V2

```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    port: int = 8000

config = AppConfig.load(config_file="config.yaml")
print(config.name)  # Full IDE support
```

### Multi-Source Support

Combine YAML files, environment variables, and CLI arguments:

```python
config = AppConfig.load(
    config_file="config.yaml",
    source_order=["cli", "env", "file"]
)
```

### Nested Configuration

```python
class DatabaseConfig(ConfigBase):
    host: str = "localhost"
    port: int = 5432

class AppConfig(ConfigBase):
    database: DatabaseConfig

config = AppConfig.load(config_file="config.yaml")
print(config.database.host)
```

## Installation

```bash
pip install confee
```

## Quick Start

1. Define configuration:

```python
from confee import ConfigBase

class MyConfig(ConfigBase):
    app_name: str
    debug: bool = False
```

2. Create config.yaml:

```yaml
app_name: MyApp
debug: false
```

3. Load and use:

```python
config = MyConfig.load(config_file="config.yaml")
print(f"App: {config.app_name}")
```

## Learn More

- GitHub: [github.com/bestend/confee](https://github.com/bestend/confee)
- PyPI: [pypi.org/project/confee/](https://pypi.org/project/confee/)

