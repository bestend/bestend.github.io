---
title: "Confee 0.1.2 Release Notes"
description: "Announcing Confee's first stable release"
date: 2025-12-21T10:00:00+09:00
draft: false
tags: ["confee", "release", "python"]
categories: ["Open Source"]
---

# Confee 0.1.2 - First Stable Release 🎉

Welcome! **Confee 0.1.2** is the project's first official stable release.

## 🎯 Release Highlights

This release provides a complete feature set:

### ✨ Core Features
- **Type-safe configuration management** - Perfect integration with Pydantic V2
- **Multi-source support** - Flexible combination of YAML/JSON files, environment variables, and CLI arguments
- **Nested configuration** - Deep field access using dot notation
- **File references** - Dynamic loading with `@file:` and `@config:` prefixes
- **Configuration inheritance** - Merge configurations with `override_with()` method
- **Validation modes** - Strict or non-strict validation

### 🎓 Developer Experience
- **Auto help generation** - Display all options and defaults with `--help` flag
- **Color-coded terminal output** - Easy-to-read error messages
- **Custom environment prefix** - Use `CONFEE_` or your own prefix
- **Flexible source order** - Control priority of file/environment/CLI

## 📊 Quality Metrics

| Metric | Value |
|--------|-------|
| Code Coverage | **91%** |
| Test Cases | **116** |
| Python Version | 3.8+ |
| Main Dependencies | Pydantic V2, Typer |

## 🚀 Key Improvements

### Python 3.9 Compatibility
Improved type hint compatibility for Python 3.9:
```python
# ✅ Now works on Python 3.9
class Config(ConfigBase):
    optional_value: Optional[str] = None
```

### Flexible Tag Patterns
GitHub release tags are now more flexible:
- ✅ `v0.1.2` format
- ✅ `0.1.2` format

Both are recognized automatically!

## 📚 Documentation & Resources

Complete documentation provided with this release:

### 📖 Official Documentation
- **README** - Quick start guide and basic usage
- **Comparison with OmegaConf** - Confee vs OmegaConf analysis
- **Development Guide** - Project contribution guide

### 🌐 Language Support
- **English** - English documentation
- **한국어** - Korean documentation (README.ko.md)

## 🔧 Installation

### Using pip
```bash
pip install confee
```

### Using uv
```bash
uv pip install confee
```

### From source (development)
```bash
git clone https://github.com/bestend/confee.git
cd confee
pip install -e .
```

## 📝 Usage Examples

### Basic Configuration Loading
```python
from confee import ConfigBase

class AppConfig(ConfigBase):
    name: str
    debug: bool = False
    workers: int = 4

# Auto load from file, environment, and CLI
config = AppConfig.load(config_file="config.yaml")
```

### Control Multi-Source Priority
```python
# CLI has highest priority
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
    name: str
    database: DatabaseConfig

# Use from CLI
# python app.py database.host=prod.db
```

## 🎉 Thank You

A big thank you to everyone who made this release possible:
- **Pydantic team** - Excellent validation library
- **Typer team** - Inspiration for CLI implementation
- **All testers and feedback providers** - Continuous improvement

## 🔮 Future Plans

Features planned for upcoming releases:

- [ ] TOML file support
- [ ] Enhanced plugin system
- [ ] Configuration templates and generators
- [ ] Web-based configuration UI
- [ ] More examples and tutorials

## 🤝 How to Contribute

Want to contribute to Confee?

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Submit a Pull Request

See [Development Guide](https://github.com/bestend/confee/blob/main/development.md) for details.

## 📞 Feedback

Have questions or suggestions?

- 🐛 **Issues**: [GitHub Issues](https://github.com/bestend/confee/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/bestend/confee/discussions)
- 📧 **Email**: Contact via issue tracker

---

**Download Confee 0.1.2 and enter the world of type-safe configuration management!**

👉 [Install from PyPI](https://pypi.org/project/confee/)
👉 [GitHub Repository](https://github.com/bestend/confee)

