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
      setMessage("Task deleted successfully.");
      await utils.task.list.invalidate();
    },
    onError: (error) => setMessage(error.message),
  });

  const tasks = tasksQuery.data ?? initialTasks;

  if (tasks.length === 0) {
    return (
      <section className="rounded-xl border border-dashed bg-white p-10 text-center">
        <h2 className="font-semibold">No tasks yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          Create your first task to get started.
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
        <p className="mb-3 text-sm text-slate-500">Deleting task...</p>
      )}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex flex-col gap-4 rounded-xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-words font-semibold">{task.title}</h2>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                {task.description || "No description"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Created on {new Date(task.createdAt).toLocaleString("en-US")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/tasks/${task.id}/edit`}>
                Edit
              </Link>
              <button
                type="button"
                disabled={deleteTask.isPending}
                className="text-sm font-medium text-red-600 hover:underline"
                onClick={() => {
                  if (window.confirm(`Delete "${task.title}"?`)) {
                    setMessage("");
                    deleteTask.mutate({ id: task.id });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
