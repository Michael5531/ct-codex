# ct-codex

[![CI](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml/badge.svg)](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml)
[![License](https://img.shields.io/github/license/Michael5531/ct-codex)](LICENSE)
[![Platforms](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20WSL-0f766e)](#支持的平台)
[![Status](https://img.shields.io/badge/status-pre--release-f59e0b)](CHANGELOG.zh-CN.md)

[English](README.md) · [平台安装说明](docs/platform-setup.zh-CN.md) · [贡献指南](CONTRIBUTING.zh-CN.md) · [更新日志](CHANGELOG.zh-CN.md)

`ct-codex` 用于安装 `ct`：一个面向 Codex CLI 的跨平台 tmux 启动器。它会让每个终端标签页拥有独立、可重新连接的 tmux session，并在 session 底部显示精简的 token 用量状态栏。

> **预发布版本**：可立即通过 `npx -y github:Michael5531/ct-codex install` 从 GitHub 安装；首次发布到 npm 后会提供更短的 npm 命令。

## 它解决的痛点

在长时间 Codex TUI 会话中，没有一个常驻、持续刷新的视图来显示当前 session 的 token 用量和上下文窗口。`/usage` 不展示 Azure Foundry 托管用量，也不是 Azure 账单计量器，因此无法为 Azure 托管部署提供这类视图。

`ct` 会把当前 session 的本地遥测常驻显示在终端底部。**Uncached** 仅为未命中缓存的输入 token 加输出 token，用于运行时追踪；它不是 Azure Foundry 发票，也不是账号级成本计算。

## 支持的平台

- macOS：iTerm2、Terminal 及其他终端模拟器
- Linux
- WSL：请在 Linux 发行版内运行

不支持原生 Windows，因为 `ct` 依赖 tmux 和 POSIX 命令。

## 安装

要求：Node.js 18+、Codex CLI、tmux、jq、lsof、ps、awk、sed、sort、tail。各系统的准确安装命令请参阅[平台安装说明](docs/platform-setup.zh-CN.md)。

```sh
npx -y github:Michael5531/ct-codex install
ct doctor
ct codex
```

首次 npm 发布后，安装命令会变为：

```sh
npx -y ct-codex install
```

安装器会将 `ct` 写入 `~/.local/bin/ct`。若该目录不在 `PATH` 中，请将以下内容加入 shell 配置后重新打开终端：

```sh
export PATH="$HOME/.local/bin:$PATH"
```

需要指定安装目录时：

```sh
npx -y ct-codex install --bin-dir "$HOME/bin"
```

## 为什么使用 `ct`？

- **标签页隔离**：每个外层终端 tab 都有稳定的 tmux session，不会全部连到共享的 `codex` session。
- **按 pane 统计**：底栏只读取当前活动 pane 的 Codex rollout 日志。
- **跨平台安装**：同一条 `npx` 安装命令适用于 macOS、Linux 与 WSL。

## 功能截图

### 常驻查看 Codex Context 信号和吞吐量

![终端状态栏中的上下文进度、当前模型、未命中缓存 token 与缓存 token](docs/images/01-context-bar.svg)

进度条直接复刻 Codex CLI 从活动 rollout 记录得出的 Context 算法；它不抓取终端屏幕，也不依赖 `/statusline`。**Uncached** 单独统计本 session 的 token 吞吐量，因此不会被误认为上下文容量或发票。

### 让每个终端标签页保持独立

![两个独立的终端标签页，各自拥有 ct-codex tmux session 和 token 状态栏](docs/images/02-tab-isolation.svg)

每个外层终端 tab 都会得到独立的 tmux session。在某个 tab 再次运行 `ct codex` 时，只会回到属于该 tab 的 session。

## 工作方式

- 在任意终端标签页运行 `ct codex`。
- 外层终端 TTY 与 shell 身份共同生成稳定的 tmux session 名称。
- 在同一个标签页再次运行 `ct codex`，会重新连接到自己的 session。
- 不同标签页会使用不同 session，切换 tab 不会合并或跳到彼此的 Codex 工作区。
- 在 tmux 内运行 `ct codex` 时，会直接在当前 tmux session 启动 Codex，不会嵌套 tmux。
- 自动命名不适用时可使用 `CT_SESSION_NAME=my-session ct codex` 显式指定名称。

## 底部状态栏

tmux 底栏只追踪当前活动 pane 的 Codex rollout 文件：

```text
Context ██████░░░░░░ 50% used (56.3k/112.5k) gpt-5.6-terra │ Uncached 1.1M (↑967.2k ↓144.1k) │ Cache 14.7M
```

- **Context**：使用活动 rollout 的 `last_token_usage.total_tokens` 与 `model_context_window`，并采用与 Codex CLI 相同的 12,000 token 预留及取整顺序。`(used/window)` 已恢复，且采用同一口径：`(last total − 12k) / (model window − 12k)`，并在有效窗口上限截断；因此它能交叉验证进度条，而不会与进度条相互矛盾。
- **Uncached（未命中缓存）**：当前 session 累计的未命中缓存输入 token 加输出 token。这是 token 吞吐量，不是账单金额。
- **Cache**：缓存命中的输入 token，单独显示且不计入 **Uncached**。

tmux 默认的窗口编号列表已隐藏，让状态栏只聚焦用量信息。

### Context 的准确性

`ct` 在源码层复刻 Codex CLI 0.148.0 的 Context 算法：从 rollout 窗口和最后一次请求总量中扣除 Codex 固定预留的 12,000 token，先对剩余百分比取整，再显示 `100 - 剩余`。它优先使用 rollout 实际给出的 `model_context_window`，没有时回退到 `~/.codex/config.toml` 中常规顶层的 `model_context_window`，与 Codex TUI 源码的优先级一致，不依赖模型名称表或硬编码的 Terra 数值。

`/statusline` 是可选项，`ct` 不会读取它。若你在其中启用 `context-remaining` 和 `context-used`，可以把它作为独立的 double-check：同一条当前 rollout 的两个数值应当一致。只有 rollout 没有可用的 context window 时，`ct` 才显示 Context 不可用。

## 命令

```sh
ct codex [codex 参数...]
ct doctor

npx -y github:Michael5531/ct-codex doctor
npx -y github:Michael5531/ct-codex uninstall
```

`uninstall` 只会删除由本包安装的 `ct`，不会删除无关的同名命令。

## 常见问题

- 先运行 `ct doctor`，它会列出缺失的本地命令。
- 若提示 `ct: command not found`，请将 `~/.local/bin` 加入 `PATH` 后重新打开终端。
- 若底栏显示 `waiting for Codex in this pane`，请在该 pane 用 `ct codex` 启动 Codex，并等待第一条 token 用量事件。

## 开发与发布前检查

```sh
npm test
npm run check
npm run pack:check
```

GitHub Actions 会在 macOS 与 Linux 上验证安装器。

发布前使用 `npm version <patch|minor|major>`，然后运行 `npm publish`。未加 scope 的 npm 包名必须可被你的 npm 账号使用；若不可用，请改用 scoped 包名。

## 许可证

[MIT](LICENSE)
