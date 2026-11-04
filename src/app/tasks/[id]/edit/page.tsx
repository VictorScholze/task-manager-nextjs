import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { TaskForm } from "@/components/task-form";
import { api } from "@/trpc/server";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const task = await api.task.getById({ id });
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <p className="text-sm font-medium text-blue-700">TASK MANAGER</p>
        <h1 className="mb-6 mt-1 text-3xl font-bold">Editar tarefa</h1>
        <TaskForm task={task} />
      </main>
    );
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
