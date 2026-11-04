import { randomUUID } from "node:crypto";
import type { Task } from "@/types/task";

const tasks = new Map<string, Task>();

export const taskRepository = {
  list(): Task[] {
    return Array.from(tasks.values()).sort(
      (a, b) => b.dataCriacao - a.dataCriacao,
    );
  },

  findById(id: string): Task | undefined {
    return tasks.get(id);
  },

  create(data: Pick<Task, "titulo" | "descricao">): Task {
    const task: Task = {
      id: randomUUID(),
      titulo: data.titulo,
      descricao: data.descricao,
      dataCriacao: Date.now(),
    };

    tasks.set(task.id, task);
    return task;
  },

  update(
    id: string,
    data: Pick<Task, "titulo" | "descricao">,
  ): Task | undefined {
    const existing = tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      titulo: data.titulo,
      descricao: data.descricao,
    };

    tasks.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return tasks.delete(id);
  },
};
