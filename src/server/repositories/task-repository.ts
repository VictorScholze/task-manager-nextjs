import { randomUUID } from "node:crypto";
import type { Task } from "@/types/task";

const tasks = new Map<string, Task>();

export const taskRepository = {
  list(): Task[] {
    return Array.from(tasks.values()).sort(
      (a, b) => b.createdAt - a.createdAt,
    );
  },

  findById(id: string): Task | undefined {
    return tasks.get(id);
  },

  create(data: Pick<Task, "title" | "description">): Task {
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      createdAt: Date.now(),
    };

    tasks.set(task.id, task);
    return task;
  },

  update(
    id: string,
    data: Pick<Task, "title" | "description">,
  ): Task | undefined {
    const existing = tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      title: data.title,
      description: data.description,
    };

    tasks.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return tasks.delete(id);
  },
};
