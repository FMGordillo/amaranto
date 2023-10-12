import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import { useParams } from "next/navigation";

export default function Records() {
  const params = useParams();
  const patientId = params?.patientId as string;
  const { data: records } = api.clinicalRecords.getByPatient.useQuery(patientId);

  return (
    <Layout title="Historias clínicas - Amaranto">
      <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
        <div className="flex justify-between items-center my-8">
          <h2 className="text-2xl font-semibold">Historia clinica</h2>
          <Link href={`/patients/${patientId}/new-record`}><button className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-pink-600">Create Record</button></Link>
        </div>
        {records && records?.length > 0 && records.map(record => <div key={record.id}>{record.message}</div>)}
      </div>
    </Layout>
  )
}
