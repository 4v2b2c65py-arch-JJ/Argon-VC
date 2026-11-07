# Argon Model API Documentation

## Overview

The Argon model API provides programmatic access to model weight enforcement, MCP routing, feature availability, model bridging, and benchmark scoring.

## Base URL

```
https://api.yamal.argon/v1
```

## Authentication

All endpoints require a Bearer token obtained via Google OAuth2.

```
Authorization: Bearer <google_id_token>
```

## Endpoints

### MCP Router

Route MCP calls through Rust tooling.

`POST /api/v1/mcp`

```json
{
  "method": "mcp.pool.amount",
  "params": { "pool_id": "argon-main", "amount_satoshi": 7000000000 },
  "source": "argon-model"
}
```

### Weight Enforcement

Enforce model weight non-replication rules.

`POST /api/v1/weights/enforce`

```json
{
  "model_id": "google/gemma-2-2b",
  "operation": "export",
  "caller": "user-script"
}
```

Response:

```json
{
  "allowed": false,
  "reason": "model weight export blocked — prevents tier/mesh structure leak"
}
```

### Feature Availability

Check model feature availability with GPL version velocity.

`GET /api/v1/features/{feature_id}`

### Model Bridge

Route requests across OpenAI, Ollama, and llama.cpp.

`POST /api/v1/bridge`

```json
{
  "provider": "open-ai",
  "model": "gpt-5.5",
  "messages": [ { "role": "user", "content": "Hello" } ]
}
```

### Benchmarks

Score benchmark suites against WordPress baseline.

`GET /api/v1/benchmarks`

## Code Languages

Supported frontend code languages: CSS3, React 18, Framer, Python 3.11, Rust, Tailwind.

## Plugin System

The frontend supports modular plugins: code-lang, google-auth, glass-ui, model-bridge, benchmarks, weight-enforcement.
