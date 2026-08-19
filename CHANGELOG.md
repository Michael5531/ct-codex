# Changelog

[中文](CHANGELOG.zh-CN.md)

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Portable `ct codex` launcher for macOS, Linux, and WSL.
- Per-terminal tmux session isolation.
- Bottom status bar with context, billable tokens, and cache hits for the active Codex pane.
- Context bar with a current-model label and 12-cell progress bar.
- Renamed `Bill` to `Uncached` so the session token throughput is not mistaken for an invoice.
- Added terminal-style feature visuals for context tracking, tab isolation, and model/deployment window configuration.
- npm installer, bilingual documentation, and macOS/Linux verification workflow.

### Fixed

- Context now reimplements Codex CLI 0.148.0's rollout-based calculation: `last_token_usage.total_tokens`, `model_context_window`, the 12,000-token baseline, and Codex's remaining-first rounding order.
- Removed terminal screen scraping and the `/statusline` dependency. `/statusline` is now only an optional independent double-check.
- Context is marked unavailable only when the rollout has no usable context window.
