# Argon-VC

Argon Model API — full-stack frontend + local Python backend with Google OAuth2
sign-in, server-side sessions, plugin presets, MCP client, rate ticker, chat,
voice, files, calls, accounts, dashboard, shaders, and an installable CLI tool.

## Live Portal

**Vercel production:** https://arvc-indol.vercel.app

## Quick Start (local — frontend + backend together)

The backend serves the frontend, so session cookies work same-origin and no
credentials leak to the browser.

```bash
# 1. Clone the repo
git clone https://github.com/4v2b2c65py-arch-JJ/Argon-VC.git
cd Argon-VC

# 2. Install the Argon CLI into your terminal (from frontend/cli)
cd frontend/cli
npm install -g .
cd ../..

# 3. Set Google OAuth2 env vars (required for sign-in)
#    Never commit these. See docs/auth/google-client-setup.md
$env:ARGON_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID.apps.googleusercontent.com"   # Windows PowerShell
$env:ARGON_GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
$env:ARGON_AUTH_REDIRECT_URI="http://127.0.0.1:8765/auth/google/callback"

# 4. Start the local backend (serves frontend on port 8765)
python -m yamal.api.server

# 5. Open http://127.0.0.1:8765 and sign in with Google
```

## Install the model CLI tool into your terminal

```bash
cd frontend/cli
npm install -g .

argon --help
argon auth login          # Sign in with Google (opens browser)
argon model status        # Check backend status
argon rate check          # Check rate limits
argon mcp route mcp.pool.query --params '{"pool_id":"argon-1"}'
argon usage summary       # Your usage summary
```

Or run the installer directly: `node frontend/cli/install.js`

## Backend API (local Python)

The backend runs on `http://127.0.0.1:8765` and exposes:

| Endpoint | Description |
|---|---|
| `GET /auth/google/login` | Get Google OAuth2 authorize URL (redirect browser there) |
| `GET /auth/google/callback` | OAuth2 callback — sets httpOnly session cookie |
| `POST /auth/logout` | Sign out |
| `GET /auth/me` | Current session |
| `POST /rate/check` | Check rate limit (matches PlanRateLimiter math) |
| `GET /rate/status` | Rate limiter status |
| `POST /mcp/route` | Route an MCP call |
| `GET /mcp/status` | MCP router status |
| `GET /model/status` | Model server status |
| `GET /usage/summary` | Usage summary |
| `GET /billing/plans` | Billing plans |
| `GET /api/openapi/{spec_id}` | OpenAPI spec |

## Google OAuth2 (no credentials leaked)

- `ARGON_GOOGLE_CLIENT_ID` and `ARGON_GOOGLE_CLIENT_SECRET` are read from
  environment variables on the backend only.
- The frontend never sees the client secret or raw ID token.
- Sessions are server-side; browsers hold only an httpOnly `argon_session`
  cookie (7-day TTL).
- Full setup: `docs/auth/google-client-setup.md`

## Plugin presets (~50 built-in connectors)

Google Drive, Supabase, GitHub, Notion, Shopify, Firecrawl, Runway Dev,
iCloud Mail/Calendar, Magnific, Higgsfield, Tripo 3D, Figma, Atlassian,
Stripe, Dropbox, Slack, Zoom, Outlook/Gmail/Calendar, Linear, ClickUp,
Trello, Todoist, Asana, Airtable, Evernote, OneNote, HeyGen, Descript,
Synthesia, ElevenLabs, Exa, Tavily, Perplexity, Hugging Face, OpenAI,
Vercel, Railway, Render, Netlify, AWS, MongoDB, PlanetScale, ClickHouse,
and more. Each installs via git-client auto-install from the frontend.

## Model benchmarks — wiki data & how-to

- `docs/benchmarks/README.md` — 18 benchmark suites across 10 categories
- `docs/benchmarks/HOWTO.md` — step-by-step benchmark how-to
- Subreddit: r/ArgonModelBenchmarks
- Argon composite average ~80.75 vs WordPress baseline 45.0

## Frontend only (Vercel)

The `argon-frontend-deploy/` folder is the static frontend deployed to Vercel.
It connects to your local backend via `ARGON_BACKEND_URL` (defaults to
`http://127.0.0.1:8765`).

Frontend only. No backend code is included in the deployed frontend repo.
Fair API pricing (live, configurable via POST /usage/pricing)

