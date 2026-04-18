"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type TaskFormProps = {
  onAddTask: (text: string) => void;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setText("");
  }

  
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
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
      <Button type="submit" variant="primary" className="shrink-0 sm:min-w-[120px]">
        Add task
      </Button>
    </form>
  );
}
