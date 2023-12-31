import Head from "next/head";
import Header from "./Header";
import { useMemo, type FunctionComponent, type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  hideFooter?: boolean;
  hideHeader?: boolean;
  title?: string;
}>;

const Layout: FunctionComponent<Props> = ({
  hideFooter = false,
  hideHeader = false,
  children,
  title,
}) => {
  const gridRowsStyle = useMemo(() => {
    if (hideHeader && hideFooter) {
      return "grid-rows-[1fr]";
    }

    if (hideHeader) {
      return "grid-rows-[1fr_min-content]";
    }

    if (hideFooter) {
      return "grid-rows-[min-content_1fr]";
    }

    return "grid-rows-[auto_1fr_auto]";
  }, [hideFooter, hideHeader]);

  return (
    <>
      <Head>
        <title>{title ?? "Amaranto"}</title>
        <meta
          name="description"
          content="Gestioná tus pacientes en tu clínica digital"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="Amaranto - Tu Clínica Digital"
          key="title"
        />
        <meta property="og:url" content="https://amaranto.chirotech.dev/" />
        <meta property="og:site_name" content="Amaranto - Tu Clínica Digital" />
        <meta property="og:title" content="Amaranto - Tu Clínica Digital" />
        <meta
          property="og:description"
          content="Gestioná tus pacientes en tu clínica digital"
        />
        <meta property="og:image" itemProp="image" content="/og_square.png" />
        <meta property="og:type" content="website" />
      </Head>
      <div className={`grid min-h-screen ${gridRowsStyle}`}>
        {!hideHeader && <Header />}
        <main>{children}</main>
        {!hideFooter && (
          <footer className="bg-fuchsia-950 py-8 text-white">
            <div className="container mx-auto flex items-center justify-between px-8">
              <a
                href="https://www.linkedin.com/company/99908623"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="w-8" src="/linkedin_icon.svg" />
              </a>
              <p className="text-right text-sm">
                Desarrollador por
                <br />
                ChiroTech
              </p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Layout;
