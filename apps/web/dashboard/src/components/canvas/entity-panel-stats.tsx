"use client";

import { useState, useEffect } from "react";
import { BasePanel } from "./base-panel";
import { useCanvas } from "./canvas-context";
import { Card, Metric, Text, AreaChart, Title, Badge } from "@tremor/react";
import { formatNumber, cn } from "@/lib/utils";

interface SubscriptionSettings {
  plan: string;
  monthlyPrice: number;
}

interface Stats {
  totalSessions: number;
  totalCost: number;
  totalTokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheCreate: number;
  };
  subscriptionCost?: number;
  apiCost?: number;
  subscriptionSessions?: number;
  apiSessions?: number;
  byDay: {
    date: string;
    sessions: number;
    cost: number;
  }[];
}

interface EntityPanelStatsProps {
  panelId: string;
  title?: string;
}

export function EntityPanelStats({ panelId, title }: EntityPanelStatsProps) {
  const { openPanel } = useCanvas();
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';
    
    Promise.all([
      fetch(`${API_BASE}/stats`).then((res) => res.json()),
      fetch(`${API_BASE}/settings`).then((res) => res.json()).catch(() => ({ plan: 'pro', monthlyPrice: 20 })),
    ])
      .then(([statsData, settingsData]) => {
        // Calculate projected cost from tokens using Claude API pricing
        // Input: $15/1M, Output: $75/1M, Cache Read: $1.50/1M, Cache Create: $18.75/1M
        const calcProjectedCost = (input: number, output: number, cacheRead = 0, cacheCreate = 0) => {
          return (input * 15 + output * 75 + cacheRead * 1.5 + cacheCreate * 18.75) / 1_000_000;
        };
        
        // Transform cloud API response to expected format
        const totalTokensIn = statsData.stats?.total_tokens_in || 0;
        const totalTokensOut = statsData.stats?.total_tokens_out || 0;
        const totalCacheRead = statsData.stats?.total_cache_read || 0;
        const totalCacheCreate = statsData.stats?.total_cache_create || 0;
        const projectedTotalCost = calcProjectedCost(totalTokensIn, totalTokensOut, totalCacheRead, totalCacheCreate);
        
        const transformedStats = statsData.stats ? {
          totalSessions: statsData.stats.total_sessions || 0,
          totalCost: projectedTotalCost,
          // All imported sessions are subscription sessions (cost_usd=0 means subscription)
          subscriptionCost: projectedTotalCost,
          subscriptionSessions: statsData.stats.total_sessions || 0,
          apiCost: 0,
          apiSessions: 0,
          totalTokens: {
            input: totalTokensIn,
            output: totalTokensOut,
            cacheRead: totalCacheRead,
            cacheCreate: totalCacheCreate,
          },
          byDay: (statsData.recent || []).reduce((acc: any[], s: any) => {
            const date = (s.ended_at || s.date || '').split('T')[0];
            const sessionCost = calcProjectedCost(s.tokens_in || 0, s.tokens_out || 0);
            const existing = acc.find((d: any) => d.date === date);
            if (existing) {
              existing.sessions++;
              existing.cost += sessionCost;
            } else {
              acc.push({ date, sessions: 1, cost: sessionCost });
            }
            return acc;
          }, []).sort((a: any, b: any) => a.date.localeCompare(b.date)),
        } : statsData;
        
        setStats(transformedStats);
        setSettings(settingsData);
      })
      .catch((err) => {
        setError(err.message || "Failed to load stats");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <BasePanel panelId={panelId} entityType="stats" title={title} width={800}>
        <div className="flex items-center justify-center h-32">
          <Text>Loading stats...</Text>
        </div>
      </BasePanel>
    );
  }

  if (error || !stats) {
    return (
      <BasePanel panelId={panelId} entityType="stats" title={title} width={800}>
        <div className="flex items-center justify-center h-32">
          <Text className="text-red-500">{error || "Failed to load stats"}</Text>
        </div>
      </BasePanel>
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
    const d = new Date(day.date);
    const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      date: shortDate,
      fullDate: day.date,
      Cost: Number(day.cost.toFixed(2)),
      Sessions: day.sessions,
    };
  });

  // Handle clicking on a chart point to open that day's session
  const handleChartClick = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    openPanel("session", date, panelId, formattedDate);
  };

  return (
    <BasePanel panelId={panelId} entityType="stats" title={title} width={800}>
      <div className="space-y-6">
        {/* Subscription Summary Card */}
        {settings && settings.monthlyPrice > 0 && (
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
            <div className="flex items-center justify-between mb-4">
              <Title>Subscription Value</Title>
              <Badge color="emerald">{settings.plan.toUpperCase()} Plan</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Text>Projected API Cost</Text>
                <p className="text-xl font-bold">
                  ${stats.subscriptionCost?.toFixed(2) || "0.00"}
                </p>
                <Text className="text-xs text-muted-foreground">
                  {stats.subscriptionSessions || 0} subscription sessions
                </Text>
              </div>

              <div>
                <Text>Actual Cost</Text>
                <p className="text-xl font-bold">
                  ${(settings.monthlyPrice + (stats.apiCost || 0)).toFixed(2)}
                </p>
                <Text className="text-xs text-muted-foreground">
                  subscription + API charges
                </Text>
              </div>

              <div>
                <Text>You Saved</Text>
                <p
                  className={cn(
                    "text-xl font-bold",
                    (stats.subscriptionCost || 0) - settings.monthlyPrice > 0
                      ? "text-emerald-600"
                      : "text-amber-600"
                  )}
                >
                  $
                  {Math.max(
                    0,
                    (stats.subscriptionCost || 0) - settings.monthlyPrice
                  ).toFixed(2)}
                </p>
              </div>

              <div>
                <Text>API Charges</Text>
                <p
                  className={cn(
                    "text-xl font-bold",
                    (stats.apiCost || 0) > 0 ? "text-amber-600" : "text-muted-foreground"
                  )}
                >
                  ${stats.apiCost?.toFixed(2) || "0.00"}
                </p>
                <Text className="text-xs text-muted-foreground">
                  {stats.apiSessions || 0} API sessions
                </Text>
              </div>
            </div>

          </Card>
        )}

        {/* Setup prompt if no settings */}
        {(!settings || settings.monthlyPrice === 0) && (
          <Card className="bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <Title>Track Your Subscription Value</Title>
                <Text>Configure your Claude subscription to see savings</Text>
              </div>
              <button
                onClick={() => openPanel("settings", undefined, panelId, "Settings")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
              >
                Configure Settings
              </button>
            </div>
          </Card>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card decoration="top" decorationColor="blue">
            <Text>Projected API Cost</Text>
            <Metric>${stats.totalCost.toFixed(2)}</Metric>
            <Text className="text-xs text-muted-foreground mt-1">
              if all sessions were API
            </Text>
          </Card>

          <Card decoration="top" decorationColor="emerald">
            <Text>Total Sessions</Text>
            <Metric>{stats.totalSessions}</Metric>
          </Card>

          <Card decoration="top" decorationColor="amber">
            <Text>Active Days</Text>
            <Metric>{stats.byDay.length}</Metric>
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
            <Text className="text-xs text-muted-foreground mb-4">
              Click a point to view session details
            </Text>
            <AreaChart
              className="h-60"
              data={chartData}
              index="date"
              categories={["Cost"]}
              colors={["blue"]}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
              showAnimation
              onValueChange={(value) => {
                if (value?.fullDate && typeof value.fullDate === "string") {
                  handleChartClick(value.fullDate);
                }
              }}
            />
          </Card>
        )}
      </div>
    </BasePanel>
  );
}
