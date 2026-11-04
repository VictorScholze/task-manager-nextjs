import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { taskRepository } from "@/server/repositories/task-repository";
import { createTRPCRouter, publicProcedure } from "../trpc";

const taskFields = {
  titulo: z.string().trim().min(1, "O título é obrigatório").max(150),
  descricao: z.string().optional(),
};

export const taskRouter = createTRPCRouter({
  list: publicProcedure.query(() => taskRepository.list()),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => {
      const task = taskRepository.findById(input.id);
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada.",
        });
      }
      return task;
    }),

  create: publicProcedure
    .input(z.object(taskFields))
    .mutation(({ input }) => taskRepository.create({
      titulo: input.titulo,
      descricao: input.descricao?.trim() || undefined,
    })),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...taskFields,
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const task = taskRepository.update(id, {
        titulo: data.titulo,
        descricao: data.descricao?.trim() || undefined,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada.",
        });
      }
      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => {
      const deleted = taskRepository.delete(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada.",
        });
      }
      return { success: true };
    }),
});
