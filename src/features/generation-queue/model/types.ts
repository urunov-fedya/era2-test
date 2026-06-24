import type { TaskStatus, GenerationTask } from "@/entities/generation-task";

export type QueueFilter = "all" | TaskStatus;

export type QueueSort = "newest" | "oldest";

export interface QueueState {
  tasks: GenerationTask[];
  filter: QueueFilter;
  sort: QueueSort;
  search: string;
  isLoading: boolean;
  error: string | null;
}
