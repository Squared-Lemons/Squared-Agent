import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCost(tokens: {
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
}): number {
  // Cost calculation based on Claude pricing (per million tokens)
  const inputCost = tokens.input * 15;
  const outputCost = tokens.output * 75;
  const cacheReadCost = tokens.cacheRead * 1.5;
  const cacheCreateCost = tokens.cacheCreate * 18.75;

  return (inputCost + outputCost + cacheReadCost + cacheCreateCost) / 1_000_000;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
}
