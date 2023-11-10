import { z } from "zod";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clinicalRecords, patients } from "~/server/db/schema";
import { getPagination } from "~/utils/db";

export const patientsRouter = createTRPCRouter({
  getPatientById: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.db
        .select()
        .from(patients)
        .leftJoin(clinicalRecords, eq(clinicalRecords.patientId, input))
        .where(eq(patients.id, input))
        .orderBy(desc(clinicalRecords.createdAt));
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
      const LIMIT = 5;

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
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(patients)
        .values({ name: input, doctorId: ctx.session.user.id })
        .returning();
    }),
});
