import { relations, sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';
import {
  index,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const sqliteTable = sqliteTableCreator((name) => `amaranto_${name}`);

export const clinicalRecords = sqliteTable("clinicalRecords", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  patientId: text("patient_id").references(() => patients.id),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const clinicalRecordsRelations = relations(clinicalRecords, ({ one }) => ({
  patient: one(patients, { fields: [clinicalRecords.patientId], references: [patients.id] }),
}));

export const patients = sqliteTable(
  "patients",
  {
    id: text("id").$defaultFn(() => createId()).primaryKey(),
    name: text("name", { length: 256 }),
    // I think we don't need any more info from the patient
    doctorId: text("doctor_id"),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  // (patient) => ({
  //   nameIndex: uniqueIndex("name_idx").on(patient.name),
  // })
);

export const patientsRelations = relations(patients, ({ many, one }) => ({
  clinicalRecords: many(clinicalRecords),
  doctor: one(users, { fields: [patients.doctorId], references: [users.id] }),
}));

export const users = sqliteTable("user", {
  id: text("id", { length: 255 }).$defaultFn(() => createId()).notNull().primaryKey(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  // TODO: Add role as a type
  role: text("role").default("doctor").notNull(),
  // FIXME: I don't know what is this, or why do i need it
  // emailVerified: text("emailVerified", {
  //   mode: "date",
  //   fsp: 3,
  // }).default(sql`CURRENT_TIMESTAMP(3)`),
  emailVerified: text("emailVerified"),
  image: text("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  // TODO: Should the user have many accounts?
  accounts: many(accounts),
  patients: many(patients),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId", { length: 255 }).notNull(),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken")
      .notNull()
      .primaryKey(),
    userId: text("userId").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (session) => ({
    sesionIdIdx: index("sessionId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);
