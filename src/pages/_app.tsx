import { appWithTranslation } from "next-i18next";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useReportWebVitals } from "next-axiom";
import { NotificationProvider } from "~/components/Notification";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useReportWebVitals();
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
