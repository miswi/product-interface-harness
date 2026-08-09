#!/usr/bin/env node
import fs from "node:fs";
import {
  cancelRun,
  finalizeRun,
  handleStopHook,
  handleUserPromptHook,
  loadRun,
  readJson,
  recordStage,
  resolveProjectRoot,
  startRun,
  validateSession
} from "./harness.mjs";

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = rest[index + 1];
    if (value === undefined || value.startsWith("--")) options[key] = true;
    else {
      options[key] = value;
      index += 1;
    }
  }
  return { command, options };
}

function requireOption(options, key) {
  if (!options[key] || options[key] === true) throw new Error(`--${key} is required`);
  return options[key];
}

function readStdin() {
  return fs.readFileSync(0, "utf8");
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function publicStatus(run) {
  if (!run) return null;
  return {
    runId: run.runId,
    sessionId: run.sessionId,
    mode: run.mode,
    status: run.status,
    requiredStages: run.requiredStages,
    stages: Object.fromEntries(Object.entries(run.stages).map(([key, value]) => [key, value.status])),
    attempts: run.attempts,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    completion: run.completion
  };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  const projectRoot = resolveProjectRoot(options.root || process.cwd());

  if (command === "start") {
    const sessionId = requireOption(options, "session");
    const requiredStages = options.stages ? String(options.stages).split(",").filter(Boolean) : undefined;
    const run = startRun({ projectRoot, sessionId, prompt: options.prompt || "", mode: options.mode || "full-audit", requiredStages });
    print(publicStatus(run));
    return;
  }

  if (command === "record") {
    const sessionId = requireOption(options, "session");
    const stage = requireOption(options, "stage");
    const file = requireOption(options, "file");
    const run = recordStage({ projectRoot, sessionId, stage, artifact: readJson(file) });
    print(publicStatus(run));
    return;
  }

  if (command === "status") {
    const sessionId = requireOption(options, "session");
    print(publicStatus(loadRun({ projectRoot, sessionId })));
    return;
  }

  if (command === "validate") {
    const sessionId = requireOption(options, "session");
    const result = validateSession({ projectRoot, sessionId });
    print({ valid: result.valid, issues: result.issues, run: publicStatus(result.run) });
    if (!result.valid) process.exitCode = 2;
    return;
  }

  if (command === "finalize") {
    const sessionId = requireOption(options, "session");
    const result = finalizeRun({ projectRoot, sessionId });
    print({ valid: result.valid, issues: result.issues, run: publicStatus(result.run) });
    if (!result.valid) process.exitCode = 2;
    return;
  }

  if (command === "cancel") {
    const sessionId = requireOption(options, "session");
    const reason = requireOption(options, "reason");
    print(publicStatus(cancelRun({ projectRoot, sessionId, reason })));
    return;
  }

  if (command === "hook-user-prompt") {
    const input = JSON.parse(readStdin() || "{}");
    const { output } = handleUserPromptHook(input, { projectRoot });
    if (output) print(output);
    return;
  }

  if (command === "hook-stop") {
    const input = JSON.parse(readStdin() || "{}");
    const { output } = handleStopHook(input, { projectRoot });
    print(output);
    return;
  }

  throw new Error("Usage: harnessctl <start|record|status|validate|finalize|cancel|hook-user-prompt|hook-stop> [options]");
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
