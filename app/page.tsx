"use client";

import { useCallback, useState } from "react";
import type { Task } from "@/lib/types";
import { createTaskId } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((text: string) => {
    setTasks((prev) => [
      ...prev,
      { id: createTaskId(), text, completed: false },
    ]);
  }, []);

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
            <TaskList
              tasks={tasks}
              onToggleTask={toggleTaskCompleted}
              onUpdateTaskText={updateTaskText}
              onDelete={deleteTask}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
