#!/usr/bin/env node

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceScript = join(packageDirectory, "scripts", "ct");
const defaultBinDirectory = join(process.env.HOME || process.env.USERPROFILE || "", ".local", "bin");
const managedMarker = "portable tmux launcher and status bar for the Codex CLI";

const usage = () => {
  console.log(`ct-codex — install and manage ct

Usage:
  npx -y ct-codex install [--bin-dir <directory>] [--force]
  npx -y ct-codex uninstall [--bin-dir <directory>]
  npx -y ct-codex doctor

After installation:
  ct codex

The launcher supports macOS, Linux, and WSL. Native Windows is not supported.`);
};

const fail = (message) => {
  console.error(`ct-codex: ${message}`);
  process.exitCode = 1;
};

const assertSupportedPlatform = () => {
  if (process.platform === "win32") {
    fail("native Windows is unsupported. Run this command inside WSL instead.");
    return false;
  }
  return true;
};

const parseOptions = (argumentsList) => {
  const options = { binDirectory: defaultBinDirectory, force: false };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--bin-dir") {
      const directory = argumentsList[index + 1];
      if (!directory) throw new Error("--bin-dir requires a directory");
      options.binDirectory = resolve(directory);
      index += 1;
    } else if (argument === "--force") {
      options.force = true;
    } else {
      throw new Error(`unknown option: ${argument}`);
    }
  }
  return options;
};

const targetPath = (binDirectory) => join(binDirectory, "ct");
const isManagedCt = (path) => {
  try {
    return readFileSync(path, "utf8").includes(managedMarker);
  } catch {
    return false;
  }
};

const printPathAdvice = (binDirectory) => {
  const pathEntries = (process.env.PATH || "").split(delimiter);
  if (!pathEntries.includes(binDirectory)) {
    console.log(`\nAdd this to your shell configuration if \`${binDirectory}\` is not already on PATH:`);
    console.log(`  export PATH="${binDirectory}:$PATH"`);
  }
};

const install = (argumentsList) => {
  if (!assertSupportedPlatform()) return;
  const { binDirectory, force } = parseOptions(argumentsList);
  const destination = targetPath(binDirectory);

  if (existsSync(destination) && !isManagedCt(destination) && !force) {
    fail(`${destination} already exists and is not managed by ct-codex. Use --force only if you intend to replace it.`);
    return;
  }

  mkdirSync(binDirectory, { recursive: true });
  copyFileSync(sourceScript, destination);
  chmodSync(destination, 0o755);
  console.log(`Installed ct to ${destination}`);
  console.log("Run: ct doctor && ct codex");
  printPathAdvice(binDirectory);
};

const uninstall = (argumentsList) => {
  const { binDirectory } = parseOptions(argumentsList);
  const destination = targetPath(binDirectory);
  if (!existsSync(destination)) {
    console.log(`Nothing to remove: ${destination} does not exist.`);
    return;
  }
  if (!isManagedCt(destination)) {
    fail(`refusing to remove ${destination}; it is not managed by ct-codex.`);
    return;
  }
  rmSync(destination);
  console.log(`Removed ${destination}`);
};

const doctor = () => {
  if (!assertSupportedPlatform()) return;
  const target = targetPath(defaultBinDirectory);
  if (existsSync(target)) {
    console.log(`ok      installed launcher: ${target}`);
  } else {
    console.log(`missing installed launcher: ${target}`);
    console.log("Run: npx -y ct-codex install");
  }
};

try {
  const [command = "help", ...argumentsList] = process.argv.slice(2);
  switch (command) {
    case "install":
      install(argumentsList);
      break;
    case "uninstall":
      uninstall(argumentsList);
      break;
    case "doctor":
      doctor();
      break;
    case "help":
    case "--help":
    case "-h":
      usage();
      break;
    case "--version":
    case "-v":
      console.log("0.1.0");
      break;
    default:
      fail(`unknown command: ${command}`);
      usage();
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
