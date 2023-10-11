import Head from "next/head";
import { useParams } from "next/navigation";
import Header from "~/components/Header";
import { api } from "~/utils/api";

export default function Records() {
  const params = useParams();
  const { data: records } = api.clinicalRecords.getByPatient.useQuery(params?.patientId as string);

  return (
    <>
      <Head>
        <title>Historias clínicas - Amaranto</title>
      </Head>

      <Header />

      <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 mt-8 text-2xl font-semibold">Historia clinica</h2>
        {records && records?.length > 0 && records.map(record => <div key={record.id}>{record.message}</div>)}
      </div>
    </>
  )
}
