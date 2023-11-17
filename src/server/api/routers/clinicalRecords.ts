import { desc, and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clinicalRecords, patients } from "~/server/db/schema";
import { getPagination } from "~/utils/db";

export const clinicalRecordsRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(clinicalRecords)
        .where(eq(clinicalRecords.id, input))
        .innerJoin(patients, eq(clinicalRecords.patientId, patients.id))
        .limit(1);
    }),
  createRecord: protectedProcedure
    .input(z.object({ message: z.string(), patientId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(clinicalRecords)
        .values({
          message: input.message,
          patientId: input.patientId,
        })
        .returning();
    }),

  getAll: protectedProcedure
    .input(z.object({ page: z.string().default("1") }))
    .query(async ({ ctx, input }) => {
      const page = parseInt(input.page, 10);
      const LIMIT = 10;

      const [recordsCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(clinicalRecords)
        .innerJoin(patients, eq(clinicalRecords.patientId, patients.id))
        .where(eq(patients.doctorId, ctx.session.user.id));

      const totalRecords = recordsCount?.count ?? 0;
      const { offset, ...paginationData } = getPagination({
        page,
        limit: LIMIT,
        total: totalRecords,
      });

      const records = await ctx.db
        .select({ data: clinicalRecords, patient: patients })
        .from(clinicalRecords)
        .innerJoin(patients, eq(clinicalRecords.patientId, patients.id))
        .where(eq(patients.doctorId, ctx.session.user.id))
        .orderBy(desc(clinicalRecords.createdAt))
        .offset(offset)
        .limit(LIMIT);

      return {
        ...paginationData,
        records,
        totalRecords,
      };
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.string(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const LIMIT = 10;

      const totalRecordsQuery = await ctx.db.run(
        sql`SELECT COUNT(*) as total from ${clinicalRecords}  WHERE ${clinicalRecords.patientId} = ${input.patientId}`,
      );

      const totalRecords = totalRecordsQuery.rows[0]?.total as number;

      const { offset, ...paginationData } = getPagination({
        page: input.page,
        limit: LIMIT,
        total: totalRecords,
      });

      const records = await ctx.db
        .select({ data: clinicalRecords })
        .from(clinicalRecords)
        .innerJoin(patients, eq(clinicalRecords.patientId, patients.id))
        .where(
          and(
            eq(clinicalRecords.patientId, input.patientId),
            eq(patients.doctorId, ctx.session.user.id),
          ),
        )
        .orderBy(desc(clinicalRecords.createdAt))
        .offset(offset)
        .limit(LIMIT);

      return {
        ...paginationData,
        records,
        totalRecords,
      };
    }),
});
