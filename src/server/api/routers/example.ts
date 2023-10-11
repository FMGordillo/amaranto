import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { patients } from "~/server/db/schema";

export const patientsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(patients);
  }),
  getByDoctor: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(patients);
  })
});
