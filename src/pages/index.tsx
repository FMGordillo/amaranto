import Layout from "~/components/Layout";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import FAQ from "~/components/FAQ";

type FeatureImage = "patients" | "records" | "ai" | undefined;

const FeatureImages: Record<Exclude<FeatureImage, undefined>, string> = {
  patients: "/create_patient.gif",
  records: "/create_record.gif",
  ai: "/create_summary.gif",
};

export default function Home() {
  const [currentImage, setCurrentImage] = useState<FeatureImage>();
  const router = useRouter();
  const { data: user, status } = useSession();

  const handleFeatureHover = (image: Exclude<FeatureImage, undefined>) => {
    setCurrentImage(image);
  };

  // TODO: add a loading screen, or Suspense?
  if (status === "loading") {
    return <span>loading...</span>;
  } else if (status === "authenticated") {
    void router.replace("/patients");
  } else {
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
                      Tu clinica digital
                    </span>
                  </span>
                </h1>
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
                      Gestiona tus pacientes
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
                  className={`hidden transition md:block ${
                    currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  src={FeatureImages[currentImage ?? "patients"]}
                />
              </div>
            </section>

            <section className="flex flex-col items-center gap-4 py-32">
              <h1 className="mb-8 select-none text-center text-4xl font-bold">
                Demostración
              </h1>
              <video muted controls className="w-1/2 ring-8 ring-pink-800">
                <source src="/main_platform.mp4" />
              </video>
            </section>

            <section className="container mx-auto py-32">
              <h1 className="mb-8 p-4 text-center text-4xl font-bold">
                Tarifas
              </h1>

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
                        <span>Soporte basico</span>
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
                    Registrame a la beta 📝
                  </a>
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
                        <span>Resumen de paciente</span>
                      </li>
                      <li className="flex gap-2">
                        <img className="w-4" src="/check.svg" />
                        <span>Importá tus historias clínicas en papel</span>
                      </li>
                    </ul>
                    <p className="pt-3 text-center font-semibold">
                      Potenciado con Inteligencia Artificial
                    </p>
                  </div>
                  <button className="mx-8 rounded-full bg-fuchsia-400 py-2 font-semibold hover:bg-fuchsia-500">
                    Próximamente
                  </button>
                </div>

                <div className="grid-cols[120px-auto-120px] grid max-w-sm gap-8 rounded-lg  pb-8 shadow-lg ring-pink-600 transition-all hover:ring md:w-1/3">
                  <div className="flex items-center rounded-lg rounded-b bg-pink-600 py-4 pl-8">
                    <h2 className="text-2xl font-semibold">Enterprise</h2>
                  </div>
                  <div className="px-8">
                    <p className="font-semibold">Todo en Free, más:</p>
                    <ul className="mt-4 flex flex-col gap-2">
                      <li className="flex gap-2">
                        <img className="w-4" src="/check_premium.svg" />
                        <span>Tus datos en tu centro</span>
                      </li>
                      <li className="flex gap-2">
                        <img className="w-4" src="/check_premium.svg" />
                        <span>Soporte para migraciones</span>
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

            <section className="flex flex-col items-center gap-4 py-32">
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
                          para clínicas en la Unión Europea, y el resto del
                          mundo. Si la seguridad es tu prioridad,{" "}
                          <a
                            className="text-blue-500 underline"
                            href="mailto:facundo@chirotech.dev"
                            rel="noreferrer noopener"
                            target="_blank"
                          >
                            contacta con nosotros
                          </a>{" "}
                          para bases de datos aisladas para tu clínica, o usar
                          tus propios servidores.
                        </span>
                      ),
                      title: "¿Es seguro?",
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
          </div>
        )}
      </Layout>
    );
  }
}
