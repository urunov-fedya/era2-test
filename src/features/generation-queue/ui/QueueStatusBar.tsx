import { useState } from "react";
import { useNavigate } from "@/shared/routing";
import { useTasksByStatus, useActiveTasks, useAverageProgress, useActiveCount } from "../model/selectors";
import { StatusCollapsedPill } from "./StatusCollapsedPill";
import { StatusSingleCard } from "./StatusSingleCard";
import { StatusMultiCard } from "./StatusMultiCard";
import { StatusMobileBar } from "./StatusMobileBar";

export function QueueStatusBar() {
  const runningTasks = useTasksByStatus("running");
  const allActiveTasks = useActiveTasks();
  const activeCount = useActiveCount();
  const avgProgress = useAverageProgress();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (activeCount === 0) return null;

  const handleNavigate = () => navigate("/queue");
  const toggleCollapsed = () => setCollapsed((c) => !c);

  const displayTasks = allActiveTasks.slice(0, 3);

  return (
    <>
      <div className="hidden md:block fixed bottom-6 right-6 z-50 w-[320px]">
        {collapsed ? (
          <StatusCollapsedPill
            count={activeCount}
            progress={avgProgress}
            onExpand={toggleCollapsed}
          />
        ) : activeCount === 1 && runningTasks.length === 1 ? (
          <StatusSingleCard
            task={runningTasks[0]}
            onNavigate={handleNavigate}
            onCollapse={toggleCollapsed}
          />
        ) : (
          <StatusMultiCard
            activeCount={activeCount}
            progress={avgProgress}
            tasks={displayTasks}
            onNavigate={handleNavigate}
            onCollapse={toggleCollapsed}
          />
        )}
      </div>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 safe-bottom">
        <StatusMobileBar
          activeCount={activeCount}
          progress={avgProgress}
          onNavigate={toggleCollapsed}
        />
      </div>
    </>
  );
}
