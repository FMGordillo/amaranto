import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from 'notistack';
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useReportWebVitals } from "next-axiom";

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useReportWebVitals();
  return (
    <SessionProvider session={session}>
      <SnackbarProvider>
        <NextNProgress color="#db2777" />
        <Component {...pageProps} />
      </SnackbarProvider>
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
