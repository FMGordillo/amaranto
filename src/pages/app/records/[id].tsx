import { NextPage } from "next";
import { useParams } from "next/navigation";
import AppLayout from "~/components/AppLayout";
import Layout from "~/components/Layout";
import Record from "~/components/Record";
import { api } from "~/utils/api";

const RecordByIdPage: NextPage = () => {
  const params = useParams();

  const { isLoading, data } = api.clinicalRecords.getById.useQuery(
    params?.id as string,
    { enabled: !!params?.id },
  );

  return (
    <Layout>
      <AppLayout>
        {!isLoading && data && (
          <section className="flex flex-col gap-8">
            <h1 className="text-2xl">
              Paciente:{" "}
              <span className="font-bold">{data[0]?.patients.name}</span>
            </h1>

            <blockquote className="max-w-prose whitespace-pre-line">
              <Record content={data[0]?.clinicalRecords.message} />
            </blockquote>

            <p className="font-light">
              Fecha de creación:{" "}
              {data[0]?.clinicalRecords.createdAt.toLocaleString()}
            </p>
          </section>
        )}
      </AppLayout>
    </Layout>
  );
};

export default RecordByIdPage;
