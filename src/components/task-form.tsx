"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Task } from "@/types/task";
import { trpc } from "@/trpc/client";

export function TaskForm({ task }: { task?: Task }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const utils = trpc.useUtils();

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      setSuccess("Tarefa criada com sucesso.");
      await utils.task.list.invalidate();
      router.push("/tasks");
      router.refresh();
    },
    onError: (err) => setError(err.message),
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      setSuccess("Tarefa atualizada com sucesso.");
      await utils.task.list.invalidate();
      router.push("/tasks");
      router.refresh();
    },
    onError: (err) => setError(err.message),
  });

  const isPending = createTask.isPending || updateTask.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedTitle = titulo.trim();
    if (!normalizedTitle) {
      setError("O título é obrigatório.");
      return;
    }

    const data = {
      titulo: normalizedTitle,
      descricao: descricao.trim() || undefined,
    };

    if (task) {
      updateTask.mutate({ id: task.id, ...data });
    } else {
      createTask.mutate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-white p-6">
      <div>
        <label htmlFor="titulo" className="mb-1.5 block text-sm font-semibold">
          Título <span className="text-red-600">*</span>
        </label>
        <input
          id="titulo"
          name="titulo"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          maxLength={150}
          required
          placeholder="Ex.: Finalizar relatório"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1.5 block text-sm font-semibold">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          rows={5}
          placeholder="Detalhes da tarefa (opcional)"
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isPending ? "Salvando..." : task ? "Salvar alterações" : "Criar tarefa"}
        </button>
        <Link href="/tasks" className="text-sm font-medium text-slate-600 hover:underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
