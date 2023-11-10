import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import type { LinkedInProfile } from "next-auth/providers/linkedin";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sqliteTable } from "~/server/db/schema";
import { SQLiteDrizzleAdapter } from "./drizzleSqliteAdapter";
import { OAuthConfig } from "next-auth/providers";

export const LinkedinProvider = (
  config: Partial<OAuthConfig<LinkedInProfile>>,
): OAuthConfig<LinkedInProfile> => ({
  id: "linkedin",
  name: "LinkedIn",
  type: "oauth",
  client: { token_endpoint_auth_method: "client_secret_post" },
  issuer: "https://www.linkedin.com",
  profile: (profile: LinkedInProfile) => ({
    id: profile.sub as string,
    name: profile.name as string,
    email: profile.email as string,
    image: profile.picture as string,
  }),
  wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  authorization: {
    params: {
      scope: "openid profile email",
    },
  },
  style: { logo: "/linkedin.svg", bg: "#069", text: "#fff", bgDark: "#069", logoDark: "/linkedin.svg", textDark: "#fff" },
  ...config,
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    jwt(all) {
      console.log("me llamaste bb?", all);
      return all.token;
    },
  },
  adapter: SQLiteDrizzleAdapter(db, sqliteTable),
  providers: [
    LinkedinProvider({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),
    // CredentialsProvider({
    //   name: "Iniciá sesión",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(_credentials, _req) {
    //     const user = await db
    //       .select()
    //       .from(users)
    //       .where(eq(users.email, "me@facundogordillo.com"))
    //       .get();
    //     console.log({ user });
    //     return user as User | null;
    //   },
    // }),
    //
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs

 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
