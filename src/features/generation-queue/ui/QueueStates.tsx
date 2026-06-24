import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, Inbox, RefreshCw, Search } from "lucide-react";
import type { QueueFilter } from "../model/types";

const EMPTY_MESSAGES: Record<QueueFilter, { title: string; desc: string }> = {
  all: {
    title: "Очередь пуста",
    desc: "Отправьте первую задачу на генерацию, и она появится здесь",
  },
  queued: {
    title: "Нет задач в очереди",
    desc: "Все задачи либо выполняются, либо уже завершены",
  },
  running: {
    title: "Нет активных задач",
    desc: "В данный момент ничего не генерируется",
  },
  done: {
    title: "Нет завершённых задач",
    desc: "Готовые результаты появятся здесь после завершения генерации",
  },
  failed: {
    title: "Нет задач с ошибками",
    desc: "Отличная новость — все задачи выполнились без ошибок",
  },
  canceled: {
    title: "Нет отменённых задач",
    desc: "Вы пока ничего не отменяли",
  },
};

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

export function EmptyState({ filter, hasSearch }: { filter: QueueFilter; hasSearch?: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Ничего не найдено</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Попробуйте изменить поисковый запрос или фильтр
        </p>
      </div>
    );
  }

  const { title, desc } = EMPTY_MESSAGES[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{desc}</p>
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
