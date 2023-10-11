import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { patients } from "~/server/db/schema";

export const patientsRouter = createTRPCRouter({
  getPatient: protectedProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.db
      .select()
      .from(patients)
      .where(
        and(eq(patients.doctorId, ctx.session.user.id), eq(patients.id, input)),
      );
  }),
  getPatients: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(patients)
      .where(eq(patients.doctorId, ctx.session.user.id));
  }),
  createPatient: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.insert(patients).values({ name: input, doctorId: ctx.session.user.id })
  }),
});
