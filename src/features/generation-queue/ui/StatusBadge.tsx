import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/entities/generation-task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  queued: "bg-secondary text-muted-foreground",
  running: "bg-orange-500/15 text-orange-400",
  done: "bg-green-500/15 text-green-400",
  failed: "bg-red-500/15 text-red-400",
  canceled: "bg-secondary text-muted-foreground",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: "В очереди",
  running: "Идёт",
  done: "Готово",
  failed: "Ошибка",
  canceled: "Отменено",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1.5 rounded-[8px] text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
