import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  HARNESS_VERSION,
  SCHEMA_VERSION,
  finalizeRun,
  handleStopHook,
  handleUserPromptHook,
  loadRun,
  recordStage,
  shouldStartFromPrompt,
  startRun,
  validateRun
} from "../runtime/harness.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(testDirectory, "../runtime/harnessctl.mjs");

function evidence() {
  return [{ id: "e1", label: "observed-as-is", source: "fixture:1", summary: "Observed object and workflow." }];
}

function completeArtifacts({ findings = [] } = {}) {
  return {
    discovery: {
      stage: "discovery",
      evidence: evidence(),
      roles: [{ id: "owner", name: "Owner" }],
      surfaces: [{ id: "client", name: "Client" }, { id: "admin", name: "Admin" }],
      objects: [{
        id: "record",
        name: "Record",
        creatable: true,
        mutable: true,
        accountableRoleId: "owner",
        consumerSurfaceIds: ["client"],
        managementSurfaceIds: ["admin"],
        evidenceIds: ["e1"]
      }],
      commands: [{
        id: "close-record",
        objectId: "record",
        purposes: ["terminate"],
        actorRoleIds: ["owner"],
        fromStates: ["active"],
        entryPoints: ["admin:detail"],
        requiresPlacement: true
      }],
      findings
    },
    contracts: {
      stage: "contracts",
      coverage: [
        { objectId: "record", surfaceId: "client", canRead: true, commandIds: [], evidenceStatus: "observed" },
        { objectId: "record", surfaceId: "admin", canRead: true, commandIds: ["close-record"], evidenceStatus: "observed" }
      ],
      findings: []
    },
    design: {
      stage: "design",
      actionPlacements: [{ commandId: "close-record", surfaceId: "admin", location: "detail", rationale: "The decision requires record history." }],
      findings: []
    },
    verification: {
      stage: "verification",
      checks: [{ id: "v1", status: "pass", method: "static-contract", findingIds: findings.map(item => item.id) }]
    }
  };
}

function asRun(artifacts) {
  return {
    schemaVersion: "1.0.0",
    harnessVersion: "0.1.0",
    runId: "fixture-run",
    sessionId: "fixture-session",
    projectRoot: "/fixture",
    mode: "full-audit",
    status: "active",
    requiredStages: ["discovery", "contracts", "design", "verification"],
    stages: Object.fromEntries(Object.entries(artifacts).map(([stage, artifact]) => [stage, { status: "complete", artifact, updatedAt: "2026-01-01T00:00:00.000Z" }])),
    attempts: { stopValidation: 0 },
    trace: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    completion: null
  };
}

test("only explicit governing-skill invocation starts the hook harness", () => {
  assert.equal(shouldStartFromPrompt("使用 $govern-product-interfaces 全面审查"), true);
  assert.equal(shouldStartFromPrompt("讨论一下全面审查是否需要 hook"), false);
});

test("package and schema versions stay synchronized with the runtime", () => {
  const projectRoot = path.resolve(testDirectory, "../..");
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const runSchema = JSON.parse(fs.readFileSync(path.join(projectRoot, "product-interface-harness/schemas/run-manifest.schema.json"), "utf8"));
  assert.equal(packageJson.version, HARNESS_VERSION);
  assert.equal(runSchema.properties.schemaVersion.const, SCHEMA_VERSION);
});

test("complete cross-surface lifecycle passes", () => {
  assert.deepEqual(validateRun(asRun(completeArtifacts())), { valid: true, issues: [] });
});

test("an empty discovery artifact cannot satisfy a comprehensive audit", () => {
  const artifacts = completeArtifacts();
  artifacts.discovery.evidence = [];
  artifacts.discovery.roles = [];
  artifacts.discovery.surfaces = [];
  artifacts.discovery.objects = [];
  artifacts.discovery.commands = [];
  artifacts.contracts.coverage = [];
  artifacts.design.actionPlacements = [];
  const codes = new Set(validateRun(asRun(artifacts)).issues.map(issue => issue.code));
  assert.equal(codes.has("discovery-evidence-empty"), true);
  assert.equal(codes.has("discovery-surfaces-empty"), true);
  assert.equal(codes.has("discovery-objects-empty"), true);
});

test("consumer-visible mutable objects require ownership and management accountability", () => {
  const artifacts = completeArtifacts();
  artifacts.discovery.objects[0].accountableRoleId = null;
  artifacts.discovery.objects[0].managementSurfaceIds = [];
  artifacts.contracts.coverage = artifacts.contracts.coverage.filter(row => row.surfaceId !== "admin");
  const result = validateRun(asRun(artifacts));
  const codes = new Set(result.issues.map(issue => issue.code));
  assert.equal(codes.has("ownership-unaccounted"), true);
  assert.equal(codes.has("management-surface-unaccounted"), true);
});

