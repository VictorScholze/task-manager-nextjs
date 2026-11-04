"use client";

import Link from "next/link";
import { useState } from "react";
import type { Task } from "@/types/task";
import { trpc } from "@/trpc/client";

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();

  const tasksQuery = trpc.task.list.useQuery(undefined, {
    initialData: initialTasks,
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      setMessage("Tarefa excluída com sucesso.");
      await utils.task.list.invalidate();
    },
    onError: (error) => setMessage(error.message),
  });

  const tasks = tasksQuery.data ?? initialTasks;

  if (tasks.length === 0) {
    return (
      <section className="rounded-xl border border-dashed bg-white p-10 text-center">
        <h2 className="font-semibold">Nenhuma tarefa por enquanto</h2>
        <p className="mt-2 text-sm text-slate-500">
          Crie sua primeira tarefa para começar.
        </p>
      </section>
    );
  }

  return (
    <section>
      {message && (
        <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          {message}
        </p>
      )}
      {deleteTask.isPending && (
        <p className="mb-3 text-sm text-slate-500">Excluindo tarefa...</p>
      )}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex flex-col gap-4 rounded-xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-words font-semibold">{task.titulo}</h2>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                {task.descricao || "Sem descrição"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Criada em {new Date(task.dataCriacao).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/tasks/${task.id}/edit`}>
                Editar
              </Link>
              <button
                type="button"
                disabled={deleteTask.isPending}
                className="text-sm font-medium text-red-600 hover:underline"
                onClick={() => {
                  if (window.confirm(`Excluir "${task.titulo}"?`)) {
                    setMessage("");
                    deleteTask.mutate({ id: task.id });
                  }
                }}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
