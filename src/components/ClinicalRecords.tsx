import Button from "./Button";
import CreateRecordModal from "./modals/CreateRecordModal";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";

type ClinicalRecordsProps = {
  patientId: string | undefined;
};
export default function ClinicalRecords({ patientId }: ClinicalRecordsProps) {
  const router = useRouter();
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [newRecordModal, setNewRecordModal] = useState(false);
  const [summary, setSummary] = useState<string | undefined>();

  const { data: records, refetch } = api.clinicalRecords.getByPatient.useQuery(
    patientId!,
    { enabled: !!patientId },
  );

  const handleGoBack = () => {
    void router.replace("/patients");
  };

  const handleBriefing = async () => {
    const url = new URL(
      "/chatgpt/clinical_records",
      env.NEXT_PUBLIC_BACKEND_URL,
    );

    try {
      setLoadingBrief(true);
      const response = await fetch(url, {
        headers: {
          'Content-Type': "application/json",
        },
        method: "POST",
        body: JSON.stringify({ patientId }),
      });
      const responseText = await response.text()
      setSummary(responseText);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBrief(false);
    }
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

      {patientId && records && records?.length > 0 && (
        <>
          {records.length > 10 && (
            <Button
              loading={loadingBrief}
              aria-disabled={loadingBrief}
              className="mx-auto mb-6 block"
              variant="outline"
              onClick={() => void handleBriefing()}
            >
              Generate briefing
            </Button>
          )}

          <Transition
            appear
            show={loadingBrief}
            as={"div"}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0"
          >
            <span>Loading...</span>
          </Transition>

          <Transition
            appear
            show={!loadingBrief && !!summary}
            as={"div"}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0"
          >
            <blockquote className="m-1 mb-4 whitespace-pre-line rounded-lg bg-gray-200 px-8 py-4 ring">
              {summary}
            </blockquote>
          </Transition>

          {records.map((record) => (
            <div key={record.id} className="mb-2 rounded-lg bg-gray-100 p-2">
              <p className="text-sm">
                {new Date(record.createdAt).toLocaleDateString()}
              </p>
              <p className="whitespace-pre-line">{record.message}</p>
            </div>
          ))}
        </>
      )}

      <CreateRecordModal
        open={newRecordModal}
        onClose={() => setNewRecordModal(false)}
        onSubmit={refetch}
        patientId={patientId}
      />
    </div>
  );
}
