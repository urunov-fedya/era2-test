import { useState, useEffect, useRef } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/era";
import { Search, ArrowUpDown } from "lucide-react";
import type { QueueFilter } from "../model/types";
import { useQueueStore } from "../model/queueStore";

const FILTERS: { key: QueueFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "queued", label: "В очереди" },
  { key: "running", label: "Идёт" },
  { key: "done", label: "Готово" },
  { key: "failed", label: "Ошибка" },
];

export function QueueToolbar() {
  const { filter, sort, search, setFilter, setSort, setSearch } = useQueueStore();
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(value), 300);
  };

  const toggleSort = () => {
    setSort(sort === "newest" ? "oldest" : "newest");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
        {FILTERS.map(({ key, label }) => (
          <Chip
            key={key}
            active={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск по промпту..."
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs shrink-0"
          onClick={toggleSort}
        >
          <ArrowUpDown className="h-3 w-3" />
          {sort === "newest" ? "Новые" : "Старые"}
        </Button>
      </div>
    </div>
  );
}
