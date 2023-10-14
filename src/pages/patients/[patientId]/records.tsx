import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import { useParams } from "next/navigation";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getSession } from "next-auth/react";

const RecordsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const params = useParams();
  const patientId = params?.patientId as string;
  const { data: records } =
    api.clinicalRecords.getByPatient.useQuery(patientId);

  return (
    <Layout title="Historias clínicas - Amaranto">
      <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
        <div className="my-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Historia clinica</h2>
          <Link href={`/patients/${patientId}/new-record`}>
            <button className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600">
              Create Record
            </button>
          </Link>
        </div>
        {records &&
          records?.length > 0 &&
          records.map((record) => <div key={record.id}>{record.message}</div>)}
      </div>
    </Layout>
  );
};

export default RecordsPage;

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
    props: { session },
  };
};
