"use client";

import { useState, useEffect } from "react";
import { BasePanel } from "./base-panel";
import { Text, Badge, Card } from "@tremor/react";
import { cn } from "@/lib/utils";

interface TokenData {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
}

interface LogEntry {
  time: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

interface EntityPanelSessionDetailProps {
  panelId: string;
  entityId?: string; // Format: "2026-01-28-05:39"
  title?: string;
  tokenData?: TokenData;
  logEntry?: LogEntry;
}

export function EntityPanelSessionDetail({
  panelId,
  entityId,
  title,
  tokenData: initialTokenData,
  logEntry: initialLogEntry,
}: EntityPanelSessionDetailProps) {
  const [tokenData, setTokenData] = useState<TokenData | undefined>(initialTokenData);
  const [logEntry, setLogEntry] = useState<LogEntry | undefined>(initialLogEntry);
  const [loading, setLoading] = useState(!initialTokenData && !initialLogEntry);

  // If no initial data provided, fetch it based on entityId
  useEffect(() => {
    if (initialTokenData || initialLogEntry || !entityId) {
      return;
    }

    // Parse entityId: "2026-01-28-05:39" -> date: "2026-01-28", time: "05:39"
    const parts = entityId.split("-");
    if (parts.length < 4) return;

    const date = parts.slice(0, 3).join("-");
    const time = parts.slice(3).join(":");

    setLoading(true);

    // Fetch session data for this date
    Promise.all([
      fetch(`/api/sessions?date=${date}`).then((res) => res.json()),
      fetch(`/api/stats/logs?date=${date}`).then((res) => res.json()),
    ])
      .then(([sessionsData, logsData]) => {
        const sessions = sessionsData.sessions || [];
        const logs = logsData.logs || [];

        // Find matching token data by time
        const matchingSession = sessions.find((s: TokenData) => {
          const sessionTime = s.date.split(" ")[1];
          return sessionTime === time || sessionTime?.startsWith(time.substring(0, 2));
        });

        // Find matching log entry by time
        const allEntries = logs.flatMap((l: { entries: LogEntry[] }) => l.entries);
        const matchingEntry = allEntries.find(
          (e: LogEntry) => e.time === time || e.time.startsWith(time.substring(0, 2))
        );

        setTokenData(matchingSession);
        setLogEntry(matchingEntry);
      })
      .catch((err) => {
        console.error("Failed to load session detail:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [entityId, initialTokenData, initialLogEntry]);

  const hasData = tokenData || logEntry;

  if (loading) {
    return (
      <BasePanel
        panelId={panelId}
        entityType="session-detail"
        title={title}
        width={500}
        minWidth={350}
        maxWidth={700}
      >
        <div className="flex items-center justify-center h-32">
          <Text>Loading session details...</Text>
        </div>
      </BasePanel>
    );
  }

  return (
    <BasePanel
      panelId={panelId}
      entityType="session-detail"
      title={title}
      width={500}
      minWidth={350}
      maxWidth={700}
    >
      {!hasData ? (
        <div className="flex items-center justify-center h-32">
          <Text className="text-muted-foreground">No session data</Text>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Session Type Badge */}
          {tokenData && (
            <div className="flex items-center gap-2">
              <Badge
                color={tokenData.type === "subscription" ? "blue" : "amber"}
                size="sm"
              >
                {tokenData.type}
              </Badge>
              <Text className="text-muted-foreground text-sm">
                {tokenData.date}
              </Text>
            </div>
          )}

          {/* Token Stats */}
          {tokenData && (
            <Card className="p-4">
              <Text className="font-semibold mb-3">Token Usage</Text>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-muted-foreground text-sm">Turns</Text>
                  <p className="text-xl font-semibold">{tokenData.turns.toLocaleString()}</p>
                </div>
                <div>
                  <Text className="text-muted-foreground text-sm">
                    {tokenData.type === "subscription" ? "Projected Cost" : "Actual Cost"}
                  </Text>
                  <p className={cn(
                    "text-xl font-semibold",
                    tokenData.type === "api" && "text-amber-600"
                  )}>
                    ${tokenData.cost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Text className="text-muted-foreground text-sm">Input</Text>
                  <p className="font-medium">{tokenData.input.toLocaleString()}</p>
                </div>
                <div>
                  <Text className="text-muted-foreground text-sm">Output</Text>
                  <p className="font-medium">{tokenData.output.toLocaleString()}</p>
                </div>
                <div>
                  <Text className="text-muted-foreground text-sm">Cache Read</Text>
                  <p className="font-medium">{tokenData.cacheRead.toLocaleString()}</p>
                </div>
                <div>
                  <Text className="text-muted-foreground text-sm">Cache Create</Text>
                  <p className="font-medium">{tokenData.cacheCreate.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Changes */}
          {logEntry && logEntry.changes.length > 0 && (
            <Card className="p-4">
              <Text className="font-semibold mb-3">Changes Made</Text>
              <ul className="space-y-2">
                {logEntry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Insights */}
          {logEntry && logEntry.insights.length > 0 && (
            <Card className="p-4 bg-blue-500/5">
              <Text className="font-semibold mb-3 text-blue-700">Key Insights</Text>
              <ul className="space-y-2">
                {logEntry.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-600">
                    <span className="mt-1">*</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Commits */}
          {logEntry && logEntry.commits.length > 0 && (
            <Card className="p-4">
              <Text className="font-semibold mb-3">Commits</Text>
              <div className="flex flex-wrap gap-2">
                {logEntry.commits.map((commit, i) => (
                  <Badge key={i} color="gray" className="font-mono">
                    {commit}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </BasePanel>
  );
}
