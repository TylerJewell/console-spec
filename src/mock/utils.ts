export function uuid(): string {
  return crypto.randomUUID();
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomFloat(min, max + 1));
}

export function randomItem<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
}
