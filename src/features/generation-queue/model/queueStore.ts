import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationTask } from "@/entities/generation-task";
import type { QueueFilter, QueueSort } from "./types";

interface QueueState {
  tasks: GenerationTask[];
  filter: QueueFilter;
  sort: QueueSort;
  search: string;
  isLoading: boolean;
  error: string | null;
}

interface QueueActions {
  init: (tasks: GenerationTask[]) => void;
  updateTask: (id: string, patch: Partial<GenerationTask>) => void;
  cancelTask: (id: string) => void;
  retryTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearDone: () => void;
  setFilter: (filter: QueueFilter) => void;
  setSort: (sort: QueueSort) => void;
  setSearch: (search: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type QueueStore = QueueState & QueueActions;

export const useQueueStore = create<QueueStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: "all" as QueueFilter,
      sort: "newest" as QueueSort,
      search: "",
      isLoading: false,
      error: null,

      init: (tasks) => {
        const existing = get().tasks;
        if (existing.length > 0) return;
        const restored = tasks.map((t) =>
          t.status === "running" ? { ...t, status: "queued" as const, progress: 0 } : t,
        );
        set({ tasks: restored, isLoading: false, error: null });
      },

      updateTask: (id, patch) => {
        set((s) => {
          const tasks = s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
          return { tasks };
        });
      },

      cancelTask: (id) => {
        set((s) => {
          const tasks = s.tasks.map((t) =>
            t.id === id ? { ...t, status: "canceled" as const, progress: 0 } : t,
          );
          return { tasks };
        });
      },

      retryTask: (id) => {
        set((s) => {
          const tasks = s.tasks.map((t) =>
            t.id === id
              ? { ...t, status: "queued" as const, progress: 0, error: null, position: null }
              : t,
          );
          return { tasks };
        });
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      clearDone: () => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.status !== "done") }));
      },

      setFilter: (filter) => set({ filter }),
      setSort: (sort) => set({ sort }),
      setSearch: (search) => set({ search }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "era2-queue-state",
      partialize: (state) => ({
        tasks: state.tasks,
        filter: state.filter,
        sort: state.sort,
        search: state.search,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<QueueState>;
        const tasks = (p.tasks ?? []).map((t) =>
          t.status === "running" ? { ...t, status: "queued" as const, progress: 0 } : t,
        );
        return {
          ...current,
          tasks,
          filter: p.filter ?? current.filter,
          sort: p.sort ?? current.sort,
          search: p.search ?? current.search,
        };
      },
    },
  ),
);
