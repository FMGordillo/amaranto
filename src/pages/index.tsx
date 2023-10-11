import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Header from "~/components/Header";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Amaranto</title>
        <meta name="description" content="Tu clínica digital" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto mt-4 p-4 bg-white shadow rounded-lg">
          <Link href="/patients">Patients</Link>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Create Clinical Record</h2>
          <form>
          </form>
        </div>
      </div>
    </>
  );
}

