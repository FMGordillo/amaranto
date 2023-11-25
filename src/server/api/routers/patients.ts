import { z } from "zod";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clinicalRecords, patients } from "~/server/db/schema";
import { getPagination } from "~/utils/db";

export const patientsRouter = createTRPCRouter({
  getPatientById: protectedProcedure
    .input(z.object({ page: z.string().default("1"), id: z.string() }))
    .query(async ({ input, ctx }) => {
      const page = parseInt(input.page, 10);
      const LIMIT = 10;

      const totalRecordsQuery = await ctx.db.run(
        sql`SELECT COUNT(*) as total from ${patients} LEFT JOIN ${clinicalRecords} ON ${patients.id} = ${clinicalRecords.patientId}  WHERE ${patients.id} = ${input.id}`,
      );
      const totalRecords = totalRecordsQuery.rows[0]?.total as number;

      const { offset, ...paginationData } = getPagination({
        page,
        limit: LIMIT,
        total: totalRecords,
      });

      const clinicalRecordsData = await ctx.db
        .select()
        .from(patients)
        .leftJoin(clinicalRecords, eq(clinicalRecords.patientId, input.id))
        .where(eq(patients.id, input.id))
        .orderBy(desc(clinicalRecords.createdAt))
        .limit(LIMIT)
        .offset(offset)

      return {
        ...paginationData,
        clinicalRecords: clinicalRecordsData,
        totalRecords,
      };
    }),

  getPatientBySearch: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.db
        .select()
        .from(patients)
        .where(
          and(
            eq(patients.doctorId, ctx.session.user.id),
            like(patients.name, `%${input}%`),
          ),
        );
    }),

  getPatients: protectedProcedure
    .input(z.object({ page: z.string().default("1") }))
    .query(async ({ input, ctx }) => {
      const page = parseInt(input.page, 10);
      const LIMIT = 10;

      const [patientsCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(patients)
        .where(eq(patients.doctorId, ctx.session.user.id));

      const totalPatients = patientsCount?.count ?? 0;

      const { offset, ...paginationData } = getPagination({
        page,
        limit: LIMIT,
        total: totalPatients,
      });

      const patientsData = await ctx.db
        .select()
        .from(patients)
        .where(eq(patients.doctorId, ctx.session.user.id))
        .orderBy(desc(patients.createdAt))
        .limit(LIMIT)
        .offset(offset);

      return {
        ...paginationData,
        patients: patientsData,
        totalPatients,
      };
    }),

  editPatient: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(patients)
        .set({ name: input.name })
        .where(
          and(
            eq(patients.doctorId, ctx.session.user.id),
            eq(patients.id, input.id),
          ),
        );
    }),

  createPatient: protectedProcedure
    .input(z.object({
      documentType: z.string().optional(),
      documentValue: z.string(),
      email: z.string().optional(),
      name: z.string(),
      surname: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(patients)
        .values({ ...input, doctorId: ctx.session.user.id })
        .returning();
    }),
});
