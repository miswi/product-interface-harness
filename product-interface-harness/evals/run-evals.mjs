#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateRun } from "../runtime/harness.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(here, "fixtures");
const categories = ["known", "cross-domain", "negative-controls"];
const results = [];

function buildRun(fixture) {
  return {
    schemaVersion: "1.0.0",
    harnessVersion: "0.1.0",
    runId: `eval-${fixture.id}`,
    sessionId: `eval-${fixture.id}`,
    projectRoot: "/eval",
    mode: "full-audit",
    status: "active",
    requiredStages: ["discovery", "contracts", "design", "verification"],
    stages: Object.fromEntries(Object.entries(fixture.artifacts).map(([stage, artifact]) => [stage, { status: "complete", artifact, updatedAt: "2026-01-01T00:00:00.000Z" }])),
    attempts: { stopValidation: 0 },
    trace: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    completion: null
  };
}

for (const category of categories) {
  const directory = path.join(fixtureRoot, category);
  for (const file of fs.readdirSync(directory).filter(name => name.endsWith(".json")).sort()) {
    const fixture = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
    const validation = validateRun(buildRun(fixture));
    const actualCodes = [...new Set(validation.issues.map(issue => issue.code))].sort();
    const expectedCodes = [...fixture.expected.issueCodes].sort();
    const passed = validation.valid === fixture.expected.valid && JSON.stringify(actualCodes) === JSON.stringify(expectedCodes);
    results.push({ id: fixture.id, category, passed, expectedValid: fixture.expected.valid, actualValid: validation.valid, expectedCodes, actualCodes });
  }
}

const summary = {
  schemaVersion: "1.0.0",
  harnessVersion: "0.1.0",
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter(result => result.passed).length,
  failed: results.filter(result => !result.passed).length,
  results
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (summary.failed > 0) process.exitCode = 1;
