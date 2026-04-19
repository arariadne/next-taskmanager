"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  durationMs?: number;
  onDone: () => void;
};

export function Toast({ message, type, durationMs = 3000, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setVisible(true), 10);
    const exitTimer = window.setTimeout(() => setVisible(false), durationMs - 250);
    const doneTimer = window.setTimeout(onDone, durationMs);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [durationMs, onDone]);

  const baseClasses =
    "pointer-events-auto rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-250";
  const colorClasses =
    type === "success" ? "bg-green-600" : "bg-red-600";
  const visibilityClasses = visible
    ? "translate-y-0 opacity-100"
    : "-translate-y-1 opacity-0";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${baseClasses} ${colorClasses} ${visibilityClasses}`}
    >
      {message}
    </div>
  );
}
