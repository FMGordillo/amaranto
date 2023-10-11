import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "~/components/Header";
import { api } from "~/utils/api";

export default function Patients() {
  const { data: session } = useSession();
  const navigate = useRouter();
  const patients = api.patients.getPatients.useQuery();

  if (!session) {
    return <span>Access denied</span>;
  }

  return (
    <>
      <Head>
        <title>Pacientes - Amaranto</title>
      </Head>
      <div className="h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 mt-8 text-2xl font-semibold">Patient List</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!patients.isLoading &&
                patients.data &&
                patients.data.length > 0 &&
                patients.data.map((patient) => (
                  <tr key={patient.id}>
                    <Link href={`/patients/${patient.id}/records`}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {patient.name}
                      </td>
                    </Link>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            navigate.push(`/patients/${patient.id}/new-record`)
                          }
                        >
                          Create Record
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
