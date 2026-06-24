export type GenType = "text" | "image" | "video" | "audio";

export type TaskStatus = "queued" | "running" | "done" | "failed" | "canceled";

export interface GenerationTask {
  id: string;
  prompt: string;
  model: string;
  type: GenType;
  status: TaskStatus;
  progress: number;
  error: string | null;
  credits: number;
  eta: number;
  position: number | null;
  createdAt: number;
  completedAt: number | null;
}
