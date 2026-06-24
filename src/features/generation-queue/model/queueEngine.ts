import type { GenerationTask } from "@/entities/generation-task";
import { useQueueStore } from "./queueStore";

const MAX_CONCURRENT = 2;
const TICK_MIN = 400;
const TICK_MAX = 700;
const FAILURE_RATE = 0.15;

const ERROR_MESSAGES = [
  "Недостаточно кредитов",
  "Превышено время ожидания",
  "Модель временно недоступна",
];

const SPEED_MAP: Record<string, { min: number; max: number }> = {
  text: { min: 8, max: 16 },
  image: { min: 6, max: 14 },
  video: { min: 2, max: 5 },
  audio: { min: 3, max: 7 },
};

let intervals: ReturnType<typeof setInterval>[] = [];
let unsubStore: (() => void) | null = null;

function getSpeed(type: string) {
  return SPEED_MAP[type] ?? SPEED_MAP.text;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tickTask(taskId: string) {
  const store = useQueueStore.getState();
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task || task.status !== "running") return;

  const speed = getSpeed(task.type);
  const step = randomBetween(speed.min, speed.max);
  const newProgress = Math.min(task.progress + step, 100);

  if (newProgress >= 100) {
    store.updateTask(taskId, {
      progress: 100,
      status: "done",
      completedAt: Date.now(),
    });
    scheduleNext();
    return;
  }

  if (Math.random() < FAILURE_RATE) {
    const error = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
    store.updateTask(taskId, {
      status: "failed",
      error,
      completedAt: Date.now(),
    });
    scheduleNext();
    return;
  }

  store.updateTask(taskId, { progress: newProgress });
}

function startTask(task: GenerationTask) {
  const interval = setInterval(() => tickTask(task.id), randomBetween(TICK_MIN, TICK_MAX));
  intervals.push(interval);
  return interval;
}

function scheduleNext() {
  const store = useQueueStore.getState();
  const available = MAX_CONCURRENT - store.getRunningCount();
  if (available <= 0) return;

  for (let i = 0; i < available; i++) {
    const task = store.getNextQueuedTask();
    if (!task) break;
    store.updateTask(task.id, { status: "running", progress: 0 });
    startTask(task);
  }
}

export function startEngine() {
  stopEngine();

  const store = useQueueStore.getState();
  const running = store.tasks.filter((t) => t.status === "running");
  for (const task of running) {
    startTask(task);
  }

  scheduleNext();

  unsubStore = useQueueStore.subscribe((state, prevState) => {
    if (state.tasks !== prevState.tasks) {
      scheduleNext();
    }
  });
}

export function stopEngine() {
  for (const id of intervals) {
    clearInterval(id);
  }
  intervals = [];
  unsubStore?.();
  unsubStore = null;
}
