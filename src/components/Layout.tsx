import Head from "next/head";
import Header from "./Header";
import type { FunctionComponent, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
}>;

const Layout: FunctionComponent<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ?? "Amaranto"}</title>
        <meta name="description" content="Tu clínica digital" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Header />
        {children}
      </div>
      <footer className="text-white bg-fuchsia-950 py-8">
        <div className="container mx-auto">
          <p>Made by ChiroTech</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
