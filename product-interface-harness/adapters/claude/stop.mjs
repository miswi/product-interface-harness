#!/usr/bin/env node
import fs from "node:fs";
import { handleStopHook } from "../../runtime/harness.mjs";

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  const { output } = handleStopHook(input);
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  process.stderr.write(`Product-interface Stop hook failed: ${error.message}\n`);
  process.exitCode = 1;
}
