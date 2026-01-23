import { readFile, readdir } from "fs/promises";
import { join } from "path";

export interface SessionLogEntry {
  time: string;
  changes: string[];
  insights: string[];
  commits: string[];
  filesModified?: string[];
}

export interface SessionLog {
  date: string;
  entries: SessionLogEntry[];
}

export async function parseSessionLogs(projectPath: string): Promise<SessionLog[]> {
  const sessionsDir = join(projectPath, ".project", "sessions");
  const logs: SessionLog[] = [];

  try {
    const files = await readdir(sessionsDir);
    const mdFiles = files.filter(f => f.endsWith(".md") && /^\d{4}-\d{2}-\d{2}/.test(f));

    for (const file of mdFiles) {
      const content = await readFile(join(sessionsDir, file), "utf-8");
      const date = file.replace(".md", "").substring(0, 10); // Extract YYYY-MM-DD
      const entries = parseSessionLogContent(content);

      if (entries.length > 0) {
        logs.push({ date, entries });
      }
    }

    // Sort by date descending
    logs.sort((a, b) => b.date.localeCompare(a.date));
    return logs;
  } catch {
    return [];
  }
}

function parseSessionLogContent(content: string): SessionLogEntry[] {
  const entries: SessionLogEntry[] = [];
  const lines = content.split("\n");

  let currentEntry: SessionLogEntry | null = null;
  let currentSection: "changes" | "insights" | "commits" | "files" | null = null;

  for (const line of lines) {
    // Match session time headers like "## Session at 09:23" or "## Session Continued"
    const sessionMatch = line.match(/^## Session (?:at )?(\d{2}:\d{2})?/i);
    if (sessionMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = {
        time: sessionMatch[1] || "00:00",
        changes: [],
        insights: [],
        commits: [],
        filesModified: [],
      };
      currentSection = null;
      continue;
    }

    // Match section headers
    if (line.match(/^### Changes Made/i) || line.match(/^### Additional Activities/i)) {
      currentSection = "changes";
      continue;
    }
    if (line.match(/^### Key Insights/i) || line.match(/^### Insights/i)) {
      currentSection = "insights";
      continue;
    }
    if (line.match(/^### Commit/i)) {
      currentSection = "commits";
      continue;
    }
    if (line.match(/^### Files Modified/i)) {
      currentSection = "files";
      continue;
    }
    // Reset section on other headers
    if (line.startsWith("### ")) {
      currentSection = null;
      continue;
    }

    // Parse bullet points
    if (currentEntry && currentSection && line.startsWith("- ")) {
      const text = line.substring(2).trim();

      if (currentSection === "changes") {
        currentEntry.changes.push(text);
      } else if (currentSection === "insights") {
        currentEntry.insights.push(text);
      } else if (currentSection === "commits") {
        // Extract commit hash from lines like "- `49244df` - Message"
        const commitMatch = text.match(/`([a-f0-9]+)`/);
        if (commitMatch) {
          currentEntry.commits.push(commitMatch[1]);
        }
      } else if (currentSection === "files") {
        currentEntry.filesModified?.push(text);
      }
    }
  }

  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries;
}

export async function getSessionLogsForDate(
  projectPath: string,
  date: string
): Promise<SessionLogEntry[]> {
  const logs = await parseSessionLogs(projectPath);
  const dayLog = logs.find(l => l.date === date);
  return dayLog?.entries || [];
}

export async function getSessionLogsForMonth(
  projectPath: string,
  month: string // YYYY-MM
): Promise<{ date: string; entries: SessionLogEntry[] }[]> {
  const logs = await parseSessionLogs(projectPath);
  return logs.filter(l => l.date.startsWith(month));
}
