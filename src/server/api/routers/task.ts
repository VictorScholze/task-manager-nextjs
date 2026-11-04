import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { taskRepository } from "@/server/repositories/task-repository";
import { createTRPCRouter, publicProcedure } from "../trpc";

const taskFields = {
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().optional(),
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
          message: "Task not found.",
        });
      }
      return task;
    }),

  create: publicProcedure
    .input(z.object(taskFields))
    .mutation(({ input }) => taskRepository.create({
      title: input.title,
      description: input.description?.trim() || undefined,
    })),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...taskFields,
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const task = taskRepository.update(id, {
        title: data.title,
        description: data.description?.trim() || undefined,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
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
          message: "Task not found.",
        });
      }
      return { success: true };
    }),
});
