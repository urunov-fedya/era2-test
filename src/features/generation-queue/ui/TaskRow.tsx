import { cn } from "@/shared/lib/utils";
import type { GenerationTask } from "@/entities/generation-task";
import { formatEta, formatCredits, formatPosition } from "../lib/formatEta";
import { TYPE_ICONS } from "../lib/constants";
import { StatusBadge } from "./StatusBadge";
import { TaskActions } from "./TaskActions";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function TaskRow({ task }: { task: GenerationTask }) {
  const Icon = TYPE_ICONS[task.type] ?? TYPE_ICONS.text;

  return (
    <div className="hidden md:block rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className={cn(
            "flex items-center justify-center size-14 rounded-md shrink-0 bg-gradient-to-br from-[#E85420] to-[#1A1614]",
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-[15px] font-medium text-foreground leading-tight line-clamp-1">
            {task.prompt}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="bg-secondary rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              <span className="size-1.5 bg-primary rounded-full" />
              <span>{task.model}</span>
            </div>
            <div className="text-xs flex items-center">
              {task.status === "queued" && task.position && (
                <span>· позиция {formatPosition(task.position)}</span>
              )}
              {(task.status === "running" || task.status === "queued") &&
                task.credits && <span>· {formatCredits(task.credits)}</span>}
              {task.status === "running" && task.eta && (
                <span>· ≈{formatEta(task.eta)}</span>
              )}
              {task.status === "failed" && task.error && (
                <span> · {task.error}</span>
              )}
            </div>
          </div>

          {task.status === "running" && (
            <ProgressBar value={task.progress} className="w-full" />
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {task.status === "running" && (
            <span className="text-xs text-accent-foreground font-mono tabular-nums w-9 text-right">
              {task.progress}%
            </span>
          )}
          <StatusBadge status={task.status} />
          <TaskActions task={task} />
        </div>
      </div>
    </div>
  );
}
