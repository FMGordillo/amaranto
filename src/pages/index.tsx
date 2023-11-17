import FAQ from "~/components/FAQ";
import Layout from "~/components/Layout";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";

type FeatureImage = "patients" | "records" | "ai" | undefined;

const FeatureImages: Record<Exclude<FeatureImage, undefined>, string> = {
  patients: "/create_patient.gif",
  records: "/create_record.gif",
  ai: "/create_summary.gif",
};

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [currentImage, setCurrentImage] = useState<FeatureImage>('records');

  const handleFeatureHover = (image: Exclude<FeatureImage, undefined>) => {
    setCurrentImage(image);
  };

  useEffect(() => {
    if (status === "authenticated") {
      void router.replace("/app");
    }
  }, [router, status]);

  return (
    <Suspense fallback="loading">
      <Layout>
        <>
          <header className="relative isolate flex h-96 items-center">
            <div className="absolute inset-0 bg-[url('/background.png')] bg-cover" />
            <div className="container flex gap-4 justify-evenly items-center z-10 mx-auto pl-4 md:pl-8">
              <h1 className="select-none">
                <span className="bg-neutral-950/50 px-4 text-6xl font-bold text-white">
                  Amaranto
                </span>
                <br />
                <br />
                <span className="inline-block bg-neutral-950/50 px-4">
                  <span className="inline-block bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text py-1 text-5xl font-bold text-transparent">
                    Tu clinica digital
                  </span>
                </span>
              </h1>
              <div className="h-80 hidden md:block">
                <img className="rounded-lg h-full" src="/doctor_and_patient.png" />
              </div>
            </div>
          </header>

          <section className="select-none py-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              Qué puede hacer
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
                    Gestionar tus pacientes
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
                    Registra tus consultas
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
                    Genera resumen de historias clínicas{" "}
                    <span className="text-bold rounded-2xl border-2 border-fuchsia-300 bg-fuchsia-50 px-2 font-bold text-fuchsia-700">
                      NEW
                    </span>
                  </span>
                </li>
              </ul>

              <img
                className={`hidden transition md:block ${currentImage ? "opacity-100" : "opacity-0"
                  }`}
                src={FeatureImages[currentImage ?? "patients"]}
              />
            </div>
          </section>

          <section className="flex flex-col items-center gap-4 pb-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              Demostración
            </h1>
            <video
              muted
              controls
              className="min-w-[520px] px-4 lg:w-1/2 xl:w-1/3"
            >
              <source src="/main_platform.mp4" />
            </video>
          </section>

          <section className="container mx-auto pb-32">
            <h1 className="mb-8 p-4 text-center text-4xl font-bold">Tarifas</h1>

            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="md:grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg pb-8 shadow-lg ring-purple-500 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-purple-400 py-4 pl-8">
                  <h2 className="text-2xl font-semibold">Beta cerrada</h2>
                </div>
                <div className="px-8">
                  <ul className="mt-4 flex list-inside flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>Pacientes ilimitados</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>Historias clínicas ilimitadas</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_free.svg" />
                      <span>Soporte básico</span>
                    </li>
                  </ul>
                </div>
                <button
                  className="mx-8 mt-4 rounded-full bg-purple-300 py-2 text-center font-semibold hover:bg-purple-400"
                  onClick={() => void signIn(undefined, {
                    callbackUrl: '/subscribe?plan=basic',
                  })}
                >
                  Registrame a la beta{" "}
                  <span role="img" aria-label="memo">
                    📝
                  </span>
                </button>
              </div>

              <div className="grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg  pb-8 shadow-lg ring-fuchsia-700 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-fuchsia-700 py-4 pl-8">
                  <h2 className="text-2xl font-semibold text-white">Plus</h2>
                </div>
                <div className="flex flex-col gap-4 px-8">
                  <p className="font-semibold">Todo en Free, más:</p>
                  <ul className="flex list-inside flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check.svg" />
                      <span>Resumen de pacientes</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check.svg" />
                      <span>Digitalizá tus historias clínicas</span>
                    </li>
                  </ul>
                  <p className="pt-3 text-center font-semibold">
                    <span>Potenciado con Inteligencia Artificial</span>
                  </p>
                </div>

                <button
                  className="mx-8 mt-4 rounded-full bg-fuchsia-400 py-2 text-center font-semibold hover:bg-fuchsia-500"
                  aria-disabled="true"
                // onClick={() => void signIn(undefined, {
                //   callbackUrl: '/subscribe?plan=pro',
                // })}
                >
                  Registrame a Plus<br />(proximamente)
                </button>
              </div>

              <div className="grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg  pb-8 shadow-lg ring-pink-600 transition-all hover:ring md:w-1/3">
                <div className="flex items-center rounded-lg rounded-b bg-pink-600 py-4 pl-8">
                  <h2 className="text-2xl font-semibold">
                    Grandes consultorios
                  </h2>
                </div>
                <div className="px-8">
                  <p className="font-semibold">Todo en Plus, más:</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>Tus datos en tu centro médico</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>Soporte técnico para migraciones</span>
                    </li>
                    <li className="flex gap-2">
                      <img className="w-4" src="/check_premium.svg" />
                      <span>Soporte prioritario 24/7</span>
                    </li>
                  </ul>
                </div>
                <a
                  className="mx-8 mt-4 rounded-full bg-pink-400 py-2 text-center font-semibold hover:bg-pink-600"
                  href="mailto:facundo@chirotech.dev"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Contáctanos
                </a>
              </div>
            </div>
          </section>

          <section className="flex flex-col items-center gap-4 pb-32">
            <h1 className="mb-8 select-none text-center text-4xl font-bold">
              Preguntas frecuentes
            </h1>

            <div className="w-full max-w-lg">
              <FAQ
                data={[
                  {
                    content:
                      "Es una plataforma digital para profesionales médicos a cargo de gestionar consultas enriquecido con herramientas que facilitan su adopción, como resumen o digitalización de historias clínicas",
                    title: "¿Qué es Amaranto?",
                  },
                  {
                    content: (
                      <span>
                        Si, tenemos copias de seguridad guardados por región:
                        para clínicas en la Unión Europea, y el resto del mundo.
                        Si la seguridad es tu prioridad,{" "}
                        <a
                          className="text-blue-500 underline"
                          href="mailto:facundo@chirotech.dev"
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          contacta con nosotros
                        </a>{" "}
                        para bases de datos aisladas para tu clínica, o usar tus
                        propios servidores.
                      </span>
                    ),
                    title:
                      "¿Es seguro?",
                  },
                  {
                    content:
                      "¡Totalmente! Encriptamos la información de punta a punta, no tenemos acceso a la información al llegar a nuestros servidores, incluso en la Beta.",
                    title:
                      "Si uso la plataforma en Beta ¿Mis datos estarán seguros?",
                  },
                  {
                    content:
                      "Estamos mejorando la experiencia de usuario de la plataforma, en conjunto con ampliar la resilencia de los servidores. Aún no tenemos fecha definida, depende cuantos inscriptos tengamos en el programa Beta, y la interacción que tengan sobre el mismo",
                    title: "¿Cuándo se lanzará la plataforma?",
                  },
                ]}
              />
            </div>
          </section>
        </>
      </Layout>
    </Suspense>
  );
}
