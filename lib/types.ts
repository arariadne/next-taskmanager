export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  /** Local calendar date `YYYY-MM-DD`, or null when no due date. */
  dueDate: string | null;
};
