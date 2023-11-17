import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { Resend } from "resend";
import type { LinkedInProfile } from "next-auth/providers/linkedin";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sqliteTable } from "~/server/db/schema";
import { SQLiteDrizzleAdapter } from "./drizzleSqliteAdapter";
import { OAuthConfig } from "next-auth/providers";
import type { EmailConfig, EmailUserConfig } from "next-auth/providers/email";
import LoginEmail from "emails";

const resend = new Resend(env.RESEND_API_KEY);

export const EmailProvider = (options: EmailUserConfig): EmailConfig => {
  return {
    id: "email",
    type: "email",
    name: "Email",
    // not being used
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "Amaranto <no-reply@chirotech.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      await resend.emails.send({
        from: "no-reply@chirotech.dev",
        to: params.identifier,
        subject: "[Amaranto] Iniciá sesión",
        react: <LoginEmail url={params.url} />,
      });
    },
    options,
  };
};

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
    stripeSubscriptionId: null,
  }),
  wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  authorization: {
    params: {
      scope: "openid profile email",
    },
  },
  style: {
    logo: "/linkedin.svg",
    bg: "#069",
    text: "#fff",
    bgDark: "#069",
    logoDark: "/linkedin.svg",
    textDark: "#fff",
  },
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
      subscription: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    stripeSubscriptionId: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: env.NODE_ENV === "development",
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.subscription = user.stripeSubscriptionId;
      return session;
    },
    jwt({ token }) {
      return token;
    },
  },
  adapter: SQLiteDrizzleAdapter(db, sqliteTable),
  providers: [
    LinkedinProvider({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),
    EmailProvider({
      from: "no-reply@chirotech.dev",
    }),
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
