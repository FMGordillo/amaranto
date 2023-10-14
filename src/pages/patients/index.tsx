import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

const Patients: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ sessionData }) => {

  const navigate = useRouter();
  const patients = api.patients.getPatients.useQuery();

  if (!sessionData) {
    return <span>Access denied</span>;
  }

  return (
    <Layout title="Pacientes - Amaranto">
      <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
        <div className="my-8 flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold">Patient List</h2>
          <Link href="/patients/new-patient">
            <button className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600">
              Create patient
            </button>
          </Link>
        </div>
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
            {patients.isLoading && (
              <tr className="animate-pulse">
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-block h-6 w-28 rounded bg-slate-500" />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-4">
                    <span className="inline-block h-6 w-28 rounded bg-slate-500" />
                    <span className="inline-block h-6 w-9 rounded bg-slate-500" />
                    <span className="inline-block h-6 w-16 rounded bg-slate-500" />
                  </div>
                </td>
              </tr>
            )}
            {!patients.isLoading &&
              patients.data &&
              patients.data.length > 0 &&
              patients.data.map((patient) => (
                <tr key={patient.id}>
                  <Link href={`/patients/${patient.id}/records`}>
                    <td className="whitespace-nowrap px-6 py-4 underline-offset-4 transition-all hover:underline">
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
                      {/*
                      <button className="text-yellow-600 hover:text-yellow-900">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Remove
                      </button>
                      */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Patients;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { sessionData: session }
  };
};
