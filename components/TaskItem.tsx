"use client";

type TaskItemProps = {
  id: string;
  text: string;
  completed: boolean;
  /** Called with this item's id when the checkbox is toggled. */
  onToggle: (id: string) => void;
};

export function TaskItem({ id, text, completed, onToggle }: TaskItemProps) {
  const checkboxId = `task-done-${id}`;

  return (
    <li>
      <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <input
          id={checkboxId}
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/40 dark:border-zinc-600 dark:bg-zinc-900"
          aria-label={`Mark "${text}" as ${completed ? "incomplete" : "complete"}`}
        />
        <label
          htmlFor={checkboxId}
          className={`min-w-0 flex-1 cursor-pointer text-sm leading-relaxed ${
            completed
              ? "text-zinc-500 line-through opacity-70 dark:text-zinc-500"
              : "font-medium text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {text}
        </label>
      </div>
    </li>
  );
}
