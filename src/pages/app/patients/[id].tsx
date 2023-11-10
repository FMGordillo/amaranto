import { Transition } from "@headlessui/react";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import invariant from "tiny-invariant";
import AppLayout from "~/components/AppLayout";
import Button from "~/components/Button";
import Layout from "~/components/Layout";
import { useNotification } from "~/components/Notification";
import CreateRecordModal from "~/components/modals/CreateRecordModal";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const PatientPageById: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const addNotification = useNotification();
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [summary, setSummary] = useState<string | undefined>();
  const [openCreateRecordModal, setOpenCreateRecordModal] = useState(false);
  const { refetch, isLoading, data } = api.patients.getPatientById.useQuery(
    props.patientId as string,
  );

  const patient = data?.[0]?.patients;
  const hasClinicalRecords = data && data?.length > 1;

  const handleRecordCreate = () => {
    setOpenCreateRecordModal(false);
    void refetch();
  };

  const handleBriefing = async () => {
    const url = new URL(
      "/chatgpt/clinical_records",
      env.NEXT_PUBLIC_BACKEND_URL,
    );
    try {
      setLoadingBrief(true);
      invariant(patient?.id, "patient id should be defined");

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ patientId: patient.id }),
      });
      const responseText = await response.text();
      setSummary(responseText);

      addNotification({
        type: "success",
        message: "Resumen generador exitosamente",
      });
    } catch (error) {
      console.log(error);
      addNotification({
        title: "Error",
        type: "error",
        message: "Error al generar resumen",
      });
    } finally {
      setLoadingBrief(false);
    }
  };

  return (
    <Layout>
      <AppLayout>
        <div className="mb-4 flex items-center justify-between">
          {!isLoading && patient && (
            <h1 className="text-2xl">
              Paciente: <span className="font-bold">{patient.name}</span>
            </h1>
          )}

          <button
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:cursor-pointer hover:bg-pink-600"
            onClick={() => setOpenCreateRecordModal(true)}
          >
            Registrar visita
          </button>
        </div>

        <div className="mb-8 flex justify-center">
          <Button
            className="flex items-center gap-2"
            onClick={() => void handleBriefing()}
            variant="outline"
          >
            Generar resumen
            {loadingBrief && (
              <img className="w-6 animate-spin" src="/loading.svg" />
            )}{" "}
          </Button>
        </div>

        <Transition
          appear
          show={!loadingBrief && !!summary}
          as="div"
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

        {!isLoading && hasClinicalRecords && (
          <ul className="flex flex-col gap-4">
            {data.map(({ clinicalRecords }) => (
              <li className="bg-fuchsia-50" key={clinicalRecords?.id}>
                <blockquote className="max-w-prose whitespace-pre-line">
                  {clinicalRecords?.message}
                </blockquote>

                <p className="font-light">
                  Fecha de creación:{" "}
                  {clinicalRecords?.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <CreateRecordModal
          open={openCreateRecordModal}
          onClose={() => setOpenCreateRecordModal(false)}
          onSubmit={handleRecordCreate}
          patient={patient}
        />
      </AppLayout>
    </Layout>
  );
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const patientId = context.params?.id ?? "";

  return {
    props: {
      patientId,
    },
  };
};

export default PatientPageById;
