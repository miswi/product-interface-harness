import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const HARNESS_VERSION = "0.1.0";
export const SCHEMA_VERSION = "1.0.0";

const FULL_AUDIT_STAGES = ["discovery", "contracts", "design", "verification"];
const FINDING_TYPES = new Set([
  "ownership-gap",
  "management-surface-gap",
  "lifecycle-command-gap",
  "missing-action",
  "misplaced-action",
  "illegal-action",
  "ambiguous-action",
  "dead-end-workflow",
  "permission-mismatch",
  "surface-gap",
  "contract-drift",
  "source-conflict",
  "stale-propagation",
  "permission-drift",
  "state-conflation",
  "orphan-field",
  "orphan-capability",
  "unresolved-business-decision",
  "evidence-gap"
]);

const GAP_TYPES_BY_CHECK = {
  ownership: new Set(["ownership-gap", "unresolved-business-decision"]),
  management: new Set(["management-surface-gap", "surface-gap", "unresolved-business-decision"]),
  lifecycle: new Set(["lifecycle-command-gap", "missing-action", "dead-end-workflow", "unresolved-business-decision"]),
  command: new Set(["missing-action", "surface-gap", "unresolved-business-decision"]),
  coverage: new Set(["surface-gap", "management-surface-gap", "unresolved-business-decision"]),
  placement: new Set(["misplaced-action", "missing-action", "unresolved-business-decision"]),
  evidence: new Set(["evidence-gap", "source-conflict", "unresolved-business-decision"])
};

function isoNow() {
  return new Date().toISOString();
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values) {
  return [...new Set(values)];
}

function shortHash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 20);
}

function safeSessionId(value) {
  const raw = String(value || "default-session");
  const readable = raw.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return `${readable || "session"}-${shortHash(raw)}`;
}

export function resolveProjectRoot(start = process.cwd()) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "product-interface-harness")) ||
      fs.existsSync(path.join(current, ".agents", "skills", "govern-product-interfaces"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(start);
    current = parent;
  }
}

export function getRunPath(projectRoot, sessionId) {
  return path.join(projectRoot, ".product-interface-harness", "runs", `${safeSessionId(sessionId)}.json`);
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, filePath);
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function loadRun({ projectRoot = resolveProjectRoot(), sessionId }) {
  const runPath = getRunPath(projectRoot, sessionId);
  if (!fs.existsSync(runPath)) return null;
  return readJson(runPath);
}

function saveRun(run) {
  run.updatedAt = isoNow();
  writeJsonAtomic(getRunPath(run.projectRoot, run.sessionId), run);
  return run;
}

function stageMap(requiredStages) {
  return Object.fromEntries(requiredStages.map(stage => [stage, { status: "pending", artifact: null, updatedAt: null }]));
}

export function startRun({
  projectRoot = resolveProjectRoot(),
  sessionId,
  prompt = "",
  mode = "full-audit",
  requiredStages = FULL_AUDIT_STAGES
}) {
  if (!sessionId) throw new Error("sessionId is required");
  const existing = loadRun({ projectRoot, sessionId });
  if (existing && ["active", "needs-attention"].includes(existing.status)) return existing;

  const now = isoNow();
  const stages = unique(requiredStages);
  const run = {
    schemaVersion: SCHEMA_VERSION,
    harnessVersion: HARNESS_VERSION,
    runId: crypto.randomUUID(),
    sessionId: String(sessionId),
    projectRoot: path.resolve(projectRoot),
    mode,
    status: "active",
    prompt,
    requiredStages: stages,
    stages: stageMap(stages),
    attempts: { stopValidation: 0 },
    trace: [{ at: now, event: "run-started", detail: { mode, requiredStages: stages } }],
    createdAt: now,
    updatedAt: now,
    completion: null
  };
  return saveRun(run);
}

export function recordStage({ projectRoot = resolveProjectRoot(), sessionId, stage, artifact }) {
  const run = loadRun({ projectRoot, sessionId });
  if (!run) throw new Error(`No harness run exists for session ${sessionId}`);
  if (run.status !== "active" && run.status !== "needs-attention") {
    throw new Error(`Run ${run.runId} is ${run.status}; start a new run before recording`);
  }
  if (!run.requiredStages.includes(stage)) throw new Error(`Unknown or unrequired stage: ${stage}`);
  if (!isObject(artifact)) throw new Error("Stage artifact must be a JSON object");
  if (artifact.stage !== stage) throw new Error(`Artifact stage must be ${stage}`);
  run.stages[stage] = { status: "complete", artifact, updatedAt: isoNow() };
  run.status = "active";
  run.trace.push({ at: isoNow(), event: "stage-recorded", detail: { stage } });
  return saveRun(run);
}

