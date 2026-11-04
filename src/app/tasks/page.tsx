import Link from "next/link";
import { api } from "@/trpc/server";
import { TaskList } from "@/components/task-list";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await api.task.list();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700">TASK MANAGER</p>
          <h1 className="mt-1 text-3xl font-bold">Minhas tarefas</h1>
        </div>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </Link>
      </header>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
