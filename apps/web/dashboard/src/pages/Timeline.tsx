import { useState, useMemo, useEffect } from "react";
import { Card, Title, Text, Badge } from "@tremor/react";
import { useStats } from "@/hooks/useStats";
import { cn } from "@/lib/utils";

interface SessionDetail {
  projectId: string;
  projectName: string;
  date: string;
  type: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
}

interface SessionLogEntry {
  time: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

interface SessionLog {
  projectId: string;
  projectName: string;
  date: string;
  entries: SessionLogEntry[];
}

// Generate calendar data for GitHub-style heatmap
function generateCalendarData(
  byDay: { date: string; sessions: number; cost: number }[]
) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 365);

  const dayMap = new Map(byDay.map((d) => [d.date, d]));
  const weeks: { date: Date; data: typeof byDay[0] | null }[][] = [];
  let currentWeek: { date: Date; data: typeof byDay[0] | null }[] = [];

  // Start from the first Sunday before or on startDate
  const current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay());

  while (current <= today) {
    const dateStr = current.toISOString().split("T")[0];
    currentWeek.push({
      date: new Date(current),
      data: dayMap.get(dateStr) || null,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    current.setDate(current.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getIntensityClass(sessions: number): string {
  if (sessions === 0) return "bg-muted";
  if (sessions === 1) return "bg-emerald-200";
  if (sessions <= 3) return "bg-emerald-400";
  if (sessions <= 5) return "bg-emerald-600";
  return "bg-emerald-800";
}

export function Timeline() {
  const { stats, loading, error } = useStats();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const calendarData = useMemo(() => {
    if (!stats?.byDay) return [];
    return generateCalendarData(stats.byDay);
  }, [stats?.byDay]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate || !stats?.byDay) return null;
    return stats.byDay.find((d) => d.date === selectedDate) || null;
  }, [selectedDate, stats?.byDay]);

  // Fetch sessions and logs when date or month is selected
  useEffect(() => {
    if (!selectedDate && !selectedMonth) {
      setSessions([]);
      setSessionLogs([]);
      setExpandedSessions(new Set());
      return;
    }

    setLoadingSessions(true);
    const params = selectedDate
      ? `date=${selectedDate}`
      : `month=${selectedMonth}`;

    // Fetch both sessions (tokens) and logs (changes/insights) in parallel
    Promise.all([
      fetch(`/api/stats/sessions?${params}`).then((res) => res.json()),
      fetch(`/api/stats/logs?${params}`).then((res) => res.json()),
    ])
      .then(([sessionsData, logsData]) => {
        setSessions(sessionsData.sessions || []);
        setSessionLogs(logsData.logs || []);
      })
      .catch((err) => {
        console.error("Failed to load sessions:", err);
        setSessions([]);
        setSessionLogs([]);
      })
      .finally(() => {
        setLoadingSessions(false);
      });
  }, [selectedDate, selectedMonth]);

  // Toggle session expansion
  const toggleSession = (key: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Handle date selection (clears month)
  const handleDateSelect = (date: string) => {
    setSelectedMonth(null);
    setSelectedDate(date);
  };

  // Handle month selection (clears date)
  const handleMonthSelect = (month: string) => {
    setSelectedDate(null);
    setSelectedMonth(month);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Timeline</h1>
        <p className="text-muted-foreground">Your activity over time</p>
      </div>

      {/* Calendar Heatmap */}
      <Card>
        <Title>Activity (Last 12 Months)</Title>

        <div className="mt-6 overflow-x-auto">
          {/* Month Labels */}
          <div className="flex gap-1 mb-2 ml-8">
            {calendarData
              .filter((_, i) => i % 4 === 0)
              .map((week, i) => {
                const firstDay = week[0]?.date;
                if (!firstDay) return null;
                return (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground"
                    style={{ width: "52px" }}
                  >
                    {months[firstDay.getMonth()]}
                  </div>
                );
              })}
          </div>

          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
              <span className="h-3">Mon</span>
              <span className="h-3"></span>
              <span className="h-3">Wed</span>
              <span className="h-3"></span>
              <span className="h-3">Fri</span>
              <span className="h-3"></span>
              <span className="h-3"></span>
            </div>

            {/* Calendar Grid */}
            <div className="flex gap-1">
              {calendarData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    const dateStr = day.date.toISOString().split("T")[0];
                    const sessions = day.data?.sessions || 0;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dayIdx}
                        onClick={() => handleDateSelect(dateStr)}
                        className={cn(
                          "w-3 h-3 rounded-sm transition-all",
                          getIntensityClass(sessions),
                          isSelected && "ring-2 ring-primary ring-offset-1"
                        )}
                        title={`${dateStr}: ${sessions} sessions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-emerald-200" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
              <div className="w-3 h-3 rounded-sm bg-emerald-600" />
              <div className="w-3 h-3 rounded-sm bg-emerald-800" />
            </div>
            <span>More</span>
          </div>
        </div>
      </Card>

      {/* Selected Day/Month Details */}
      {(selectedDate || selectedMonth) && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Title>
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
            </Title>
            <button
              onClick={() => {
                setSelectedDate(null);
                setSelectedMonth(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>

          {/* Session Details - Rich View */}
          <div>
            {loadingSessions ? (
              <Text className="text-muted-foreground">Loading sessions...</Text>
            ) : sessionLogs.length === 0 && sessions.length === 0 ? (
              <Text className="text-muted-foreground">No session details available</Text>
            ) : (
              <div className="space-y-6">
                {/* Group by date for month view */}
                {(() => {
                  // Get unique dates from logs
                  const dates = selectedMonth
                    ? [...new Set(sessionLogs.map(l => l.date))].sort((a, b) => b.localeCompare(a))
                    : [selectedDate!];

                  return dates.map((date) => {
                    const dateLogs = sessionLogs.filter(l => l.date === date);
                    const dateSessions = sessions.filter(s => s.date.startsWith(date));

                    // Merge logs and sessions by time
                    const allEntries = dateLogs.flatMap(log =>
                      log.entries.map(entry => ({
                        ...entry,
                        projectName: log.projectName,
                        tokenData: dateSessions.find(s => {
                          const sessionTime = s.date.split(" ")[1];
                          return sessionTime?.startsWith(entry.time.substring(0, 2));
                        }),
                      }))
                    );

                    // Add sessions without log entries
                    const coveredTimes = new Set(allEntries.map(e => e.time.substring(0, 2)));
                    const orphanSessions = dateSessions.filter(s => {
                      const hour = s.date.split(" ")[1]?.substring(0, 2);
                      return !coveredTimes.has(hour || "");
                    });

                    const totalChanges = allEntries.reduce((sum, e) => sum + e.changes.length, 0);

                    return (
                      <div key={date} className="border rounded-lg overflow-hidden">
                        {/* Date Header */}
                        <div className="bg-muted/30 px-4 py-3 border-b">
                          <Text className="font-semibold">
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Text>
                        </div>

                        {/* Session Entries */}
                        <div className="divide-y">
                          {allEntries.map((entry, idx) => {
                            const key = `${date}-${entry.time}-${idx}`;
                            const isExpanded = expandedSessions.has(key);
                            const changeCount = entry.changes.length;

                            return (
                              <div key={key} className="bg-background">
                                {/* Collapsible Header */}
                                <button
                                  onClick={() => toggleSession(key)}
                                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "transition-transform",
                                      isExpanded && "rotate-90"
                                    )}>
                                      ▶
                                    </span>
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
                                  <Badge color="gray">
                                    {changeCount} change{changeCount !== 1 ? "s" : ""}
                                  </Badge>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 space-y-4">
                                    {/* Token Stats */}
                                    {entry.tokenData && (
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-muted/30 rounded-lg">
                                        <div>
                                          <span className="text-muted-foreground">Turns</span>
                                          <p className="font-medium">{entry.tokenData.turns.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Input</span>
                                          <p className="font-medium">{entry.tokenData.input.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Output</span>
                                          <p className="font-medium">{entry.tokenData.output.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            {entry.tokenData.type === "subscription" ? "Projected API Cost" : "Actual Cost"}
                                          </span>
                                          <p className={cn(
                                            "font-medium",
                                            entry.tokenData.type === "subscription" ? "text-muted-foreground" : "text-amber-600"
                                          )}>
                                            ${entry.tokenData.cost.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Changes */}
                                    {entry.changes.length > 0 && (
                                      <div>
                                        <Text className="font-semibold text-sm mb-2">Changes:</Text>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                          {entry.changes.map((change, i) => (
                                            <li key={i} className="text-muted-foreground">{change}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Insights */}
                                    {entry.insights.length > 0 && (
                                      <div>
                                        <Text className="font-semibold text-sm mb-2">Insights:</Text>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                          {entry.insights.map((insight, i) => (
                                            <li key={i} className="text-blue-600">{insight}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Commits */}
                                    {entry.commits.length > 0 && (
                                      <div>
                                        <Text className="font-semibold text-sm mb-2">Commits:</Text>
                                        <div className="flex flex-wrap gap-2">
                                          {entry.commits.map((commit, i) => (
                                            <Badge key={i} color="gray" className="font-mono">
                                              {commit}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Orphan sessions (token data without log entries) */}
                          {orphanSessions.map((session, idx) => {
                            const key = `orphan-${date}-${session.date}-${idx}`;
                            const isExpanded = expandedSessions.has(key);
                            const time = session.date.split(" ")[1] || "00:00";

                            return (
                              <div key={key} className="bg-background">
                                <button
                                  onClick={() => toggleSession(key)}
                                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "transition-transform",
                                      isExpanded && "rotate-90"
                                    )}>
                                      ▶
                                    </span>
                                    <span className="font-medium">{time}</span>
                                    <Badge
                                      color={session.type === "subscription" ? "blue" : "amber"}
                                      size="xs"
                                    >
                                      {session.type}
                                    </Badge>
                                  </div>
                                  <Badge color="gray">tokens only</Badge>
                                </button>

                                {isExpanded && (
                                  <div className="px-4 pb-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-muted/30 rounded-lg">
                                      <div>
                                        <span className="text-muted-foreground">Turns</span>
                                        <p className="font-medium">{session.turns.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Input</span>
                                        <p className="font-medium">{session.input.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Output</span>
                                        <p className="font-medium">{session.output.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          {session.type === "subscription" ? "Projected API Cost" : "Actual Cost"}
                                        </span>
                                        <p className={cn(
                                          "font-medium",
                                          session.type === "subscription" ? "text-muted-foreground" : "text-amber-600"
                                        )}>
                                          ${session.cost.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Monthly Summary */}
      {stats && stats.byDay.length > 0 && (
        <Card>
          <Title>Monthly Summary</Title>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const monthlyData = stats.byDay.reduce(
                (acc, day) => {
                  const month = day.date.substring(0, 7);
                  if (!acc[month]) {
                    acc[month] = { sessions: 0, cost: 0 };
                  }
                  acc[month].sessions += day.sessions;
                  acc[month].cost += day.cost;
                  return acc;
                },
                {} as Record<string, { sessions: number; cost: number }>
              );

              return Object.entries(monthlyData)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .slice(0, 4)
                .map(([month, data]) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className={cn(
                      "p-3 rounded-lg text-left transition-all hover:bg-muted",
                      selectedMonth === month
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50"
                    )}
                  >
                    <Badge color="blue" className="mb-2">
                      {new Date(month + "-01").toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </Badge>
                    <p className="text-lg font-semibold">
                      {data.sessions} sessions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${data.cost.toFixed(2)}
                    </p>
                  </button>
                ));
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
