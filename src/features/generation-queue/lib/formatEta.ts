export function formatEta(ms: number): string {
  if (ms <= 0) return "—";
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}с`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${minutes}м`;
  return `${minutes}м ${secs}с`;
}

export function formatCredits(credits: number): string {
  return `${credits} 🔥`;
}

export function formatPosition(pos: number | null): string {
  if (pos === null) return "—";
  return `#${pos}`;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}с`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}м`;
}
