# 平台安装说明

[English](platform-setup.md)

`ct` 需要 Codex CLI、tmux、jq、lsof 与标准 POSIX 命令行工具。只有 `npx` 安装器需要 Node.js 18+。

## macOS

如尚未安装 Homebrew，请先安装；然后安装缺失依赖：

```sh
brew install tmux jq
```

macOS 已包含 `lsof`、`ps`、`awk`、`sed`、`sort` 和 `tail`。请单独安装并登录 Codex CLI，然后运行：

```sh
npx -y ct-codex install
ct doctor
ct codex
```

## Ubuntu、Debian 与 WSL Ubuntu

```sh
sudo apt update
sudo apt install -y tmux jq lsof

npx -y ct-codex install
ct doctor
ct codex
```

在 WSL 中，请于 Linux 发行版内执行上述命令，不要在 PowerShell 或 Command Prompt 中执行。

## Fedora 与 RHEL 系发行版

```sh
sudo dnf install -y tmux jq lsof
```

## Arch Linux

```sh
sudo pacman -S --needed tmux jq lsof
```

## PATH

安装器会将 `ct` 放到 `~/.local/bin`。如有需要，请将它加入 shell 启动文件：

```sh
export PATH="$HOME/.local/bin:$PATH"
```

zsh 请加到 `~/.zshrc`，bash 请加到 `~/.bashrc`；fish 使用：

```fish
fish_add_path ~/.local/bin
```