function addIssue(issues, code, message, refs = []) {
  issues.push({ code, message, refs: unique(refs.filter(Boolean)) });
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = [];
  for (const item of items) {
    if (!item?.id) continue;
    if (seen.has(item.id)) duplicates.push(item.id);
    seen.add(item.id);
  }
  return unique(duplicates);
}

function findingCovers(findings, subjectId, allowedTypes) {
  return findings.some(finding =>
    allowedTypes.has(finding?.type) && asArray(finding?.subjectRefs).includes(subjectId)
  );
}

function validateFindingShape(findings, evidenceIds, issues) {
  for (const duplicate of duplicateIds(findings)) {
    addIssue(issues, "duplicate-finding-id", `Finding id is duplicated: ${duplicate}`, [duplicate]);
  }
  for (const finding of findings) {
    if (!finding?.id || !FINDING_TYPES.has(finding?.type)) {
      addIssue(issues, "invalid-finding", "Every finding needs an id and a supported type", [finding?.id]);
    }
    if (!finding?.severity || asArray(finding?.subjectRefs).length === 0) {
      addIssue(issues, "incomplete-finding", `Finding ${finding?.id || "<unknown>"} needs severity and subjectRefs`, [finding?.id]);
    }
    for (const evidenceId of asArray(finding?.evidenceIds)) {
      if (!evidenceIds.has(evidenceId)) {
        addIssue(issues, "unknown-evidence-reference", `Finding ${finding?.id} references unknown evidence ${evidenceId}`, [finding?.id, evidenceId]);
      }
    }
  }
}

