import { useState, useEffect, useRef } from "react";
import { Chip } from "@/shared/ui/era";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
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

const DEBOUNCE_MS = 300;

export function QueueToolbar() {
  const filter = useFilter();
  const sort = useSort();
  const { setFilter, setSort, setSearch } = useQueueStore();
  const [localSearch, setLocalSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearch(localSearch);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch, setSearch]);

  const toggleSort = () => {
    setSort(sort === "newest" ? "oldest" : "newest");
  };

  return (
    <div className="flex flex-col gap-2">
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Поиск по промпту..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
