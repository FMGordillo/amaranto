import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import CreatePatientModal from "~/components/modals/CreatePatientModal";
import AppLayout from "~/components/AppLayout";
import { useSearchParams } from "next/navigation";
import Pagination from "~/components/Pagination";
import LoadingPatient from "~/components/LoadingPatient";
import invariant from "tiny-invariant";

const Patients = () => {
  const router = useRouter();
  const params = useSearchParams();

  const patientId = params.get("patientId");
  const page = params.get("page") ?? "1";

  const [newPatientModal, setNewPatientModal] = useState(false);
  const { refetch, data, isLoading } = api.patients.getPatients.useQuery({
    page,
  });

  const handlePatientClick = (patientId: string | undefined) => {
    invariant(!!patientId, "patientId must be provided");
    void router.push(`/app/patients/${patientId}`);
  };

  return (
    <Layout title="Pacientes - Amaranto">
      <AppLayout>
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold">Lista de pacientes</h2>
          <button
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:cursor-pointer hover:bg-pink-600"
            onClick={() => setNewPatientModal(true)}
          >
            Crear paciente
          </button>
        </div>

        {data && (
          <>
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading && <LoadingPatient />}
                {!isLoading &&
                  data &&
                  data.patients.length > 0 &&
                  data.patients.map((patient) => (
                    <tr
                      key={patient?.id}
                      className={`hover:cursor-pointer hover:bg-fuchsia-50 ${patient?.id === patientId
                        ? "bg-fuchsia-200"
                        : "bg-transparent"
                        }`}
                      onClick={() => handlePatientClick(patient?.id)}
                    >
                      <td className="flex justify-between whitespace-nowrap px-6 py-4 underline-offset-4 transition-all">
                        <span className="select-none">{patient?.name}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <Pagination
              visiblePages={data?.visiblePages}
              hasPreviousPage={data?.hasPreviousPage}
              hasNextPage={data?.hasNextPage}
              pages={data?.pages}
            />
          </>
        )}

        <CreatePatientModal
          open={newPatientModal}
          onClose={() => setNewPatientModal(false)}
          onSubmit={() => void refetch()}
        />
      </AppLayout>
    </Layout>
  );
};

export default Patients;
