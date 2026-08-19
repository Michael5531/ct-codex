# 贡献指南

[English](CONTRIBUTING.md)

感谢你帮助 `ct-codex` 在不同终端和操作系统中保持可靠。

## 提交 Pull Request 前

1. 启动器必须兼容 POSIX `sh`；不要加入特定 shell 的语法。
2. 必须保持 macOS、Linux 与 WSL 支持。
3. 修改 npm 安装器时，请添加或更新测试。
4. 运行：

   ```sh
   npm run check
   npm run pack:check
   ```

5. 修改面向用户的行为时，请同时更新中文和英文文档。

## 报告问题

请提供操作系统、终端模拟器、shell、tmux 版本、Codex CLI 版本、完整命令和 `ct doctor` 输出。提交日志前，请删除会话内容及其他敏感信息。

## 范围

项目只专注于启动 Codex 和展示本地 token 用量。为了保持轻量与跨平台，无关的终端框架功能可能不会被接受。
