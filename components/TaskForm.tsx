"use client";

import { FormEvent, useState } from "react";
import type { TaskPriority } from "@/lib/types";
import { Button } from "@/components/Button";

type TaskFormProps = {
  onAddTask: (text: string, priority: TaskPriority, dueDate: string | null) => void;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const due = dueDate.trim() === "" ? null : dueDate.trim();
    onAddTask(trimmed, priority, due);
    setText("");
    setPriority("medium");
    setDueDate("");
  }

  const canAdd = text.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[12rem]">
        <label
          htmlFor="task-text"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Task
        </label>
        <input
          id="task-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          autoComplete="off"
        />
      </div>
      <div className="flex w-full flex-col gap-1.5 sm:w-40 sm:shrink-0">
        <label
          htmlFor="task-priority"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="flex w-full flex-col gap-1.5 sm:w-44 sm:shrink-0">
        <label
          htmlFor="task-due-date"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Due date
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!canAdd}
        className="shrink-0 sm:min-w-[120px]"
      >
        Add task
      </Button>
    </form>
  );
}
