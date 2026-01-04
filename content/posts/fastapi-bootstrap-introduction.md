---
title: "Introduction to FastAPI Bootstrap"
date: 2026-01-04
---

**FastAPI Bootstrap** is a production-ready toolkit that adds essential features to your FastAPI applications, including smart logging, standardized exception handling, and request tracing.

## Why FastAPI Bootstrap?

Building production FastAPI applications requires:
- Structured logging with request context
- Consistent error responses
- Request tracing across services
- Standardized API responses

**FastAPI Bootstrap** provides all of these out of the box with minimal configuration.

## Key Features

### Smart Logging with Context

Automatic request context in every log:

```python
from fastapi import FastAPI
from fastapi_bootstrap import bootstrap

app = FastAPI()
bootstrap(app)

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    logger.info("Fetching user")  # Includes request_id, method, path
    return {"user_id": user_id}
```

Logs automatically include:
- Request ID for tracing
- HTTP method and path
- Client IP address
- User agent

### Standardized Exception Handling

Automatic conversion of exceptions to consistent JSON responses:

```python
from fastapi_bootstrap.exceptions import NotFoundError

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    if item_id not in items:
        raise NotFoundError(f"Item {item_id} not found")
    return items[item_id]
```

Response format:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Item 123 not found",
    "request_id": "abc-123-def"
  }
}
```

### Request Tracing

Built-in request ID tracking for distributed tracing:

```python
from fastapi import Request

@app.get("/trace")
async def trace_request(request: Request):
    request_id = request.state.request_id
    # Use for logging, external API calls, etc.
    return {"request_id": request_id}
```

### Response Standardization

Consistent response format across your API:

```python
from fastapi_bootstrap import SuccessResponse

@app.get("/data")
async def get_data():
    return SuccessResponse(
        data={"items": [1, 2, 3]},
        message="Data retrieved successfully"
    )
```

## Installation

```bash
pip install fastapi-bootstrap
```

## Quick Start

### Basic Setup

```python
from fastapi import FastAPI
from fastapi_bootstrap import bootstrap

app = FastAPI()

# Apply all features
bootstrap(app)

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Custom Configuration

```python
from fastapi_bootstrap import BootstrapConfig, bootstrap

config = BootstrapConfig(
    log_level="INFO",
    enable_request_logging=True,
    cors_enabled=True,
    cors_origins=["https://example.com"]
)

bootstrap(app, config=config)
```

### Using Built-in Exceptions

```python
from fastapi_bootstrap.exceptions import (
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
)

@app.post("/users")
async def create_user(email: str):
    if not is_valid_email(email):
        raise BadRequestError("Invalid email format")
    
    if user_exists(email):
        raise ConflictError("User already exists")
    
    return SuccessResponse(data=create_user(email))
```

## Learn More

- **GitHub:** [github.com/bestend/fastapi-bootstrap](https://github.com/bestend/fastapi-bootstrap)
- **PyPI:** [pypi.org/project/fastapi-bootstrap/](https://pypi.org/project/fastapi-bootstrap/)
- **Documentation:** Full examples and API reference available in the repository
