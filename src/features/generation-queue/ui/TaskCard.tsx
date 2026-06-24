import type {GenerationTask} from "@/entities/generation-task";
import {formatEta, formatCredits, formatPosition} from "../lib/formatEta";
import {TYPE_ICONS} from "../lib/constants";
import {StatusBadge} from "./StatusBadge";
import {TaskActions} from "./TaskActions";
import {ProgressBar} from "@/shared/ui/progress-bar";

export function TaskCard({task}: {task: GenerationTask}) {
  const Icon = TYPE_ICONS[task.type] ?? TYPE_ICONS.text;

  return (
    <div className='md:hidden rounded-md bg-card border border-border p-4 space-y-3'>
      {/* Top: icon + prompt + meta */}
      <div className='flex gap-3'>
        <div className='flex items-center justify-center size-12 rounded-md shrink-0 bg-gradient-to-br from-[#E85420] to-[#1A1614]'>
          <Icon className='h-5 w-5 text-white' />
        </div>

        <div className='flex-1 min-w-0'>
          <p className='text-[15px] font-semibold leading-snug line-clamp-2 mb-1.5'>
            {task.prompt}
          </p>

          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <div className='bg-secondary rounded-full px-2 py-0.5 flex items-center gap-1'>
              <span className='size-1.5 bg-primary rounded-full' />
              <span className='font-mono'>{task.model}</span>
            </div>
            <div className="flex-1">
              {task.status === "queued" && task.position && (
                <span>позиция {formatPosition(task.position)}</span>
              )}
              {(task.status === "running" || task.status === "queued") &&
                task.credits && <span>{formatCredits(task.credits)}</span>}
              {task.status === "running" && task.eta && (
                <span>≈{formatEta(task.eta)}</span>
              )}
              {task.status === "failed" && task.error && (
                <span>· {task.error}</span>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {task.status === "running" && <ProgressBar value={task.progress} />}

      {/* Footer: badge + % | actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <StatusBadge status={task.status} />
          {task.status === "running" && (
            <span className='text-sm font-mono text-primary font-semibold'>
              {task.progress}%
            </span>
          )}
        </div>
        <TaskActions task={task} />
      </div>
    </div>
  );
}
