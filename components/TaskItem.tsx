"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/Button";

type TaskItemProps = {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (updatedText: string) => void;
};

export function TaskItem({
  id,
  text,
  completed,
  onToggle,
  onEdit,
}: TaskItemProps) {
  const checkboxId = `task-done-${id}`;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  // When user changes text externally, reset edit field and messages
  useEffect(() => {
    if (!isEditing) setEditedText(text);
  }, [text, isEditing]);

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
    } catch (e) {
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedText(text);
    setError(null);
    setSuccess(false);
    setIsEditing(false);
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
      <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-shadow">
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
                  className={`w-full rounded-md border-2 px-3 py-2 text-sm font-medium shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 dark:bg-zinc-900 dark:text-zinc-100 
                    ${error ? "border-red-500 ring-red-200" : "border-[#3B82F6] ring-[#3B82F6]/25"}
                  `}
                  style={{ background: "#fafdff" }}
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
      </div>
    </li>
  );
}
