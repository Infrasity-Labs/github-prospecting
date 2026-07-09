<div align="center">

# GitHub Prospecting

**Automated discovery and tracking of GitHub repositories in a target market.**

Search, enrich, snapshot. Watch a competitive landscape evolve over time and catch new entrants the day they appear.

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/storage-SQLite-003B57?logo=sqlite&logoColor=white)
![GitHub API](https://img.shields.io/badge/data-GitHub%20REST%20API-181717?logo=github&logoColor=white)
![Dependencies](https://img.shields.io/badge/dependencies-1-brightgreen)

</div>

---

## Table of contents

- [Overview](#overview)
- [Results](#results)
- [How it works](#how-it-works)
- [Quick start](#quick-start)
- [Usage](#usage)
  - [Full pipeline](#full-pipeline)
  - [Fast mode](#fast-mode-discover-only)
- [Configuration](#configuration)
- [Data model](#data-model)
- [Project layout](#project-layout)
- [Rate limits](#rate-limits)
- [Troubleshooting](#troubleshooting)

## Overview

GitHub Prospecting is a small, dependency-light Node.js pipeline for competitive intelligence on GitHub. Point it at **any market segment** with `--keywords "your, terms"` — queries are generated automatically — or hand-tune a query list for precision (the repo ships with a tuned list targeting the **AI agent / LLM memory** space as a working example). Then run it on a schedule. Each run:

1. Discovers every public repository matching your queries
2. Enriches each candidate with deep metadata (activity, contributors, releases, README)
3. Persists a **dated snapshot** to SQLite and exports a star-ranked CSV

Because every run is a snapshot keyed by date, the database becomes a time series: you can chart star growth, spot momentum shifts, and get an explicit list of repos that are **new since the last run**.

**Design principles**

- **Config over code.** Retargeting to a different market is one `--keywords` flag; deeper tuning (queries, thresholds, exclusions) lives in three JSON files. Zero code changes either way.
- **Degrade, never abort.** A failed endpoint yields a `null` field, not a crashed run. Long runs survive rate limits by sleeping until the limit resets.
- **One dependency.** `better-sqlite3` for storage. Everything else is Node.js built-ins.

## Results

Latest snapshot (2026-07-09), from a run with `--keywords "llm observability"`. Prospects are grouped by the search query that discovered them, so you can see exactly what each keyword-derived query surfaces. Repos are deduplicated across queries — each appears only under the query that found it first. Regenerated from `competitors.csv` after each run.

### `topic:llm-observability` — 100 prospects

<details>
<summary><strong>Show table</strong></summary>

| # | Repository | Stars | Language | Last push | Description | Website |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | [langfuse/langfuse](https://github.com/langfuse/langfuse) | 30,764 | TypeScript | 2026-07-08 | 🪢 Open source AI engineering platform: LLM evals, observability, metrics, prompt management, playground, datasets. Integrates with OpenTelemetry, LangChain, OpenAI SDK, LiteLLM, and more. 🍊YC W23 | [langfuse.com](https://langfuse.com) |
| 2 | [comet-ml/opik](https://github.com/comet-ml/opik) | 20,442 | Python | 2026-07-09 | Debug, evaluate, and monitor your LLM applications, RAG systems, and agentic workflows with comprehensive tracing, automated evaluations, and production-ready dashboards. | [www.comet.com/docs/opik](https://www.comet.com/docs/opik/) |
| 3 | [VoltAgent/voltagent](https://github.com/VoltAgent/voltagent) | 9,995 | TypeScript | 2026-07-09 | AI Agent Engineering Platform built on an Open Source TypeScript AI Agent Framework | [voltagent.dev](https://voltagent.dev) |
| 4 | [mnfst/manifest](https://github.com/mnfst/manifest) | 7,221 | TypeScript | 2026-07-08 | Connect Your Agents And Harnesses With Any Provider 🦚 | [manifest.build](https://manifest.build) |
| 5 | [maximhq/bifrost](https://github.com/maximhq/bifrost) | 6,379 | Go | 2026-07-09 | Fastest enterprise AI gateway (50x faster than LiteLLM) with adaptive load balancer, cluster mode, guardrails, 1000+ models support & <100 µs overhead at 5k RPS. | [www.getmaxim.ai/bifrost](https://www.getmaxim.ai/bifrost) |
| 6 | [Helicone/helicone](https://github.com/Helicone/helicone) | 5,922 | TypeScript | 2026-07-05 | 🧊 Open source LLM observability platform. One line of code to monitor, evaluate, and experiment. YC W23 🍓 | [www.helicone.ai](https://www.helicone.ai) |
| 7 | [coze-dev/coze-loop](https://github.com/coze-dev/coze-loop) | 5,597 | Go | 2026-07-08 | Next-generation AI Agent Optimization Platform: Cozeloop addresses challenges in AI agent development by providing full-lifecycle management capabilities from development, debugging, and evaluation to monitoring. |  |
| 8 | [latitude-dev/latitude-llm](https://github.com/latitude-dev/latitude-llm) | 4,397 | TypeScript | 2026-07-09 | Latitude is the open-source ai monitoring platform. | [latitude.so](https://latitude.so) |
| 9 | [pydantic/logfire](https://github.com/pydantic/logfire) | 4,355 | Python | 2026-07-09 | AI observability platform for production LLM and agent systems. | [pydantic.dev/logfire](https://pydantic.dev/logfire/) |
| 10 | [Agenta-AI/agenta](https://github.com/Agenta-AI/agenta) | 4,277 | TypeScript | 2026-07-08 | The open-source LLMOps platform: prompt playground, prompt management, LLM evaluation, and LLM observability all in one place. | [www.agenta.ai](http://www.agenta.ai) |
| 11 | [memodb-io/Acontext](https://github.com/memodb-io/Acontext) | 3,571 | JavaScript | 2026-06-30 | Agent Skills as a Memory Layer | [acontext.io](https://acontext.io) |
| 12 | [lmnr-ai/lmnr](https://github.com/lmnr-ai/lmnr) | 3,073 | TypeScript | 2026-07-09 | Laminar - open-source observability platform purpose-built for AI agents. YC S24. | [laminar.sh](https://laminar.sh) |
| 13 | [JudgmentLabs/judgeval](https://github.com/JudgmentLabs/judgeval) | 1,038 | Python | 2026-07-07 | The Continuous-Improvement Stack for Agents. Our environment data and evals power agent improvement and monitoring. | [judgmentlabs.ai](https://judgmentlabs.ai/) |
| 14 | [traceroot-ai/traceroot](https://github.com/traceroot-ai/traceroot) | 657 | TypeScript | 2026-07-09 | TraceRoot - open-source observability and self-healing layer for AI agents. YC S25 | [traceroot.ai](https://traceroot.ai) |
| 15 | [evilmartians/agent-prism](https://github.com/evilmartians/agent-prism) | 369 | TypeScript | 2026-07-08 | React components for visualizing traces from AI agents | [storybook.agent-prism.evilmartians.io/?utm_source=github&utm_medium=social](https://storybook.agent-prism.evilmartians.io/?utm_source=github&utm_medium=social) |
| 16 | [Justin0504/Aegis](https://github.com/Justin0504/Aegis) | 363 | TypeScript | 2026-07-08 | Runtime policy enforcement for AI agents. Cryptographic audit trail, human-in-the-loop approvals, kill switch. Zero code changes. |  |
| 17 | [palico-ai/palico-ai](https://github.com/palico-ai/palico-ai) | 343 | TypeScript | 2024-11-26 | Build, Improve Performance, and Productionize your AI Application | [www.palico.ai](https://www.palico.ai/) |
| 18 | [databufflabs/databuff](https://github.com/databufflabs/databuff) | 222 | Vue | 2026-07-08 | AI-native OpenTelemetry APM with multi-agent troubleshooting. 5-minute Docker self-host. | [databuff.ai](https://databuff.ai) |
| 19 | [taichuy/1flowbase](https://github.com/taichuy/1flowbase) | 193 | Rust | 2026-07-09 | Open-source AI gateway for local agent clients: publish fusion-style multi-model workflows as OpenAI/Claude-compatible virtual models with traces, tokens, latency, and cost visibility. |  |
| 20 | [langfuse/oss-llmops-stack](https://github.com/langfuse/oss-llmops-stack) | 139 |  | 2025-02-15 | Modular, open source LLMOps stack that separates concerns: LiteLLM unifies LLM APIs, manages routing and cost controls, and ensures high-availability, while Langfuse focuses on detailed observability, prompt versioning, and performance evaluations. | [oss-llmops-stack.com](https://oss-llmops-stack.com) |
| 21 | [cyberark/agentwatch](https://github.com/cyberark/agentwatch) | 121 | Python | 2025-05-14 | A powerful AI observability framework that provides comprehensive insights into agent interactions across platforms, enabling developers to monitor, analyze, and optimize AI-driven applications with minimal integration effort. | [www.cyberark.com](https://www.cyberark.com) |
| 22 | [tma1-ai/tma1](https://github.com/tma1-ai/tma1) | 108 | Go | 2026-07-03 | Local-first observability your agent reads back. TMA1 records every LLM call, then routes what it sees into the agent's next turn via hooks and MCP. | [tma1.ai](https://tma1.ai/) |
| 23 | [radicalbit/radicalbit-ai-monitoring](https://github.com/radicalbit/radicalbit-ai-monitoring) | 82 | Python | 2026-06-15 | A comprehensive solution for monitoring your AI models in production | [docs.oss-monitoring.radicalbit.ai](https://docs.oss-monitoring.radicalbit.ai/) |
| 24 | [Necmttn/ax](https://github.com/Necmttn/ax) | 80 | TypeScript | 2026-07-09 | the agent experience layer · observability + memory for AI coding agents (Claude Code + Codex) · local-first, typed, yours |  |
| 25 | [shyftlabs/continuum](https://github.com/shyftlabs/continuum) | 75 | Python | 2026-07-06 | Continuum — the agent runtime by ShyftLabs. Build, orchestrate, ship. | [docs.continuum.shyftlabs.io](https://docs.continuum.shyftlabs.io/) |
| 26 | [vstorm-co/agentcanvas](https://github.com/vstorm-co/agentcanvas) | 70 | Python | 2026-06-17 | Visualize Pydantic AI agent workflows from Logfire traces as an interactive HTML diagram — tools, nested sub-agents, tokens and exact cost. | [vstorm.co](https://vstorm.co) |
| 27 | [langfuse/langfuse-java](https://github.com/langfuse/langfuse-java) | 68 | Java | 2026-07-03 | 🪢 Auto-generated Java Client for Langfuse API |  |
| 28 | [Netis/heron](https://github.com/Netis/heron) | 67 | Rust | 2026-06-23 | Agent and LLM API performance monitoring via network packet probe. Measures performance of OpenClaw, Claude, Codex, DeepAgents and more — deployed on the provider side, no SDK changes required. | [heron-ai.pages.dev](https://heron-ai.pages.dev) |
| 29 | [dunetrace/dunetrace](https://github.com/dunetrace/dunetrace) | 56 | Python | 2026-07-07 | Real-time monitoring of production AI agents. | [dunetrace.com](https://dunetrace.com/) |
| 30 | [last9/gpu-telemetry](https://github.com/last9/gpu-telemetry) | 55 | Python | 2026-07-07 | GPU Observability with workload attribution. One OTLP agent per node ties hardware metrics (NVIDIA, AMD, Intel Gaudi) to the K8s pod or Slurm job burning the GPU. | [last9.io/gpu-observability](https://last9.io/gpu-observability/) |
| 31 | [myscale/myscale-telemetry](https://github.com/myscale/myscale-telemetry) | 55 | Python | 2025-01-02 | Open-source observability for your LLM application. | [pypi.org/project/myscale-telemetry](https://pypi.org/project/myscale-telemetry/) |
| 32 | [vicarious11/agenttop](https://github.com/vicarious11/agenttop) | 49 | Python | 2026-04-17 | htop for AI coding agents — monitor token usage, costs, and workflows across Claude Code, Cursor, Kiro, Codex, and Copilot |  |
| 33 | [TaewoooPark/Agent-Blackbox](https://github.com/TaewoooPark/Agent-Blackbox) | 45 | TypeScript | 2026-06-29 | Local-first flight recorder for coding agents : replay every run as a live session map, score the context bill, and write the fix back into AGENTS.md — no API key, one npx command. | [www.npmjs.com/package/@taewooopark/agent-blackbox](https://www.npmjs.com/package/@taewooopark/agent-blackbox) |
| 34 | [ByteYellow/AgentProvenance](https://github.com/ByteYellow/AgentProvenance) | 44 | Go | 2026-07-08 | Security-oriented three-axis observability for sandboxed AI agents: model intent, app context, and runtime telemetry into verifiable evidence graphs for risk, forensics, and audit. |  |
| 35 | [CollieAi/llm-firewall](https://github.com/CollieAi/llm-firewall) | 43 |  | 2026-07-08 | AI Firewall & LLM security toolkit - protect your AI applications from prompt injection, jailbreaks, PII leakage, and adversarial attacks | [collieai.io](https://collieai.io) |
| 36 | [VoltAgent/ai-agent-platform](https://github.com/VoltAgent/ai-agent-platform) | 40 |  | 2025-10-27 | AI agent platform for building multi-agent systems with orchestration, memory, RAG, workflows, and enterprise observability. | [github.com/VoltAgent/voltagent](https://github.com/VoltAgent/voltagent) |
| 37 | [ENDEVSOLS/Long-Trainer](https://github.com/ENDEVSOLS/Long-Trainer) | 30 | Python | 2026-05-07 | Production-ready RAG framework for Python — multi-tenant chatbots with streaming, tool calling, agent mode (LangGraph), vector search (FAISS), and persistent MongoDB memory. Built on LangChain. | [endevsols.com/open-source/longtrainer](https://endevsols.com/open-source/longtrainer) |
| 38 | [tma1-ai/openfuse](https://github.com/tma1-ai/openfuse) | 29 | TypeScript | 2026-07-08 | Langfuse on GreptimeDB. Self-hosted LLM observability. | [github.com/tma1-ai/openfuse#readme](https://github.com/tma1-ai/openfuse#readme) |
| 39 | [syndicalt/pathlight](https://github.com/syndicalt/pathlight) | 25 | TypeScript | 2026-05-01 | Visual debugging, execution traces, and observability for AI agents. |  |
| 40 | [teilomillet/hapax](https://github.com/teilomillet/hapax) | 24 | Go | 2025-01-06 | The reliability layer between your code and LLM providers. | [teilomillet.github.io/hapax](https://teilomillet.github.io/hapax) |
| 41 | [softcane/cc-blackbox](https://github.com/softcane/cc-blackbox) | 20 | Rust | 2026-06-18 | A stop-loss for Claude Code: detects loops, compaction danger, failed tools, and token waste before the next request. |  |
| 42 | [langfuse/langfuse-workshop](https://github.com/langfuse/langfuse-workshop) | 19 | TypeScript | 2026-07-07 | End-to-end Langfuse workshop using a TypeScript Agent to teach the AI engineering loop: tracing, prompt management, monitoring, datasets, experiments, and evaluation. | [langfuse.com/workshop](https://langfuse.com/workshop) |
| 43 | [MCKRUZ/openclaw-langfuse](https://github.com/MCKRUZ/openclaw-langfuse) | 18 | JavaScript | 2026-02-19 | OpenClaw plugin for Langfuse LLM observability — traces every agent turn with sessions, token usage, latency, and cost tracking. Zero dependencies, drop-in install. |  |
| 44 | [ftonato/auris](https://github.com/ftonato/auris) | 18 | TypeScript | 2026-04-13 | Production-grade Node.js RAG system with hybrid retrieval, pluggable adapters, and OpenTelemetry tracing | [deepwiki.com/ftonato/auris](https://deepwiki.com/ftonato/auris/) |
| 45 | [nujovich/hermes-telemetry](https://github.com/nujovich/hermes-telemetry) | 17 | Python | 2026-07-09 | Budget enforcement + observability plugin for Hermes Agent. Stops runaway costs before they happen. |  |
| 46 | [smarth-tech/claudetrack](https://github.com/smarth-tech/claudetrack) | 16 | TypeScript | 2026-03-03 | Real-time token tracking, cost forecasting, and rate limit prediction for the Anthropic Claude API. Self-hosted, open source, free forever. |  |
| 47 | [TarekAwwad/authrty-claude-code-analytics](https://github.com/TarekAwwad/authrty-claude-code-analytics) | 15 | Python | 2026-07-05 | An analytics tool to explore Claude code usage patterns, errors, and token costs | [checkyouragent.dev](https://checkyouragent.dev/) |
| 48 | [wild-edge/wildedge-python](https://github.com/wild-edge/wildedge-python) | 15 | Python | 2026-06-23 | Python SDK for WildEdge | [wildedge.dev](https://wildedge.dev) |
| 49 | [smigolsmigol/llmkit](https://github.com/smigolsmigol/llmkit) | 14 | TypeScript | 2026-06-30 | Know what your AI agents cost. API gateway with budget enforcement, session tracking, and MCP tools. | [llmkit.sh](https://llmkit.sh) |
| 50 | [ankitvirdi4/awesome-llm-cost](https://github.com/ankitvirdi4/awesome-llm-cost) | 13 |  | 2026-06-05 | Tools, libraries, papers, and patterns for reducing the cost of running large language models in production. | [github.com/ankitvirdi4/awesome-llm-cost](https://github.com/ankitvirdi4/awesome-llm-cost) |
| 51 | [michaeloboyle/claude-langfuse-monitor](https://github.com/michaeloboyle/claude-langfuse-monitor) | 11 | JavaScript | 2026-04-07 | Automatic Langfuse tracking for Claude Code | [www.npmjs.com/package/claude-langfuse-monitor](https://www.npmjs.com/package/claude-langfuse-monitor) |
| 52 | [Rxflex/agenttrace](https://github.com/Rxflex/agenttrace) | 11 | Python | 2026-05-07 | AgentTrace is an open-source, local-first step debugger for AI agents. It provides a Python SDK for tracing your agent runs and a web UI to inspect spans, tool calls, prompts, and responses as an interactive tree. |  |
| 53 | [DataGrout/lumen](https://github.com/DataGrout/lumen) | 11 | Rust | 2026-06-13 | Real-time LLM token and cost monitor with TLS-intercepting proxy or HTTP relay; cross-platform with macOS status bar app and browser dashboard | [datagrout.ai/lumen](https://datagrout.ai/lumen) |
| 54 | [Sapience-AI/openclaw-middleware-suite](https://github.com/Sapience-AI/openclaw-middleware-suite) | 10 | TypeScript | 2026-07-06 | Six in-process middlewares for OpenClaw: HITL approvals, prompt-injection guardrails, PII redaction, tool-call budgets, context compaction, and complexity-aware model routing. Zero telemetry, all state local. |  |
| 55 | [Arylmera/Token-Dashboard](https://github.com/Arylmera/Token-Dashboard) | 10 | Rust | 2026-07-05 | Local desktop dashboard for Claude Code. Reads your JSONL transcripts and surfaces per-prompt cost, tool heatmaps, subagent attribution, cache analytics, and a rule-based tips engine. Rust + Tauri, fully offline, MIT. | [github.com/Arylmera/Token-Dashboard/releases/latest](https://github.com/Arylmera/Token-Dashboard/releases/latest) |
| 56 | [neogate-io/NeoGate](https://github.com/neogate-io/NeoGate) | 9 | Rust | 2026-07-09 | Self-hosted Rust LLM API gateway with OpenAI-compatible and Anthropic-compatible APIs, model routing, multi-tenant keys, usage tracking, billing, and admin console. | [github.com/neogate-io/NeoGate](https://github.com/neogate-io/NeoGate) |
| 57 | [repanareddysekhar/llm-obs](https://github.com/repanareddysekhar/llm-obs) | 9 | Python | 2026-05-27 | Lightweight Python SDK for LLM inference logging and observability | [pypi.org/project/llm-obs](https://pypi.org/project/llm-obs/) |
| 58 | [lumina-gen/lumina-core](https://github.com/lumina-gen/lumina-core) | 9 | TypeScript | 2026-06-12 | Self-hosted LLM observability — traces, cost, latency, agents, tool calling, RAG. Python SDK + OpenTelemetry + REST. |  |
| 59 | [spanlens/Spanlens](https://github.com/spanlens/Spanlens) | 9 | TypeScript | 2026-07-08 | Open source LLM observability and monitoring. Drop-in proxy for OpenAI, Anthropic, and Gemini with request logging, cost tracking, and agent tracing. Self-host with one Docker command. MIT. | [spanlens.io](https://spanlens.io) |
| 60 | [yideng-xl/gemini-cli-hud](https://github.com/yideng-xl/gemini-cli-hud) | 8 | TypeScript | 2026-06-02 | Real-time bottom-sticky HUD for Gemini CLI — model, context usage, tool calls, and more |  |
| 61 | [acailic/agent_debugger](https://github.com/acailic/agent_debugger) | 8 | Python | 2026-07-08 | Local-first agent debugger with replay, failure memory, smart highlights, and drift detection. | [acailic.github.io/agent_debugger/course.html](https://acailic.github.io/agent_debugger/course.html) |
| 62 | [AgentTel/agenttel-sdk](https://github.com/AgentTel/agenttel-sdk) | 7 | Java | 2026-04-11 | Agent-ready telemetry SDK — enriches OpenTelemetry across Java, Go, Python, Node.js, and browser with structured context for AI-driven observability. | [agenttel.dev](https://agenttel.dev/) |
| 63 | [JustVugg/agentmw](https://github.com/JustVugg/agentmw) | 7 | Python | 2026-05-19 | Open-source middleware for AI agents — catches mid-run failures,compresses stale context, and grows a reasoning library across runs. Any model, any framework. |  |
| 64 | [JoniMartin27/lookspan](https://github.com/JoniMartin27/lookspan) | 7 | TypeScript | 2026-07-08 | Local-first observability dashboard for AI agents. MCP-native. Look at every span your agents emit. | [jonimartin27.github.io/lookspan](https://jonimartin27.github.io/lookspan/) |
| 65 | [sentinelrca/sentinel](https://github.com/sentinelrca/sentinel) | 7 | Python | 2026-07-05 | Root cause analysis for AI agents. Detects agent loops, retry storms, and optimization opportunities in LangSmith, Langfuse, Arize Phoenix, and OpenTelemetry traces. | [github.com/sentinelrca](https://github.com/sentinelrca) |
| 66 | [AndrMoura/streamlit-chatbot-analytics](https://github.com/AndrMoura/streamlit-chatbot-analytics) | 7 | Python | 2024-05-08 | Streamlit-based chatbot leveraging Ollama via LangChain and PostHog-LLM for advanced logging and monitoring |  |
| 67 | [ambertrace/ambertrace-sdk](https://github.com/ambertrace/ambertrace-sdk) | 6 | Python | 2026-03-19 |  | [www.ambertrace.dev](https://www.ambertrace.dev/) |
| 68 | [matdev83/llm-accounting](https://github.com/matdev83/llm-accounting) | 6 | Python | 2025-07-07 | A Python package for tracking and analyzing LLM usage across different models and applications. It is primarily designed as a library for integration into development process of LLM-based agentic workflow tooling, providing robust tracking capabilities. |  |
| 69 | [NikiforovAll/pi-otel](https://github.com/NikiforovAll/pi-otel) | 6 | TypeScript | 2026-05-16 | OpenTelemetry tracing for pi-coding-agent — per-turn span tree with full OTel GenAI semantic conventions | [nikiforovall.blog/pi-otel](http://nikiforovall.blog/pi-otel/) |
| 70 | [grepture/proxy](https://github.com/grepture/proxy) | 6 | TypeScript | 2026-06-26 | Drop-in proxy for OpenAI, Anthropic, and other LLM APIs. Logging, PII redaction, prompt versioning, and evals out of the box. | [grepture.com](https://grepture.com) |
| 71 | [softcane/codex-blackbox](https://github.com/softcane/codex-blackbox) | 6 | Rust | 2026-05-30 | Codex CLI session supervision: see failed or incomplete turns, token use, model changes, context pressure, and postmortems. |  |
| 72 | [xops-labs/llm-usage-exporter](https://github.com/xops-labs/llm-usage-exporter) | 6 | C# | 2026-07-01 | Self-hosted Prometheus exporter for LLM usage, token, request, and USD cost telemetry across OpenAI, Azure OpenAI, Anthropic Claude, Google Gemini, and AWS Bedrock. | [github.com/xops-labs/llm-usage-exporter#readme](https://github.com/xops-labs/llm-usage-exporter#readme) |
| 73 | [justinGrosvenor/alignmenter](https://github.com/justinGrosvenor/alignmenter) | 6 | HTML | 2025-11-12 | Check if your AI sounds like your brand, stays safe, and behaves consistently. Works with your custom GPTs, hosted APIs, and local models. Get detailed reports in minutes, not days. | [www.alignmenter.com](https://www.alignmenter.com) |
| 74 | [aryanjp1/tokenbudget](https://github.com/aryanjp1/tokenbudget) | 6 | Python | 2026-02-17 | Lightweight token tracking, cost management, and budget enforcement for LLM API calls |  |
| 75 | [LucaL6/claw-insights](https://github.com/LucaL6/claw-insights) | 6 | TypeScript | 2026-03-24 | Open-source agent observability — session replay, metrics, and shareable snapshots for AI agent workflows |  |
| 76 | [tanujbolisetty/google-adk-observability](https://github.com/tanujbolisetty/google-adk-observability) | 5 | Python | 2026-06-03 | Comprehensive agent analytics suite for AI agents built with the Google Agent Development Kit (ADK) , LangChain or other popular frameworks, powered by BigQuery Agent Analytics plugin and Grafana |  |
| 77 | [Idank96/agent-panorama](https://github.com/Idank96/agent-panorama) | 5 | Python | 2026-06-16 | See what your AI agents do, whether it's worth it, and what it costs - a manager-readable report + local dashboard from Langfuse/LangSmith traces (or a one-line live callback). Open source, runs locally. |  |
| 78 | [aaronlab/browsertrace](https://github.com/aaronlab/browsertrace) | 4 | Python | 2026-05-14 | Local replay debugger for Browser Use failures with screenshots, model I/O, failed-step timelines, and public-safe HTML exports. | [aaronlab.github.io/browsertrace](https://aaronlab.github.io/browsertrace/) |
| 79 | [Scaffoldic/forgesight](https://github.com/Scaffoldic/forgesight) | 4 | Python | 2026-06-23 | Vendor-neutral, OpenTelemetry-first telemetry for AI agents — traces, cost, budgets & a tamper-evident audit trail to any backend, no agent-code changes. | [pypi.org/project/forgesight](https://pypi.org/project/forgesight/) |
| 80 | [mohsinsheikhani/property-maintenance-agent](https://github.com/mohsinsheikhani/property-maintenance-agent) | 4 | Python | 2026-06-07 | Eval-first AI agent that triages property maintenance emails. The real work is the eval system around it: trace-driven error analysis, code graders and validated LLM-as-judge (TPR/TNR), component and end-to-end evals, a failure taxonomy, and a CI regression gate. LangGraph, FastAPI, Langfuse. | [www.linkedin.com/in/mohsin-sheikhani](https://www.linkedin.com/in/mohsin-sheikhani/) |
| 81 | [m24927605/agentic-spendguard](https://github.com/m24927605/agentic-spendguard) | 4 | Rust | 2026-07-06 | Agentic SpendGuard — audit-chain spend control for LLM agents. KMS-signed decisions, Stripe-style auth/capture ledger, operator approval, multi-tenant. Adapters for Pydantic-AI, LangChain, LangGraph, OpenAI Agents SDK, Microsoft AGT. | [agenticspendguard.dev](https://agenticspendguard.dev) |
| 82 | [AgentInsight/agentinsight-sdk-python](https://github.com/AgentInsight/agentinsight-sdk-python) | 4 | Python | 2026-07-06 | AgentInsight Python SDK provides a Python client for the AgentInsight platform, supporting LLM application observability, tracing, evaluation, and prompt management. | [agentinsight.goldebridge.com/platform](https://agentinsight.goldebridge.com/platform) |
| 83 | [hanyo-ai/pulse](https://github.com/hanyo-ai/pulse) | 4 | TypeScript | 2026-07-07 | The missing observability layer for AI agents. Real-time session visualization. Every prompt. Every tool call. Every model switch. Live. Drop-in OpenAI/Anthropic gateway. Self-hosted. Bun + SQLite. |  |
| 84 | [NeuroForgeLabs/rag-doctor](https://github.com/NeuroForgeLabs/rag-doctor) | 4 | JavaScript | 2026-03-13 | 🩺 RAG Doctor — Open-source diagnostic tool for Retrieval-Augmented Generation (RAG) systems. Analyzes codebases to detect architectural issues in LLM pipelines such as missing retrieval, bad chunking, embedding mismatches, and vector database misuse. |  |
| 85 | [aws-samples/sample-bedrock-invocation-analytics](https://github.com/aws-samples/sample-bedrock-invocation-analytics) | 4 | Python | 2026-06-18 | 📊 Multi-account analytics for Amazon Bedrock. Hub + Spoke architecture aggregates invocation logs across AWS accounts into DynamoDB; NiceGUI WebUI shows token usage, cost breakdown, latency, and TPOT in real time. |  |
| 86 | [Danultimate/traceforge](https://github.com/Danultimate/traceforge) | 3 | Python | 2026-05-22 | Agent runtime tracing + LLM-mock replay for Python. Self-contained HTML reports, pytest snapshot testing, cost tracking. No SaaS. | [pypi.org/project/traceforge-llm](https://pypi.org/project/traceforge-llm/) |
| 87 | [sitta07/RAGScope](https://github.com/sitta07/RAGScope) | 3 | Python | 2026-03-10 | A lightweight observability tool for visualizing and comparing RAG retrieval strategies. Features real-time embedding visualization and side-by-side performance metrics. |  |
| 88 | [2nd1st/api-log-viewer](https://github.com/2nd1st/api-log-viewer) | 3 | Svelte | 2026-06-02 | Svelte 5 SPA trace viewer for api-log · LLM 网关日志查看器，可对接兼容的 JSONL / SQLite trace 存储 |  |
| 89 | [sairintechnologycom/burnlens](https://github.com/sairintechnologycom/burnlens) | 3 | Python | 2026-06-13 | Open-source LLM FinOps proxy — track OpenAI, Anthropic (Claude), and Google Gemini costs by feature, team, and customer. Zero code changes. pip install burnlens. | [burnlens.app](https://burnlens.app) |
| 90 | [lucianareynaud/turnpike](https://github.com/lucianareynaud/turnpike) | 3 | Python | 2026-06-26 | OTel-native typed primitives for LLM cost attribution and telemetry — published on PyPI. | [pypi.org/project/turnpike](https://pypi.org/project/turnpike) |
| 91 | [andalabx/agentmetrics](https://github.com/andalabx/agentmetrics) | 3 | Python | 2026-06-23 | Open-source AI agent observability. Track cost, latency, tokens, and errors for OpenClaw, Hermes, LangChain, CrewAI, LlamaIndex, OpenAI Agents, AutoGen, and Anthropic Managed Agents. Self-hosted, no cloud required. | [agentmetrics.dev](https://agentmetrics.dev) |
| 92 | [ashwanijha04/peekr](https://github.com/ashwanijha04/peekr) | 3 | Python | 2026-06-11 | Zero-config observability for AI agents. Auto-instruments OpenAI & Anthropic SDKs. | [ashwanijha04.github.io/peekr](https://ashwanijha04.github.io/peekr/) |
| 93 | [vibeinging/yiTrace](https://github.com/vibeinging/yiTrace) | 3 | Rust | 2026-07-09 | Local-first TraceDB for AI agents: replay runs, search traces, track cost/evals, and embed in Node/Electron or shard with a gateway. | [github.com/vibeinging/yiTrace#readme](https://github.com/vibeinging/yiTrace#readme) |
| 94 | [victoralfred/whatifd](https://github.com/victoralfred/whatifd) | 3 | Python | 2026-06-22 | whatif is an open experiment runner for LLM behavior changes. whatif forks production traces, replays them with a proposed change (cached tool outputs preserve safety), scores the diff, and emits a PR-ready verdict report | [whatif.codes](https://whatif.codes) |
| 95 | [erandr/geight.ai](https://github.com/erandr/geight.ai) | 3 | C# | 2026-05-07 | Route traffic across providers and models through one OpenAI-compatible API. Bring your own keys, define fallbacks and policies, and scale from a single binary to a fleet, or let us run it for you. | [geight.ai](https://geight.ai) |
| 96 | [Chief-Strategist-J/llm-observability-platform](https://github.com/Chief-Strategist-J/llm-observability-platform) | 3 | Python | 2026-07-07 | Implemented an LLM observability and evaluation submodule featuring automated instrumentation and tracing, stateful chat orchestration, semantic vector-memory caching, and scheduled Temporal workers for cost anomaly detection. (Tracep api only link : https://tracep-go.onrender.com/) |  |
| 97 | [umairb0/agenttrace](https://github.com/umairb0/agenttrace) | 3 | Python | 2026-07-09 | Trace and debug AI agent behavior locally with a step-by-step visual tool that stores data offline for clear inspection and faster development. |  |
| 98 | [brokle-ai/brokle](https://github.com/brokle-ai/brokle) | 3 | Go | 2026-07-03 | The AI engineering platform for AI teams. Observability, evaluation, and prompt management for LLMs and AI agents. OpenTelemetry native. | [steloit.com](https://steloit.com) |
| 99 | [scopecall/scopecall](https://github.com/scopecall/scopecall) | 3 | TypeScript | 2026-06-25 | Open-source, self-hostable AI cost & workflow observability. Find the prompt, customer, model, and workflow path behind every LLM cost spike — without a proxy. | [scopecall.com](https://scopecall.com) |
| 100 | [agentc7/ac7](https://github.com/agentc7/ac7) | 3 | TypeScript | 2026-06-29 | Self-hosted control plane for AI agent teams. Push objectives at Claude Code or OpenAI Codex; capture every LLM call. | [agentc7.com](https://agentc7.com) |

</details>

### `"llm observability" in:description` — 93 prospects

<details>
<summary><strong>Show table</strong></summary>

| # | Repository | Stars | Language | Last push | Description | Website |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | [openobserve/openobserve](https://github.com/openobserve/openobserve) | 19,784 | TypeScript | 2026-07-09 | Open source observability platform for logs, metrics, traces, frontend monitoring, pipelines and LLM observability. A sophisticated, simple and highly performant alternative to Datadog, Splunk, and Elasticsearch with 140x lower storage costs and single binary deployment. | [openobserve.ai](https://openobserve.ai) |
| 2 | [evidentlyai/evidently](https://github.com/evidentlyai/evidently) | 7,673 | Jupyter Notebook | 2026-05-02 | Evidently is ​​an open-source ML and LLM observability framework. Evaluate, test, and monitor any AI-powered system or data pipeline. From tabular data to Gen AI. 100+ metrics. | [discord.gg/xZjKRaNp8b](https://discord.gg/xZjKRaNp8b) |
| 3 | [openlit/openlit](https://github.com/openlit/openlit) | 2,582 | TypeScript | 2026-07-08 | Open source platform for AI Engineering: OpenTelemetry-native LLM Observability, GPU Monitoring, Guardrails, Evaluations, Prompt Management, Vault, Playground. 🚀💻 Integrates with 50+ LLM Providers, VectorDBs, Agent Frameworks and GPUs. | [docs.openlit.io](https://docs.openlit.io) |
| 4 | [whylabs/langkit](https://github.com/whylabs/langkit) | 992 | Jupyter Notebook | 2024-11-22 | 🔍 LangKit: An open-source toolkit for monitoring Large Language Models (LLMs). 📚 Extracts signals from prompts & responses, ensuring safety & security. 🛡️ Features include text quality, relevance metrics, & sentiment analysis. 📊 A comprehensive tool for LLM observability. 👀 | [whylabs.ai](https://whylabs.ai) |
| 5 | [ajac-zero/example-rag-app](https://github.com/ajac-zero/example-rag-app) | 158 | TypeScript | 2026-01-15 | Open-Source RAG app with LLM Observability (Langfuse), support for 100+ providers (LiteLLM), Dockerized, Full Type-checking, 100% Test coverage, and more... |  |
| 6 | [AmineDjeghri/generative-ai-project-template](https://github.com/AmineDjeghri/generative-ai-project-template) | 117 | Python | 2026-07-08 | Template for a new generative ai project using uv, nicegui, fastapi, llms (cloud & local with litellm and ollama, cpu/gpu) and langfuse for llm observability | [aminedjeghri.com/generative-ai-project-template](http://aminedjeghri.com/generative-ai-project-template/) |
| 7 | [DataDog/llm-observability](https://github.com/DataDog/llm-observability) | 78 | Jupyter Notebook | 2026-07-08 | Learn by example how to instrument Datadog's LLM Observability product | [docs.datadoghq.com/tracing/llm_observability](https://docs.datadoghq.com/tracing/llm_observability/) |
| 8 | [langchain-tracer/Axon](https://github.com/langchain-tracer/Axon) | 38 | TypeScript | 2026-07-02 | OpenTelemetry-native LLM observability CLI. Point any OTEL exporter at it and watch your LLM/agent traces in real time. | [www.npmjs.com/package/@axon-ai/cli](https://www.npmjs.com/package/@axon-ai/cli) |
| 9 | [sarva-20/LLM-Observability-FOSS](https://github.com/sarva-20/LLM-Observability-FOSS) | 36 | Python | 2026-01-07 | 🧠 Learn LLM Observability step-by-step using FOSS tools. From zero visibility to full monitoring with Langtrace, OpenTelemetry, and Jaeger. Demo from FOSS United Coimbatore Meetup. |  |
| 10 | [codex-odyssey/llm-observability](https://github.com/codex-odyssey/llm-observability) | 19 | Jupyter Notebook | 2024-11-08 | 技術書典#17 - 『俺たちと探究するLLM Observabilityアプリケーションのオブザーバビリティ』で使用するサンプルアプリケーション | [techbookfest.org/product/mn0L7GEm3s8Vhmxq971HEi?productVariantID=myG2YLxFNAEVkRf2dipG8f](https://techbookfest.org/product/mn0L7GEm3s8Vhmxq971HEi?productVariantID=myG2YLxFNAEVkRf2dipG8f) |
| 11 | [ContextJet-ai/awesome-llm-observability](https://github.com/ContextJet-ai/awesome-llm-observability) | 18 | Python | 2026-07-06 | 50+ curated LLM observability tools PLUS 26 Agent Skills (several with runnable, unit-tested scripts) to build, evaluate, debug, secure & monitor reliable LLM apps. Tracing, evals, guardrails, LLMOps. |  |
| 12 | [Aayush-engineer/TraceMind](https://github.com/Aayush-engineer/TraceMind) | 16 | Python | 2026-07-09 | Open-source LLM observability and evaluation platform |  |
| 13 | [MikeHsu0618/2025-llm-observability-bootcamp](https://github.com/MikeHsu0618/2025-llm-observability-bootcamp) | 14 | Python | 2025-06-05 | 2025 DevOpsDays Taipei LLM Observability Bootcamp |  |
| 14 | [Crashlens/crashlens](https://github.com/Crashlens/crashlens) | 13 | Python | 2025-12-02 | Production LLM observability CLI — detects token waste, retry loops & model overkill across OpenAI/Anthropic/Gemini. Prometheus metrics, Grafana dashboard, PyPI shipped. | [crashlens.vercel.app](https://crashlens.vercel.app/) |
| 15 | [Dynatrace/obslab-llm-observability](https://github.com/Dynatrace/obslab-llm-observability) | 12 | HTML | 2026-02-02 | Search for a holiday and get destination advice from an LLM. Observability by Dynatrace. | [dynatrace.github.io/obslab-llm-observability](https://dynatrace.github.io/obslab-llm-observability/) |
| 16 | [candelahq/candela](https://github.com/candelahq/candela) | 10 | Go | 2026-07-09 | 🕯️ OTel-native LLM observability platform. Trace, cost, and evaluate your LLM calls. | [www.candelahq.com](https://www.candelahq.com/) |
| 17 | [goabiaryan/awesome-observability](https://github.com/goabiaryan/awesome-observability) | 9 | Python | 2026-06-10 | A curation of some of the best tools, resources, frameworks on LLM observability |  |
| 18 | [HikaruEgashira/otel-hooks](https://github.com/HikaruEgashira/otel-hooks) | 8 | Python | 2026-07-09 | AI Agent hooks for LLM Observability. |  |
| 19 | [joshuagamboa/turboquant-apple-silicon](https://github.com/joshuagamboa/turboquant-apple-silicon) | 7 | Rust | 2026-04-01 | High-performance Rust integration for aggressive KV cache quantization on Apple Silicon GPUs (Metal). Features a multi-turn TUI, smart context windowing, and full LLM observability. |  |
| 20 | [GaggleAMP/langchainrb_datadog](https://github.com/GaggleAMP/langchainrb_datadog) | 6 | Ruby | 2025-05-22 | Enables LLM observability with Datadog for Langchain.rb |  |
| 21 | [ankitvirdi4/react-native-llm-meter](https://github.com/ankitvirdi4/react-native-llm-meter) | 6 | TypeScript | 2026-07-01 | LLM observability for React Native and Expo. Track token usage, cost, latency, and TTFT for Claude, GPT, and Gemini calls on device, with optional remote sync. | [www.npmjs.com/package/react-native-llm-meter](https://www.npmjs.com/package/react-native-llm-meter) |
| 22 | [iiizzzyyy/promptmetrics](https://github.com/iiizzzyyy/promptmetrics) | 5 | TypeScript | 2026-05-20 | Lightweight, self-hosted prompt registry with GitHub-backed versioning and metadata logging for LLM observability. | [github.com/iiizzzyyy/promptmetrics](https://github.com/iiizzzyyy/promptmetrics) |
| 23 | [genai-telemetry/genai-telemetry](https://github.com/genai-telemetry/genai-telemetry) | 5 | Python | 2026-06-06 | Platform-agnostic SDK for LLM observability. Export LLM traces, token usage, costs, and performance metrics directly to Splunk, Elasticsearch, Datadog—or via OTLP to Prometheus, Grafana Tempo, and more. One SDK, any backend. |  |
| 24 | [recondodev/recondo](https://github.com/recondodev/recondo) | 5 | TypeScript | 2026-05-10 | AI governance gateway. Wire-level LLM observability — every prompt, every tool call, every response. | [recondo.dev](https://recondo.dev/) |
| 25 | [maheshbabugorantla/llm-observability-opensearch](https://github.com/maheshbabugorantla/llm-observability-opensearch) | 5 | Python | 2026-06-13 | Full-stack LLM observability using OpenSearch, Data Prepper, and OpenTelemetry. Zero-code instrumentation with automatic cost tracking via OpenLLMetry + LiteLLM pricing. |  |
| 26 | [avikcodes/traceLLM](https://github.com/avikcodes/traceLLM) | 5 | JavaScript | 2026-06-13 | Open-source LLM observability platform → track prompts, token usage, latency, retries, hallucinations, tool calls, agent execution paths. PostgreSQL stores traces. WebSocket streams logs live. | [tracellm.aviklabs.xyz](https://tracellm.aviklabs.xyz/) |
| 27 | [serener91/Texo](https://github.com/serener91/Texo) | 4 | Python | 2026-01-21 | Weaving the fabric of LLM observability |  |
| 28 | [sauravGit/open-llm-observability](https://github.com/sauravGit/open-llm-observability) | 4 | Python | 2026-05-12 | A vendor-neutral, OpenTelemetry-compatible semantic convention and SDK layer for standardizing LLM observability across any provider, framework, or platform. | [github.com/sauravGit/open-llm-observability](https://github.com/sauravGit/open-llm-observability) |
| 29 | [Rishabhmannu/financebench-rag-agent](https://github.com/Rishabhmannu/financebench-rag-agent) | 4 | Python | 2026-06-09 | Multi-agent LangGraph RAG for financial Q&A — 72.7% on FinanceBench under κ=0.932 calibrated judge. RBAC at the vector layer, multi-party HITL on high-stakes answers, self-hosted LLM observability. pip install financebench-rag-agent | [pypi.org/project/financebench-rag-agent](https://pypi.org/project/financebench-rag-agent/) |
| 30 | [ordinarykaizen/PromptLab](https://github.com/ordinarykaizen/PromptLab) | 3 |  | 2025-02-26 | LLM observability |  |
| 31 | [priordd/chatbot-datadog-chainlit-openai](https://github.com/priordd/chatbot-datadog-chainlit-openai) | 3 | Python | 2024-12-08 | Chatbot: Datadog LLM Observability + OpenAI + Chainlit |  |
| 32 | [JJleem/claude-console](https://github.com/JJleem/claude-console) | 3 | TypeScript | 2026-04-20 | Claude Code 설정 관리 + LLM Observability 로컬 대시보드 |  |
| 33 | [doneyli/clickhouse-llm-observability](https://github.com/doneyli/clickhouse-llm-observability) | 3 | Python | 2026-07-08 | LLM Observability demo with LibreChat, Langfuse, and ClickHouse |  |
| 34 | [tarekmasryo/tarekmasryo](https://github.com/tarekmasryo/tarekmasryo) | 3 |  | 2026-05-05 | Personal GitHub profile README showcasing production ML, GenAI/RAG systems, LLM observability, and decision-ready AI workflows. | [tarekmasryo.github.io](https://tarekmasryo.github.io) |
| 35 | [cocolocow/langfuse-board](https://github.com/cocolocow/langfuse-board) | 3 | TypeScript | 2026-05-20 | The executive dashboard for LLM observability. CEO-friendly view of your AI costs, usage and quality — plugged into Langfuse. | [langfuse-board-landing.vercel.app](https://langfuse-board-landing.vercel.app) |
| 36 | [YANG-DB/observability-prompots](https://github.com/YANG-DB/observability-prompots) | 2 | Python | 2023-05-07 | LLM observability related prompts |  |
| 37 | [run-llama/product-specs-comparison](https://github.com/run-llama/product-specs-comparison) | 2 | HTML | 2026-02-13 | Demo for LlamaIndex x PostHog LLM observability |  |
| 38 | [jdziat/langfuse-go](https://github.com/jdziat/langfuse-go) | 2 | Go | 2026-06-29 | Go SDK for Langfuse - the open-source LLM observability platform. Track traces, spans, generations, and scores for your LLM applications with zero external dependencies. |  |
| 39 | [art-vish/llamacpp-llm-observer](https://github.com/art-vish/llamacpp-llm-observer) | 2 | Makefile | 2025-08-23 | Llama.cpp LLM Observability Stack with Prometheus, Grafana, Alertmanager and Node Exporter |  |
| 40 | [klipitkas/opik-php](https://github.com/klipitkas/opik-php) | 2 | PHP | 2026-02-21 | Community-maintained PHP SDK for Opik - an LLM observability and evaluation platform. | [packagist.org/packages/klipitkas/opik-php](https://packagist.org/packages/klipitkas/opik-php) |
| 41 | [VigneshReddy-afk/ajah](https://github.com/VigneshReddy-afk/ajah) | 2 | Go | 2026-06-26 | Self-hostable LLM observability platform. Gateway proxy, cost attribution, PII masking, quality scoring. |  |
| 42 | [LatencyTDH/prosperus](https://github.com/LatencyTDH/prosperus) | 2 | TypeScript | 2026-07-04 | LLM observability platform: traces, spans, evaluations, and cost tracking for AI-powered applications |  |
| 43 | [doneyli/clickhouse-clickstack-o11y](https://github.com/doneyli/clickhouse-clickstack-o11y) | 2 | Python | 2026-02-19 | HyperDX AI Dashboard Builder — LLM observability with ClickHouse, OpenTelemetry, and Claude-powered dashboard generation |  |
| 44 | [last9/python-ai-sdk](https://github.com/last9/python-ai-sdk) | 2 | Python | 2026-07-03 | OpenTelemetry extension for LLM observability - track conversations, workflows, and costs in Python AI applications | [last9.io](https://last9.io) |
| 45 | [linny006/llmops-radar](https://github.com/linny006/llmops-radar) | 2 | Python | 2026-07-09 | Live index of the newest LLMOps tooling — track what's shipping in LLM observability and deployment | [github.com/linny006?utm_source=github&utm_medium=about&utm_campaign=llmops-radar](https://github.com/linny006?utm_source=github&utm_medium=about&utm_campaign=llmops-radar) |
| 46 | [pkrao20/LumenAI](https://github.com/pkrao20/LumenAI) | 2 | TypeScript | 2026-06-01 | Lightweight LLM observability platform — real-time inference logging, multi-turn chat, and metadata ingestion pipeline for AI applications |  |
| 47 | [aman-bhaskar-codes/llm-engineering-lab](https://github.com/aman-bhaskar-codes/llm-engineering-lab) | 2 | Python | 2026-03-21 | Production-grade LLM systems built through learning-by-building. Covers extraction engines, RAG pipelines, evaluation systems, agents, and LLM observability. |  |
| 48 | [tarekmasryo/llm-production-telemetry](https://github.com/tarekmasryo/llm-production-telemetry) | 2 | Jupyter Notebook | 2026-05-02 | Decision-grade LLM observability notebook: telemetry validation, SLO/budget burn, routing backtest, drift checks, triage policy, and review-ready operational artifacts. | [www.kaggle.com/code/tarekmasryo/llm-production-telemetry](https://www.kaggle.com/code/tarekmasryo/llm-production-telemetry) |
| 49 | [llm-trace/llm-trace](https://github.com/llm-trace/llm-trace) | 2 | Python | 2026-04-07 | Lightweight LLM observability library. SQLite-based tracing with zero infrastructure. Drop-in support for LangGraph, LangChain, OpenAI, Anthropic, OpenTelemetry, and any HTTP client. |  |
| 50 | [llamatelemetry/llamatelemetry](https://github.com/llamatelemetry/llamatelemetry) | 2 | Jupyter Notebook | 2026-06-11 | llamatelemetry is a cuda-dedicated llm inference and llm observability tool for local llm model with GGUF format using built-in llama.cpp tool. | [llamatelemetry.github.io](https://llamatelemetry.github.io/) |
| 51 | [PalenaAI/langfuse-operator](https://github.com/PalenaAI/langfuse-operator) | 2 | Go | 2026-06-28 | Kubernetes operator for deploying and managing production-ready Langfuse LLM observability instances. Deploy the full stack (Web, Worker, PostgreSQL, ClickHouse, Redis, Blob Storage) from a single custom resource, with automated upgrades, secret rotation, multi-tenancy, and circuit breakers built in. | [langfuse-operator.palena.ai](https://langfuse-operator.palena.ai/) |
| 52 | [ThilakKumar-A/Logmera](https://github.com/ThilakKumar-A/Logmera) | 2 | Python | 2026-03-04 | Logmera is a self-hosted LLM observability and monitoring platform for AI applications. It logs prompts, responses, and latency, storing everything in your own PostgreSQL database. Run it on your infrastructure and monitor AI behavior with a built-in dashboard and full data privacy. |  |
| 53 | [CanadaDevOpsCommunity2025/LLMObservabilitySystem_Ugo](https://github.com/CanadaDevOpsCommunity2025/LLMObservabilitySystem_Ugo) | 1 |  | 2025-06-11 | Project Name: LLM Observability System / Group Name: Ugo / Participant Name: Ugochukwu Osuji |  |
| 54 | [egopher/langecho](https://github.com/egopher/langecho) | 1 | Go | 2025-03-05 | LLM Observability tool |  |
| 55 | [supernature885/ai-radar-llm-observability-starter](https://github.com/supernature885/ai-radar-llm-observability-starter) | 1 | Python | 2026-07-03 | LLM Observability Starter |  |
| 56 | [zvectorlabs/zradar](https://github.com/zvectorlabs/zradar) | 1 | Rust | 2026-07-06 | Agent Tracing & LLM Observability Platform with high-performance OpenTelemetry ingestion and cost effective Parquet telemetry storage on S3 |  |
| 57 | [sfc-gh-sdickson/LLM_OBSERVE](https://github.com/sfc-gh-sdickson/LLM_OBSERVE) | 1 | Python | 2025-07-22 | Testing Tool for LLM Observability |  |
| 58 | [cmangun/llm-observability-platform](https://github.com/cmangun/llm-observability-platform) | 1 | Python | 2026-04-27 | LLM observability and cost tracking |  |
| 59 | [Axionautomation/vega](https://github.com/Axionautomation/vega) | 1 | TypeScript | 2025-08-26 | Vega by Axion - LLM Observability Platform |  |
| 60 | [TIEGUO-W/claude-mon](https://github.com/TIEGUO-W/claude-mon) | 1 | JavaScript | 2026-05-17 | Zero-config LLM observability for Claude Code |  |
| 61 | [priordd/langchain-function-dd-demo](https://github.com/priordd/langchain-function-dd-demo) | 1 | Python | 2025-06-01 | Langchain LLM function with Datadog LLM Observability |  |
| 62 | [kavishkartha05/QueryScope](https://github.com/kavishkartha05/QueryScope) | 1 | Python | 2026-04-03 | open source load testing + LLM observability tool |  |
| 63 | [maxjeffwell/lunary](https://github.com/maxjeffwell/lunary) | 1 | TypeScript | 2026-03-10 | Lunary community edition - self-hosted LLM observability platform |  |
| 64 | [n1s0-c/mcp-server-datadog-fork](https://github.com/n1s0-c/mcp-server-datadog-fork) | 1 | TypeScript | 2026-01-19 | MCP server for Datadog with LLM Observability support |  |
| 65 | [santiagomed/tellm](https://github.com/santiagomed/tellm) | 1 | Go | 2024-09-03 | A minimal LLM observability platform written in Go. |  |
| 66 | [Pixeler5diti/localmind](https://github.com/Pixeler5diti/localmind) | 1 | Python | 2026-02-24 | A Local-First Cognitive & LLM Observability Engine for Developers |  |
| 67 | [vosevnikita-droid/rag-eval-harness](https://github.com/vosevnikita-droid/rag-eval-harness) | 1 | Python | 2026-05-29 | RAGAS-style RAG evaluation harness + LLM observability tracing patterns |  |
| 68 | [Tenount/backup-lunary](https://github.com/Tenount/backup-lunary) | 1 |  | 2025-10-31 | The production toolkit for LLMs. Observability, prompt management and evaluations. | [lunary.ai](https://lunary.ai) |
| 69 | [michwirantono/thepracticaldeveloper](https://github.com/michwirantono/thepracticaldeveloper) | 1 | HTML | 2025-07-04 | Articles and resources on LLM observability, tracing, and hallucination detection. |  |
| 70 | [llmobserve/llmobserve](https://github.com/llmobserve/llmobserve) | 1 | Go | 2026-04-21 | LLM observability for Go developers. Zero external services. 3 lines of code. |  |
| 71 | [bryan-lolordo/ai-agent-observatory](https://github.com/bryan-lolordo/ai-agent-observatory) | 1 | Python | 2026-01-26 | Production LLM observability platform with cost tracking, semantic caching, and quality evaluation |  |
| 72 | [diegosimao/Observability---RAG](https://github.com/diegosimao/Observability---RAG) | 1 | Python | 2025-12-10 | LLM Observability (RAG) using the modern O11y stack (OpenTelemetry, Prometheus, and Grafana). |  |
| 73 | [Rixy-Ai/ServeQuery](https://github.com/Rixy-Ai/ServeQuery) | 1 | Jupyter Notebook | 2025-06-24 | Revolutionizing AI Observability ServeQuery is the ultimate platform for ML and LLM observability |  |
| 74 | [Howard-Soap/llm-lens](https://github.com/Howard-Soap/llm-lens) | 1 | TypeScript | 2026-05-03 | 🔍 Open-source, free, zero-dependency LLM observability tool. See your LLM clearly. |  |
| 75 | [ashcastelinocs124/ArcanaAI](https://github.com/ashcastelinocs124/ArcanaAI) | 1 | HTML | 2026-02-15 | A LLM observability platform for multi-agent LLM systems with forensic analysis capabilities. |  |
| 76 | [postfiatorg/langfuse](https://github.com/postfiatorg/langfuse) | 1 | TypeScript | 2026-05-07 | 🪢 Open source LLM engineering platform: LLM Observability, metrics, evals, prompt management, playground, datasets. |  |
| 77 | [omuili/llm-observability-copilot](https://github.com/omuili/llm-observability-copilot) | 1 | JavaScript | 2025-12-29 | llm-observability-copilot Description: AI-native observability platform for LLM applications - Datadog + Google Cloud Hackathon |  |
| 78 | [erythix4/VMLLM](https://github.com/erythix4/VMLLM) | 1 | Shell | 2026-04-29 | A lab to understand how to use Victoria Metrics as a backend for LLM observability |  |
| 79 | [bugrasitemkar/ai-signals](https://github.com/bugrasitemkar/ai-signals) | 1 | TypeScript | 2026-04-05 | Real-time LLM observability tool — visualizes 18 internal model signals across 5 schools of thought |  |
| 80 | [sarahabumandil/ZakeyTeam-AI-Agent-Observability](https://github.com/sarahabumandil/ZakeyTeam-AI-Agent-Observability) | 1 | Python | 2026-01-09 | production grade observability for AI agents , demonstrating logging , tracing and metrics using modern LLM observability tools |  |
| 81 | [GiorgosPanagopoulos/llmpulse](https://github.com/GiorgosPanagopoulos/llmpulse) | 1 | Python | 2026-06-21 | Production-grade LLM observability platform — real-time tracing, cost tracking, and analytics for Anthropic & OpenAI APIs |  |
| 82 | [hw-oh/wandb-skills](https://github.com/hw-oh/wandb-skills) | 1 | Python | 2026-03-06 | AI coding agent skills for W&B (Weights & Biases) — Models experiment tracking and Weave LLM observability | [docs.wandb.ai](https://docs.wandb.ai/) |
| 83 | [catamitez0-maker/EigenTruth](https://github.com/catamitez0-maker/EigenTruth) | 1 | Python | 2026-07-05 | Calibrated LLM observability toolkit: representation diagnostics, conformal risk calibration, verifier/control traces, and optional activation steering. |  |
| 84 | [ekeshwarj5/llm-observability](https://github.com/ekeshwarj5/llm-observability) | 1 | TypeScript | 2026-05-21 | End-to-end LLM observability platform: chatbot, instrumentation SDK, event-driven ingestion, OLTP+OLAP storage, Grafana dashboards. |  |
| 85 | [RoyNativ-AI/vllm-tracker](https://github.com/RoyNativ-AI/vllm-tracker) | 1 | TypeScript | 2026-01-16 | Privacy-first LLM observability. Like Langfuse but stores zero prompts. Self-hosted, multi-instance, SOC2/GDPR ready. |  |
| 86 | [Emart29/rag-document-analyzer](https://github.com/Emart29/rag-document-analyzer) | 1 | Python | 2026-02-18 | A production-ready Retrieval-Augmented Generation (RAG) system for intelligent document question-answering, with integrated LLM observability and monitoring | [rag-document-analyzer.vercel.app](https://rag-document-analyzer.vercel.app) |
| 87 | [Sagar2366/agent-observability-sandbox](https://github.com/Sagar2366/agent-observability-sandbox) | 1 | Python | 2026-06-26 | Production-Grade LLM Observability at Scale — OTel Demo App + Datadog LLM Obs + Docker Sandbox with security guardrails and governance |  |
| 88 | [PrithviElancherran/AI-SRE-Agent](https://github.com/PrithviElancherran/AI-SRE-Agent) | 1 | Python | 2025-10-24 | Autonomous AI SRE Agent that analyzes production incidents, executes playbooks, and finds root causes using LLMs, observability data, and historical patterns. |  |
| 89 | [airblackbox/otel-prompt-vault](https://github.com/airblackbox/otel-prompt-vault) | 1 | Go | 2026-03-28 | OpenTelemetry Collector processor that offloads sensitive GenAI content to external storage, leaving structured references in traces. Privacy-by-default for LLM observability. |  |
| 90 | [skyline-GTRr32/OKI-TRACE](https://github.com/skyline-GTRr32/OKI-TRACE) | 1 | Python | 2026-05-17 | OKI TRACE: Local LLM observability. See step-by-step, layer-by-layer what your AI thinks. Logit Lens & Attention for HuggingFace models. |  |
| 91 | [juliettech13/helicone-ollama-proxy](https://github.com/juliettech13/helicone-ollama-proxy) | 1 | TypeScript | 2025-04-11 | A powerful Express.js proxy server that connects Ollama with Helicone for advanced LLM observability and monitoring of your local Llama requests. |  |
| 92 | [armelhbobdad/opik-skills](https://github.com/armelhbobdad/opik-skills) | 1 |  | 2026-01-28 | Agent Skills that bring Opik's LLM observability stack directly into your AI coding assistant—trace, evaluate, and iterate without leaving your editor. |  |
| 93 | [BrenoGdS/llm-microservice-observability-demo](https://github.com/BrenoGdS/llm-microservice-observability-demo) | 1 | Java | 2025-12-12 | A Spring Boot microservice that uses LangChain4j and Ollama to explain financing quotes with LLMs, featuring conversation memory and LLM observability with Langfuse. |  |

</details>

### `"llm observability" in:name` — 86 prospects

<details>
<summary><strong>Show table</strong></summary>

| # | Repository | Stars | Language | Last push | Description | Website |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | [benitomartin/llm-observability-opik](https://github.com/benitomartin/llm-observability-opik) | 31 | Python | 2025-06-19 | LLM Evaluation and Observability System for Football Content | [decodingml.substack.com/p/your-ai-football-assist-eval-guide](https://decodingml.substack.com/p/your-ai-football-assist-eval-guide) |
| 2 | [AstronomerAmber/LLM_Observability](https://github.com/AstronomerAmber/LLM_Observability) | 11 | Jupyter Notebook | 2024-05-30 |  |  |
| 3 | [deepaksatna/LLM-Observability-Stack](https://github.com/deepaksatna/LLM-Observability-Stack) | 7 | Python | 2026-01-19 | A comprehensive observability stack for monitoring LLM inference and training workloads on Kubernetes with NVIDIA GPUs. This project provides Prometheus metrics collection, Grafana dashboards, GPU monitoring with DCGM, Kubernetes cluster monitoring, and custom LLM metrics |  |
| 4 | [pdichone/llm-observability-course](https://github.com/pdichone/llm-observability-course) | 6 | Python | 2026-01-21 |  |  |
| 5 | [TrueWatchTech/llm-observability-demo-setup-guide](https://github.com/TrueWatchTech/llm-observability-demo-setup-guide) | 6 | Python | 2025-12-04 | This guide helps you instrument your AI/LLM chatbot (built on the Dify platform with Ollama LLM) with observability using TrueWatch and DataKit. |  |
| 6 | [hghalebi/rust-llm-observability-guide](https://github.com/hghalebi/rust-llm-observability-guide) | 5 | Shell | 2026-02-27 | OpenTelemetry for Rig Agents: Practical tutorial from first run to production rigor |  |
| 7 | [vpr1995/llm-observability](https://github.com/vpr1995/llm-observability) | 4 | TypeScript | 2026-03-30 |  |  |
| 8 | [dynatrace-wwse/enablement-gen-ai-llm-observability](https://github.com/dynatrace-wwse/enablement-gen-ai-llm-observability) | 2 | HTML | 2026-07-07 |  | [dynatrace-wwse.github.io/enablement-gen-ai-llm-observability](https://dynatrace-wwse.github.io/enablement-gen-ai-llm-observability/) |
| 9 | [aminespinoza10/LLM-Observability](https://github.com/aminespinoza10/LLM-Observability) | 2 | Shell | 2026-01-27 | This repository is going to show you how to deploy a basic observability stack when using a local agent with Ollama |  |
| 10 | [donlelef/llm-observability-talk](https://github.com/donlelef/llm-observability-talk) | 2 | Python | 2025-05-29 | Code snippets for the talk "Observability for the GenAI Era" |  |
| 11 | [HrushikeshPawar/LLM-Observability-Monitoring](https://github.com/HrushikeshPawar/LLM-Observability-Monitoring) | 2 | Jupyter Notebook | 2024-11-19 | Hands-on notebooks for LLM app tracing, observability and evaluation: Arize Phoenix, OpenTelemetry, MLflow and eval pipelines |  |
| 12 | [ro-anderson/datadog-llm-observability-workshop](https://github.com/ro-anderson/datadog-llm-observability-workshop) | 2 |  | 2025-10-29 | notes and code from the workshop. |  |
| 13 | [ENGRZULQARNAIN/llm_observability_and_monitoring_tool](https://github.com/ENGRZULQARNAIN/llm_observability_and_monitoring_tool) | 2 | Python | 2025-06-25 |  |  |
| 14 | [AllTrue-ai/alltrue-llm-observability](https://github.com/AllTrue-ai/alltrue-llm-observability) | 1 | Python | 2026-04-24 |  |  |
| 15 | [samit-manna/llm-observability](https://github.com/samit-manna/llm-observability) | 1 | Python | 2025-10-03 | LLL Observability |  |
| 16 | [wentbackward/llm-observability](https://github.com/wentbackward/llm-observability) | 1 | Shell | 2026-04-27 | Monitor your LLM servers - Prometheus endpoint for scraping llm-proxy and nv-monitor endpoints |  |
| 17 | [deepan8545/LLM-Observability](https://github.com/deepan8545/LLM-Observability) | 1 | Python | 2026-03-31 | Production LLM observability layer — Langfuse tracing, p50/p95/p99 latency, cost-per-request, LLM-as-judge quality scoring (4.4/5), and CI benchmark gate on every PR. |  |
| 18 | [mukulchhabra23/llm-observability](https://github.com/mukulchhabra23/llm-observability) | 1 |  | 2026-02-25 | Reference toolkit for logging, tracing, evaluation telemetry, and monitoring patterns for production LLM applications with schema examples and instrumentation strategies. |  |
| 19 | [distroaryan/llm-observability](https://github.com/distroaryan/llm-observability) | 1 | Python | 2026-04-02 | created to learn how production grade and reliable llm systems are built |  |
| 20 | [DmitryDmitriadi/llm-observability-evaluation](https://github.com/DmitryDmitriadi/llm-observability-evaluation) | 1 |  | 2026-05-16 | Case study: unified observability + evaluation for automation and conversational AI agents. Versioned error catalog, multi-signal confidence, cost meters. |  |
| 21 | [PrithviHL/llm-observability-dashboard](https://github.com/PrithviHL/llm-observability-dashboard) | 1 | Python | 2026-06-24 | Self-hosted LLM observability & eval dashboard — ingests OpenTelemetry GenAI spans from OpenAI, Anthropic, Google, LangChain, LlamaIndex, and vLLM; runs DeepEval/RAGAS eval jobs; detects prompt drift via PSI; and alerts via Prometheus → Slack/PagerDuty. Built with ClickHouse, Postgres, and Next.js 15. |  |
| 22 | [mustifiz/LLM_Observability_Workshop](https://github.com/mustifiz/LLM_Observability_Workshop) | 1 | Jupyter Notebook | 2025-09-08 |  |  |
| 23 | [vaishnavi1144/llm-observability-platform](https://github.com/vaishnavi1144/llm-observability-platform) | 1 | Python | 2026-05-22 |  |  |
| 24 | [hunyaochong/llm-observability-workflow](https://github.com/hunyaochong/llm-observability-workflow) | 1 |  | 2025-08-12 |  |  |
| 25 | [anglerfishlyy/grafana-llm-observability](https://github.com/anglerfishlyy/grafana-llm-observability) | 1 | TypeScript | 2025-09-21 | Grafana plugin to monitor LLM requests: latency, tokens, cost, errors, and prompt comparison. Data ingestion via JSON; supports OpenAI, Anthropic, Llama, etc. |  |
| 26 | [cmangun/llm-observability-dashboards](https://github.com/cmangun/llm-observability-dashboards) | 1 | JavaScript | 2025-12-29 | Prometheus + Grafana observability stack for LLM-powered systems | [field-deployed-engineer.vercel.app](https://field-deployed-engineer.vercel.app) |
| 27 | [Pradeep-Shinde/llm-observability-platform](https://github.com/Pradeep-Shinde/llm-observability-platform) | 1 | Python | 2026-05-31 | Production-inspired observability platform for LLM applications using OpenWebUI, LiteLLM, Ollama, Langfuse, Prometheus, and Grafana. |  |
| 28 | [rahul-alhan/llm-observability-stack](https://github.com/rahul-alhan/llm-observability-stack) | 1 | Python | 2026-06-09 | Langfuse tracing + Prometheus SLOs + Streamlit cohort drilldown for production LangGraph agents — token cost, p95 latency, tool-call success, prompt-version A/B |  |
| 29 | [Chandanag8197/LLM-observability-dashboard](https://github.com/Chandanag8197/LLM-observability-dashboard) | 1 | Python | 2026-03-15 |  |  |
| 30 | [nagaraj07/llm-observability-system](https://github.com/nagaraj07/llm-observability-system) | 1 | Python | 2026-03-18 |  |  |
| 31 | [SSG-YERRAMSETTI/LLM-Observability-Polling-Pipeline](https://github.com/SSG-YERRAMSETTI/LLM-Observability-Polling-Pipeline) | 1 | Python | 2026-05-18 | Real-time monitoring and evaluation of production LLM systems across GCP and AWS |  |
| 32 | [seanlee10/llm-observability-with-arize-phoenix](https://github.com/seanlee10/llm-observability-with-arize-phoenix) | 1 | Jupyter Notebook | 2024-10-22 |  |  |
| 33 | [deepaksatna/LLM-Observability-Stack-v2.0](https://github.com/deepaksatna/LLM-Observability-Stack-v2.0) | 1 | HTML | 2026-02-12 | A comprehensive, production-ready observability stack for monitoring LLM inference workloads on Kubernetes with NVIDIA GPUs. This version focuses on ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat) for centralized log management and Infrastructure Testing with Pytest for deployment validation. |  |
| 34 | [kbsivacse/llm-observability](https://github.com/kbsivacse/llm-observability) | 0 |  | 2025-12-06 | A collection of demos and documentation for end-to-end LLM observability. Track, evaluate, and debug large language models with confidence. |  |
| 35 | [erwinfri/alltrue-llm-observability](https://github.com/erwinfri/alltrue-llm-observability) | 0 | Python | 2026-01-17 | Fork of the https://github.com/AllTrue-ai/alltrue-llm-observability repository |  |
| 36 | [kevinastuhuaman/llm-observability](https://github.com/kevinastuhuaman/llm-observability) | 0 |  | 2026-03-02 | Self-hosted LLM observability with Langfuse on Lightsail, fire-and-forget ingestion, and lightweight tracing. |  |
| 37 | [ozzyozbourne/llm-observability](https://github.com/ozzyozbourne/llm-observability) | 0 | Python | 2025-11-08 |  |  |
| 38 | [ByteWise-Cookie/llm-observability](https://github.com/ByteWise-Cookie/llm-observability) | 0 | Python | 2025-12-31 | LLM observability system that surfaces hallucination risk and quality degradation in Gemini-powered applications using Datadog. |  |
| 39 | [sqcvt/LLM-OBSERVABILITY](https://github.com/sqcvt/LLM-OBSERVABILITY) | 0 | C++ | 2026-06-30 |  |  |
| 40 | [codemits/LLM-observability](https://github.com/codemits/LLM-observability) | 0 | TypeScript | 2025-12-02 |  |  |
| 41 | [sbolla-ai/llm-observability](https://github.com/sbolla-ai/llm-observability) | 0 | Python | 2026-02-26 | production-grade repository for End-to-End Observability for AI/LLM Workloads using OpenTelemetry and Python |  |
| 42 | [SHUB2205/LLM-Observability](https://github.com/SHUB2205/LLM-Observability) | 0 | Python | 2025-09-15 |  |  |
| 43 | [sdace9719/llm-observability](https://github.com/sdace9719/llm-observability) | 0 | Python | 2025-12-26 |  |  |
| 44 | [cerenaaa/llm-observability](https://github.com/cerenaaa/llm-observability) | 0 | Python | 2026-05-27 | Tracing, logging, and cost monitoring for LLM applications in production |  |
| 45 | [Aho-Bakaa/llm_observability](https://github.com/Aho-Bakaa/llm_observability) | 0 | Python | 2026-04-23 |  |  |
| 46 | [mzandinia/llm-observability](https://github.com/mzandinia/llm-observability) | 0 | Python | 2026-07-08 | Portfolio flagship — see README |  |
| 47 | [rifahnazar1/llm-observability](https://github.com/rifahnazar1/llm-observability) | 0 | Python | 2026-02-26 |  |  |
| 48 | [vyshnavi841/LLM_Observability](https://github.com/vyshnavi841/LLM_Observability) | 0 | Python | 2026-03-20 |  |  |
| 49 | [Shuvodeep/llm_observability](https://github.com/Shuvodeep/llm_observability) | 0 | Python | 2026-03-19 |  |  |
| 50 | [MaximilianoRodrigoSoria/llmops-observability](https://github.com/MaximilianoRodrigoSoria/llmops-observability) | 0 | Python | 2026-07-08 |  |  |
| 51 | [Shubhamgiri2004/LLM-Observability](https://github.com/Shubhamgiri2004/LLM-Observability) | 0 | TypeScript | 2026-05-24 |  |  |
| 52 | [juliopessan/llm-observability](https://github.com/juliopessan/llm-observability) | 0 | TypeScript | 2026-03-27 |  |  |
| 53 | [Hansel-Christopher/llm-observability](https://github.com/Hansel-Christopher/llm-observability) | 0 | Python | 2024-06-16 |  |  |
| 54 | [yan-labs/llm-observability](https://github.com/yan-labs/llm-observability) | 0 | HTML | 2026-03-26 |  |  |
| 55 | [haffo/llm-observability](https://github.com/haffo/llm-observability) | 0 | Python | 2026-04-18 |  |  |
| 56 | [Srihari080802/LLM-Observability](https://github.com/Srihari080802/LLM-Observability) | 0 | Python | 2026-05-24 |  |  |
| 57 | [skiingfalcon/llm-observability](https://github.com/skiingfalcon/llm-observability) | 0 | Python | 2026-06-08 |  |  |
| 58 | [Divya2610/LLM-Observability](https://github.com/Divya2610/LLM-Observability) | 0 | Python | 2026-06-04 | Built a production-grade LLM Observability Platform with FastAPI, Prometheus and Grafana automatically evaluates every LLM response for relevance, faithfulness and toxicity, with real-time dashboards tracking latency, token usage and model health across providers. |  |
| 59 | [soutoner/llm-observability](https://github.com/soutoner/llm-observability) | 0 | Vue | 2026-06-17 | Content of the talk for rindus' Navigators of Code 2026 |  |
| 60 | [AddChew/llm-observability](https://github.com/AddChew/llm-observability) | 0 | Python | 2026-03-15 |  |  |
| 61 | [recrsn/llm-observability](https://github.com/recrsn/llm-observability) | 0 | Python | 2025-10-18 | LLM Observability example |  |
| 62 | [vee-studio1/llm-observability](https://github.com/vee-studio1/llm-observability) | 0 | Python | 2026-02-13 |  |  |
| 63 | [espirado/llm-observability](https://github.com/espirado/llm-observability) | 0 | Python | 2025-12-15 |  |  |
| 64 | [Prof-it/llm-observability](https://github.com/Prof-it/llm-observability) | 0 | Python | 2026-06-23 | This repository provides anonymized qualitative research materials underpinning the "Agentic RAG and LLMs for Holistic Observability in Fintech" case study. Code includes QR-code generator. |  |
| 65 | [pankaj45/llm-observability](https://github.com/pankaj45/llm-observability) | 0 | Java | 2026-05-25 | A production-grade AI observability and inference logging platform with a streaming chatbot UI, live-data grounding via context orchestration, regex-based PII redaction, event-driven ingestion pipeline, multi-turn conversation continuity, and an operator analytics dashboard. |  |
| 66 | [cyohan21/llm-observability](https://github.com/cyohan21/llm-observability) | 0 | TypeScript | 2025-09-19 |  |  |
| 67 | [JephinJose/llm-observability](https://github.com/JephinJose/llm-observability) | 0 | TypeScript | 2026-07-01 |  |  |
| 68 | [project1shelby-ui/llm-observability-](https://github.com/project1shelby-ui/llm-observability-) | 0 |  | 2026-07-03 | Open-source LLM observability platform — SDK auto-captures cost/latency/tokens per call, NLI-based hallucination detection, prompt version control, and golden dataset regression testing. |  |
| 69 | [Partha-2/llm-observability](https://github.com/Partha-2/llm-observability) | 0 | JavaScript | 2026-05-22 |  |  |
| 70 | [gopalpamidimukkala/llm-observability](https://github.com/gopalpamidimukkala/llm-observability) | 0 | TypeScript | 2026-05-23 |  |  |
| 71 | [Anirudh11011/LLM-Observability](https://github.com/Anirudh11011/LLM-Observability) | 0 | Python | 2026-06-23 |  |  |
| 72 | [av1kav/llm-observability](https://github.com/av1kav/llm-observability) | 0 |  | 2025-07-18 | An evaluation of LLMs through the Comet Opik OSS Observability framework |  |
| 73 | [tkilper/llm-observability](https://github.com/tkilper/llm-observability) | 0 | Python | 2026-04-16 | End-to-end streaming pipeline for LLM API observability - |  |
| 74 | [gaoyuan796/llm-observability](https://github.com/gaoyuan796/llm-observability) | 0 | Jupyter Notebook | 2025-09-22 |  |  |
| 75 | [nbrosse/llm-observability](https://github.com/nbrosse/llm-observability) | 0 | Python | 2025-08-15 | LLM observability using langfuse and a fasthtml chatbot |  |
| 76 | [chandanCoding/llm-observability](https://github.com/chandanCoding/llm-observability) | 0 | Python | 2026-06-28 | Tracing, token-cost accounting, and evaluation metrics for production LLM applications |  |
| 77 | [22A91A61E8/llm-observability](https://github.com/22A91A61E8/llm-observability) | 0 | Python | 2026-06-10 |  |  |
| 78 | [praveen-netinti/llm-observability](https://github.com/praveen-netinti/llm-observability) | 0 | TypeScript | 2026-06-23 | Trace, debug, and monitor LLM applications with interactive traces, Slack alerts, issues, and analytics. | [neosigma-llm-observability.vercel.app](https://neosigma-llm-observability.vercel.app) |
| 79 | [Srieehari/LLM_Observability](https://github.com/Srieehari/LLM_Observability) | 0 | TypeScript | 2026-07-03 |  |  |
| 80 | [Srimonchaari/LLM-Observability](https://github.com/Srimonchaari/LLM-Observability) | 0 | Python | 2026-03-29 |  |  |
| 81 | [Sebastian-411/llm-observability](https://github.com/Sebastian-411/llm-observability) | 0 | Python | 2026-06-09 |  |  |
| 82 | [Shruti-lab/llm-observability](https://github.com/Shruti-lab/llm-observability) | 0 | Python | 2026-05-14 |  |  |
| 83 | [sahared/llm-observability](https://github.com/sahared/llm-observability) | 0 | Go | 2025-12-15 | Production-ready observability platform for AI agents and LLM applications. |  |
| 84 | [Manoj-py/llm-observability](https://github.com/Manoj-py/llm-observability) | 0 | Go | 2026-05-28 |  |  |
| 85 | [IshaVishwakarma/llm-observability](https://github.com/IshaVishwakarma/llm-observability) | 0 | Python | 2026-05-08 |  |  |
| 86 | [Gabrielteixeira2004/LLM_Observability](https://github.com/Gabrielteixeira2004/LLM_Observability) | 0 | Python | 2025-12-11 |  |  |

</details>

## How it works

```mermaid
flowchart LR
    K["--keywords / KEYWORDS env"] --> Q
    QJ[config/queries.json<br/>fallback] --> Q
    Q[lib/queries.js<br/>query resolution] --> D
    X[config/exclusions.json] --> D
    subgraph pipeline [run.js]
        D[1. Discover<br/>search, dedupe, filter] --> E[2. Enrich<br/>per-repo metadata]
        E --> S[3. Store<br/>snapshot + export]
    end
    S --> DB[(competitors.db)]
    S --> CSV[competitors.csv]
```

| Stage | Module | What it does |
| --- | --- | --- |
| **Discover** | `lib/discover.js` | Resolves search queries via `lib/queries.js` (generated from `--keywords`, or `config/queries.json` when no keywords are given), runs each against the GitHub Search API, dedupes results by repository full name, drops repos listed in `config/exclusions.json`, and sorts by stars. A configurable delay between queries (longer when unauthenticated) stays within GitHub's search rate limits. |
| **Enrich** | `lib/enrich.js` | For each candidate, fetches full repository metadata, README, releases, contributors, language breakdown, weekly commit activity, and recent commits. Runs with bounded concurrency; any endpoint that fails yields `null` for that field rather than aborting the run. |
| **Store** | `lib/store.js` | Writes one snapshot per day into `competitors.db` and regenerates `competitors.csv` ranked by stars. Re-running on the same day overwrites that day's snapshot, so runs are idempotent. Also reports which repos are new since the last snapshot. |

Shared plumbing lives in `lib/github.js`: a thin GitHub REST client that adds auth headers, tracks request counts, retries on transient network errors, and automatically sleeps until `x-ratelimit-reset` when rate limited.

## Quick start

**Prerequisites:** Node.js 18 or newer (the pipeline uses the built-in `fetch`).

```bash
# 1. Install
npm install

# 2. Set a GitHub token (strongly recommended - see Rate limits below)
export GITHUB_TOKEN=ghp_xxx          # bash / zsh
$env:GITHUB_TOKEN = "ghp_xxx"        # PowerShell

# 3. Run the full pipeline against YOUR market
node run.js --keywords "vector database, embedding search"

# ...or run without --keywords to use the hand-tuned example queries
# (AI agent / LLM memory space) in config/queries.json
node run.js
```

No special token scopes are needed; a classic personal access token with public repository read access is enough. The pipeline runs unauthenticated too, just much more slowly.

## Usage

### Full pipeline

```bash
node run.js
```

Runs discover, enrich, and store in sequence. Produces or updates:

| Output | Description |
| --- | --- |
| `competitors.db` | SQLite database with one row per repo per snapshot date (`repos` table) plus full README text (`readmes` table) |
| `competitors.csv` | Star-ranked summary of the latest run, ready to open in a spreadsheet |

**Flags**

| Flag | Effect |
| --- | --- |
| `--keywords "kw1, kw2"` | Generate search queries from a comma-separated keyword list instead of using `config/queries.json`. Each keyword expands into a `topic:` query plus name/description matches. The `KEYWORDS` env var works too (the flag wins if both are set). |
| `--no-store` | Skip writing the database and CSV; print the enriched records as JSON to stdout instead |

```bash
# Pipe a snapshot into other tooling without touching the database
node run.js --no-store > snapshot.json
```

Progress logs and the end-of-run summary (repos discovered, API requests used, rate limit remaining, new repos since last snapshot) are printed to **stderr**, so stdout stays clean for JSON output and shell pipelines.

<details>
<summary><strong>Example run summary</strong></summary>

```text
=== run summary ===
snapshot date:        2026-07-09
discovered:           412
passed filters:       398
enriched:             395
new since last snap:  3
  + some-org/new-memory-layer
  + another/agent-recall
  + acme/context-store
  (review these for exclusions.json false positives)
API requests used:    2871
rate limit remaining: 2101
elapsed:              643.2s
output:               competitors.db, competitors.csv
```

</details>

### Fast mode (discover only)

```bash
node run-fast.js --keywords "vector database"   # keywords optional, as with run.js
```

Skips enrichment entirely and writes `competitors.csv` straight from the search results, which already carry stars, description, homepage, topics, and last-push date. Use fast mode when:

- You just want an up-to-date ranked list in a minute or two
- The candidate volume is large enough to trip GitHub's secondary rate limits during enrichment

## Configuration

There are two ways to define your prospecting space, and no code changes are needed to retarget the pipeline to a different market:

1. **Keywords (zero setup):** `node run.js --keywords "your, market, terms"` (or set the `KEYWORDS` env var). Each keyword is expanded into overlapping queries — a `topic:` search plus name and description matches — and results are deduplicated across them.
2. **Hand-tuned queries (max precision):** edit `config/queries.json`. Used whenever no keywords are given.

Tuning knobs and false-positive curation live in two more JSON files in `config/`.

### `config/queries.json` - what to search for

The list of GitHub search queries used when `--keywords` is not given. Any [GitHub repository search syntax](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories) works: topics, description matches, quoted phrases, qualifiers. The shipped list targets the AI agent / LLM memory space and doubles as an example of the pattern: start from keyword-generated queries, then graduate to a hand-tuned list once you know which shapes find your market.

```json
[
  "topic:agent-memory",
  "\"memory layer\" llm in:description",
  "\"long-term memory\" agent in:description"
]
```

> [!TIP]
> Cast a wide net with overlapping queries. Results are deduplicated across queries, and each stored record remembers which query first discovered it (`discovered_via_query`), which helps you evaluate query quality over time.

### `config/thresholds.json` - tuning knobs

Rate limiting, concurrency, and fetch-depth settings:

| Key | Default | Meaning |
| --- | --- | --- |
| `minStars` | `10` | Minimum star count (reserved; relevance filtering is currently disabled) |
| `maxMonthsSincePush` | `6` | Staleness cutoff (reserved; relevance filtering is currently disabled) |
| `searchPerPage` | `100` | Results fetched per search query |
| `searchDelayMsAuthed` | `2500` | Delay between search queries with a token |
| `searchDelayMsUnauthed` | `7000` | Delay between search queries without a token |
| `enrichConcurrency` | `5` | Repos enriched in parallel |
| `commitActivityMaxRetries` | `3` | Retries while GitHub computes commit stats (HTTP 202) |
| `commitActivityRetryDelayMs` | `2000` | Delay between those retries |
| `recentCommitsPerPage` | `20` | Recent commits captured per repo |
| `releasesPerPage` | `10` | Releases captured per repo |
| `contributorsPerPage` | `30` | Contributors captured per repo |

> [!NOTE]
> Automatic relevance filtering (stars/staleness) in `lib/discover.js` is currently disabled, so all discovered repos flow through for manual review. Curate the list with `exclusions.json` instead.

### `config/exclusions.json` - curated false positives

A map of `owner/repo` to a short reason, for repositories that match the queries but are not actually competitors (general agent frameworks, databases marketing to agent workloads, and so on). Excluded repos are dropped during the discover stage. The reasons are documentation for your future self. The shipped entries belong to the example agent-memory queries — when retargeting to your own market, start from `{}`.

```json
{
  "langchain-ai/langchain": "framework, memory is a submodule",
  "pingcap/tidb": "database marketing to agent workloads"
}
```

**Recommended workflow:** after each run, review the "new since last snapshot" list in the run summary and add any false positives here with a one-line reason.

## Data model

`competitors.db` contains two tables, both keyed by `(full_name, snapshot_date)`:

| Table | Contents |
| --- | --- |
| `repos` | One row per repo per snapshot: stars, forks, issues, watchers, topics, per-language byte counts, license, contributor counts, release info, weekly commit activity, recent commits, and the query that discovered it. Array and object fields are stored as JSON strings. |
| `readmes` | Full README markdown per repo per snapshot, kept in its own table so the main table stays light for querying. |

Because snapshots accumulate, longitudinal queries are trivial:

```sql
-- Star growth of one repo over time
SELECT snapshot_date, stargazers_count
FROM repos
WHERE full_name = 'some-org/some-repo'
ORDER BY snapshot_date;
```

```sql
-- Fastest-growing repos between the two most recent snapshots
WITH latest AS (SELECT MAX(snapshot_date) d FROM repos),
     prev   AS (SELECT MAX(snapshot_date) d FROM repos WHERE snapshot_date < (SELECT d FROM latest))
SELECT a.full_name,
       b.stargazers_count - a.stargazers_count AS stars_gained
FROM repos a
JOIN repos b ON b.full_name = a.full_name AND b.snapshot_date = (SELECT d FROM latest)
WHERE a.snapshot_date = (SELECT d FROM prev)
ORDER BY stars_gained DESC
LIMIT 20;
```

## Project layout

```text
github-prospecting/
├── run.js                  # Full pipeline entry point (discover -> enrich -> store)
├── run-fast.js             # Discover-only entry point (CSV straight from search)
├── lib/
│   ├── github.js           # Shared REST client: auth, rate limits, retries
│   ├── queries.js          # Query resolution: keywords -> queries, or queries.json
│   ├── discover.js         # Stage 1: search, dedupe, filter exclusions, sort
│   ├── enrich.js           # Stage 2: per-repo metadata fetch
│   └── store.js            # Stage 3: SQLite snapshot + CSV export
├── config/
│   ├── queries.json        # Search queries defining the space
│   ├── thresholds.json     # Rate limits and fetch-depth tuning
│   └── exclusions.json     # Known false positives, with reasons
├── competitors.db          # Generated: snapshot history (gitignored)
└── competitors.csv         # Generated: latest star-ranked summary (gitignored)
```

## Rate limits

GitHub's API limits are the main constraint on this pipeline, and it is built to respect them:

| | Authenticated | Unauthenticated |
| --- | --- | --- |
| Core API | 5,000 requests/hour | 60 requests/hour |
| Search API | 30 requests/minute | 10 requests/minute |

- **Always run with `GITHUB_TOKEN` set.** An unauthenticated full run is effectively impractical beyond a handful of repos.
- **Primary limits are handled automatically.** On a 403/429 the client sleeps until `x-ratelimit-reset` and retries, so long runs recover on their own.
- **Secondary (abuse) limits** can still trigger during enrichment at high candidate volume. If that happens, lower `enrichConcurrency` in `config/thresholds.json` or use `run-fast.js`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Run is extremely slow, long pauses between queries | No `GITHUB_TOKEN` set | Export a token; authenticated search delay drops from 7s to 2.5s per query |
| Repeated `rate limited on ...` messages during enrichment | GitHub secondary rate limit | Lower `enrichConcurrency`, or switch to `node run-fast.js` |
| `weekly_commits` is `null` for some repos | GitHub returns 202 while computing stats and retries were exhausted | Re-run later; stats are usually cached by GitHub after the first request |
| `skipping <repo>: repo metadata fetch failed` | Repo was deleted or made private between discovery and enrichment | Expected; the repo is dropped from the snapshot |
| A repo you know is irrelevant keeps appearing | It matches a query | Add it to `config/exclusions.json` with a reason |
