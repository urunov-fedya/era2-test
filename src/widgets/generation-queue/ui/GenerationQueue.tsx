import { useEffect, useState, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import {
  useQueueStore,
  startEngine,
  stopEngine,
  useFilteredTasks,
  useFilter,
  useSearch,
  QueueStats,
  QueueToolbar,
  TaskRow,
  TaskCard,
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/features/generation-queue";

type PageState = "loading" | "ready" | "error";

const LOAD_DELAY_MS = 600;
const ERROR_CHANCE = 0.1;

export function GenerationQueue() {
  const clearDone = useQueueStore((s) => s.clearDone);
  const filter = useFilter();
  const search = useSearch();
  const tasks = useFilteredTasks();
  const [pageState, setPageState] = useState<PageState>("loading");

  const init = useCallback(() => {
    setPageState("loading");
    const timeout = setTimeout(() => {
      if (Math.random() < ERROR_CHANCE) {
        setPageState("error");
      } else {
        setPageState("ready");
      }
    }, LOAD_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => init(), [init]);

  useEffect(() => {
    startEngine();
    return () => stopEngine();
  }, []);

  if (pageState === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Очередь генераций</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Все ваши задачи в реальном времени
          </p>
        </div>
        <LoadingState />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Очередь генераций</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Все ваши задачи в реальном времени
          </p>
        </div>
        <ErrorState onRetry={init} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Очередь генераций</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Все ваши задачи в реальном времени
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={clearDone}
        >
          Очистить готовые
        </Button>
      </div>

      <QueueStats />

      <QueueToolbar />

      {tasks.length === 0 ? (
        <EmptyState filter={filter} hasSearch={search.trim().length > 0} />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskRow task={task} />
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
