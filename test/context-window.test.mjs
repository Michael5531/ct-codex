import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const launcher = join(root, "scripts", "ct");

function resolveContextWindow(model, reportedWindow, environment = {}) {
  return execFileSync("sh", [launcher, "_context-limit", model, String(reportedWindow)], {
    encoding: "utf8",
    env: { ...process.env, ...environment },
  }).trim().split("\t");
}

test("uses the confirmed Terra context window by default", () => {
  assert.deepEqual(resolveContextWindow("gpt-5.6-terra", 124518), ["1050000", "builtin"]);
});

test("uses active-rollout telemetry for an unmapped Codex model", () => {
  assert.deepEqual(resolveContextWindow("gpt-5.6-sol", 262144), ["262144", "telemetry"]);
});

test("allows launch and named model context-window overrides", () => {
  assert.deepEqual(resolveContextWindow("gpt-5.6-terra", 124518, { CT_CONTEXT_LIMIT: "1048576" }), ["1048576", "override"]);
  assert.deepEqual(resolveContextWindow("azure-production", 131072, { CT_CONTEXT_WINDOWS: "azure-production=786432,gpt-5.6-sol=262144" }), ["786432", "mapping"]);
});
