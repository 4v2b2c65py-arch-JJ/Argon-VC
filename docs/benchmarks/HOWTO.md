# Model Benchmark How-To

Step-by-step guide to running Argon model benchmarks.

## Prerequisites

- Python 3.11+
- Backend running: `python -m yamal.api.server`
- Argon CLI installed: `npm install -g .` (from `frontend/cli/`)
- Authenticated: `argon auth login`

## Run a benchmark

```bash
# 1. Start backend (in one terminal)
python -m yamal.api.server

# 2. Sign in (opens browser for Google OAuth2)
argon auth login

# 3. Check you're within rate limits
argon rate check

# 4. Run the composite scorer benchmark
argon mcp route mcp.benchmark.run --params '{"suite":"benchmark_scorer"}'

# 5. View your usage summary
argon usage summary
```

## Available suites via MCP

| Suite | MCP method | Description |
|---|---|---|
| benchmark_scorer | `mcp.benchmark.run` | Composite argon score vs WordPress baseline |
| hardware_profile | `mcp.hardware.profile` | Hardware profiling |
| query_frequency | `mcp.query.frequency` | Query frequency tracking |
| dataset_update | `mcp.dataset.update_cycle` | Dataset freshness |
| recall_memory | `mcp.recall.memory` | Recall/memory retention |

## Interpreting results

- Argon composite average: ~80.75
- WordPress baseline: 45.0
- Anything above baseline indicates the Argon model outperforms the reference.

## Subreddit wiki

Share results and discuss at r/ArgonModelBenchmarks.
