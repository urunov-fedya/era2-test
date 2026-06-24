import { useState } from "react";
import { useNavigate } from "@/shared/routing";
import { cn } from "@/shared/lib/utils";
import { Moon, ChevronRight, ChevronDown, FileText, Image, Video, Music } from "lucide-react";
import type { GenerationTask, GenType } from "@/entities/generation-task";
import { useTasksByStatus, useActiveTasks, useAverageProgress, useActiveCount } from "../model/selectors";


const TYPE_LABELS: Record<GenType, string> = {
  text: "Генерация текста",
  image: "Генерация изображения",
  video: "Генерация видео",
  audio: "Генерация аудио",
};

const TYPE_ICONS: Record<GenType, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Music,
};

export function QueueStatusBar() {
  const runningTasks = useTasksByStatus("running");
  const allActiveTasks = useActiveTasks();
  const activeCount = useActiveCount();
  const avgProgress = useAverageProgress();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (activeCount === 0) return null;

  const handleNavigate = () => navigate("/queue");
  const toggleCollapsed = () => setCollapsed((c) => !c);

  const displayTasks = allActiveTasks.slice(0, 3);

  return (
    <>
      {/* Desktop/tablet */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50 w-[320px]">
        {collapsed ? (
          <CollapsedPill
            count={activeCount}
            progress={avgProgress}
            onExpand={toggleCollapsed}
          />
        ) : activeCount === 1 && runningTasks.length === 1 ? (
          <SingleTaskCard
            task={runningTasks[0]}
            onNavigate={handleNavigate}
            onCollapse={toggleCollapsed}
          />
        ) : (
          <MultiTaskCard
            activeCount={activeCount}
            progress={avgProgress}
            tasks={displayTasks}
            onNavigate={handleNavigate}
            onCollapse={toggleCollapsed}
          />
        )}
      </div>

      {/* Mobile: full-width bottom bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 safe-bottom">
        <MobileBar
          activeCount={activeCount}
          progress={avgProgress}
          onNavigate={toggleCollapsed}
        />
      </div>
    </>
  );
}

/* ── Collapsed pill ── */
function CollapsedPill({ count, progress, onExpand }: { count: number; progress: number; onExpand: () => void }) {
  return (
    <button
      onClick={onExpand}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
        "bg-card border border-primary/60 shadow-lg",
        "hover:border-primary transition-colors",
      )}
    >
      <Moon className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm font-medium">
        {count} {count === 1 ? "генерация" : count < 5 ? "генерации" : "генераций"}
      </span>
      <span className="text-sm text-primary font-semibold font-mono">· {progress}%</span>
    </button>
  );
}

/* ── Single task expanded card ── */
function SingleTaskCard({ task, onNavigate, onCollapse }: { task: GenerationTask; onNavigate: () => void; onCollapse: () => void }) {
  const Icon = TYPE_ICONS[task.type as GenType] ?? FileText;
  const label = TYPE_LABELS[task.type as GenType] ?? "Генерация";

  return (
    <div
      className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#E85420] to-[#1A1614] shrink-0">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{label}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {task.model} · {task.progress}%
              </p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onCollapse(); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Prompt preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-snug">
          {task.prompt}
        </p>

        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E85420] to-[#ff7a3d] transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Mobile bottom bar ── */
function MobileBar({ activeCount, progress, onNavigate }: { activeCount: number; progress: number; onNavigate: () => void }) {
  return (
    <button
      onClick={onNavigate}
      className="w-full rounded-md bg-card border border-primary/50 shadow-lg overflow-hidden text-left"
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Moon className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Генерации идут</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {activeCount} активны · {progress}%
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
      </div>
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-[#E85420] to-[#ff7a3d] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}

/* ── Multiple tasks expanded card ── */
function MultiTaskCard({ activeCount, progress, tasks, onNavigate, onCollapse }: { activeCount: number; progress: number; tasks: GenerationTask[]; onNavigate: () => void; onCollapse: () => void }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#E85420] to-[#1A1614] shrink-0">
            <Moon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Генерации идут</p>
            <p className="text-xs text-muted-foreground font-mono">
              {activeCount} активны · {progress}%
            </p>
          </div>
        </div>
        <button
          onClick={onCollapse}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Task rows */}
      <div className="px-4 space-y-2 pb-3">
        {tasks.map((task) => {
          const Icon = TYPE_ICONS[task.type as GenType] ?? FileText;
          const isQueued = task.status === "queued";
          return (
            <div key={task.id} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#E85420] to-[#1A1614] shrink-0">
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate mb-1">{task.prompt}</p>
                {!isQueued && (
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E85420] to-[#ff7a3d] transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <span className={cn(
                "text-xs font-mono tabular-nums shrink-0 w-14 text-right",
                isQueued ? "text-muted-foreground" : "text-primary font-semibold",
              )}>
                {isQueued ? "в очереди" : `${task.progress}%`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button
        onClick={onNavigate}
        className="w-full flex items-center justify-center gap-1.5 py-3 border-t border-border text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
      >
        Открыть очередь
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
