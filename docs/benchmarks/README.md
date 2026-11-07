# Model Benchmarks — Wiki Data & How-To

This directory contains subreddit-style wiki data and a how-to guide for the
Argon model benchmark suites. It is meant to be the canonical reference that a
userbase can read before running benchmarks, and it maps directly to the
benchmark suites implemented under `yamal/benchmark/`.

## Benchmark suites (18 total across 10 categories)

| Category | Suites | What it measures |
|---|---|---|
| Query | `query_frequency` | Query frequency tracking and update cycles |
| Dataset | `dataset_update_cycle` | Dataset freshness and update cadence |
| Element | `element_footer_matcher` | UI element/footer matching accuracy |
| Session | `session_frequency_assigner` | Session assignment and frequency |
| Recall | `recall_memory` | Model recall and memory retention |
| Hardware | `hardware_profile` | Hardware profiling and scoring |
| Scorer | `benchmark_scorer` | Composite scoring vs WordPress baseline |
| Design | `design_comparison` | Design pattern comparisons |
| Architecture | `architecture` | Model architecture analysis |
| FLOPS | `flops_analysis` | Floating-point operations analysis |

## How to use

```bash
# Start the backend
python -m yamal.api.server

# Check rate limits before benchmarking
argon rate check

# Run a benchmark suite via MCP
argon mcp route mcp.benchmark.run --params '{"suite":"benchmark_scorer"}'

# View scores
argon usage summary
```

### Composite score reference

The `BenchmarkScorer` produces an argon composite average (~80.75) compared
against a WordPress baseline (45.0). Higher is better.

## Subreddit / wiki data

Model benchmark discussion and wiki data live in the Argon community:

- Subreddit: r/ArgonModelBenchmarks
- Wiki: https://github.com/4v2b2c65py-arch-JJ/Argon-VC/wiki/Model-Benchmarks

Contribute benchmark results, hardware profiles, and suite configurations there.

## Files

- `HOWTO.md` — step-by-step benchmark how-to
- `SUITES.md` — per-suite reference (parameters, expected outputs)
- `SCORING.md` — scoring methodology (argon composite vs baselines)
