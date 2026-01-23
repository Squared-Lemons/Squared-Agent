import { useState, useEffect } from "react";
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

export function Settings() {
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
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
      <div className="flex items-center justify-center h-64">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text className="text-red-500">Failed to load settings</Text>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your Claude subscription details</p>
      </div>

      {/* Subscription Plan */}
      <Card>
        <Title>Subscription Plan</Title>
        <Text className="mb-4">Select your Claude subscription tier</Text>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLAN_OPTIONS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handlePlanChange(plan.id)}
              className={cn(
                "p-4 rounded-lg border-2 text-left transition-all",
                settings.plan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{plan.name}</span>
                {settings.plan === plan.id && (
                  <Badge color="blue" size="xs">Active</Badge>
                )}
              </div>
              <Text className="text-sm">{plan.description}</Text>
            </button>
          ))}
        </div>
      </Card>

      {/* Pricing Details */}
      <Card>
        <Title>Pricing Details</Title>
        <Text className="mb-4">Configure your subscription cost for savings calculations</Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                setSettings({ ...settings, monthlyPrice: parseFloat(e.target.value) || 0 });
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
                setSettings({ ...settings, billingCycleStart: parseInt(e.target.value) || 1 });
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
        <div className="mt-4 space-y-4 text-sm">
          <div className="p-4 bg-blue-500/10 rounded-lg">
            <Text className="font-semibold mb-2 text-blue-700">Projected API Cost</Text>
            <Text className="mb-2">What you would pay if using the API directly:</Text>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              (input × $15 + output × $75 + cache_read × $1.50 + cache_create × $18.75) / 1,000,000
            </code>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <Text className="font-semibold mb-2">Actual Cost</Text>
            <Text>Your subscription cost + any API session charges:</Text>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
              Monthly Subscription + API Session Charges = Actual Cost
            </code>
          </div>

          <div className="p-4 bg-emerald-500/10 rounded-lg">
            <Text className="font-semibold mb-2 text-emerald-700">Savings</Text>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              Projected API Cost - Actual Cost = Savings
            </code>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-lg">
            <Text className="font-semibold mb-2 text-amber-700">API Sessions</Text>
            <Text>Sessions marked as "api" are charged separately and added to your actual cost.</Text>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <Title>Notes</Title>
        <Text className="mb-4">Any additional notes about your subscription</Text>

        <textarea
          value={settings.notes || ""}
          onChange={(e) => {
            setSettings({ ...settings, notes: e.target.value });
            setSaved(false);
          }}
          placeholder="e.g., Subscribed on Jan 1, 2026..."
          rows={3}
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
          <span className="text-emerald-600 font-medium">
            ✓ Settings saved
          </span>
        )}
      </div>
    </div>
  );
}
