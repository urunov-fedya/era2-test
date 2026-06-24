import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  X,
  RotateCcw,
  Download,
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music,
} from "lucide-react";
import type { GenerationTask, TaskStatus } from "@/entities/generation-task";
import { useQueueStore } from "../model/queueStore";
import { formatEta, formatCredits, formatPosition } from "../lib/formatEta";

const STATUS_COLORS: Record<TaskStatus, string> = {
  queued: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  running: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  done: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  canceled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: "В очереди",
  running: "Идёт",
  done: "Готово",
  failed: "Ошибка",
  canceled: "Отменено",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Music,
};

interface TaskItemProps {
  task: GenerationTask;
}

export function TaskItem({ task }: TaskItemProps) {
  const { cancelTask, retryTask, deleteTask } = useQueueStore();
  const Icon = TYPE_ICONS[task.type] ?? FileText;

  const statusBadge = (
    <Badge
      className={cn(
        "rounded-full text-[11px] px-2 py-0.5 font-medium border",
        STATUS_COLORS[task.status],
      )}
    >
      {STATUS_LABELS[task.status]}
    </Badge>
  );

  const progressBar =
    task.status === "running" ? (
      <div className="flex items-center gap-2 min-w-[100px]">
        <Progress value={task.progress} className="h-1.5 w-full" />
        <span className="text-xs font-mono text-muted-foreground tabular-nums w-8 text-right">
          {task.progress}%
        </span>
      </div>
    ) : null;

  const actions = (
    <div className="flex items-center gap-1">
      {(task.status === "running" || task.status === "queued") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => cancelTask(task.id)}
        >
          <X className="h-3 w-3" />
          Отмена
        </Button>
      )}
      {(task.status === "failed" || task.status === "canceled") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => retryTask(task.id)}
        >
          <RotateCcw className="h-3 w-3" />
          Повтор
        </Button>
      )}
      {task.status === "done" && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Download className="h-3 w-3" />
          Скачать
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => deleteTask(task.id)}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  const meta = (
    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
      <span className="text-foreground/80">{task.model}</span>
      {task.status === "queued" && task.position !== null && (
        <span>Позиция: {formatPosition(task.position)}</span>
      )}
      {task.status === "running" && <span>~{formatEta(task.eta)}</span>}
      {task.status === "done" && task.completedAt && (
        <span>{formatCredits(task.credits)}</span>
      )}
      {task.status === "failed" && task.error && (
        <span className="text-red-400 font-sans">{task.error}</span>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop/tablet row */}
      <div className="hidden md:flex items-center gap-4 px-4 py-3 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-sm truncate">{task.prompt}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {meta}
            {progressBar}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {statusBadge}
          {actions}
        </div>
      </div>

      {/* Mobile card */}
      <div className="md:hidden rounded-xl bg-card border border-border p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary shrink-0 mt-0.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm line-clamp-2">{task.prompt}</p>
          </div>
          {statusBadge}
        </div>
        <div className="flex flex-col gap-2">
          {meta}
          {progressBar}
        </div>
        <div className="flex justify-end">{actions}</div>
      </div>
    </>
  );
}
