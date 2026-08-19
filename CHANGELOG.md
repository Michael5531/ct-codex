# Changelog

[中文](CHANGELOG.zh-CN.md)

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Portable `ct codex` launcher for macOS, Linux, and WSL.
- Per-terminal tmux session isolation.
- Bottom status bar with context, billable tokens, and cache hits for the active Codex pane.
- Model-aware context bar with a current-model label, 12-cell progress bar, per-rollout window telemetry, and explicit deployment overrides.
- Renamed `Bill` to `Uncached` so the session token throughput is not mistaken for an invoice.
- npm installer, bilingual documentation, and macOS/Linux verification workflow.
