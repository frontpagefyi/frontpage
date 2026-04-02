/**
 * This script pretty prints an ESLint report from `eslint --format json` to a more human-readable format.
 *
 * We need it because there is no built-in way to output to a file and separately print to the console in a human-readable format without running ESLint twice.
 */

import fs from "fs/promises";
import type { ESLint } from "eslint";

async function readReportFile(path: string): Promise<ESLint.LintResult[]> {
  const fileContents = await fs.readFile(path, "utf-8");
  return JSON.parse(fileContents);
}

function prettyPrintReport(report: ESLint.LintResult[]): void {
  let totalErrors = 0;
  let totalWarnings = 0;
  for (const result of report) {
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;

    if (result.errorCount === 0 && result.warningCount === 0) {
      continue;
    }

    console.log(`\n${result.filePath}`);

    for (const message of result.messages) {
      const severity = message.severity === 2 ? "error" : "warning";
      console.log(
        `  ${message.line}:${message.column}  ${severity}  ${message.message}  ${message.ruleId}`,
      );
    }
    console.log("");
  }

  console.log(`\nTotal: ${totalErrors} errors, ${totalWarnings} warnings`);
}

const reports = await Promise.all(
  process.argv.slice(2).map(async (path) => ({
    contents: await readReportFile(path),
    filePath: path,
  })),
);

for (const report of reports) {
  const absolutePath = new URL(report.filePath, import.meta.url).pathname;
  console.log("\n====================");
  console.log(`Report from ${absolutePath}`);
  console.log("====================");
  prettyPrintReport(report.contents);
}
