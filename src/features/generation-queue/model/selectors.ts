import { useShallow } from "zustand/shallow";
import { useQueueStore } from "./queueStore";
import type { GenerationTask, TaskStatus } from "@/entities/generation-task";

/** Primitive selectors — no array allocation, only re-render on value change. */
export function useFilter() {
  return useQueueStore((s) => s.filter);
}

export function useSort() {
  return useQueueStore((s) => s.sort);
}

export function useSearch() {
  return useQueueStore((s) => s.search);
}

/** Filtered + sorted task list. useShallow avoids re-renders when result is structurally equal. */
export function useFilteredTasks(): GenerationTask[] {
  return useQueueStore(
    useShallow((s) => {
      let result = s.tasks;

      if (s.filter !== "all") {
        result = result.filter((t) => t.status === s.filter);
      }

      if (s.search.trim()) {
        const q = s.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.prompt.toLowerCase().includes(q) ||
            t.model.toLowerCase().includes(q),
        );
      }

      return [...result].sort((a, b) =>
        s.sort === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
      );
    }),
  );
}

/** Counts by status — stable object via useShallow. */
export function useQueueCounts() {
  return useQueueStore(
    useShallow((s) => {
      const counts: Record<TaskStatus | "all", number> = {
        all: s.tasks.length,
        queued: 0,
        running: 0,
        done: 0,
        failed: 0,
        canceled: 0,
      };
      for (const t of s.tasks) {
        counts[t.status]++;
      }
      return counts;
    }),
  );
}

/** Primitive: number of active (running + queued) tasks. */
export function useActiveCount() {
  return useQueueStore(
    (s) => s.tasks.filter((t) => t.status === "running" || t.status === "queued").length,
  );
}

/** Active tasks array — stable via useShallow. */
export function useActiveTasks() {
  return useQueueStore(
    useShallow((s) =>
      s.tasks.filter((t) => t.status === "running" || t.status === "queued"),
    ),
  );
}

/** Primitive: average progress of running tasks (0–100). Single-pass loop, no intermediate array. */
export function useAverageProgress() {
  return useQueueStore((s) => {
    let sum = 0;
    let count = 0;
    for (const t of s.tasks) {
      if (t.status === "running") {
        sum += t.progress;
        count++;
      }
    }
    return count === 0 ? 0 : Math.round(sum / count);
  });
}
