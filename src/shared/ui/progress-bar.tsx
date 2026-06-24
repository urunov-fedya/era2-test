import { cn } from "@/shared/lib/utils";
import { Progress } from "./progress";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

export function ProgressBar({ value, className, showLabel, labelClassName }: ProgressBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={value}
        className="flex-1 h-1.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-[#E85420] [&>div]:to-[#ff7a3d]"
      />
      {showLabel && (
        <span className={cn("text-xs font-mono tabular-nums text-muted-foreground w-8 text-right", labelClassName)}>
          {value}%
        </span>
      )}
    </div>
  );
}
