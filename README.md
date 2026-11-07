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
