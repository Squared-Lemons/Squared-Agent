import { useState, useMemo } from "react";
import { Card, Title, Text, Badge } from "@tremor/react";
import { useStats } from "@/hooks/useStats";
import { cn } from "@/lib/utils";

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

  const calendarData = useMemo(() => {
    if (!stats?.byDay) return [];
    return generateCalendarData(stats.byDay);
  }, [stats?.byDay]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate || !stats?.byDay) return null;
    return stats.byDay.find((d) => d.date === selectedDate) || null;
  }, [selectedDate, stats?.byDay]);

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
                        onClick={() => setSelectedDate(dateStr)}
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

      {/* Selected Day Details */}
      {selectedDate && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Title>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Title>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>

          {selectedDayData ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text>Sessions</Text>
                <p className="text-2xl font-bold">{selectedDayData.sessions}</p>
              </div>
              <div>
                <Text>Cost</Text>
                <p className="text-2xl font-bold">
                  ${selectedDayData.cost.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <Text className="text-muted-foreground">No activity on this day</Text>
          )}
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
                  <div
                    key={month}
                    className="p-3 bg-muted/50 rounded-lg"
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
                  </div>
                ));
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
