import { cn } from "@/shared/lib/utils";
import { useQueueCounts } from "../model/selectors";
import { Clock, Play, CheckCircle, AlertCircle } from "lucide-react";

const STATS = [
  { key: "queued" as const, label: "В очереди", icon: Clock, color: "text-neutral-400" },
  { key: "running" as const, label: "Идёт", icon: Play, color: "text-orange-400" },
  { key: "done" as const, label: "Готово", icon: CheckCircle, color: "text-green-400" },
  { key: "failed" as const, label: "Ошибка", icon: AlertCircle, color: "text-red-400" },
];

export function QueueStats() {
  const counts = useQueueCounts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border",
          )}
        >
          <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg bg-secondary", color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-semibold font-mono tabular-nums">{counts[key]}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
