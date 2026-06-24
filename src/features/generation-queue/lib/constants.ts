import { FileText, Image, Video, Music } from "lucide-react";
import type { GenType } from "@/entities/generation-task";

export const TYPE_ICONS: Record<GenType, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Music,
};

export const TYPE_LABELS: Record<GenType, string> = {
  text: "Генерация текста",
  image: "Генерация изображения",
  video: "Генерация видео",
  audio: "Генерация аудио",
};
