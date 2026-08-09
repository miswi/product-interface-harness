#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { resolveProjectRoot } from "./harness.mjs";

const projectRoot = resolveProjectRoot();
const skillNames = [
  "govern-product-interfaces",
  "discover-product-model",
  "audit-surface-contracts",
  "design-interface-system",
  "verify-interface-quality"
];
const failures = [];

function fail(skill, message) {
  failures.push({ skill, message });
}

for (const skill of skillNames) {
  const directory = path.join(projectRoot, ".agents", "skills", skill);
  const file = path.join(directory, "SKILL.md");
  const metadata = path.join(directory, "agents", "openai.yaml");
  if (!fs.existsSync(file)) {
    fail(skill, "SKILL.md is missing");
    continue;
  }
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/);
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    fail(skill, "YAML frontmatter is missing or malformed");
    continue;
  }
  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== skill) fail(skill, `frontmatter name must match directory (${skill})`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name || "") || (name || "").length > 64) fail(skill, "name violates Agent Skills naming rules");
  if (!description || description.length > 1024) fail(skill, "description must contain 1-1024 characters");
  if (lines.length > 500) fail(skill, `SKILL.md has ${lines.length} lines; keep it under 500`);
  if (!fs.existsSync(metadata)) fail(skill, "agents/openai.yaml is missing");

  for (const match of source.matchAll(/`(references\/[^`]+\.md)`/g)) {
    if (!fs.existsSync(path.join(directory, match[1]))) fail(skill, `referenced file is missing: ${match[1]}`);
  }
}

const result = { valid: failures.length === 0, checked: skillNames.length, failures };
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.valid) process.exitCode = 1;
