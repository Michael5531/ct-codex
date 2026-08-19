# ct-codex

[![CI](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml/badge.svg)](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml)
[![npm](https://img.shields.io/npm/v/ct-codex?logo=npm&label=npm)](https://www.npmjs.com/package/ct-codex)
[![License](https://img.shields.io/github/license/Michael5531/ct-codex)](LICENSE)
[![Platforms](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20WSL-0f766e)](#支持的平台)
[![Status](https://img.shields.io/badge/status-pre--release-f59e0b)](CHANGELOG.zh-CN.md)

[English](README.md) · [平台安装说明](docs/platform-setup.zh-CN.md) · [贡献指南](CONTRIBUTING.zh-CN.md) · [更新日志](CHANGELOG.zh-CN.md)

`ct-codex` 用于安装 `ct`：一个面向 Codex CLI 的跨平台 tmux 启动器。它会让每个终端标签页拥有独立、可重新连接的 tmux session，并在 session 底部显示精简的 token 用量状态栏。

> **预发布版本**：项目已可在本地使用和评审；npm 与 GitHub badges 会在首次公开发布后自动生效。

## 支持的平台

- macOS：iTerm2、Terminal 及其他终端模拟器
- Linux
- WSL：请在 Linux 发行版内运行

不支持原生 Windows，因为 `ct` 依赖 tmux 和 POSIX 命令。

## 安装

要求：Node.js 18+、Codex CLI、tmux、jq、lsof、ps、awk、sed、sort、tail。各系统的准确安装命令请参阅[平台安装说明](docs/platform-setup.zh-CN.md)。

```sh
npx -y ct-codex install
ct doctor
ct codex
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
Context █░░░░░░░░░ 4% (42.6k/1.05M) │ Bill 45.8k (↑42.6k ↓3.2k) │ Cache 338.4k
```

- **Context**：最新输入上下文，相对于 1,050,000 token 上下文窗口。
- **Bill**：未命中缓存的输入 token 加输出 token。
- **Cache**：缓存命中的输入 token，单独显示且不计入 **Bill**。

tmux 默认的窗口编号列表已隐藏，让状态栏只聚焦用量信息。

## 命令

```sh
ct codex [codex 参数...]
ct doctor

npx -y ct-codex doctor
npx -y ct-codex uninstall
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
