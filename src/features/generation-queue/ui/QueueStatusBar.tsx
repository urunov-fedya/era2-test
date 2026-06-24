import { useState } from "react";
import { useNavigate } from "@/shared/routing";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Loader2, ChevronRight, ChevronUp, Minimize2 } from "lucide-react";
import { useActiveTasks, useAverageProgress, useActiveCount } from "../model/selectors";

export function QueueStatusBar() {
  const activeTasks = useActiveTasks();
  const activeCount = useActiveCount();
  const avgProgress = useAverageProgress();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (activeCount === 0) return null;

  const handleNavigate = () => navigate("/queue");
  const toggleCollapsed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((c) => !c);
  };

  const displayTasks = activeTasks.slice(0, 3);

  return (
    <>
      {/* Desktop/tablet: floating bottom-right */}
      <div
        className={cn(
          "hidden md:block fixed bottom-6 right-6 z-50",
          "rounded-2xl bg-card border border-border shadow-2xl",
          "transition-all duration-300",
          collapsed ? "cursor-pointer" : "cursor-default",
        )}
        onClick={collapsed ? () => setCollapsed(false) : undefined}
      >
        {collapsed ? (
          <CollapsedPill count={activeCount} progress={avgProgress} onExpand={toggleCollapsed} />
        ) : activeCount === 1 ? (
          <SingleTaskBar task={displayTasks[0]} onCollapse={toggleCollapsed} onNavigate={handleNavigate} />
        ) : (
          <MultiTaskBar count={activeCount} progress={avgProgress} tasks={displayTasks} onCollapse={toggleCollapsed} onNavigate={handleNavigate} />
        )}
      </div>

      {/* Mobile: full-width bottom panel */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom",
          "bg-card border-t border-border transition-colors",
          collapsed ? "cursor-pointer active:bg-secondary/50" : "cursor-default",
        )}
        onClick={collapsed ? () => setCollapsed(false) : undefined}
      >
        {collapsed ? (
          <MobileCollapsedPill count={activeCount} progress={avgProgress} onExpand={toggleCollapsed} />
        ) : activeCount === 1 ? (
          <MobileSingleBar task={displayTasks[0]} onCollapse={toggleCollapsed} onNavigate={handleNavigate} />
        ) : (
          <MobileMultiBar count={activeCount} progress={avgProgress} onCollapse={toggleCollapsed} onNavigate={handleNavigate} />
        )}
      </div>
    </>
  );
}

/* ── Collapsed pill (desktop) ── */
function CollapsedPill({ count, progress, onExpand }: { count: number; progress: number; onExpand: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Loader2 className="h-3.5 w-3.5 text-orange-400 animate-spin shrink-0" />
      <span className="text-xs font-medium tabular-nums">{count} · {progress}%</span>
      <Button variant="ghost" size="icon" onClick={onExpand} className="ml-1 h-6 w-6" aria-label="Развернуть">
        <ChevronUp className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── Collapsed pill (mobile) ── */
function MobileCollapsedPill({ count, progress, onExpand }: { count: number; progress: number; onExpand: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <Loader2 className="h-3.5 w-3.5 text-orange-400 animate-spin" />
        <span className="text-xs font-medium tabular-nums">{count} · {progress}%</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onExpand} className="h-7 w-7" aria-label="Развернуть">
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/* ── Expanded: single task (desktop) ── */
function SingleTaskBar({ task, onCollapse, onNavigate }: { task: { model: string; progress: number }; onCollapse: (e: React.MouseEvent) => void; onNavigate: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-w-[260px]">
      <Loader2 className="h-4 w-4 text-orange-400 animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{task.model}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={task.progress} className="h-1 flex-1" />
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-7 text-right">{task.progress}%</span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" onClick={onCollapse} className="h-6 w-6" aria-label="Свернуть">
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNavigate} className="h-6 w-6" aria-label="Открыть очередь">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ── Expanded: multiple tasks (desktop) ── */
function MultiTaskBar({ count, progress, tasks, onCollapse, onNavigate }: { count: number; progress: number; tasks: { model: string; progress: number }[]; onCollapse: (e: React.MouseEvent) => void; onNavigate: () => void }) {
  return (
    <div className="px-4 py-3 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 text-orange-400 animate-spin" />
          <span className="text-xs font-medium">Генерации идут · {count} активны · {progress}%</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={onCollapse} className="h-6 w-6" aria-label="Свернуть">
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNavigate} className="h-6 w-6" aria-label="Открыть очередь">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground truncate flex-1">{t.model}</span>
            <Progress value={t.progress} className="h-1 w-16" />
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-6 text-right">{t.progress}%</span>
          </div>
        ))}
      </div>
      <Button variant="link" size="sm" onClick={onNavigate} className="text-[11px] mt-1 h-auto p-0">Открыть очередь →</Button>
    </div>
  );
}

/* ── Expanded: single task (mobile) ── */
function MobileSingleBar({ task, onCollapse, onNavigate }: { task: { model: string; progress: number }; onCollapse: (e: React.MouseEvent) => void; onNavigate: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Loader2 className="h-4 w-4 text-orange-400 animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{task.model}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={task.progress} className="h-1 flex-1" />
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{task.progress}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" onClick={onCollapse} className="h-7 w-7" aria-label="Свернуть">
          <Minimize2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNavigate} className="h-7 w-7" aria-label="Открыть очередь">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ── Expanded: multiple tasks (mobile) ── */
function MobileMultiBar({ count, progress, onCollapse, onNavigate }: { count: number; progress: number; onCollapse: (e: React.MouseEvent) => void; onNavigate: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />
        <span className="text-xs font-medium">{count} генераций · {progress}%</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onCollapse} className="h-7 w-7" aria-label="Свернуть">
          <Minimize2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNavigate} className="h-7 w-7" aria-label="Открыть очередь">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
