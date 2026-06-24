import { useQueueStore } from "./queueStore";
import type { GenerationTask, TaskStatus } from "@/entities/generation-task";
import type { QueueFilter, QueueSort } from "./types";

export function useFilteredTasks(): GenerationTask[] {
  const { tasks, filter, sort, search } = useQueueStore();

  let result = tasks;

  if (filter !== "all") {
    result = result.filter((t) => t.status === filter);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.prompt.toLowerCase().includes(q) ||
        t.model.toLowerCase().includes(q),
    );
  }

  result = [...result].sort((a, b) => {
    if (sort === "newest") return b.createdAt - a.createdAt;
    return a.createdAt - b.createdAt;
  });

  return result;
}

export function useQueueCounts() {
  const tasks = useQueueStore((s) => s.tasks);

  const counts: Record<TaskStatus | "all", number> = {
    all: tasks.length,
    queued: 0,
    running: 0,
    done: 0,
    failed: 0,
    canceled: 0,
  };

  for (const t of tasks) {
    counts[t.status]++;
  }

  return counts;
}

export function useActiveTasks() {
  return useQueueStore((s) =>
    s.tasks.filter((t) => t.status === "running" || t.status === "queued"),
  );
}

export function useActiveCount() {
  return useQueueStore((s) =>
    s.tasks.filter((t) => t.status === "running" || t.status === "queued").length,
  );
}

export function useAverageProgress() {
  return useQueueStore((s) => {
    const running = s.tasks.filter((t) => t.status === "running");
    if (running.length === 0) return 0;
    const sum = running.reduce((acc, t) => acc + t.progress, 0);
    return Math.round(sum / running.length);
  });
}
