import { cn } from "@/shared/lib/utils";
import { Moon } from "lucide-react";

export function StatusCollapsedPill({ count, progress, onExpand }: { count: number; progress: number; onExpand: () => void }) {
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
