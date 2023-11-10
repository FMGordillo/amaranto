import { ResultSet } from "@libsql/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import AppLayout from "~/components/AppLayout";
import Layout from "~/components/Layout";
import CreatePatientModal, {
  Patient,
} from "~/components/modals/CreatePatientModal";
import CreateRecordModal, {
  ClinicalRecord,
} from "~/components/modals/CreateRecordModal";

const Box: FunctionComponent<PropsWithChildren<{ action: () => void }>> = ({
  action,
  children,
}) => {
  return (
    <button
      className="border bg-fuchsia-100 p-4 shadow transition-all hover:cursor-pointer hover:bg-fuchsia-200 hover:shadow-lg"
      onClick={action}
    >
      <span className="block text-center">{children}</span>
    </button>
  );
};

const AppPage: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const handlePatientSubmit = (data: Patient[]) => {
    setShowPatientModal(false);
    void router.push("/app/patients/" + data[0]?.id);
  };

  const handleRecordSubmit = (data: ClinicalRecord[]) => {
    setShowRecordModal(false);
    void router.push("/app/patients/" + data[0]?.patientId);
  };

  return (
    <Layout>
      <AppLayout>
        <h1 className="mb-4 text-2xl">Welcome, {data?.user.name}</h1>
        <div className="grid grid-flow-col gap-4">
          <Box action={() => setShowPatientModal(true)}>
            Crear nuevo paciente
          </Box>
          <Box action={() => setShowRecordModal(true)}>
            Registrar nueva visita
          </Box>
        </div>
        <CreatePatientModal
          open={showPatientModal}
          onSubmit={handlePatientSubmit}
          onClose={() => setShowPatientModal(false)}
        />
        <CreateRecordModal
          open={showRecordModal}
          onSubmit={handleRecordSubmit}
          onClose={() => setShowRecordModal(false)}
        />
      </AppLayout>
    </Layout>
  );
};

export default AppPage;
