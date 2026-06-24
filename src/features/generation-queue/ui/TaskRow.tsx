import {Button} from "@/shared/ui/button";
import {cn} from "@/shared/lib/utils";
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
import type {GenerationTask, TaskStatus} from "@/entities/generation-task";
import {useQueueStore} from "../model/queueStore";
import {formatEta, formatCredits, formatPosition} from "../lib/formatEta";

const TYPE_ICONS = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Music,
} as const;

const TYPE_ICON_BG: Record<string, string> = {
  text: "bg-gradient-to-br from-[#E85420] to-[#ff7a3d]",
  image: "bg-gradient-to-br from-[#E85420] to-[#ff7a3d]",
  video: "bg-gradient-to-br from-[#D6451A] to-[#E85420]",
  audio: "bg-gradient-to-br from-[#E87A3D] to-[#ffb27a]",
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  queued: "bg-secondary text-muted-foreground",
  running: "bg-orange-500/15 text-orange-400",
  done: "bg-green-500/15 text-green-400",
  failed: "bg-red-500/15 text-red-400",
  canceled: "bg-secondary text-muted-foreground",
};

interface TaskRowProps {
  task: GenerationTask;
}

function StatusBadge({status}: {status: TaskStatus}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1.5 rounded-[8px] text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status === "queued" && "В очереди"}
      {status === "running" && "Идёт"}
      {status === "done" && "Готово"}
      {status === "failed" && "Ошибка"}
      {status === "canceled" && "Отменено"}
    </span>
  );
}

function TaskActions({task}: {task: GenerationTask}) {
  const {cancelTask, retryTask, deleteTask} = useQueueStore();

  return (
    <div className='flex items-center gap-1.5 shrink-0'>
      {task.status === "done" && (
        <Button
          variant='ghost'
          size='iconSm'
          className='rounded-[8px] text-accent-foreground hover:text-foreground'
        >
          <Download className='h-4 w-4' />
        </Button>
      )}
      {(task.status === "failed" || task.status === "canceled") && (
        <Button
          variant='ghost'
          size='iconSm'
          className='rounded-[8px] text-accent-foreground hover:text-foreground'
          onClick={() => retryTask(task.id)}
        >
          <RotateCcw className='h-4 w-4' />
        </Button>
      )}
      {(task.status === "running" || task.status === "queued") && (
        <Button
          variant='ghost'
          size='iconSm'
          className='rounded-[8px]  text-muted-foreground hover:text-foreground'
          onClick={() => cancelTask(task.id)}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
      <Button
        variant='ghost'
        size='iconSm'
        className='rounded-[8px]  text-muted-foreground hover:text-foreground'
        onClick={() => deleteTask(task.id)}
      >
        <MoreHorizontal className='h-4 w-4' />
      </Button>
    </div>
  );
}

export function TaskRow({task}: TaskRowProps) {
  const Icon = TYPE_ICONS[task.type] ?? FileText;
  const iconBg = TYPE_ICON_BG[task.type] ?? "bg-[#E85420]";

  return (
    <div className='hidden md:block rounded-2xl bg-card border border-border hover:border-primary/30 transition-all'>
      <div className='flex items-center gap-4 px-5 py-4'>
        {/* Иконка типа */}
        <div
          className={cn(
            "flex items-center justify-center size-14 rounded-md shrink-0 bg-gradient-to-br from-[#E85420] to-[#1A1614]"
          )}
        >
          <Icon className='h-5 w-5 text-white' />
        </div>

        {/* Контент */}
        <div className='flex-1 min-w-0 flex flex-col gap-1'>
          <p className='text-[15px] font-medium text-foreground leading-tight line-clamp-1'>
            {task.prompt}
          </p>

          <div className='flex items-center gap-2 text-xs text-muted-foreground mb-2'>
            <div className='bg-secondary rounded-full px-2 py-0.5 text-xs flex items-center gap-1'>
              <span className='size-1.5 bg-primary rounded-full' />
              <span>{task.model}</span>
            </div>
            <div className='text-xs flex items-center'>
              {task.status === "queued" && task.position && (
                <span>· позиция {formatPosition(task.position)}</span>
              )}
              {(task.status === "running" || task.status === "queued") &&
                task.credits && <span>· {formatCredits(task.credits)}</span>}
              {task.status === "running" && task.eta && (
                <span>· ≈{formatEta(task.eta)}</span>
              )}
            </div>
          </div>
          {/* Прогресс */}
          {task.status === "running" && (
            <div className='flex items-center gap-2 w-full flex-1'>
              <div className='w-full h-1.5 bg-secondary rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-[#E85420] to-[#ff7a3d] transition-all duration-300'
                  style={{width: `${task.progress}%`}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Правая часть */}
        <div className='flex items-center gap-4 shrink-0'>
          {task.status === "running" && (
            <span className='text-xs text-accent-foreground font-mono tabular-nums w-9 text-right'>
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

// TaskCard (мобильная версия) — тоже можно улучшить, но сначала давай TaskRow
export function TaskCard({task}: TaskRowProps) {
  const Icon = TYPE_ICONS[task.type] ?? FileText;
  const iconBg = TYPE_ICON_BG[task.type] ?? "bg-[#E85420]";

  return (
    <div className='md:hidden rounded-2xl bg-card border border-border p-4'>
      <div className='flex gap-3'>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
            iconBg
          )}
        >
          <Icon className='h-5 w-5 text-white' />
        </div>

        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium leading-snug line-clamp-2 mb-1.5'>
            {task.prompt}
          </p>

          <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-3'>
            <span className='text-orange-400 font-medium'>{task.model}</span>
          </div>

          <div className='flex items-center justify-between'>
            <StatusBadge status={task.status} />
            <TaskActions task={task} />
          </div>
        </div>
      </div>

      {task.status === "running" && (
        <div className='mt-3 flex items-center gap-2'>
          <div className='flex-1 h-1.5 bg-secondary rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-[#E85420] to-[#ff7a3d]'
              style={{width: `${task.progress}%`}}
            />
          </div>
          <span className='text-xs font-mono text-muted-foreground w-8 text-right'>
            {task.progress}%
          </span>
        </div>
      )}
    </div>
  );
}
