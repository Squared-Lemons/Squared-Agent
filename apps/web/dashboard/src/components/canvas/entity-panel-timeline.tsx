"use client";

import { useState, useEffect, useMemo } from "react";
import { BasePanel } from "./base-panel";
import { useCanvas } from "./canvas-context";
import { Card, Title, Text, Badge } from "@tremor/react";
import { cn } from "@/lib/utils";

interface Stats {
  byDay: {
    date: string;
    sessions: number;
    cost: number;
  }[];
}

interface EntityPanelTimelineProps {
  panelId: string;
  title?: string;
}

// Generate calendar data for GitHub-style heatmap
function generateCalendarData(byDay: { date: string; sessions: number; cost: number }[]) {
  // Use the most recent date from data, or today if no data
  const sortedDates = byDay.map(d => d.date).sort();
  const latestDataDate = sortedDates.length > 0
    ? new Date(sortedDates[sortedDates.length - 1])
    : new Date();

  // End date is the latest data date (or today)
  const endDate = new Date(latestDataDate);

  // Start date is 365 days before the end date
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 365);

  const dayMap = new Map(byDay.map((d) => [d.date, d]));
  const weeks: { date: Date; data: (typeof byDay)[0] | null }[][] = [];
  let currentWeek: { date: Date; data: (typeof byDay)[0] | null }[] = [];

  // Start from the first Sunday before or on startDate
  const current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay());

  while (current <= endDate) {
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

const MONTHS = [
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

export function EntityPanelTimeline({ panelId, title }: EntityPanelTimelineProps) {
  const { openPanel } = useCanvas();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Failed to load timeline data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const calendarData = useMemo(() => {
    if (!stats?.byDay) return [];
    return generateCalendarData(stats.byDay);
  }, [stats?.byDay]);

  // Calculate monthly data
  const monthlyData = useMemo(() => {
    if (!stats?.byDay) return {};

    return stats.byDay.reduce(
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
  }, [stats?.byDay]);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedMonth(null);

    const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    openPanel("session", dateStr, panelId, formattedDate);
  };

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <BasePanel panelId={panelId} entityType="timeline" title={title} width={700}>
        <div className="flex items-center justify-center h-32">
          <Text>Loading timeline...</Text>
        </div>
      </BasePanel>
    );
  }

  if (!stats) {
    return (
      <BasePanel panelId={panelId} entityType="timeline" title={title} width={700}>
        <div className="flex items-center justify-center h-32">
          <Text className="text-muted-foreground">No data available</Text>
        </div>
      </BasePanel>
    );
  }

  return (
    <BasePanel panelId={panelId} entityType="timeline" title={title} width={700}>
      <div className="space-y-6">
        {/* Calendar Heatmap */}
        <Card>
          <Title>Activity (Last 12 Months)</Title>
          <Text className="text-xs text-muted-foreground mb-4">
            Click a day to view session details
          </Text>

          <div className="overflow-x-auto">
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
                      {MONTHS[firstDay.getMonth()]}
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
                          onClick={() => sessions > 0 && handleDateClick(dateStr)}
                          className={cn(
                            "w-3 h-3 rounded-sm transition-all",
                            getIntensityClass(sessions),
                            isSelected && "ring-2 ring-primary ring-offset-1",
                            sessions > 0 && "cursor-pointer hover:ring-1 hover:ring-primary/50"
                          )}
                          title={`${dateStr}: ${sessions} sessions`}
                          disabled={sessions === 0}
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

        {/* Monthly Summary */}
        {Object.keys(monthlyData).length > 0 && (
          <Card>
            <Title>Monthly Summary</Title>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(monthlyData)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .slice(0, 8)
                .map(([month, data]) => (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(month)}
                    className={cn(
                      "p-3 rounded-lg text-left transition-all hover:bg-muted",
                      selectedMonth === month
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50"
                    )}
                  >
                    <Badge color="blue" className="mb-2" size="xs">
                      {new Date(month + "-01").toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </Badge>
                    <p className="text-lg font-semibold">{data.sessions} sessions</p>
                    <p className="text-sm text-muted-foreground">${data.cost.toFixed(2)}</p>
                  </button>
                ))}
            </div>
          </Card>
        )}
      </div>
    </BasePanel>
  );
}