function validateDiscovery(artifact, issues) {
  const roles = asArray(artifact.roles);
  const surfaces = asArray(artifact.surfaces);
  const objects = asArray(artifact.objects);
  const commands = asArray(artifact.commands);
  const evidence = asArray(artifact.evidence);
  const findings = asArray(artifact.findings);
  const roleIds = new Set(roles.map(item => item?.id).filter(Boolean));
  const surfaceIds = new Set(surfaces.map(item => item?.id).filter(Boolean));
  const objectIds = new Set(objects.map(item => item?.id).filter(Boolean));
  const evidenceIds = new Set(evidence.map(item => item?.id).filter(Boolean));

  if (evidence.length === 0) addIssue(issues, "discovery-evidence-empty", "Discovery must inventory at least one evidence source");
  if (surfaces.length === 0) addIssue(issues, "discovery-surfaces-empty", "Discovery must inventory at least one product surface");
  if (objects.length === 0) addIssue(issues, "discovery-objects-empty", "Discovery must inventory at least one business object");

  for (const [name, items] of [["role", roles], ["surface", surfaces], ["object", objects], ["command", commands], ["evidence", evidence]]) {
    for (const duplicate of duplicateIds(items)) addIssue(issues, `duplicate-${name}-id`, `${name} id is duplicated: ${duplicate}`, [duplicate]);
  }
  validateFindingShape(findings, evidenceIds, issues);

  for (const object of objects) {
    if (!object?.id || !object?.name) {
      addIssue(issues, "invalid-object", "Every business object needs an id and name", [object?.id]);
      continue;
    }
    const consumers = asArray(object.consumerSurfaceIds);
    const management = asArray(object.managementSurfaceIds);
    const evidenceRefs = asArray(object.evidenceIds);
    for (const surfaceId of [...consumers, ...management]) {
      if (!surfaceIds.has(surfaceId)) addIssue(issues, "unknown-surface-reference", `Object ${object.id} references unknown surface ${surfaceId}`, [object.id, surfaceId]);
    }
    if (object.accountableRoleId && !roleIds.has(object.accountableRoleId)) {
      addIssue(issues, "unknown-role-reference", `Object ${object.id} references unknown role ${object.accountableRoleId}`, [object.id, object.accountableRoleId]);
    }
    if (consumers.length > 0 && !object.accountableRoleId && !findingCovers(findings, object.id, GAP_TYPES_BY_CHECK.ownership)) {
      addIssue(issues, "ownership-unaccounted", `Consumer-visible object ${object.id} has no accountable role and no ownership finding`, [object.id]);
    }
    if (consumers.length > 0 && object.mutable !== false && management.length === 0 && !findingCovers(findings, object.id, GAP_TYPES_BY_CHECK.management)) {
      addIssue(issues, "management-surface-unaccounted", `Mutable consumer-visible object ${object.id} has no management surface and no reported gap`, [object.id]);
    }
    if (evidenceRefs.length === 0 && !findingCovers(findings, object.id, GAP_TYPES_BY_CHECK.evidence)) {
      addIssue(issues, "object-evidence-missing", `Object ${object.id} has no evidence reference or evidence-gap finding`, [object.id]);
    }
    for (const evidenceId of evidenceRefs) {
      if (!evidenceIds.has(evidenceId)) addIssue(issues, "unknown-evidence-reference", `Object ${object.id} references unknown evidence ${evidenceId}`, [object.id, evidenceId]);
    }

    if (object.creatable === true) {
      const lifecycleCommands = commands.filter(command => command?.objectId === object.id);
      const hasExit = lifecycleCommands.some(command =>
        asArray(command.purposes).some(purpose => ["correct", "reverse", "terminate"].includes(purpose))
      );
      if (!hasExit && !findingCovers(findings, object.id, GAP_TYPES_BY_CHECK.lifecycle)) {
        addIssue(issues, "lifecycle-exit-unaccounted", `Creatable object ${object.id} has no correction/reversal/termination command and no lifecycle finding`, [object.id]);
      }
    }
  }

  for (const command of commands) {
    if (!command?.id || !objectIds.has(command?.objectId)) {
      addIssue(issues, "invalid-command", `Command ${command?.id || "<unknown>"} needs an existing objectId`, [command?.id, command?.objectId]);
      continue;
    }
    if (asArray(command.actorRoleIds).length === 0 || asArray(command.fromStates).length === 0) {
      addIssue(issues, "command-semantics-incomplete", `Command ${command.id} needs actorRoleIds and fromStates`, [command.id]);
    }
    if (asArray(command.purposes).length === 0) {
      addIssue(issues, "command-purpose-missing", `Command ${command.id} needs at least one semantic purpose`, [command.id]);
    }
    for (const roleId of asArray(command.actorRoleIds)) {
      if (!roleIds.has(roleId)) addIssue(issues, "unknown-role-reference", `Command ${command.id} references unknown role ${roleId}`, [command.id, roleId]);
    }
    if (asArray(command.entryPoints).length === 0 && !findingCovers(findings, command.id, GAP_TYPES_BY_CHECK.command)) {
      addIssue(issues, "command-entry-unaccounted", `Command ${command.id} has no entry point and no reported gap`, [command.id]);
    }
  }

  return { roles, surfaces, objects, commands, evidence, findings };
}

function validateContracts(artifact, discovery, allFindings, issues) {
  const coverage = asArray(artifact.coverage);
  const coverageKeys = new Set(coverage.map(item => `${item?.objectId}::${item?.surfaceId}`));
  const objectIds = new Set(discovery.objects.map(item => item.id));
  const surfaceIds = new Set(discovery.surfaces.map(item => item.id));
  const commandIds = new Set(discovery.commands.map(item => item.id));
  for (const object of discovery.objects) {
    for (const surfaceId of unique([...asArray(object.consumerSurfaceIds), ...asArray(object.managementSurfaceIds)])) {
      const key = `${object.id}::${surfaceId}`;
      if (!coverageKeys.has(key) && !findingCovers(allFindings, object.id, GAP_TYPES_BY_CHECK.coverage)) {
        addIssue(issues, "surface-coverage-unaccounted", `Object ${object.id} has no coverage record for surface ${surfaceId}`, [object.id, surfaceId]);
      }
    }
  }
  for (const row of coverage) {
    if (!row?.objectId || !row?.surfaceId || !row?.evidenceStatus) {
      addIssue(issues, "invalid-coverage-row", "Every coverage row needs objectId, surfaceId, and evidenceStatus", [row?.objectId, row?.surfaceId]);
    }
    if (row?.objectId && !objectIds.has(row.objectId)) addIssue(issues, "unknown-object-reference", `Coverage row references unknown object ${row.objectId}`, [row.objectId]);
    if (row?.surfaceId && !surfaceIds.has(row.surfaceId)) addIssue(issues, "unknown-surface-reference", `Coverage row references unknown surface ${row.surfaceId}`, [row.surfaceId]);
    for (const commandId of asArray(row?.commandIds)) {
      if (!commandIds.has(commandId)) addIssue(issues, "unknown-command-reference", `Coverage row references unknown command ${commandId}`, [commandId]);
    }
  }
}

