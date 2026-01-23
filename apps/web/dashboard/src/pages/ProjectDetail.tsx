import { useParams, Link } from "react-router-dom";
import { Card, Title, Text, BarChart, Badge } from "@tremor/react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useProjectStats } from "@/hooks/useStats";
import { formatDate, formatNumber } from "@/lib/utils";

type TabType = "sessions" | "costs" | "worklog";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { stats, loading, error } = useProjectStats(id);
  const [activeTab, setActiveTab] = useState<TabType>("sessions");
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text className="text-red-500">{error || "Project not found"}</Text>
      </div>
    );
  }

  const costChartData = stats.tokenSessions.map((session) => {
    // Shorten date for chart display: "2026-01-19 05:45" -> "Jan 19"
    const [datePart] = session.date.split(" ");
    const d = new Date(datePart);
    const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      date: shortDate,
      fullDate: session.date,
      Input: session.input,
      Output: session.output,
      "Cache Read": session.cacheRead,
      "Cache Create": session.cacheCreate,
    };
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: "sessions", label: "Sessions" },
    { id: "costs", label: "Costs" },
    { id: "worklog", label: "Work Log" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/projects"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">{stats.project.name}</h1>
        <p className="text-muted-foreground">{stats.project.path}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Projected API Cost</Text>
          <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <Text>Sessions</Text>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>Work Days</Text>
          <p className="text-2xl font-bold">{stats.sessionLogs.length}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          {stats.sessionLogs.length === 0 ? (
            <Card>
              <Text className="text-center py-8">No session logs found</Text>
            </Card>
          ) : (
            stats.sessionLogs.map((log) => (
              <Card key={log.date}>
                <Title>{formatDate(log.date)}</Title>
                <div className="mt-4 space-y-2">
                  {log.sessions.map((session, idx) => {
                    const key = `${log.date}-${idx}`;
                    const isExpanded = expandedSessions.has(key);

                    return (
                      <div
                        key={key}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSession(key)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {session.time}
                              {session.title && ` - ${session.title}`}
                            </span>
                          </div>
                          <Badge color="blue">
                            {session.changes.length} changes
                          </Badge>
                        </button>

                        {isExpanded && (
                          <div className="p-3 pt-0 border-t border-border">
                            {session.changes.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium mb-1">
                                  Changes:
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                  {session.changes.map((change, i) => (
                                    <li key={i}>{change}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {session.insights.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium mb-1">
                                  Insights:
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                  {session.insights.map((insight, i) => (
                                    <li key={i}>{insight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {session.commits.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">
                                  Commits:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {session.commits.map((commit, i) => (
                                    <Badge key={i} color="gray">
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
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "costs" && (
        <div className="space-y-4">
          <Card>
            <Title>Token Usage by Session</Title>
            {costChartData.length > 0 ? (
              <BarChart
                className="h-72 mt-4"
                data={costChartData}
                index="date"
                categories={["Input", "Output", "Cache Read", "Cache Create"]}
                colors={["blue", "emerald", "amber", "violet"]}
                valueFormatter={(value) => formatNumber(value)}
                stack
                showAnimation
              />
            ) : (
              <Text className="text-center py-8">No token data available</Text>
            )}
          </Card>

          <Card>
            <Title>Session Details</Title>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-right p-2">Input</th>
                    <th className="text-right p-2">Output</th>
                    <th className="text-right p-2">Cache Read</th>
                    <th className="text-right p-2">Turns</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tokenSessions.map((session, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="p-2">{session.date}</td>
                      <td className="p-2">
                        <Badge
                          color={
                            session.type === "subscription" ? "blue" : "amber"
                          }
                        >
                          {session.type}
                        </Badge>
                      </td>
                      <td className="text-right p-2">
                        {formatNumber(session.input)}
                      </td>
                      <td className="text-right p-2">
                        {formatNumber(session.output)}
                      </td>
                      <td className="text-right p-2">
                        {formatNumber(session.cacheRead)}
                      </td>
                      <td className="text-right p-2">{session.turns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "worklog" && (
        <div className="space-y-4">
          {stats.sessionLogs.length === 0 ? (
            <Card>
              <Text className="text-center py-8">No work log entries</Text>
            </Card>
          ) : (
            stats.sessionLogs.flatMap((log) =>
              log.sessions.map((session, idx) => (
                <Card key={`${log.date}-${idx}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge color="blue">{formatDate(log.date)}</Badge>
                    <span className="text-muted-foreground">{session.time}</span>
                    {session.title && (
                      <span className="font-medium">{session.title}</span>
                    )}
                  </div>

                  {session.changes.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {session.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  )}
                </Card>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
