import { Chip } from "@/shared/ui/era";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { QueueFilter } from "../model/types";
import { useQueueStore } from "../model/queueStore";
import { useFilter, useSort } from "../model/selectors";

const FILTERS: { key: QueueFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "queued", label: "В очереди" },
  { key: "running", label: "Идёт" },
  { key: "done", label: "Готово" },
  { key: "failed", label: "Ошибка" },
];

export function QueueToolbar() {
  const filter = useFilter();
  const sort = useSort();
  const { setFilter, setSort } = useQueueStore();

  const toggleSort = () => {
    setSort(sort === "newest" ? "oldest" : "newest");
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
      {FILTERS.map(({ key, label }) => (
        <Chip
          key={key}
          active={filter === key}
          onClick={() => setFilter(key)}
        >
          {label}
        </Chip>
      ))}

      <Chip active={false} onClick={toggleSort}>
        <span className="flex items-center gap-1">
          {sort === "newest" ? "Сначала новые" : "Сначала старые"}
          {sort === "newest" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </span>
      </Chip>
    </div>
  );
}
