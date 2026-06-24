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

const STATUS_LABEL_CLASSES: Record<TaskStatus, string> = {
  queued: "text-muted-foreground",
  running: "text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full text-xs font-medium",
  done: "text-green-400 bg-green-500/15 px-2 py-0.5 rounded-full text-xs font-medium",
  failed: "text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full text-xs font-medium",
  canceled: "text-muted-foreground",
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

const TYPE_ICON_BG: Record<string, string> = {
  text: "bg-orange-600",
  image: "bg-orange-600",
  video: "bg-orange-700",
  audio: "bg-orange-500",
};

interface TaskRowProps {
  task: GenerationTask;
}

function StatusLabel({ status }: { status: TaskStatus }) {
  return (
    <span className={cn("text-xs", STATUS_LABEL_CLASSES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function TaskActions({ task }: { task: GenerationTask }) {
  const { cancelTask, retryTask, deleteTask } = useQueueStore();

  return (
    <div className="flex items-center gap-1 shrink-0">
      {task.status === "done" && (
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
          <Download className="h-3.5 w-3.5" />
        </Button>
      )}
      {(task.status === "failed" || task.status === "canceled") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => retryTask(task.id)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
      {(task.status === "running" || task.status === "queued") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => cancelTask(task.id)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={() => deleteTask(task.id)}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function TaskMeta({ task }: { task: GenerationTask }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
      <span className="text-orange-400 font-medium">{task.model}</span>
      {task.status === "queued" && task.position !== null && (
        <span>позиция {formatPosition(task.position)} в очереди</span>
      )}
      {task.status === "queued" && task.credits && (
        <span>· {formatCredits(task.credits)}</span>
      )}
      {task.status === "running" && (
        <>
          <span>· ~{formatEta(task.eta)}</span>
          {task.credits && <span>· {formatCredits(task.credits)}</span>}
        </>
      )}
      {task.status === "done" && task.completedAt && task.credits && (
        <span>· готово за {formatEta(task.eta)} · {formatCredits(task.credits)}</span>
      )}
      {task.status === "failed" && task.error && (
        <span className="text-red-400">{task.error}</span>
      )}
      {task.status === "canceled" && (
        <span>· отменено пользователем</span>
      )}
    </div>
  );
}

export function TaskRow({ task }: TaskRowProps) {
  const Icon = TYPE_ICONS[task.type] ?? FileText;
  const iconBg = TYPE_ICON_BG[task.type] ?? "bg-orange-600";

  return (
    <div className="hidden md:block rounded-[16px] bg-card border border-border hover:bg-card/80 transition-colors overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-[16.5px]">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", iconBg)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-sm truncate">{task.prompt}</p>
          <TaskMeta task={task} />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {task.status === "running" && (
            <span className="text-sm font-medium font-mono tabular-nums text-muted-foreground">
              {task.progress}%
            </span>
          )}
          <StatusLabel status={task.status} />
          <TaskActions task={task} />
        </div>
      </div>
      {task.status === "running" && (
        <Progress value={task.progress} className="h-0.5 rounded-none" />
      )}
    </div>
  );
}

export function TaskCard({ task }: TaskRowProps) {
  const Icon = TYPE_ICONS[task.type] ?? FileText;
  const iconBg = TYPE_ICON_BG[task.type] ?? "bg-orange-600";

  return (
    <div className="md:hidden rounded-xl bg-card border border-border overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5", iconBg)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className="text-sm line-clamp-2">{task.prompt}</p>
          <TaskMeta task={task} />
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusLabel status={task.status} />
          <TaskActions task={task} />
        </div>
      </div>
      {task.status === "running" && (
        <Progress value={task.progress} className="h-0.5 rounded-none" />
      )}
    </div>
  );
}
