import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import AppLayout from "~/components/AppLayout";
import Layout from "~/components/Layout";
import LoadingPatient from "~/components/LoadingPatient";
import Pagination from "~/components/Pagination";
import CreateRecordModal from "~/components/modals/CreateRecordModal";
import { api } from "~/utils/api";
import dayjs from 'dayjs'

const RecordsPage: NextPage = () => {
  const router = useRouter();
  const query = useSearchParams();
  const [newRecordModal, setNewRecordModal] = useState(false);

  const page = query.get("page") ?? "1";

  const { refetch, isLoading, data } = api.clinicalRecords.getAll.useQuery({
    page,
  });

  return (
    <Layout>
      <AppLayout>
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold">Lista de clinicas</h2>
          <button
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:cursor-pointer hover:bg-pink-600"
            onClick={() => setNewRecordModal(true)}
          >
            Crear visita
          </button>
        </div>

        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Fecha de registro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && <LoadingPatient />}
            {!isLoading &&
              data?.records &&
              data.records.length > 0 &&
              data.records.map((record) => (
                <tr
                  key={record.data.id}
                  className="hover:text-gray-90 hover:cursor-pointer hover:bg-fuchsia-50"
                  onClick={() =>
                    void router.push(`/app/records/${record.data.id}`)
                  }
                >
                  <td className="whitespace-nowrap px-6 py-4 underline-offset-4 transition-all">
                    {record.patient?.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 underline-offset-4 transition-all">
                    {dayjs(record.data.createdAt).format('llll')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {data && (
          <Pagination
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            pages={data.pages}
            visiblePages={data.visiblePages}
          />
        )}

        <CreateRecordModal
          open={newRecordModal}
          onClose={() => setNewRecordModal(false)}
          onSubmit={() => void refetch()}
        />
      </AppLayout>
    </Layout>
  );
};

export default RecordsPage;
