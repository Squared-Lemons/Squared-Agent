import { useState, useEffect } from "react";
import { Card, Metric, Text, AreaChart, Title, Badge, ProgressBar } from "@tremor/react";
import { useStats } from "@/hooks/useStats";
import { formatNumber, cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SubscriptionSettings {
  plan: string;
  monthlyPrice: number;
}

export function Overview() {
  const { stats, loading, error } = useStats();
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

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

  const chartData = stats.byDay.map((day) => {
    // Shorten date for chart display: "2026-01-19" -> "Jan 19"
    const d = new Date(day.date);
    const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      date: shortDate,
      Cost: Number(day.cost.toFixed(2)),
      Sessions: day.sessions,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Your work summaries and session costs
        </p>
      </div>

      {/* Subscription Summary Card */}
      {settings && settings.monthlyPrice > 0 && (
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <Title>Subscription Value</Title>
            <Badge color="emerald">{settings.plan.toUpperCase()} Plan</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Text>Projected API Cost</Text>
              <p className="text-2xl font-bold">${stats.subscriptionCost?.toFixed(2) || "0.00"}</p>
              <Text className="text-xs text-muted-foreground">
                {stats.subscriptionSessions || 0} subscription sessions
              </Text>
            </div>

            <div>
              <Text>Actual Cost</Text>
              <p className="text-2xl font-bold">
                ${(settings.monthlyPrice + (stats.apiCost || 0)).toFixed(2)}
              </p>
              <Text className="text-xs text-muted-foreground">
                subscription + API charges
              </Text>
            </div>

            <div>
              <Text>You Saved</Text>
              <p className={cn(
                "text-2xl font-bold",
                (stats.subscriptionCost || 0) - settings.monthlyPrice > 0
                  ? "text-emerald-600"
                  : "text-amber-600"
              )}>
                ${Math.max(0, (stats.subscriptionCost || 0) - settings.monthlyPrice).toFixed(2)}
              </p>
              <Text className="text-xs text-muted-foreground">
                {(((stats.subscriptionCost || 0) / settings.monthlyPrice) * 100).toFixed(0)}% utilization
              </Text>
            </div>

            <div>
              <Text>API Charges</Text>
              <p className={cn(
                "text-2xl font-bold",
                (stats.apiCost || 0) > 0 ? "text-amber-600" : "text-muted-foreground"
              )}>
                ${stats.apiCost?.toFixed(2) || "0.00"}
              </p>
              <Text className="text-xs text-muted-foreground">
                {stats.apiSessions || 0} API sessions
              </Text>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <Text>Subscription Utilization</Text>
              <Text>{(((stats.subscriptionCost || 0) / settings.monthlyPrice) * 100).toFixed(0)}%</Text>
            </div>
            <ProgressBar
              value={Math.min(100, ((stats.subscriptionCost || 0) / settings.monthlyPrice) * 100)}
              color="emerald"
            />
            <Text className="text-xs text-muted-foreground mt-1">
              {(stats.subscriptionCost || 0) >= settings.monthlyPrice
                ? "You've gotten full value from your subscription!"
                : `$${(settings.monthlyPrice - (stats.subscriptionCost || 0)).toFixed(2)} more value available`}
            </Text>
          </div>
        </Card>
      )}

      {/* Setup prompt if no settings */}
      {(!settings || settings.monthlyPrice === 0) && (
        <Card className="bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <Title>Track Your Subscription Value</Title>
              <Text>Configure your Claude subscription to see savings and utilization</Text>
            </div>
            <Link
              to="/settings"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Configure Settings
            </Link>
          </div>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Projected API Cost</Text>
          <Metric>${stats.totalCost.toFixed(2)}</Metric>
          <Text className="text-xs text-muted-foreground mt-1">if all sessions were API</Text>
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
          <Title>Daily Projected API Cost</Title>
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
          <Title>Projected API Cost by Project</Title>
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
