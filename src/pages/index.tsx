import Layout from "~/components/Layout";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: user } = useSession();

  return (
    <Layout>
      {user ? (
        <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
          <Link href="/patients">Patients</Link>
          <h2 className="mb-4 mt-8 text-2xl font-semibold">
            Create Clinical Record
          </h2>
        </div>
      ) : (
        <main>
          <header className="relative isolate flex h-96 items-center bg-[url('/doctor_and_patient_laptop.jpg')] bg-cover bg-right-top">
            <div className="absolute inset-0 bg-pink-300 opacity-80" />
            <div className="container z-10 mx-auto pl-4 md:pl-8">
              <h1 className="flex flex-col">
                <span className="text-6xl font-bold">Amaranto</span>
                <span className="inline-block bg-gradient-to-r from-pink-600 to-fuchsia-600 bg-clip-text py-1 text-5xl font-bold text-transparent">
                  Tu clinica digital
                </span>
              </h1>
            </div>
          </header>

          <section className="mt-8 py-4">
            <h1 className="text-center text-4xl font-bold">
              Gestioná tus pacientes
              <br />
              <b className="underline">en un solo lugar</b>
            </h1>
          </section>

          <section className="flex flex-col gap-4 items-center mt-8 py-8 bg-fuchsia-300">
            <h1 className="text-center text-4xl font-bold">
              Demo
            </h1>
            <video className="bg-gray-500">
              <source />
            </video>
          </section>

          <section className="">
            <div className="container mx-auto p-10">
              <h1 className="mb-8 p-4 text-4xl font-bold">Pricing</h1>

              <div className="flex items-center justify-center flex-col gap-4 md:flex-row">

                <div className="max-w-sm md:grid-cols[120px-auto-120px] grid gap-8 rounded-lg pb-8 shadow-lg ring-neutral-500 transition-all hover:ring md:w-1/3">
                  <div className="flex items-center rounded-lg rounded-b bg-neutral-400 py-4 pl-8">
                    <h2 className="text-2xl font-semibold">Free</h2>
                  </div>
                  <div className="px-8">
                    <p className="font-semibold">Todo en Free, más:</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <p>Resumen de historia clínica con IA</p>
                      <p>Soporte prioritario 24/7</p>
                    </div>
                  </div>
                  <button
                    className="mx-8 mt-4 rounded-full bg-neutral-300 py-2 font-semibold hover:bg-neutral-400"
                    onClick={() => void signIn()}
                  >
                    Sign me up!
                  </button>
                </div>

                <div className="max-w-sm grid-cols[120px-auto-120px] grid gap-8 rounded-lg  pb-8 shadow-lg ring-fuchsia-700 transition-all hover:ring md:w-1/3">
                  <div className="flex items-center rounded-lg rounded-b bg-fuchsia-700 py-4 pl-8">
                    <h2 className="text-2xl font-semibold text-white">Plus</h2>
                  </div>
                  <div className="px-8">
                    <p className="font-semibold">Todo en Free, más:</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <p>Resumen de historia clínica con IA</p>
                      <p>Soporte prioritario 24/7</p>
                    </div>
                  </div>
                  <button className="mx-8 mt-4 rounded-full bg-fuchsia-400 py-2 font-semibold hover:bg-fuchsia-500">
                    Contact me
                  </button>
                </div>

                <div className="max-w-sm grid-cols[120px-auto-120px] grid gap-8 rounded-lg  pb-8 shadow-lg ring-pink-600 transition-all hover:ring md:w-1/3">
                  <div className="flex items-center rounded-lg rounded-b bg-pink-600 py-4 pl-8">
                    <h2 className="text-2xl font-semibold">Enterprise</h2>
                  </div>
                  <div className="px-8">
                    <p className="font-semibold">Todo en Free, más:</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <p>Resumen de historia clínica con IA</p>
                      <p>Soporte prioritario 24/7</p>
                    </div>
                  </div>
                  <button className="mx-8 mt-4 rounded-full bg-pink-400 py-2 font-semibold hover:bg-pink-600">
                    Contact me
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )
      }
    </Layout >
  );
}
