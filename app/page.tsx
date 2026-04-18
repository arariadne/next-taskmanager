"use client";

import { useCallback, useMemo, useState } from "react";
import type { Task, TaskPriority } from "@/lib/types";
import { createTaskId } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";

type TaskFilter = "all" | "active" | "completed";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const addTask = useCallback(
    (text: string, priority: TaskPriority, dueDate: string | null) => {
      setTasks((prev) => [
        ...prev,
        { id: createTaskId(), text, completed: false, priority, dueDate },
      ]);
    },
    [],
  );

  /** Flips `completed` for the task with the given id. */
  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  }, []);

  const updateTaskText = useCallback((id: string, nextText: string) => {
    const trimmed = nextText.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const filteredTasks = useMemo(() => {
    if (taskFilter === "active") {
      return tasks.filter((t) => !t.completed);
    }
    if (taskFilter === "completed") {
      return tasks.filter((t) => t.completed);
    }
    return tasks;
  }, [tasks, taskFilter]);

  const filterEmptyMessage =
    tasks.length > 0 && filteredTasks.length === 0
      ? taskFilter === "active"
        ? "No active tasks."
        : "No completed tasks."
      : undefined;

  const filterButtons: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Task manager
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Add tasks and check them off when you&apos;re done.
            </p>
          </header>

          <TaskForm onAddTask={addTask} />

          <section aria-labelledby="task-list-heading" className="space-y-3">
            <h2
              id="task-list-heading"
              className="text-sm font-semibold tracking-wide text-zinc-600 dark:text-zinc-400"
            >
              {completedCount} of {totalCount} completed
            </h2>

            <div
              className="flex w-full gap-2 sm:gap-3"
              role="group"
              aria-label="Filter tasks by status"
            >
              {filterButtons.map(({ value, label }) => {
                const selected = taskFilter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTaskFilter(value)}
                    className={
                      selected
                        ? "flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        : "flex-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggleTask={toggleTaskCompleted}
              onUpdateTaskText={updateTaskText}
              onDelete={deleteTask}
              emptyMessage={filterEmptyMessage}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
