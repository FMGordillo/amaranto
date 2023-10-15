import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import CreateRecordModal from "./modals/CreateRecordModal";

type ClinicalRecordsProps = {
  patientId: string | undefined;
};
export default function ClinicalRecords({ patientId }: ClinicalRecordsProps) {
  const router = useRouter();
  const [newRecordModal, setNewRecordModal] = useState(false);
  const { data: records, refetch } = api.clinicalRecords.getByPatient.useQuery(
    patientId!,
    { enabled: !!patientId },
  );

  const handleGoBack = () => {
    void router.replace("/patients");
  };

  if (!patientId)
    return (
      <div className="relative flex h-full items-center justify-center rounded-md px-8">
        <h1 className="z-10">Select a patient</h1>
        <div className="absolute inset-0 bg-pink-50 blur" />
      </div>
    );

  return (
    <div className="max-h-full overflow-y-auto">
      <button
        className="flex items-center gap-2 rounded-md border px-4 py-2"
        onClick={handleGoBack}
      >
        <img src="/back.svg" className="w-6" />
        <span>Back</span>
      </button>
      <div className="my-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Historia clinica</h2>
        <button
          className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
          onClick={() => setNewRecordModal(true)}
        >
          Create Record
        </button>
      </div>
      {records &&
        records?.length > 0 &&
        records.map((record) => (
          <div key={record.id} className="mb-2 rounded-lg bg-gray-100 p-2">
            <p className="text-sm">{new Date(record.createdAt).toLocaleDateString()}</p>
            <p className="whitespace-pre-line">{record.message}</p>
          </div>
        ))}

      <CreateRecordModal
        open={newRecordModal}
        onClose={() => setNewRecordModal(false)}
        onSubmit={refetch}
        patientId={patientId}
      />
    </div>
  );
}
