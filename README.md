# Argon-VC

Argon Model API Frontend — Vue 3 + React 18 glass UI landing page with plugin presets, MCP client, rate ticker, chat, voice, files, calls, accounts, dashboard, and shaders.

## Live Portal

**Vercel deployment:** https://brisk-poplar-0dnm3mc.tmp.now

> Temporary deployment — expires in 60 minutes. Claim it at https://vercel.com/claim-deployment?code=ecb3268a-6b17-4c70-86b7-07f5e060b0f8 to keep it, or run `vercel login` and `vercel` to make it permanent.

## Deploy

This is a pure frontend (HTML + Tailwind CDN + Vue/React via CDN). No build step required.

**Option 1: Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. From this folder: `vercel`
3. Follow the prompts to deploy.

**Option 2: GitHub Pages**
1. Push this repo to GitHub.
2. Enable GitHub Pages in repo settings → source: main branch / root folder.

**Option 3: Any static server**
```
python -m http.server 8080
# open http://localhost:8080
```

## What's included

- Landing page + API docs + plugins + code-lang sections
- Vue 3 components mounted on top of React 18 (CDN)
- Rate ticker synced to PlanRateLimiter math (RPM/TPM/concurrent calls)
- Plugin presets (~50 built-in connectors: Google Drive, Supabase, GitHub, Notion, Shopify, Firecrawl, Runway, iCloud Mail/Calendar, Magnific, Higgsfield, Tripo 3D, Figma, Atlassian, Stripe, Dropbox, Slack, Zoom, Outlook/Gmail/Calendar, Linear, ClickUp, Trello, Todoist, Asana, Airtable, Evernote, OneNote, HeyGen, Descript, Synthesia, ElevenLabs, Exa, Tavily, Perplexity, Hugging Face, OpenAI, Vercel, Railway, Render, Netlify, AWS, MongoDB, PlanetScale, ClickHouse, and more) with git-client auto-install
- Custom plugin manager (add your own via git URL)
- MCP client (router status, test calls, git-based MCP server install)
- Chat, Voice, Files, Calls, Accounts, Dashboard, UVX Shaders

Frontend only. No backend code is included in this repo.
