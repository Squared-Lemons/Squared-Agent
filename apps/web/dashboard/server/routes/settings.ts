import { Hono } from "hono";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

export interface SubscriptionSettings {
  plan: "free" | "pro" | "max" | "custom";
  monthlyPrice: number;
  // Token limits (per month for subscription comparison)
  estimatedMonthlyTokens?: number;
  // Usage tracking period
  billingCycleStart?: number; // Day of month (1-31)
  // Notes
  notes?: string;
}

const SETTINGS_DIR = join(homedir(), ".squared-agent");
const SETTINGS_FILE = join(SETTINGS_DIR, "dashboard-settings.json");

const DEFAULT_SETTINGS: SubscriptionSettings = {
  plan: "pro",
  monthlyPrice: 20,
  billingCycleStart: 1,
};

// Plan presets
const PLAN_PRESETS: Record<string, Partial<SubscriptionSettings>> = {
  free: { monthlyPrice: 0 },
  pro: { monthlyPrice: 20 },
  max: { monthlyPrice: 100 },
};

async function loadSettings(): Promise<SubscriptionSettings> {
  try {
    const content = await readFile(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: SubscriptionSettings): Promise<void> {
  await mkdir(SETTINGS_DIR, { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export const settingsRouter = new Hono();

// Get current settings
settingsRouter.get("/", async (c) => {
  const settings = await loadSettings();
  return c.json(settings);
});

// Update settings
settingsRouter.put("/", async (c) => {
  const body = await c.req.json();
  const currentSettings = await loadSettings();

  // Apply plan preset if plan changed
  let newSettings = { ...currentSettings, ...body };
  if (body.plan && body.plan !== currentSettings.plan && PLAN_PRESETS[body.plan]) {
    newSettings = { ...newSettings, ...PLAN_PRESETS[body.plan] };
  }

  await saveSettings(newSettings);
  return c.json(newSettings);
});

// Get plan presets
settingsRouter.get("/presets", (c) => {
  return c.json({
    free: { name: "Free", monthlyPrice: 0, description: "Limited usage" },
    pro: { name: "Pro", monthlyPrice: 20, description: "$20/month" },
    max: { name: "Max", monthlyPrice: 100, description: "$100/month - 5x Pro usage" },
    custom: { name: "Custom", monthlyPrice: null, description: "Set your own values" },
  });
});
