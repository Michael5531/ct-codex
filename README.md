# ct-codex

[![CI](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml/badge.svg)](https://github.com/Michael5531/ct-codex/actions/workflows/verify.yml)
[![License](https://img.shields.io/github/license/Michael5531/ct-codex)](LICENSE)
[![Platforms](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20WSL-0f766e)](#supported-platforms)
[![Status](https://img.shields.io/badge/status-pre--release-f59e0b)](CHANGELOG.md)

[中文文档](README.zh-CN.md) · [Platform setup](docs/platform-setup.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

`ct-codex` installs `ct`, a portable tmux launcher for the Codex CLI. It gives each terminal tab its own persistent tmux session and renders a compact token-usage bar at the bottom of that session.

> **Pre-release** — install directly from GitHub with `npx -y github:Michael5531/ct-codex install`. The shorter npm command will be available after the first npm release.

## Supported platforms

- macOS — iTerm2, Terminal, and other terminal emulators
- Linux
- WSL (run inside a Linux distribution)

Native Windows is not supported because `ct` relies on tmux and POSIX utilities.

## Install

Requirements: Node.js 18+, the Codex CLI, tmux, jq, lsof, ps, awk, sed, sort, and tail. See [platform setup](docs/platform-setup.md) for exact package-manager commands.

```sh
npx -y github:Michael5531/ct-codex install
ct doctor
ct codex
```

After the first npm release, the install command will become:

```sh
npx -y ct-codex install
```

The installer writes `ct` to `~/.local/bin/ct`. If that directory is not on your `PATH`, add this to your shell configuration and restart the shell:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Install to another directory when needed:

```sh
npx -y ct-codex install --bin-dir "$HOME/bin"
```

## Why `ct`?

- **Tab isolation** — each outer terminal tab gets its own stable tmux session instead of all tabs attaching to one shared `codex` session.
- **Per-pane usage** — the bottom bar reads only the active pane's Codex rollout log.
- **Portable setup** — one `npx` installer works on macOS, Linux, and WSL.

## How it behaves

- Run `ct codex` from any terminal tab.
- The outer terminal TTY and shell identity determine a stable tmux session name.
- Running `ct codex` again from the same tab reattaches to its own session.
- Other tabs get different sessions, so switching tabs never merges their Codex work.
- Running `ct codex` inside tmux starts Codex in the current tmux session rather than nesting tmux.
- Set `CT_SESSION_NAME=my-session` when a script needs an explicit name.

## Status bar

The bottom tmux bar tracks only the active pane's Codex rollout file:

```text
Context █░░░░░░░░░ 4% (42.6k/1.05M) │ Bill 45.8k (↑42.6k ↓3.2k) │ Cache 338.4k
```

- **Context** is the latest input context against a 1,050,000-token window.
- **Bill** is uncached input plus output tokens.
- **Cache** is cached input tokens, shown separately and excluded from **Bill**.

The tmux window index list is deliberately hidden to keep the bar focused on usage.

## Commands

```sh
ct codex [codex arguments...]
ct doctor

npx -y github:Michael5531/ct-codex doctor
npx -y github:Michael5531/ct-codex uninstall
```

`uninstall` only removes a `ct` file installed by this package. It refuses to remove an unrelated command.

## Troubleshooting

- Run `ct doctor` first. It lists any missing local commands.
- If `ct: command not found`, add `~/.local/bin` to `PATH` and open a new shell.
- If the bar says `waiting for Codex in this pane`, start Codex with `ct codex` in that pane and wait for its first usage event.

## Development

```sh
npm test
npm run check
npm run pack:check
```

The GitHub Actions workflow validates the installer on macOS and Linux.

Before creating a release, use `npm version <patch|minor|major>` and then run `npm publish`. The unscoped npm package name must be available to your npm account; use a scoped name if it is not.

## License

[MIT](LICENSE)
