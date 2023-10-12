import Layout from "~/components/Layout";
import Link from "next/link";

export default function Home() {

  return (
    <Layout>
      <div className="container mx-auto mt-4 p-4 bg-white shadow rounded-lg">
        <Link href="/patients">Patients</Link>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Create Clinical Record</h2>
      </div>
    </Layout>
  );
}

