import { TaskManager } from "@/components/TaskManager";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-1 flex-col">
        <TaskManager />
      </main>
    </div>
  );
}
