import Button from "./Button";
import CreateRecordModal from "./modals/CreateRecordModal";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import invariant from "tiny-invariant";

type ClinicalRecordsProps = {
  patientId: string | undefined;
};
export default function ClinicalRecords({ patientId }: ClinicalRecordsProps) {
  const router = useRouter();
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [newRecordModal, setNewRecordModal] = useState(false);
  const [summary, setSummary] = useState<string | undefined>();

  const page = parseInt(router.query.page as string) || 1;

  const { data, refetch } = api.clinicalRecords.getByPatient.useQuery(
    { patientId: patientId!, page },
    { enabled: !!patientId },
  );

  const handleGoBack = () => {
    void router.replace("/patients");
  };

  const handlePageChange = (page: number) => {
    invariant(data?.pages, "pages should be defined");

    if (page > data?.pages.length || page <= 0) return;
    router.query.page = page.toString();
    router.replace(router);
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
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ patientId }),
      });
      const responseText = await response.text();
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
      <div className="my-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 rounded-md border px-4 py-2"
            onClick={handleGoBack}
          >
            <img src="/back.svg" className="w-6" />
          </button>
          <h2 className="text-2xl font-semibold">Historia clinica</h2>
        </div>
        <button
          className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
          onClick={() => setNewRecordModal(true)}
        >
          Create Record
        </button>
      </div>

      {patientId && data?.records && data.records?.length > 0 ? (
        <>
          {data.totalRecords > 10 ? (
            <Button
              loading={loadingBrief}
              aria-disabled={loadingBrief}
              className="mx-auto mb-6 block"
              variant="outline"
              onClick={() => void handleBriefing()}
            >
              Generate briefing
            </Button>
          ) : (
            <blockquote className="mb-8 text-center text-neutral-700">
              After the 10th record, AI will be enabled to you
            </blockquote>
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

          {data.records.map((record) => (
            <div
              key={record.id}
              className="mb-2 rounded-lg bg-gray-100 px-4 py-2"
            >
              <p className="text-right text-sm">
                {new Date(record.createdAt).toLocaleDateString()}
              </p>
              <p className="whitespace-pre-line">{record.message}</p>
            </div>
          ))}

          {data.visiblePages.length > 0 && (
            <div className="flex justify-center gap-2">
              <Button
                className={!data.hasPreviousPage ? "bg-neutral-400" : ""}
                aria-disabled={!data.hasPreviousPage}
                onClick={() => handlePageChange(page - 1)}
              >
                {"<"}
              </Button>

              {data.visiblePages.map((currentPage) => (
                <Button
                  className={currentPage === page ? "bg-pink-500" : ""}
                  onClick={() => handlePageChange(currentPage)}
                  key={currentPage}
                >
                  {currentPage}
                </Button>
              ))}

              <Button
                aria-disabled={!data.hasNextPage}
                className={!data.hasNextPage ? "bg-neutral-400" : ""}
                onClick={() => handlePageChange(page + 1)}
              >
                {">"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <blockquote className="text-center text-neutral-700">
          No registers found for the user
        </blockquote>
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
