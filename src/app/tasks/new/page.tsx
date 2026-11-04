import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <p className="text-sm font-medium text-blue-700">TASK MANAGER</p>
      <h1 className="mb-6 mt-1 text-3xl font-bold">Nova tarefa</h1>
      <TaskForm />
    </main>
  );
}
