import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import {
  useQueueStore,
  startEngine,
  stopEngine,
  useFilteredTasks,
  QueueStats,
  QueueToolbar,
  TaskRow,
  TaskCard,
  EmptyState,
} from "@/features/generation-queue";

export function GenerationQueue() {
  const clearDone = useQueueStore((s) => s.clearDone);
  const filter = useQueueStore((s) => s.filter);
  const search = useQueueStore((s) => s.search);
  const tasks = useFilteredTasks();

  useEffect(() => {
    startEngine();
    return () => stopEngine();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Очередь генераций</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Управляйте задачами генерации — отслеживайте прогресс, отменяйте и повторяйте
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground shrink-0"
          onClick={clearDone}
        >
          <Trash2 className="h-3.5 w-3.5" />
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
