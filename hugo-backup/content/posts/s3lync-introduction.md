---
title: "Introduction to s3lync"
date: 2026-01-04
---

**s3lync** is a Pythonic library that bridges the gap between AWS S3 and your local filesystem, allowing you to work with S3 objects as if they were local files.

## Why s3lync?

Working with S3 in Python typically requires:
- Manually handling downloads and uploads
- Writing custom caching logic
- Managing file synchronization
- Tracking which files have changed

**s3lync** solves all of these problems with a simple, intuitive interface.

## Key Features

### Pythonic API

Work with S3 objects using familiar Python patterns:

```python
from s3lync import S3Object

# Simple file operations
obj = S3Object("s3://my-bucket/data.json")
data = obj.read()  # Automatically downloads if needed
obj.write(new_data)  # Automatically uploads changes
```

### Automatic Synchronization

Files are automatically synced between S3 and your local cache:

```python
# First access: downloads from S3
obj = S3Object("s3://bucket/file.txt")
content = obj.read()

# Subsequent accesses: uses local cache
content = obj.read()  # Fast! Uses cached version

# Changes are automatically uploaded
obj.write("new content")  # Uploads to S3
```

### Smart Caching with Hash Verification

Built-in MD5 hash verification ensures data integrity:

```python
obj = S3Object("s3://bucket/important-data.csv")
obj.sync(force=True)  # Force sync with hash verification
```

### Async Support

Fully async/await compatible for high-performance applications:

```python
from s3lync import AsyncS3Object

async def process_file():
    obj = AsyncS3Object("s3://bucket/large-file.json")
    data = await obj.read()
    await obj.write(processed_data)
```

## Installation

```bash
# Basic installation
pip install s3lync

# With async support
pip install s3lync[async]
```

## Quick Start

```python
from s3lync import S3Object

# Read from S3
obj = S3Object("s3://my-bucket/config.json")
config = obj.read()

# Write to S3
obj.write('{"updated": true}')

# Check sync status
if obj.needs_sync():
    obj.sync()
```

### Working with Directories

```python
from s3lync import S3Directory

# Sync entire directory
s3_dir = S3Directory("s3://bucket/models/")
s3_dir.download()  # Download all files

# Access files
for s3_obj in s3_dir.objects:
    data = s3_obj.read()
```

### Integration with pathlib

```python
from s3lync import S3Object
import pandas as pd

obj = S3Object("s3://bucket/data.csv")
df = pd.read_csv(obj.__fspath__())  # Works seamlessly!
```

## Learn More

- **GitHub:** [github.com/bestend/s3lync](https://github.com/bestend/s3lync)
- **PyPI:** [pypi.org/project/s3lync/](https://pypi.org/project/s3lync/)
- **Documentation:** Full examples and API reference available in the repository