local_free (self-hosted): $0.000 / 1k tokens, $0.000 / request (999,999/mo included)
community: $0.0005 / 1k tokens, $0.0001 / request (10k/mo included)
standard: $0.002 / 1k tokens, $0.001 / request
pro: $0.005 / 1k tokens, $0.002 / request
Principle: local inference is free; metering applies only to shared/remote node usage. Transparent, no hidden fees.

---

## QB Protocol Bridge (Node Directive) — Fair Pricing, Usage & Dataset

**Auto-provisioning (broad spectrum):** Argon API is auto-provisioned under *all* model subsets — not just Argon. Subsets: `local` (GGUF/ensemble), `openai` (GPT/Verios-class), `anthropic` (Claude), `nemotron` (NVIDIA Nemotron), `huggingface`, `argon/vercel` (portal), `all`. Check: `GET /argon/provision/status`, `POST /argon/provision/auto`, `GET /argon/subsets`. Credentials stay in env vars only (no secrets in git/API responses).

This repo’s Vercel portal (`https://arvc-indol.vercel.app`) can connect to a local/remote **QB Protocol** bridge for unified model access, mesh pooling, and metered usage — **without leaking credentials**.

### Connect (no credentials in git/frontend)
- Set backend at runtime: `?backend=https://<your-authenticated-tunnel>` (or inject `window.ARGON_CONFIG.backendUrl`). Default local: `http://127.0.0.1:17760`.
- Required header for QB Protocol bridge: `X-Protocol-Version: 2`.
- Optional auth: `Authorization: Bearer <ARGON_API_TOKEN>` (set via secure tunnel/session; never commit tokens).
- Node auto-connect: `GET /node/directive` → `POST /node/register` `{name, endpoint, capabilities, token?}` → `POST /node/{id}/heartbeat`.

### Fair API Pricing (transparent, configurable)
Source of truth: `GET /usage/pricing`. Local inference is free; metering applies only to shared/remote node usage.

| Tier | Label | $ / 1k tokens | $ / request | Included monthly requests |
|---|---|---:|---:|---:|
| `local_free` | Local device (self-hosted) | 0.0000 | 0.0000 | 999,999 |
| `community` | Community node | 0.0005 | 0.0001 | 10,000 |
| `standard` | Standard API | 0.0020 | 0.0010 | 0 |
| `pro` | Pro API | 0.0050 | 0.0020 | 0 |

Wallet/ledger (no private keys stored): `GET /wallet/status`, `GET /wallet/balance/{node_id}`, `POST /wallet/credit`, `POST /wallet/usage` `{node_id,tokens,requests,tier}`, `GET /wallet/transactions`.

### API Usage Pattern (for nodes/CLI/portal)
```bash
# Status & registry
curl -H "X-Protocol-Version: 2" $ARGON_BACKEND_URL/model/status
curl -H "X-Protocol-Version: 2" $ARGON_BACKEND_URL/models/registry
curl -H "X-Protocol-Version: 2" $ARGON_BACKEND_URL/models/all

# MCP/model routing
curl -H "X-Protocol-Version: 2" -H "Content-Type: application/json" \
  -d '{"method":"mcp.registry.list","params":{}}' $ARGON_BACKEND_URL/mcp/route

# Mesh pool (user base, tasks, shared data, inter-node datapassage)
curl -H "X-Protocol-Version: 2" $ARGON_BACKEND_URL/pool/status
# POST /pool/users/upsert, /pool/tasks/append|claim, /pool/tasks/{id}/complete
# POST /pool/data, GET /pool/data/{key}, POST /pool/mesh/link
```

### Current Machine Dataset / Model Footprint (reference snapshot)
Measured on the reference node (update via `/models/registry/rescan` + `du` as models change):

| Location | Size | Real model files (>=1MB) | Notes |
|---|---:|---:|---|
| `qb_protocol/models` | **1.3 GB** | **1** | `tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf` (~637.81 MB) |
| `speed/Gnu-3.4-console-edition/alien ware/gnu 3.4` | **544 KB** | **0** | 22 `.gguf` entries present; currently stub/small (<1MB), discovered but not loadable as weights |
| Unified registry (live) | — | **7 providers / 31 model entries** | Categories: `local_gguf`, `openai`, `anthropic`, `nemotron`, `huggingface`, `vercel`; credential status only |

*Credential safety:* registry exposes only env var names + configured booleans. Never commit `.env`, API keys, tokens, or wallet secrets.
