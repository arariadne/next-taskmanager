"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Task, TaskPriority } from "@/lib/types";
import { createTaskId } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Toast, type ToastType } from "@/components/Toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type TaskFilter = "all" | "active" | "completed";
type ActionResult = { ok: boolean; message?: string };

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ id: number; type: ToastType; message: string } | null>(null);
  const toastCounterRef = useRef(0);

  const showToast = useCallback((type: ToastType, message: string) => {
    toastCounterRef.current += 1;
    setToast({ id: toastCounterRef.current, type, message });
  }, []);

  const addTask = useCallback(
    (text: string, priority: TaskPriority, dueDate: string | null): ActionResult => {
      try {
        setTasks((prev) => [
          ...prev,
          { id: createTaskId(), text, completed: false, priority, dueDate },
        ]);
        showToast("success", "Task successfully added!");
        return { ok: true };
      } catch {
        const message = "Failed to add task. Please try again.";
        showToast("error", message);
        return { ok: false, message };
      }
    },
    [setTasks, showToast],
  );

  /** Flips `completed` for the task with the given id. */
  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  }, [setTasks]);

  const updateTaskText = useCallback((id: string, nextText: string): ActionResult => {
    const trimmed = nextText.trim();
    if (!trimmed) {
      const message = "Failed to edit task. Task text cannot be empty.";
      showToast("error", message);
      return { ok: false, message };
    }

    let taskFound = false;
    try {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          taskFound = true;
          return { ...t, text: trimmed };
        }),
      );
      if (!taskFound) {
        const message = "Failed to edit task. Task not found.";
        showToast("error", message);
        return { ok: false, message };
      }
      showToast("success", "Task successfully updated!");
      return { ok: true };
    } catch {
      const message = "Failed to edit task. Please try again.";
      showToast("error", message);
      return { ok: false, message };
    }
  }, [setTasks, showToast]);

  const deleteTask = useCallback((id: string): ActionResult => {
    let removed = false;
    try {
      setTasks((prev) =>
        prev.filter((t) => {
          const shouldKeep = t.id !== id;
          if (!shouldKeep) removed = true;
          return shouldKeep;
        }),
      );
      if (!removed) {
        const message = "Failed to delete task. Task not found.";
        showToast("error", message);
        return { ok: false, message };
      }
      showToast("success", "Task successfully deleted!");
      return { ok: true };
    } catch {
      const message = "Failed to delete task. Please try again.";
      showToast("error", message);
      return { ok: false, message };
    }
  }, [setTasks, showToast]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const statusFilteredTasks = useMemo(() => {
    if (taskFilter === "active") {
      return tasks.filter((t) => !t.completed);
    }
    if (taskFilter === "completed") {
      return tasks.filter((t) => t.completed);
    }
    return tasks;
  }, [tasks, taskFilter]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    if (!normalizedSearchQuery) return statusFilteredTasks;
    return statusFilteredTasks.filter((t) =>
      t.text.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [statusFilteredTasks, normalizedSearchQuery]);

  const filterEmptyMessage =
    tasks.length > 0 && filteredTasks.length === 0
      ? normalizedSearchQuery
        ? taskFilter === "all"
          ? "No tasks match your search."
          : taskFilter === "active"
            ? "No active tasks match your search."
            : "No completed tasks match your search."
        : taskFilter === "active"
          ? "No active tasks."
          : "No completed tasks."
      : undefined;

  const filterButtons: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div
      className={`flex min-h-full flex-col bg-zinc-50 font-sans dark:bg-zinc-950 ${theme === "dark" ? "dark" : ""}`}
    >
      <main className="flex flex-1 flex-col">
        <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-xs justify-end">
          {toast ? (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onDone={() => setToast((current) => (current?.id === toast.id ? null : current))}
            />
          ) : null}
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
          <header className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Task manager
              </h1>
              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
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

            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                disabled={searchQuery.length === 0}
                className="shrink-0 rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                aria-label="Clear search"
              >
                Clear
              </button>
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
