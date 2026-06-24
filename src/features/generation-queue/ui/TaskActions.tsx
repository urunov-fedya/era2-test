import { Button } from "@/shared/ui/button";
import { X, RotateCcw, Download, MoreHorizontal, Trash2 } from "lucide-react";
import type { GenerationTask } from "@/entities/generation-task";
import { useQueueStore } from "../model/queueStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="iconSm"
            className="rounded-[8px] text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
