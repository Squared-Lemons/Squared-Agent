"use client";

import { useState, useEffect } from "react";
import { BasePanel } from "./base-panel";
import { useCanvas } from "./canvas-context";
import { Text, Badge, Card } from "@tremor/react";
import { cn } from "@/lib/utils";

interface TokenSession {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
  summary?: string;
}

interface SessionLogEntry {
  time: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

interface SessionLog {
  date: string;
  entries: SessionLogEntry[];
}

interface EntityPanelSessionProps {
  panelId: string;
  date: string; // YYYY-MM-DD format
  title?: string;
}

export function EntityPanelSession({ panelId, date, title }: EntityPanelSessionProps) {
  const { openPanel } = useCanvas();
  const [sessions, setSessions] = useState<TokenSession[]>([]);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

    // Fetch sessions for this date
    fetch(`${API_BASE}/sessions?date=${date}`)
      .then((res) => res.json())
      .then((sessionsData) => {
        // Transform and filter sessions for this date
        const allSessions = sessionsData.sessions || [];
        const daySessions = allSessions.filter((s: any) => {
          const sessionDate = (s.ended_at || s.date || '').split('T')[0];
          return sessionDate === date;
        }).map((s: any) => ({
          date: s.ended_at || s.date,
          type: 'subscription' as const,
          input: s.tokens_in || 0,
          output: s.tokens_out || 0,
          cacheRead: 0,
          cacheCreate: 0,
          turns: s.turns || 0,
          cost: s.cost_usd || 0,
          summary: s.summary || '',
        }));
        setSessions(daySessions);
        setLogs([]); // Logs not available in cloud API yet
      })
      .catch((err) => {
        console.error("Failed to load session details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  // Calculate totals for the day
  const totals = sessions.reduce(
    (acc, s) => ({
      input: acc.input + s.input,
      output: acc.output + s.output,
      cacheRead: acc.cacheRead + s.cacheRead,
      cacheCreate: acc.cacheCreate + s.cacheCreate,
      turns: acc.turns + s.turns,
      cost: acc.cost + s.cost,
    }),
    { input: 0, output: 0, cacheRead: 0, cacheCreate: 0, turns: 0, cost: 0 }
  );

  // Merge logs and sessions
  const allLogEntries = logs.flatMap((log) => log.entries);

  // Match sessions to log entries by time
  const mergedEntries = allLogEntries.map((entry) => {
    const matchingSession = sessions.find((s) => {
      // Handle both "YYYY-MM-DD HH:MM" and "YYYY-MM-DDTHH:MM:SSZ" formats
      const sessionTime = s.date.includes('T')
        ? s.date.split('T')[1]?.substring(0, 2)
        : s.date.split(" ")[1];
      return sessionTime?.startsWith(entry.time.substring(0, 2));
    });
    return { ...entry, tokenData: matchingSession };
  });

  // Find sessions without log entries
  const coveredTimes = new Set(allLogEntries.map((e) => e.time.substring(0, 2)));
  const orphanSessions = sessions.filter((s) => {
    // Handle both "YYYY-MM-DD HH:MM" and "YYYY-MM-DDTHH:MM:SSZ" formats
    const timePart = s.date.includes('T') 
      ? s.date.split('T')[1]?.substring(0, 2)
      : s.date.split(" ")[1]?.substring(0, 2);
    return !coveredTimes.has(timePart || "");
  });

  // Handle clicking a session to open detail panel
  const handleSessionClick = (
    e: React.MouseEvent,
    time: string,
    tokenData?: TokenSession,
    logEntry?: SessionLogEntry
  ) => {
    e.stopPropagation();
    openPanel(
      "session-detail",
      `${date}-${time}`,
      panelId,
      time,
      { tokenData, logEntry }
    );
  };

  return (
    <BasePanel
      panelId={panelId}
      entityType="session"
      title={title}
      width={500}
      minWidth={350}
      maxWidth={700}
    >
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Text>Loading session details...</Text>
        </div>
      ) : sessions.length === 0 && logs.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <Text className="text-muted-foreground">No data for this date</Text>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Day Summary */}
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Text className="text-muted-foreground">Sessions</Text>
                <p className="text-lg font-semibold">{sessions.length}</p>
              </div>
              <div>
                <Text className="text-muted-foreground">Total Turns</Text>
                <p className="text-lg font-semibold">{totals.turns.toLocaleString()}</p>
              </div>
              <div>
                <Text className="text-muted-foreground">Cost</Text>
                <p className="text-lg font-semibold">${totals.cost.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Session List - Click to open detail panel */}
          <div className="space-y-2">
            <Text className="font-semibold text-sm text-muted-foreground">
              Click a session to view details
            </Text>

            {/* Sessions with log entries */}
            {mergedEntries.map((entry, idx) => {
              const changeCount = entry.changes.length;

              return (
                <button
                  key={`${date}-${entry.time}-${idx}`}
                  onClick={(e) => handleSessionClick(e, entry.time, entry.tokenData, entry)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border",
                    "hover:bg-muted/50 hover:border-primary/30",
                    "transition-colors flex items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{entry.time}</span>
                    {entry.tokenData && (
                      <Badge
                        color={entry.tokenData.type === "subscription" ? "blue" : "amber"}
                        size="xs"
                      >
                        {entry.tokenData.type}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {entry.tokenData && (
                      <span>{entry.tokenData.turns} turns</span>
                    )}
                    <Badge color="gray" size="xs">
                      {changeCount} change{changeCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </button>
              );
            })}

            {/* Orphan sessions (token data without log entries) */}
            {orphanSessions.map((session, idx) => {
              const time = session.date.split(" ")[1] || session.date.split("T")[1]?.substring(0,5) || "00:00";
              // Extract first sentence or first 100 chars of summary
              const shortSummary = session.summary 
                ? session.summary.split(' | ')[0].substring(0, 150) + (session.summary.length > 150 ? '...' : '')
                : '';

              return (
                <button
                  key={`orphan-${date}-${session.date}-${idx}`}
                  onClick={(e) => handleSessionClick(e, time, session, undefined)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border",
                    "hover:bg-muted/50 hover:border-primary/30",
                    "transition-colors"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{time}</span>
                      <Badge
                        color={session.type === "subscription" ? "blue" : "amber"}
                        size="xs"
                      >
                        {session.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{session.turns} turns</span>
                    </div>
                  </div>
                  {shortSummary && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {shortSummary}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BasePanel>
  );
}
