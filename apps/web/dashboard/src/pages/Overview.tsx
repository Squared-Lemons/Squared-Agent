import { Card, Metric, Text, AreaChart, Title } from "@tremor/react";
import { useStats } from "@/hooks/useStats";
import { formatNumber } from "@/lib/utils";

export function Overview() {
  const { stats, loading, error } = useStats();

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

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Text>No data yet</Text>
        <Text className="text-muted-foreground">
          Add a project to get started
        </Text>
      </div>
    );
  }

  const cacheEfficiency =
    stats.totalTokens.cacheRead > 0
      ? (
          (stats.totalTokens.cacheRead /
            (stats.totalTokens.input + stats.totalTokens.cacheRead)) *
          100
        ).toFixed(1)
      : "0";

  const chartData = stats.byDay.map((day) => ({
    date: day.date,
    Cost: Number(day.cost.toFixed(2)),
    Sessions: day.sessions,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Your work summaries and session costs
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Total Cost</Text>
          <Metric>${stats.totalCost.toFixed(2)}</Metric>
        </Card>

        <Card decoration="top" decorationColor="emerald">
          <Text>Total Sessions</Text>
          <Metric>{stats.totalSessions}</Metric>
        </Card>

        <Card decoration="top" decorationColor="amber">
          <Text>Active Projects</Text>
          <Metric>{stats.byProject.length}</Metric>
        </Card>

        <Card decoration="top" decorationColor="violet">
          <Text>Cache Efficiency</Text>
          <Metric>{cacheEfficiency}%</Metric>
        </Card>
      </div>

      {/* Token Usage Summary */}
      <Card>
        <Title>Token Usage</Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <Text>Input</Text>
            <p className="text-xl font-semibold">
              {formatNumber(stats.totalTokens.input)}
            </p>
          </div>
          <div>
            <Text>Output</Text>
            <p className="text-xl font-semibold">
              {formatNumber(stats.totalTokens.output)}
            </p>
          </div>
          <div>
            <Text>Cache Read</Text>
            <p className="text-xl font-semibold">
              {formatNumber(stats.totalTokens.cacheRead)}
            </p>
          </div>
          <div>
            <Text>Cache Create</Text>
            <p className="text-xl font-semibold">
              {formatNumber(stats.totalTokens.cacheCreate)}
            </p>
          </div>
        </div>
      </Card>

      {/* Cost Chart */}
      {chartData.length > 0 && (
        <Card>
          <Title>Daily Costs (Last 30 Days)</Title>
          <AreaChart
            className="h-72 mt-4"
            data={chartData}
            index="date"
            categories={["Cost"]}
            colors={["blue"]}
            valueFormatter={(value) => `$${value.toFixed(2)}`}
            showAnimation
          />
        </Card>
      )}

      {/* Project Breakdown */}
      {stats.byProject.length > 0 && (
        <Card>
          <Title>Cost by Project</Title>
          <div className="mt-4 space-y-3">
            {stats.byProject.map((project) => (
              <div
                key={project.projectId}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{project.projectName}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.sessions} sessions
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  ${project.cost.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
