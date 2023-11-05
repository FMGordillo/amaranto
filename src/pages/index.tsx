import FAQ from "~/components/FAQ";
import Layout from "~/components/Layout";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "next-i18next";

type FeatureImage = "patients" | "records" | "ai" | undefined;

const FeatureImages: Record<Exclude<FeatureImage, undefined>, string> = {
  patients: "/create_patient.gif",
  records: "/create_record.gif",
  ai: "/create_summary.gif",
};

export default function Home() {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState<FeatureImage>();
  const { data: user } = useSession();

  const handleFeatureHover = (image: Exclude<FeatureImage, undefined>) => {
    setCurrentImage(image);
  };

  // TODO: add a loading screen, or Suspense?
  // if (status === "loading") {
  //   return <span>loading...</span>;
  // } else if (status === "authenticated") {
  //   void router.replace("/patients");
  // } else {
  return (
    <Layout>
      {user ? (
        <div className="container mx-auto mt-8 rounded-lg bg-white p-4 shadow">
          <Link href="/patients">Patients</Link>
          <h2 className="mb-4 mt-8 text-2xl font-semibold">
            Create Clinical Record
          </h2>
        </div>
      ) : (
        <div>
          <header className="relative isolate flex h-96 items-center">
            <div className="absolute inset-0 bg-[url('/background.png')] bg-cover" />
            <div className="container z-10 mx-auto pl-4 md:pl-8">
              <h1 className="select-none">
                <span className="bg-neutral-950/50 px-4 text-6xl font-bold text-white">
                  Amaranto
                </span>
                <br />
                <br />
                <span className="inline-block bg-neutral-950/50 px-4">
                  <span className="inline-block bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text py-1 text-5xl font-bold text-transparent">
                    {t("title_2")}
                  </span>
                </span>
              </h1>
            </div>
          </header>

          <section className="select-none py-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              {t("section-features.title")}
            </h1>

            <div className="mx-auto grid max-w-5xl grid-cols-[1fr] items-center justify-center gap-4 rounded-md border md:grid-cols-[1fr_1fr]">
              <ul className="flex flex-col gap-4">
                <li
                  onMouseEnter={() => handleFeatureHover("patients")}
                  className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-lg border bg-fuchsia-200 px-6 py-4 ring-fuchsia-700 transition-all hover:ring"
                >
                  <div className="inline-block rounded-full bg-pink-100 p-1">
                    <img className="w-8 p-1" src="/person-add.svg" />
                  </div>
                  <span className="text-xl font-bold">
                    {t("section-features.patients")}
                  </span>
                </li>

                <li
                  onMouseEnter={() => handleFeatureHover("records")}
                  className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-lg border bg-fuchsia-200 px-6 py-4 ring-fuchsia-700 transition-all hover:ring"
                >
                  <div className="inline-block rounded-full bg-pink-100 p-1">
                    <img className="w-8 p-1" src="/book.svg" />
                  </div>
                  <span className="text-xl font-bold">
                    {t("section-features.visits")}
                  </span>
                </li>

                <li
                  onMouseEnter={() => handleFeatureHover("ai")}
                  className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-lg border bg-fuchsia-200 px-6 py-4 ring-fuchsia-700 transition-all hover:ring"
                >
                  <div className="inline-block rounded-full bg-pink-100 p-1">
                    <img className="w-8 p-1" src="/document.svg" />
                  </div>
                  <span className="text-xl font-bold">
                    {t("section-features.visits")}{" "}
                    <span className="text-bold rounded-2xl border-2 border-fuchsia-300 bg-fuchsia-50 px-2 font-bold text-fuchsia-700">
                      NEW
                    </span>
                  </span>
                </li>
              </ul>

              <img
                className={`hidden transition md:block ${
                  currentImage ? "opacity-100" : "opacity-0"
                }`}
                src={FeatureImages[currentImage ?? "patients"]}
              />
            </div>
          </section>

          <section className="flex flex-col items-center gap-4 py-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              {t("section-demo.title")}
            </h1>
            <video
              muted
              controls
              className="min-w-[520px] px-4 lg:w-1/2 xl:w-1/3"
            >
              <source src="/main_platform.mp4" />
            </video>
          </section>

          <section className="container mx-auto py-32">
            <h1 className="mb-8 p-4 text-center text-4xl font-bold">
              {t("section-pricing.title")}
            </h1>

            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="md:grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg pb-8 shadow-lg ring-purple-500 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-purple-400 py-4 pl-8">
                  <h2 className="text-2xl font-semibold">
                    {t("section-pricing.free-tier.title")}
                  </h2>
                </div>
                <div className="px-8">
                  <ul className="mt-4 flex list-inside flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>{t("section-pricing.free-tier.feature-1")}</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>{t("section-pricing.free-tier.feature-2")}</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>{t("section-pricing.free-tier.feature-3")}</span>
                    </li>
                  </ul>
                </div>
                <a
                  className="mx-8 mt-4 rounded-full bg-purple-300 py-2 text-center font-semibold hover:bg-purple-400"
                  // onClick={() => void signIn()}
                  href="https://share-eu1.hsforms.com/1QL5wqKPmRj2mNUIpLrEItg2dasdu"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t("section-pricing.free-tier.cta")}{" "}
                  <span role="img" aria-label="memo">
                    📝
                  </span>
                </a>
              </div>

              <div className="grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg  pb-8 shadow-lg ring-fuchsia-700 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-fuchsia-700 py-4 pl-8">
                  <h2 className="text-2xl font-semibold text-white">
                    {t("section-pricing.plus-tier.title")}
                  </h2>
                </div>
                <div className="flex flex-col gap-4 px-8">
                  <p className="font-semibold">
                    {t("section-pricing.plus-tier.subtitle")}
                  </p>
                  <ul className="flex list-inside flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check.svg" />
                      <span>{t("section-pricing.plus-tier.feature-1")}</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check.svg" />
                      <span>{t("section-pricing.plus-tier.feature-2")}</span>
                    </li>
                  </ul>
                  <p className="pt-3 text-center font-semibold">
                    <span>{t("section-pricing.plus-tier.feature-3")}</span>
                  </p>
                </div>
                <button className="mx-8 rounded-full bg-fuchsia-400 py-2 font-semibold hover:bg-fuchsia-500">
                  <span>{t("section-pricing.plus-tier.cta")}</span>
                </button>
              </div>

              <div className="grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg  pb-8 shadow-lg ring-pink-600 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-pink-600 py-4 pl-8">
                  <h2 className="text-2xl font-semibold">
                    {t("section-pricing.enterprise-tier.title")}
                  </h2>
                </div>
                <div className="px-8">
                  <p className="font-semibold">
                    {t("section-pricing.enterprise-tier.subtitle")}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>
                        {t("section-pricing.enterprise-tier.feature-1")}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>
                        {t("section-pricing.enterprise-tier.feature-2")}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>
                        {t("section-pricing.enterprise-tier.feature-3")}
                      </span>
                    </li>
                  </ul>
                </div>
                <a
                  className="mx-8 mt-4 rounded-full bg-pink-400 py-2 text-center font-semibold hover:bg-pink-600"
                  href="mailto:facundo@chirotech.dev"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t("section-pricing.enterprise-tier.cta")}
                </a>
              </div>
            </div>
          </section>

          <section className="flex flex-col items-center gap-4 py-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              {t("section-faq.title")}
            </h1>

            <div className="w-full max-w-lg">
              <FAQ
                data={[
                  {
                    content: t("section-faq.question-1.content"),
                    title: t("section-faq.question-1.title"),
                  },
                  {
                    content: (
                      <span>
                        {t("section-faq.question-2.content-1")}{" "}
                        <a
                          className="text-blue-500 underline"
                          href="mailto:facundo@chirotech.dev"
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {t("section-faq.question-2.content-link")}
                        </a>{" "}
                        {t("section-faq.question-2.content-2")}
                      </span>
                    ),
                    title: t("section-faq.question-2.title"),
                  },
                  {
                    content: t("section-faq.question-3.content"),
                    title: t("section-faq.question-3.title"),
                  },
                  {
                    content: t("section-faq.question-4.content"),
                    title: t("section-faq.question-4.title"),
                  },
                ]}
              />
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
  // }
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
