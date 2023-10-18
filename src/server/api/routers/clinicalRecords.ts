import { eq, sql } from "drizzle-orm";
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

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.string(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const LIMIT = 5;

      const totalRecordsQuery = await ctx.db.run(
        sql`SELECT COUNT(*) as total from ${clinicalRecords}  WHERE ${clinicalRecords.patientId} = ${input.patientId}`,
      );

      const totalRecords = totalRecordsQuery.rows[0]?.total as number;
      const offset = input.page - 1 * LIMIT;

      const pages = [...Array(Math.ceil(totalRecords / LIMIT)).keys()].map(
        (k) => k + 1,
      );

      const startPage = Math.max(input.page - 5, 1);
      const endPage = Math.min(input.page + 5, pages.length);
      const visiblePages = pages.slice(startPage - 1, endPage);

      const hasPreviousPage = input.page > 1;
      const hasNextPage = input.page < pages.length;

      const records = await ctx.db
        .select()
        .from(clinicalRecords)
        .where(eq(clinicalRecords.patientId, input.patientId))
        .offset(offset)
        .limit(LIMIT);

      return {
        hasNextPage,
        hasPreviousPage,
        pages,
        records,
        totalRecords,
        visiblePages,
      };
    }),
});
