"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { Task } from "@/lib/types";
import { TaskItem } from "@/components/TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTaskText: (id: string, text: string) => { ok: boolean; message?: string };
  onDelete: (id: string) => { ok: boolean; message?: string };
  /** Shown when there are no tasks to render (e.g. empty filter). */
  emptyMessage?: string;
};

const defaultEmptyMessage = "No tasks yet. Add one above!";
const ENTER_ANIMATION_MS = 280;
const EXIT_ANIMATION_MS = 240;

function TaskListComponent({
  tasks,
  onToggleTask,
  onUpdateTaskText,
  onDelete,
  emptyMessage,
}: TaskListProps) {
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set());
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const exitingIdsRef = useRef<Set<string>>(new Set());
  const prevTaskIdsRef = useRef<Set<string>>(new Set(tasks.map((task) => task.id)));
  const enterTimersRef = useRef<Map<string, number>>(new Map());
  const exitTimersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const previousIds = prevTaskIdsRef.current;
    const currentIds = new Set(tasks.map((task) => task.id));
    const newIds = tasks
      .map((task) => task.id)
      .filter((id) => !previousIds.has(id));

    if (newIds.length > 0) {
      setEnteringIds((prev) => {
        const next = new Set(prev);
        newIds.forEach((id) => next.add(id));
        return next;
      });

      newIds.forEach((id) => {
        const existingTimer = enterTimersRef.current.get(id);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
        }

        const timerId = window.setTimeout(() => {
          setEnteringIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          enterTimersRef.current.delete(id);
        }, ENTER_ANIMATION_MS);

        enterTimersRef.current.set(id, timerId);
      });
    }

    prevTaskIdsRef.current = currentIds;
  }, [tasks]);

  useEffect(() => {
    exitingIdsRef.current = exitingIds;
  }, [exitingIds]);

  useEffect(() => {
    return () => {
      enterTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      exitTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const handleDeleteWithAnimation = useCallback((id: string) => {
    if (exitingIdsRef.current.has(id)) {
      return { ok: true };
    }

    setExitingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const timerId = window.setTimeout(() => {
      const result = onDelete(id);
      if (!result.ok) {
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
      exitTimersRef.current.delete(id);
    }, EXIT_ANIMATION_MS);

    exitTimersRef.current.set(id, timerId);
    return { ok: true };
  }, [onDelete]);

  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
        {emptyMessage ?? defaultEmptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          text={task.text}
          completed={task.completed}
          priority={task.priority}
          dueDate={task.dueDate}
          onToggle={onToggleTask}
          onEdit={onUpdateTaskText}
          onDelete={handleDeleteWithAnimation}
          animationState={
            exitingIds.has(task.id)
              ? "exiting"
              : enteringIds.has(task.id)
                ? "entering"
                : "idle"
          }
        />
      ))}
    </ul>
  );
}

export const TaskList = memo(TaskListComponent);
