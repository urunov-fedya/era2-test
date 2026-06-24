import { Moon, ChevronRight } from "lucide-react";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function StatusMobileBar({ activeCount, progress, onNavigate }: { activeCount: number; progress: number; onNavigate: () => void }) {
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
      <ProgressBar value={progress} className="px-0" />
    </button>
  );
}