function validateDesign(artifact, discovery, allFindings, issues) {
  const placements = asArray(artifact.actionPlacements);
  const placed = new Set(placements.map(item => item?.commandId).filter(Boolean));
  const commandIds = new Set(discovery.commands.map(item => item.id));
  const surfaceIds = new Set(discovery.surfaces.map(item => item.id));
  for (const command of discovery.commands) {
    if (command.requiresPlacement === false) continue;
    if (!placed.has(command.id) && !findingCovers(allFindings, command.id, GAP_TYPES_BY_CHECK.placement)) {
      addIssue(issues, "action-placement-unaccounted", `Command ${command.id} has no placement decision or finding`, [command.id]);
    }
  }
  for (const placement of placements) {
    if (!placement?.commandId || !placement?.surfaceId || !placement?.location || !placement?.rationale) {
      addIssue(issues, "invalid-action-placement", "Every action placement needs commandId, surfaceId, location, and rationale", [placement?.commandId]);
    }
    if (placement?.commandId && !commandIds.has(placement.commandId)) addIssue(issues, "unknown-command-reference", `Placement references unknown command ${placement.commandId}`, [placement.commandId]);
    if (placement?.surfaceId && !surfaceIds.has(placement.surfaceId)) addIssue(issues, "unknown-surface-reference", `Placement references unknown surface ${placement.surfaceId}`, [placement.surfaceId]);
  }
}

function validateVerification(artifact, allFindings, issues) {
  const checks = asArray(artifact.checks);
  if (checks.length === 0) addIssue(issues, "verification-empty", "Verification must contain at least one check");
  const referencedFindings = new Set(checks.flatMap(check => asArray(check?.findingIds)));
  const findingIds = new Set(allFindings.map(item => item.id));
  for (const finding of allFindings) {
    if (!["low"].includes(finding.severity) && !referencedFindings.has(finding.id)) {
      addIssue(issues, "finding-not-verified", `Material finding ${finding.id} has no verification check`, [finding.id]);
    }
  }
  for (const check of checks) {
    if (!check?.id || !["pass", "fail", "blocked", "not-tested"].includes(check?.status) || !check?.method) {
      addIssue(issues, "invalid-verification-check", "Every verification check needs id, status, and method", [check?.id]);
    }
    for (const findingId of asArray(check?.findingIds)) {
      if (!findingIds.has(findingId)) addIssue(issues, "unknown-finding-reference", `Verification check ${check?.id} references unknown finding ${findingId}`, [check?.id, findingId]);
    }
  }
}

export function validateRun(run) {
  const issues = [];
  if (!isObject(run)) return { valid: false, issues: [{ code: "invalid-run", message: "Run must be an object", refs: [] }] };
  if (run.schemaVersion !== SCHEMA_VERSION) addIssue(issues, "schema-version-mismatch", `Expected schema ${SCHEMA_VERSION}, received ${run.schemaVersion}`);
  for (const stage of asArray(run.requiredStages)) {
    if (run.stages?.[stage]?.status !== "complete" || !isObject(run.stages?.[stage]?.artifact)) {
      addIssue(issues, "required-stage-incomplete", `Required stage is incomplete: ${stage}`, [stage]);
    } else if (run.stages[stage].artifact.stage !== stage) {
      addIssue(issues, "stage-artifact-mismatch", `Artifact recorded for ${stage} declares stage ${run.stages[stage].artifact.stage || "<missing>"}`, [stage]);
    }
  }

  const discoveryArtifact = run.stages?.discovery?.artifact;
  let discovery = { roles: [], surfaces: [], objects: [], commands: [], evidence: [], findings: [] };
  if (isObject(discoveryArtifact)) discovery = validateDiscovery(discoveryArtifact, issues);
  const evidenceIds = new Set(discovery.evidence.map(item => item.id));
  const contractFindings = asArray(run.stages?.contracts?.artifact?.findings);
  const designFindings = asArray(run.stages?.design?.artifact?.findings);
  validateFindingShape(contractFindings, evidenceIds, issues);
  validateFindingShape(designFindings, evidenceIds, issues);
  const allFindings = [...discovery.findings, ...contractFindings, ...designFindings];
  for (const duplicate of duplicateIds(allFindings)) addIssue(issues, "duplicate-finding-id", `Finding id is duplicated across stages: ${duplicate}`, [duplicate]);
  if (isObject(run.stages?.contracts?.artifact)) validateContracts(run.stages.contracts.artifact, discovery, allFindings, issues);
  if (isObject(run.stages?.design?.artifact)) validateDesign(run.stages.design.artifact, discovery, allFindings, issues);
  if (isObject(run.stages?.verification?.artifact)) validateVerification(run.stages.verification.artifact, allFindings, issues);

  return { valid: issues.length === 0, issues };
}

