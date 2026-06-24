import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-card border border-border">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ hasFilter }: { hasFilter?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilter ? "Ничего не найдено" : "Очередь пуста"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {hasFilter
          ? "Попробуйте изменить фильтр или поисковый запрос"
          : "Отправьте первую задачу на генерацию, и она появится здесь"}
      </p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Ошибка загрузки</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Не удалось загрузить очередь генераций. Проверьте подключение и попробуйте снова.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" />
        Повторить
      </Button>
    </div>
  );
}
