import { Button } from "@/shared/ui/button";
import { X, RotateCcw, Download, MoreHorizontal } from "lucide-react";
import type { GenerationTask } from "@/entities/generation-task";
import { useQueueStore } from "../model/queueStore";

export function TaskActions({ task }: { task: GenerationTask }) {
  const { cancelTask, retryTask, deleteTask } = useQueueStore();

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {task.status === "done" && (
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-[8px] text-accent-foreground hover:text-foreground"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
      {(task.status === "failed" || task.status === "canceled") && (
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-[8px] text-accent-foreground hover:text-foreground"
          onClick={() => retryTask(task.id)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
      {(task.status === "running" || task.status === "queued") && (
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-[8px] text-muted-foreground hover:text-foreground"
          onClick={() => cancelTask(task.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="iconSm"
        className="rounded-[8px] text-muted-foreground hover:text-foreground"
        onClick={() => deleteTask(task.id)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
