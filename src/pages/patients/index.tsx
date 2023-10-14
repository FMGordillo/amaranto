import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import PatientsList from "~/components/PatientsList";
import { useRouter } from "next/router";
import ClinicalRecords from "~/components/ClinicalRecords";
import { useState } from "react";
import CreatePatientModal from "~/components/modals/CreatePatientModal";
import invariant from "tiny-invariant";

const Patients: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const [newPatientModal, setNewPatientModal] = useState(false);
  const patients = api.patients.getPatients.useQuery();

  const { patientId } = router.query;

  const handlePatientClick = (patientId: string | undefined) => {
    invariant(!!patientId, "patientId must be provided");
    void router.replace(`/patients?patientId=${patientId}`);
  };

  return (
    <Layout title="Pacientes - Amaranto">
      <div className="container mx-auto h-full max-h-full rounded-lg bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold">Patient List</h2>
          <button
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
            onClick={() => setNewPatientModal(true)}
          >
            Create patient
          </button>
        </div>

        <div className="grid h-full max-h-full grid-cols-2 gap-4 p-8 px-8">
          <PatientsList
            patients={patients.data}
            loading={patients.isLoading}
            handlePatientClick={handlePatientClick}
          />
          <ClinicalRecords patientId={patientId as string | undefined} />
        </div>

        <CreatePatientModal
          open={newPatientModal}
          onClose={() => setNewPatientModal(false)}
          onSubmit={patients.refetch}
        />
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
    props: { sessionData: session },
  };
};
