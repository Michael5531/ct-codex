# 更新日志

[English](CHANGELOG.md)

本文件记录项目中所有重要变更。

## [Unreleased]

### 新增

- 适用于 macOS、Linux 与 WSL 的 `ct codex` 跨平台启动器。
- 按外层终端隔离 tmux session。
- 当前 Codex pane 的 Context、Uncached 与 Cache 底部状态栏。
- 显示当前模型标签和 12 格进度条的 Context 底栏。
- 将 `Bill` 更名为 `Uncached`，避免把 session 的 token 吞吐量误认为发票金额。
- 新增终端风格功能图，展示上下文追踪、标签页隔离及模型/部署窗口配置。
- npm 安装器、中英文文档，以及 macOS/Linux 验证工作流。

### 修复

- Context 现复刻 Codex CLI 0.148.0 的 rollout 计算：`last_token_usage.total_tokens`、`model_context_window`、12,000 token 预留，以及先算剩余再取整的顺序。
- 已移除终端屏幕抓取和 `/statusline` 依赖；`/statusline` 现在仅可作为独立的 double-check。
- 只有 rollout 没有可用的 context window 时，Context 才会显示不可用。
