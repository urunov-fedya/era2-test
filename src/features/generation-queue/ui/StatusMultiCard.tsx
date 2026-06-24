import { cn } from "@/shared/lib/utils";
import { Moon, ChevronRight, ChevronDown } from "lucide-react";
import type { GenerationTask, GenType } from "@/entities/generation-task";
import { TYPE_ICONS } from "../lib/constants";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function StatusMultiCard({ activeCount, progress, tasks, onNavigate, onCollapse }: { activeCount: number; progress: number; tasks: GenerationTask[]; onNavigate: () => void; onCollapse: () => void }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
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

      <div className="px-4 space-y-2 pb-3">
        {tasks.map((task) => {
          const Icon = TYPE_ICONS[task.type as GenType] ?? TYPE_ICONS.text;
          const isQueued = task.status === "queued";
          return (
            <div key={task.id} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#E85420] to-[#1A1614] shrink-0">
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate mb-1">{task.prompt}</p>
                {!isQueued && <ProgressBar value={task.progress} />}
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
