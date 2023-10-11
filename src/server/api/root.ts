import { patientsRouter } from "~/server/api/routers/patients";
import { createTRPCRouter } from "~/server/api/trpc";
import { clinicalRecordsRouter } from "./routers/clinicalRecords";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  clinicalRecords: clinicalRecordsRouter,
  patients: patientsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
