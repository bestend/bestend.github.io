---
title: "Introduction to kd (Kidsnote Downloader)"
date: 2026-01-11
---

**kd** is a CLI tool that bulk downloads your child's album photos and videos from Kidsnote.

> **Note:** This tool is designed for Korean users. Kidsnote is a childcare communication app widely used in Korean kindergartens and daycares.

## Why kd?

Kidsnote stores precious memories of your children at daycare, but there's no easy way to back them up. Manually downloading hundreds of photos one by one is painful.

**kd** solves this with a simple command-line interface.

## Key Features

- One-line installation
- Browser automation for easy login
- Multi-child support with automatic name detection
- Fast async downloads (up to 20 concurrent)
- Auto-organize by date (`YYYY/MM/DD`)
- Skip already downloaded files

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/bestend/kidsnote/main/install.sh | bash
```

## Quick Start

```bash
# 1. Login (opens browser)
kd login

# 2. Set download path
kd config

# 3. Fetch album list
kd fetch

# 4. Download all
kd download
```

## Learn More

- **GitHub:** [github.com/bestend/kidsnote](https://github.com/bestend/kidsnote)
