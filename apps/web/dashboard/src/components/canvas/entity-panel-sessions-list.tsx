"use client";

import { useState, useEffect, useMemo } from "react";
import { BasePanel } from "./base-panel";
import { useCanvas } from "./canvas-context";
import { Text, Badge } from "@tremor/react";
import { cn } from "@/lib/utils";

interface Session {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
}

interface SessionsByDay {
  date: string;
  sessions: Session[];
  totalCost: number;
  totalTurns: number;
}

interface EntityPanelSessionsListProps {
  panelId: string;
}

export function EntityPanelSessionsList({ panelId }: EntityPanelSessionsListProps) {
  const { openPanel } = useCanvas();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions
  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load sessions");
        setLoading(false);
      });
  }, []);

  // Group sessions by date
  const sessionsByDay = useMemo(() => {
    const grouped = new Map<string, Session[]>();

    for (const session of sessions) {
      // Extract date part (YYYY-MM-DD)
      const dateOnly = session.date.split(" ")[0];
      const existing = grouped.get(dateOnly) || [];
      grouped.set(dateOnly, [...existing, session]);
    }

    // Convert to array and sort by date descending
    const result: SessionsByDay[] = Array.from(grouped.entries())
      .map(([date, daySessions]) => ({
        date,
        sessions: daySessions.sort((a, b) => a.date.localeCompare(b.date)),
        totalCost: daySessions.reduce((sum, s) => sum + s.cost, 0),
        totalTurns: daySessions.reduce((sum, s) => sum + s.turns, 0),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }, [sessions]);

  const handleDateClick = (e: React.MouseEvent, date: string) => {
    e.stopPropagation();
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    console.log("Opening session panel for date:", date);
    openPanel("session", date, panelId, formattedDate);
  };

  return (
    <BasePanel
      panelId={panelId}
      entityType="sessions-list"
      title="Sessions"
      showClose={false}
      width={400}
      minWidth={320}
      maxWidth={600}
    >
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Text>Loading sessions...</Text>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32">
          <Text className="text-red-500">{error}</Text>
        </div>
      ) : sessionsByDay.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <Text className="text-muted-foreground">No sessions found</Text>
          <Text className="text-xs text-muted-foreground">
            Run some Claude Code sessions to see data here
          </Text>
        </div>
      ) : (
        <div className="space-y-2">
          {sessionsByDay.map((day) => (
            <button
              key={day.date}
              onClick={(e) => handleDateClick(e, day.date)}
              className={cn(
                "w-full text-left p-3 rounded-lg border",
                "hover:bg-muted/50 hover:border-primary/30",
                "transition-colors"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Badge color="gray" size="xs">
                  {day.sessions.length} session{day.sessions.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{day.totalTurns} turns</span>
                <span>${day.totalCost.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </BasePanel>
  );
}
