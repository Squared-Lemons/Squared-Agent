import { readFile } from "fs/promises";
import { join } from "path";

export interface TokenSession {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
}

export async function parseTokenUsage(projectPath: string): Promise<TokenSession[]> {
  const filePath = join(projectPath, ".project", "token-usage.md");

  try {
    const content = await readFile(filePath, "utf-8");
    const sessions: TokenSession[] = [];

    // Find the table in the Session Log section
    const lines = content.split("\n");
    let inTable = false;
    let headerFound = false;

    for (const line of lines) {
      // Look for the table header
      if (line.includes("| Date |") && line.includes("| Type |")) {
        headerFound = true;
        continue;
      }

      // Skip the separator line
      if (headerFound && line.startsWith("|---")) {
        inTable = true;
        continue;
      }

      // Parse table rows
      if (inTable && line.startsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter(c => c);

        if (cells.length >= 7) {
          const [date, type, input, output, cacheRead, cacheCreate, turns] = cells;

          sessions.push({
            date,
            type: type as "subscription" | "api",
            input: parseInt(input, 10) || 0,
            output: parseInt(output, 10) || 0,
            cacheRead: parseInt(cacheRead, 10) || 0,
            cacheCreate: parseInt(cacheCreate, 10) || 0,
            turns: parseInt(turns, 10) || 0,
          });
        }
      }

      // End of table
      if (inTable && !line.startsWith("|") && line.trim() !== "") {
        break;
      }
    }

    return sessions;
  } catch {
    return [];
  }
}

export function calculateCost(tokens: {
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
}): number {
  // Cost per million tokens
  const inputCost = tokens.input * 15;
  const outputCost = tokens.output * 75;
  const cacheReadCost = tokens.cacheRead * 1.5;
  const cacheCreateCost = tokens.cacheCreate * 18.75;

  return (inputCost + outputCost + cacheReadCost + cacheCreateCost) / 1_000_000;
}
