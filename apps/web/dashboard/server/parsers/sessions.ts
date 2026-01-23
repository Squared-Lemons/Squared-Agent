import { readFile, readdir } from "fs/promises";
import { join } from "path";

export interface SessionEntry {
  time: string;
  title?: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

export interface SessionLog {
  date: string;
  sessions: SessionEntry[];
}

export async function parseSessionLogs(projectPath: string): Promise<SessionLog[]> {
  const sessionsDir = join(projectPath, ".project", "sessions");
  const logs: SessionLog[] = [];

  try {
    const files = await readdir(sessionsDir);
    const mdFiles = files.filter((f) => f.endsWith(".md")).sort().reverse();

    for (const file of mdFiles) {
      const content = await readFile(join(sessionsDir, file), "utf-8");
      const date = file.replace(".md", "");
      const sessions = parseSessionFile(content);

      if (sessions.length > 0) {
        logs.push({ date, sessions });
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return logs;
}

function parseSessionFile(content: string): SessionEntry[] {
  const sessions: SessionEntry[] = [];
  const lines = content.split("\n");

  let currentSession: SessionEntry | null = null;
  let currentSection: "changes" | "insights" | "commits" | null = null;

  for (const line of lines) {
    // New session header (## Session at HH:MM or ## Session Continued)
    if (line.startsWith("## Session")) {
      if (currentSession) {
        sessions.push(currentSession);
      }

      const timeMatch = line.match(/(\d{1,2}:\d{2})/);
      const titleMatch = line.match(/## Session at \d{1,2}:\d{2}\s*[-–]\s*(.+)/);

      currentSession = {
        time: timeMatch?.[1] || "00:00",
        title: titleMatch?.[1]?.trim(),
        changes: [],
        insights: [],
        commits: [],
      };
      currentSection = null;
      continue;
    }

    // Section headers
    if (line.startsWith("### Changes Made") || line.startsWith("### Changes")) {
      currentSection = "changes";
      continue;
    }

    if (line.startsWith("### Key Insights") || line.startsWith("### Insights")) {
      currentSection = "insights";
      continue;
    }

    if (line.startsWith("### Commit") || line.includes("Commit")) {
      currentSection = "commits";
      continue;
    }

    // Other section headers reset current section
    if (line.startsWith("### ")) {
      currentSection = null;
      continue;
    }

    // Parse list items
    if (currentSession && currentSection && line.match(/^[-*]\s+/)) {
      const item = line.replace(/^[-*]\s+/, "").trim();

      if (item) {
        if (currentSection === "changes") {
          currentSession.changes.push(item);
        } else if (currentSection === "insights") {
          currentSession.insights.push(item);
        } else if (currentSection === "commits") {
          // Extract commit hash if present
          const hashMatch = item.match(/`?([a-f0-9]{7,40})`?/i);
          if (hashMatch) {
            currentSession.commits.push(hashMatch[1]);
          } else {
            currentSession.commits.push(item);
          }
        }
      }
    }

    // Look for inline commit references
    if (currentSession && line.includes("`") && currentSection === "commits") {
      const matches = line.matchAll(/`([a-f0-9]{7,40})`/gi);
      for (const match of matches) {
        if (!currentSession.commits.includes(match[1])) {
          currentSession.commits.push(match[1]);
        }
      }
    }
  }

  // Don't forget the last session
  if (currentSession) {
    sessions.push(currentSession);
  }

  return sessions;
}
