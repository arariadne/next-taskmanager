"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { TaskPriority } from "@/lib/types";
import { Button } from "@/components/Button";
import { formatRelativeDueDate, isDueDatePast } from "@/lib/utils";

const priorityBadgeStyles: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className:
      "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-200",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-200",
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950/80 dark:text-green-200",
  },
};

type TaskItemProps = {
  id: string;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  /** Local `YYYY-MM-DD` or null. */
  dueDate: string | null;
  onToggle: (id: string) => void;
  onEdit: (updatedText: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({
  id,
  text,
  completed,
  priority,
  dueDate,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const checkboxId = `task-done-${id}`;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const errorId = useId();
  const deleteDialogTitleId = useId();

  const dueLabel = useMemo(() => formatRelativeDueDate(dueDate), [dueDate]);
  const showOverdueStyle = Boolean(
    dueLabel && isDueDatePast(dueDate) && !completed,
  );

  // Autofocus & select input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditedText(text);
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editedText.trim();
    if (!trimmed) {
      setError("Task text cannot be empty.");
      setSuccess(false);
      inputRef.current?.focus();
      return;
    }
    try {
      setError(null);
      onEdit(trimmed);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedText(text);
    setError(null);
    setSuccess(false);
    setIsEditing(false);
  };

  const openDeleteDialog = () => {
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    deleteDialogRef.current?.close();
  };

  const confirmDelete = () => {
    onDelete(id);
    closeDeleteDialog();
  };

  // Keyboard accessibility for editing
  const handleEditInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <li>
      <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start gap-3">
          <input
            id={checkboxId}
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/40 dark:border-zinc-600 dark:bg-zinc-900"
            aria-label={`Mark "${text}" as ${completed ? "incomplete" : "complete"}`}
            tabIndex={isEditing ? -1 : 0}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeStyles[priority].className}`}
            >
              {priorityBadgeStyles[priority].label}
            </span>
          {isEditing ? (
            <form
              className="flex min-w-0 flex-1 flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              role="form"
              aria-label="Edit task"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <input
                  ref={inputRef}
                  type="text"
                  value={editedText}
                  disabled={success}
                  onChange={(e) => {
                    setEditedText(e.target.value);
                    setError(null);
                    setSuccess(false);
                  }}
                  onKeyDown={handleEditInputKeyDown}
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  className={`w-full rounded-md border-2 bg-white px-3 py-2 text-sm font-medium text-zinc-950 caret-zinc-950 shadow-sm placeholder:text-zinc-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 dark:bg-zinc-800 dark:text-zinc-50 dark:caret-zinc-50 dark:placeholder:text-zinc-500 
                    ${error ? "border-red-500 ring-red-200 dark:border-red-500" : "border-[#3B82F6] ring-[#3B82F6]/25"}
                  `}
                  autoComplete="off"
                  maxLength={100}
                />
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={handleSave}
                    disabled={success}
                  >
                    Save
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
              {error ? (
                <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ) : success ? (
                <span className="text-sm text-green-600 dark:text-green-400">
                  Task updated!
                </span>
              ) : null}
            </form>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className={`min-w-0 flex-1 rounded-md px-1 py-0.5 text-left text-sm leading-relaxed transition-colors 
                hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-[#3B82F6] dark:hover:bg-zinc-800 ${
                  completed
                    ? "text-zinc-500 line-through opacity-70 dark:text-zinc-500"
                    : "font-medium text-zinc-900 dark:text-zinc-100"
                }`}
              aria-label={`Edit task "${text}"`}
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isEditing) {
                  e.preventDefault();
                  startEditing();
                }
              }}
            >
              {text}
            </button>
          )}
          </div>
          <button
            type="button"
            onClick={openDeleteDialog}
            aria-label={`Delete task "${text}"`}
            aria-haspopup="dialog"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </div>
        {dueLabel ? (
          <p
            className={`pl-7 ${
              showOverdueStyle
                ? "text-sm font-medium text-red-600 dark:text-red-400"
                : completed
                  ? "text-sm text-zinc-400 dark:text-zinc-500"
                  : "text-sm text-zinc-500 dark:text-zinc-400"
            }`}
          >
            Due {dueLabel}
          </p>
        ) : null}
      </div>

      <dialog
        ref={deleteDialogRef}
        aria-labelledby={deleteDialogTitleId}
        onClick={(e) => {
          if (e.target === deleteDialogRef.current) closeDeleteDialog();
        }}
        className="fixed left-1/2 top-1/2 z-50 m-0 max-h-[min(90dvh,calc(100vh-2rem))] w-[min(100%,22rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 [&::backdrop]:bg-black/50"
      >
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h3
            id={deleteDialogTitleId}
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Delete this task?
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            This can&apos;t be undone. The task will be removed from your list.
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Task
          </p>
          <p className="mt-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {text}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end dark:border-zinc-800">
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-full bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-red-600 sm:w-auto"
            onClick={confirmDelete}
          >
            Delete task
          </Button>
        </div>
      </dialog>
    </li>
  );
}
