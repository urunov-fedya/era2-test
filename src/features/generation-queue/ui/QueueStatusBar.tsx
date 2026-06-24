import { useNavigate } from "@/shared/routing";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/utils";
import { Loader2, ChevronRight } from "lucide-react";
import { useActiveTasks, useAverageProgress, useActiveCount } from "../model/selectors";

export function QueueStatusBar() {
  const activeTasks = useActiveTasks();
  const activeCount = useActiveCount();
  const avgProgress = useAverageProgress();
  const navigate = useNavigate();

  if (activeCount === 0) return null;

  const handleClick = () => navigate("/queue");

  const displayTasks = activeTasks.slice(0, 3);

  return (
    <>
      {/* Desktop/tablet: floating bottom-right */}
      <div
        onClick={handleClick}
        className={cn(
          "hidden md:block fixed bottom-6 right-6 z-50",
          "rounded-2xl bg-card border border-border shadow-2xl",
          "cursor-pointer hover:border-primary/30 transition-all duration-300",
          "animate-fade-in-up",
        )}
      >
        {activeCount === 1 ? (
          <SingleTaskBar task={displayTasks[0]} />
        ) : (
          <MultiTaskBar count={activeCount} progress={avgProgress} tasks={displayTasks} />
        )}
      </div>

      {/* Mobile: full-width bottom panel */}
      <div
        onClick={handleClick}
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom",
          "bg-card border-t border-border",
          "cursor-pointer active:bg-secondary/50 transition-colors",
          "animate-fade-in-up",
        )}
      >
        {activeCount === 1 ? (
          <MobileSingleBar task={displayTasks[0]} />
        ) : (
          <MobileMultiBar count={activeCount} progress={avgProgress} />
        )}
      </div>
    </>
  );
}

function SingleTaskBar({ task }: { task: { model: string; progress: number } }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-w-[260px]">
      <Loader2 className="h-4 w-4 text-orange-400 animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{task.model}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={task.progress} className="h-1 flex-1" />
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-7 text-right">
            {task.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MultiTaskBar({
  count,
  progress,
  tasks,
}: {
  count: number;
  progress: number;
  tasks: { model: string; progress: number }[];
}) {
  return (
    <div className="px-4 py-3 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 text-orange-400 animate-spin" />
          <span className="text-xs font-medium">
            Генерации идут · {count} активны · {progress}%
          </span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground truncate flex-1">{t.model}</span>
            <Progress value={t.progress} className="h-1 w-16" />
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-6 text-right">
              {t.progress}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-primary mt-2 font-medium">
        Открыть очередь →
      </p>
    </div>
  );
}

function MobileSingleBar({ task }: { task: { model: string; progress: number } }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Loader2 className="h-4 w-4 text-orange-400 animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{task.model}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={task.progress} className="h-1 flex-1" />
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
            {task.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileMultiBar({ count, progress }: { count: number; progress: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />
        <span className="text-xs font-medium">
          {count} генераций · {progress}%
        </span>
      </div>
      <span className="text-xs text-primary font-medium">Открыть →</span>
    </div>
  );
}
