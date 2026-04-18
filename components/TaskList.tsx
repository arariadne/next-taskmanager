"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "@/components/TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTaskText: (id: string, text: string) => void;
};

export function TaskList({ tasks, onToggleTask, onUpdateTaskText }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
        No tasks yet. Add one above!
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
          onToggle={onToggleTask}
          onEdit={(updatedText) => onUpdateTaskText(task.id, updatedText)}
        />
      ))}
    </ul>
  );
}
