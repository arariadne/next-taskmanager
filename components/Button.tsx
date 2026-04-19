import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const baseStyles =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#3B82F6] text-white hover:bg-[#2563EB] active:bg-[#1D4ED8]",
  secondary:
    "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 active:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
