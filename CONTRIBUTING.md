# Contributing

[中文](CONTRIBUTING.zh-CN.md)

Thanks for helping make `ct-codex` reliable across terminals and operating systems.

## Before opening a pull request

1. Keep the launcher POSIX `sh` compatible; do not add shell-specific syntax.
2. Preserve support for macOS, Linux, and WSL.
3. Add or update tests when changing the npm installer.
4. Run:

   ```sh
   npm run check
   npm run pack:check
   ```

5. Update both English and Chinese documentation for user-facing changes.

## Reporting a bug

Include the OS, terminal emulator, shell, tmux version, Codex CLI version, the exact command, and `ct doctor` output. Remove session content and other sensitive information before posting logs.

## Scope

The project intentionally focuses on launching Codex and showing local token usage. Unrelated terminal-framework features may be declined to keep the tool small and portable.
