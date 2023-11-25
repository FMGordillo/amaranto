import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

export const sqliteTable = sqliteTableCreator((name) => `amaranto_${name}`);

export const clinicalRecords = sqliteTable("clinicalRecords", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  patientId: text("patient_id").references(() => patients.id),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const clinicalRecordsRelations = relations(
  clinicalRecords,
  ({ one }) => ({
    patient: one(patients, {
      fields: [clinicalRecords.patientId],
      references: [patients.id],
    }),
  }),
);

export const patients = sqliteTable("patients", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  surname: text("surname", { length: 256 }),
  documentType: text("document_type"),
  documentValue: text("document_value"),
  email: text("email"),
  doctorId: text("doctor_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// export const patientsRelations = relations(patients, ({ many, one }) => ({
//   clinicalRecords: many(clinicalRecords),
//   doctor: one(users, { fields: [patients.doctorId], references: [users.id] }),
// }));

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  role: text("role").default("doctor").notNull(),
  // from stripe
  stripeSubscriptionId: text("stripe_subscription_id"),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

// export const usersRelations = relations(users, ({ many }) => ({
//   patients: many(patients),
// }));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
