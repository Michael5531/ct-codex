import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const cli = join(root, "bin", "ct-codex.js");

test("installs a syntax-valid ct launcher into a chosen bin directory", () => {
  const directory = mkdtempSync(join(tmpdir(), "ct-codex-"));
  const binDirectory = join(directory, "bin");
  try {
    execFileSync(process.execPath, [cli, "install", "--bin-dir", binDirectory], { encoding: "utf8" });
    const installedScript = join(binDirectory, "ct");
    assert.equal(existsSync(installedScript), true);
    assert.match(readFileSync(installedScript, "utf8"), /portable tmux launcher/);
    execFileSync("sh", ["-n", installedScript]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("refuses to replace an unrelated ct command without --force", () => {
  const directory = mkdtempSync(join(tmpdir(), "ct-codex-"));
  const binDirectory = join(directory, "bin");
  try {
    mkdirSync(binDirectory, { recursive: true });
    const existingCommand = join(binDirectory, "ct");
    writeFileSync(existingCommand, "#!/usr/bin/env sh\necho unrelated\n");
    const result = spawnSync(process.execPath, [cli, "install", "--bin-dir", binDirectory], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /not managed by ct-codex/);
    assert.match(readFileSync(existingCommand, "utf8"), /unrelated/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("uninstalls only a launcher it installed", () => {
  const directory = mkdtempSync(join(tmpdir(), "ct-codex-"));
  const binDirectory = join(directory, "bin");
  try {
    execFileSync(process.execPath, [cli, "install", "--bin-dir", binDirectory], { encoding: "utf8" });
    const result = execFileSync(process.execPath, [cli, "uninstall", "--bin-dir", binDirectory], { encoding: "utf8" });
    assert.match(result, /Removed/);
    assert.equal(existsSync(join(binDirectory, "ct")), false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
