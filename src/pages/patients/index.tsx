import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import PatientsList from "~/components/PatientsList";
import { useRouter } from "next/router";
import ClinicalRecords from "~/components/ClinicalRecords";
import { Fragment, useEffect, useState } from "react";
import CreatePatientModal from "~/components/modals/CreatePatientModal";
import invariant from "tiny-invariant";
import { Transition } from "@headlessui/react";

const Patients = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });
  const [newPatientModal, setNewPatientModal] = useState(false);
  const patients = api.patients.getPatients.useQuery();

  const { patientId } = router.query;

  const handlePatientClick = (patientId: string | undefined) => {
    invariant(!!patientId, "patientId must be provided");
    void router.replace(`/patients?patientId=${patientId}`);
  };

  useEffect(() => {
    const currentPatient = patients.data?.findIndex(
      (patient) => patient.id === patientId,
    );

    if (currentPatient === -1) void router.replace("/patients");
  }, [router.query.patientId, patients.data]);

  return (
    <Layout title="Pacientes - Amaranto">
      <div className="relative h-full py-4">
        <Transition
          show={status === "loading"}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <img className="z-20 w-6 animate-spin" src="/loading.svg" />
            <div className="absolute inset-0 bg-pink-500 opacity-50" />
          </div>
        </Transition>

        <div className="container mx-auto h-full rounded-lg bg-white p-8 shadow">
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="mb-4 text-2xl font-semibold">Patient List</h2>
            <button
              className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:cursor-pointer hover:bg-pink-600"
              onClick={() => setNewPatientModal(true)}
            >
              Create patient
            </button>
          </div>

          {patients.data?.length === 0 ? (
            <div className="relative isolate -mt-8 flex h-full items-center justify-center rounded-md px-8">
              <h1 className="z-10">Create a patient</h1>
              <div className="absolute inset-0 bg-pink-50 blur" />
            </div>
          ) : (
            <div className="grid h-full max-h-full grid-cols-1 gap-4 p-8 px-8 md:grid-cols-2">
              <PatientsList
                patients={patients.data}
                loading={patients.isLoading}
                handlePatientClick={handlePatientClick}
                onSubmit={patients.refetch}
              />
              <ClinicalRecords patientId={patientId as string | undefined} />
            </div>
          )}
          <CreatePatientModal
            open={newPatientModal}
            onClose={() => setNewPatientModal(false)}
            onSubmit={patients.refetch}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Patients;
