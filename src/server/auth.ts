import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  User,
} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

// import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sessions, sqliteTable, users } from "~/server/db/schema";

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
    jwt({ token, user, account, profile, isNewUser }) {
      // console.log({ token, account });
      // if (account) {
      // }
      // await db.insert(sessions).values({
      //   userId: user.id,
      //   expires: new Date(),
      //   sessionToken: token.accessToken as string,
      // })
      console.log({ token, user, account, profile, isNewUser });
      token.accessToken = '1';
      return token;
    },
    session: ({ session, token, user }) => {
      console.log({ session, token, user });
      return {
        expires: session.expires,
        user: {
          ...session.user,
          id: '842fee57-af7f-4548-a53b-0e5fb6120380',
        },
      }
    },
  },
  // adapter: DrizzleAdapter(db, sqliteTable),
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: 'Iniciá sesión',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(_credentials, _req) {
        const user = await db.select().from(users).where(eq(users.email, "me@facundogordillo.com")).get()
        console.log({ user });
        return user as User | null;
      }
    }),
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
