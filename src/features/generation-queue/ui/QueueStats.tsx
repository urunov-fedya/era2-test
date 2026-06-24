import { useQueueCounts } from "../model/selectors";

const STATS = [
  { key: "queued" as const, label: "В очереди", dotColor: "bg-neutral-400" },
  { key: "running" as const, label: "Идёт", dotColor: "bg-orange-500" },
  { key: "done" as const, label: "Готово", dotColor: "bg-green-500" },
  { key: "failed" as const, label: "Ошибка", dotColor: "bg-red-500" },
];

export function QueueStats() {
  const counts = useQueueCounts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map(({ key, label, dotColor }) => (
        <div
          key={key}
          className="flex flex-col gap-3 px-4 py-4 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className="text-3xl font-semibold font-mono tabular-nums leading-none">{counts[key]}</p>
        </div>
      ))}
    </div>
  );
}