test("creatable objects require an accounted lifecycle exit", () => {
  const artifacts = completeArtifacts();
  artifacts.discovery.commands = [];
  artifacts.design.actionPlacements = [];
  artifacts.contracts.coverage[1].commandIds = [];
  const result = validateRun(asRun(artifacts));
  assert.equal(result.issues.some(issue => issue.code === "lifecycle-exit-unaccounted"), true);
});

test("explicitly reported gaps satisfy coverage without pretending the capability exists", () => {
  const artifacts = completeArtifacts({
    findings: [{
      id: "f-owner",
      type: "ownership-gap",
      severity: "high",
      subjectRefs: ["record"],
      evidenceIds: ["e1"],
      status: "open"
    }, {
      id: "f-management",
      type: "management-surface-gap",
      severity: "high",
      subjectRefs: ["record"],
      evidenceIds: ["e1"],
      status: "open"
    }, {
      id: "f-exit",
      type: "lifecycle-command-gap",
      severity: "high",
      subjectRefs: ["record"],
      evidenceIds: ["e1"],
      status: "open"
    }]
  });
  artifacts.discovery.objects[0].accountableRoleId = null;
  artifacts.discovery.objects[0].managementSurfaceIds = [];
  artifacts.discovery.commands = [];
  artifacts.contracts.coverage = artifacts.contracts.coverage.filter(row => row.surfaceId !== "admin");
  artifacts.design.actionPlacements = [];
  assert.deepEqual(validateRun(asRun(artifacts)), { valid: true, issues: [] });
});

test("run state records stages and finalizes through the public interface", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "product-interface-harness-"));
  const sessionId = "test-session";
  startRun({ projectRoot, sessionId });
  for (const [stage, artifact] of Object.entries(completeArtifacts())) {
    recordStage({ projectRoot, sessionId, stage, artifact });
  }
  const result = finalizeRun({ projectRoot, sessionId });
  assert.equal(result.valid, true);
  assert.equal(loadRun({ projectRoot, sessionId }).status, "complete");
});

test("harnessctl CLI completes a full run through its external interface", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "product-interface-cli-"));
  const sessionId = "cli-session";
  const invoke = args => spawnSync(process.execPath, [cliPath, ...args, "--root", projectRoot], { encoding: "utf8" });
  assert.equal(invoke(["start", "--session", sessionId]).status, 0);
  for (const [stage, artifact] of Object.entries(completeArtifacts())) {
    const artifactPath = path.join(projectRoot, `${stage}.json`);
    fs.writeFileSync(artifactPath, `${JSON.stringify(artifact)}\n`, "utf8");
    const recorded = invoke(["record", "--session", sessionId, "--stage", stage, "--file", artifactPath]);
    assert.equal(recorded.status, 0, recorded.stderr);
  }
  const finalized = invoke(["finalize", "--session", sessionId]);
  assert.equal(finalized.status, 0, finalized.stderr);
  assert.equal(JSON.parse(finalized.stdout).valid, true);
});

test("project hook configurations reference existing adapters", () => {
  const projectRoot = path.resolve(testDirectory, "../..");
  for (const configPath of [path.join(projectRoot, ".codex/hooks.json"), path.join(projectRoot, ".claude/settings.json")]) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    for (const event of ["UserPromptSubmit", "Stop"]) {
      const command = config.hooks[event][0].hooks[0].command;
      const adapter = command.match(/node\s+(.+\.mjs)$/)?.[1];
      assert.ok(adapter, `Missing adapter path in ${configPath}`);
      assert.equal(fs.existsSync(path.join(projectRoot, adapter)), true, `${adapter} must exist`);
    }
  }
});

test("Stop hook blocks incomplete runs and completes valid runs", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "product-interface-hook-"));
  const hookInput = { session_id: "hook-session", cwd: projectRoot, prompt: "使用 $govern-product-interfaces 全面审查" };
  const started = handleUserPromptHook(hookInput, { projectRoot });
  assert.ok(started.run);
  const blocked = handleStopHook({ session_id: "hook-session", cwd: projectRoot }, { projectRoot });
  assert.equal(blocked.output.decision, "block");
  for (const [stage, artifact] of Object.entries(completeArtifacts())) {
    recordStage({ projectRoot, sessionId: "hook-session", stage, artifact });
  }
  const allowed = handleStopHook({ session_id: "hook-session", cwd: projectRoot }, { projectRoot });
  assert.equal(allowed.output.continue, true);
  assert.equal(loadRun({ projectRoot, sessionId: "hook-session" }).status, "complete");
});
