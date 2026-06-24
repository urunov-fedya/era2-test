import { ChevronRight } from "lucide-react";
import type { GenerationTask, GenType } from "@/entities/generation-task";
import { TYPE_ICONS, TYPE_LABELS } from "../lib/constants";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function StatusSingleCard({ task, onNavigate, onCollapse }: { task: GenerationTask; onNavigate: () => void; onCollapse: () => void }) {
  const Icon = TYPE_ICONS[task.type as GenType] ?? TYPE_ICONS.text;
  const label = TYPE_LABELS[task.type as GenType] ?? "Генерация";

  return (
    <div
      className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      <div className="p-4">
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

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-snug">
          {task.prompt}
        </p>

        <ProgressBar value={task.progress} />
      </div>
    </div>
  );
}
