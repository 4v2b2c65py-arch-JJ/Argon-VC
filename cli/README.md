# Argon CLI — Install the Model CLI Tool Into Your Terminal

Install the Argon model CLI so you can run benchmarks, rate checks, MCP calls,
and model management directly from your terminal.

## Quick install

```bash
# From the frontend/cli directory
npm install -g .

# Or run the installer directly
node frontend/cli/install.js
```

## Usage

```bash
argon --help
argon auth login          # Sign in with Google (opens browser)
argon model status        # Check backend status
argon rate check          # Check rate limits
argon rate status         # Full rate limiter status
argon rate plan pro       # Set your plan to pro
argon mcp route mcp.pool.query --params '{"pool_id":"argon-1"}'
argon mcp status          # MCP router status
argon usage summary       # Your usage summary
argon billing plans       # Available billing plans
argon api specs           # List API specs
argon health              # Health check
argon auth logout         # Sign out
```

## Backend

The CLI talks to the local Argon backend:

```bash
python -m yamal.api.server   # starts on http://127.0.0.1:8765
```

Set `ARGON_BACKEND_URL` to point at a remote backend:

```bash
export ARGON_BACKEND_URL=https://your-backend.example.com
```

## Google OAuth2

Set `ARGON_GOOGLE_CLIENT_ID` and `ARGON_GOOGLE_CLIENT_SECRET` environment
variables. See `docs/auth/google-client-setup.md`.

## Benchmarks / Wiki

See `docs/benchmarks/` for model benchmark how-to, suite reference, and
subreddit wiki data.