export function validateSession({ projectRoot = resolveProjectRoot(), sessionId }) {
  const run = loadRun({ projectRoot, sessionId });
  if (!run) return { valid: false, issues: [{ code: "run-not-found", message: `No harness run exists for session ${sessionId}`, refs: [] }], run: null };
  return { ...validateRun(run), run };
}

export function finalizeRun({ projectRoot = resolveProjectRoot(), sessionId }) {
  const result = validateSession({ projectRoot, sessionId });
  if (!result.run) return result;
  result.run.trace.push({ at: isoNow(), event: "final-validation", detail: { valid: result.valid, issueCodes: result.issues.map(issue => issue.code) } });
  if (result.valid) {
    result.run.status = "complete";
    result.run.completion = { at: isoNow(), outcome: "complete" };
  } else {
    result.run.status = "needs-attention";
  }
  saveRun(result.run);
  return result;
}

export function cancelRun({ projectRoot = resolveProjectRoot(), sessionId, reason }) {
  if (!reason) throw new Error("A cancellation reason is required");
  const run = loadRun({ projectRoot, sessionId });
  if (!run) throw new Error(`No harness run exists for session ${sessionId}`);
  run.status = "cancelled";
  run.completion = { at: isoNow(), outcome: "cancelled", reason };
  run.trace.push({ at: isoNow(), event: "run-cancelled", detail: { reason } });
  return saveRun(run);
}

export function sessionIdFromHook(input) {
  return String(input?.session_id || input?.conversation_id || input?.thread_id || input?.transcript_path || "default-session");
}

export function shouldStartFromPrompt(prompt) {
  return /\$govern-product-interfaces\b|\buse\s+govern-product-interfaces\b|使用[^\n]{0,80}govern-product-interfaces/i.test(String(prompt || ""));
}

export function handleUserPromptHook(input, { projectRoot = resolveProjectRoot(input?.cwd || process.cwd()) } = {}) {
  const prompt = String(input?.prompt || "");
  if (!shouldStartFromPrompt(prompt)) return { output: null, run: null };
  const sessionId = sessionIdFromHook(input);
  const run = startRun({ projectRoot, sessionId, prompt });
  const command = `node product-interface-harness/runtime/harnessctl.mjs status --session ${JSON.stringify(sessionId)}`;
  return {
    run,
    output: {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `A product-interface harness run is active (${run.runId}). Record discovery, contracts, design, and verification artifacts before answering. Inspect the run with: ${command}`
      }
    }
  };
}

function summarizeIssues(issues, limit = 8) {
  const selected = issues.slice(0, limit).map(issue => `- ${issue.code}: ${issue.message}`).join("\n");
  const remaining = issues.length > limit ? `\n- ...and ${issues.length - limit} more issue(s)` : "";
  return `${selected}${remaining}`;
}

export function handleStopHook(input, { projectRoot = resolveProjectRoot(input?.cwd || process.cwd()) } = {}) {
  const sessionId = sessionIdFromHook(input);
  const run = loadRun({ projectRoot, sessionId });
  if (!run || ["complete", "cancelled"].includes(run.status)) return { output: { continue: true }, run };

  run.attempts.stopValidation = Number(run.attempts?.stopValidation || 0) + 1;
  const result = validateRun(run);
  run.trace.push({ at: isoNow(), event: "stop-validation", detail: { valid: result.valid, issueCodes: result.issues.map(issue => issue.code) } });
  if (result.valid) {
    run.status = "complete";
    run.completion = { at: isoNow(), outcome: "complete", completedBy: "stop-hook" };
    saveRun(run);
    return { output: { continue: true }, run, result };
  }

  run.status = "needs-attention";
  saveRun(run);
  const reason = `Product-interface audit is incomplete. Resume the indicated specialist stage, record the missing evidence, and validate again.\n${summarizeIssues(result.issues)}\nIf the user explicitly abandons this audit, run harnessctl cancel with a concrete reason.`;
  return { output: { decision: "block", reason }, run, result };
}
