import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { SnackbarProvider } from 'notistack';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useReportWebVitals } from "next-axiom";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useReportWebVitals();
  return (
    <SessionProvider session={session}>
      <SnackbarProvider>
        <Component {...pageProps} />
      </SnackbarProvider>
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
