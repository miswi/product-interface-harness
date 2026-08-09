#!/usr/bin/env node
import fs from "node:fs";
import { handleUserPromptHook } from "../../runtime/harness.mjs";

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  const { output } = handleUserPromptHook(input);
  if (output) process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  process.stderr.write(`Product-interface UserPromptSubmit hook failed: ${error.message}\n`);
  process.exitCode = 1;
}
