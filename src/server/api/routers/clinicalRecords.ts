import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clinicalRecords } from "~/server/db/schema";

export const clinicalRecordsRouter = createTRPCRouter({
  createRecord: protectedProcedure
    .input(z.object({ message: z.string(), patientId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(clinicalRecords).values({
        message: input.message,
        patientId: input.patientId,
      });
    }),

  getByPatient: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db
      .select()
      .from(clinicalRecords)
      .where(eq(clinicalRecords.patientId, input));
  }),
});
