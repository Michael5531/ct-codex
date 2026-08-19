# Platform setup

[中文](platform-setup.zh-CN.md)

`ct` needs the Codex CLI, tmux, jq, lsof, and standard POSIX command-line tools. Node.js 18+ is required only for the `npx` installer.

## macOS

Install Homebrew first if necessary, then install the missing dependencies:

```sh
brew install tmux jq
```

`lsof`, `ps`, `awk`, `sed`, `sort`, and `tail` are included with macOS. Install and authenticate the Codex CLI separately, then run:

```sh
npx -y github:Michael5531/ct-codex install
ct doctor
ct codex
```

## Ubuntu, Debian, and WSL Ubuntu

```sh
sudo apt update
sudo apt install -y tmux jq lsof

npx -y github:Michael5531/ct-codex install
ct doctor
ct codex
```

For WSL, run all commands inside the Linux distribution, not in PowerShell or Command Prompt.

## Fedora and RHEL-family Linux

```sh
sudo dnf install -y tmux jq lsof
```

## Arch Linux

```sh
sudo pacman -S --needed tmux jq lsof
```

## PATH

The installer places `ct` in `~/.local/bin`. Add it to your shell startup file when needed:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

For zsh, add that line to `~/.zshrc`; for bash, use `~/.bashrc`; for fish:

```fish
fish_add_path ~/.local/bin
```
