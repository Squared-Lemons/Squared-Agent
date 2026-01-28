"use client";

import { useState, useEffect } from "react";
import { BasePanel } from "./base-panel";
import { Card, Title, Text, Badge } from "@tremor/react";
import { cn } from "@/lib/utils";

interface SubscriptionSettings {
  plan: "free" | "pro" | "max-5x" | "max-20x" | "custom";
  monthlyPrice: number;
  billingCycleStart?: number;
  notes?: string;
}

const PLAN_OPTIONS = [
  { id: "free", name: "Free", price: 0, description: "Limited usage" },
  { id: "pro", name: "Pro", price: 20, description: "$20/month" },
  { id: "max-5x", name: "Max 5x", price: 100, description: "$100/month - 5x Pro" },
  { id: "max-20x", name: "Max 20x", price: 200, description: "$200/month - 20x Pro" },
  { id: "custom", name: "Custom", price: null, description: "Set your own" },
];

interface EntityPanelSettingsProps {
  panelId: string;
  title?: string;
}

export function EntityPanelSettings({ panelId, title }: EntityPanelSettingsProps) {
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePlanChange = (plan: string) => {
    if (!settings) return;

    const preset = PLAN_OPTIONS.find((p) => p.id === plan);
    setSettings({
      ...settings,
      plan: plan as SubscriptionSettings["plan"],
      monthlyPrice: preset?.price ?? settings.monthlyPrice,
    });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const updated = await res.json();
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BasePanel panelId={panelId} entityType="settings" title={title} width={500}>
        <div className="flex items-center justify-center h-32">
          <Text>Loading settings...</Text>
        </div>
      </BasePanel>
    );
  }

  if (!settings) {
    return (
      <BasePanel panelId={panelId} entityType="settings" title={title} width={500}>
        <div className="flex items-center justify-center h-32">
          <Text className="text-red-500">Failed to load settings</Text>
        </div>
      </BasePanel>
    );
  }

  return (
    <BasePanel panelId={panelId} entityType="settings" title={title} width={500}>
      <div className="space-y-6">
        {/* Subscription Plan */}
        <Card>
          <Title>Subscription Plan</Title>
          <Text className="mb-4">Select your Claude subscription tier</Text>

          <div className="grid grid-cols-2 gap-3">
            {PLAN_OPTIONS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handlePlanChange(plan.id)}
                className={cn(
                  "p-3 rounded-lg border-2 text-left transition-all",
                  settings.plan === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{plan.name}</span>
                  {settings.plan === plan.id && (
                    <Badge color="blue" size="xs">
                      Active
                    </Badge>
                  )}
                </div>
                <Text className="text-xs">{plan.description}</Text>
              </button>
            ))}
          </div>
        </Card>

        {/* Pricing Details */}
        <Card>
          <Title>Pricing Details</Title>
          <Text className="mb-4">Configure your subscription cost</Text>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Subscription Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.monthlyPrice}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    monthlyPrice: parseFloat(e.target.value) || 0,
                  });
                  setSaved(false);
                }}
                disabled={settings.plan !== "custom"}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border bg-background",
                  settings.plan !== "custom" && "opacity-50 cursor-not-allowed"
                )}
              />
              {settings.plan !== "custom" && (
                <Text className="text-xs text-muted-foreground mt-1">
                  Select "Custom" plan to edit this value
                </Text>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Billing Cycle Start Day
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={settings.billingCycleStart || 1}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    billingCycleStart: parseInt(e.target.value) || 1,
                  });
                  setSaved(false);
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background"
              />
              <Text className="text-xs text-muted-foreground mt-1">
                Day of month when your billing cycle starts (1-31)
              </Text>
            </div>
          </div>
        </Card>

        {/* How Costs Are Calculated */}
        <Card>
          <Title>How Costs Are Calculated</Title>
          <div className="mt-4 space-y-3 text-sm">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Text className="font-semibold mb-1 text-blue-700">Projected API Cost</Text>
              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                (input × $15 + output × $75 + cache_read × $1.50 + cache_create × $18.75) /
                1M
              </code>
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Text className="font-semibold mb-1 text-emerald-700">Savings</Text>
              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                Projected API Cost - Actual Cost
              </code>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card>
          <Title>Notes</Title>
          <Text className="mb-3">Any additional notes</Text>

          <textarea
            value={settings.notes || ""}
            onChange={(e) => {
              setSettings({ ...settings, notes: e.target.value });
              setSaved(false);
            }}
            placeholder="e.g., Subscribed on Jan 1, 2026..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border bg-background resize-none"
          />
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              saving && "opacity-50 cursor-not-allowed"
            )}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {saved && (
            <span className="text-emerald-600 font-medium text-sm">Settings saved</span>
          )}
        </div>
      </div>
    </BasePanel>
  );
}
