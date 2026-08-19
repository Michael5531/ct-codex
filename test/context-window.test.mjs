import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const launcher = join(root, "scripts", "ct");

function contextUsed(totalTokens, contextWindow) {
  return execFileSync("sh", [launcher, "_context-used", String(totalTokens), String(contextWindow)], {
    encoding: "utf8",
  }).trim();
}

function contextMetrics(totalTokens, contextWindow) {
  return execFileSync("sh", [launcher, "_context-metrics", String(totalTokens), String(contextWindow)], {
    encoding: "utf8",
  }).trim().split("\t");
}

test("reimplements Codex's 12k reserved-baseline context calculation", () => {
  // Codex CLI: effective=124,518-12,000=112,518; remaining=90,943;
  // round(90,943/112,518*100)=81; used=100-81=19.
  assert.equal(contextUsed(33_575, 124_518), "19");
});

test("rounds remaining first, then takes its complement like Codex", () => {
  // With this input Codex rounds remaining to 49, then takes the complement.
  assert.equal(contextUsed(69_259, 124_518), "51");
});

test("renders numerator and denominator from the same normalized calculation", () => {
  // 94,439 raw total - 12,000 reserve = 82,439 user-controllable tokens.
  // The denominator is likewise 124,518 - 12,000 = 112,518, yielding 73%.
  assert.deepEqual(contextMetrics(94_439, 124_518), ["73", "82439", "112518"]);
});

test("keeps context unused until the reserved baseline is consumed", () => {
  assert.equal(contextUsed(12_000, 124_518), "0");
  assert.equal(contextUsed(9_000, 124_518), "0");
});

test("caps exhausted context at 100 percent used", () => {
  assert.equal(contextUsed(124_518, 124_518), "100");
  assert.equal(contextUsed(200_000, 124_518), "100");
});

test("refuses a missing or unusable rollout context window", () => {
  assert.throws(() => contextUsed(50_000, 12_000));
  assert.throws(() => contextUsed(50_000, 0));
});
