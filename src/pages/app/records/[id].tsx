import { NextPage } from "next";
import { useParams } from "next/navigation";
import AppLayout from "~/components/AppLayout";
import Layout from "~/components/Layout";
import Record from "~/components/Record";
import { api } from "~/utils/api";
import dayjs from "dayjs";

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
            <div className="flex justify-between">
            <h1 className="text-2xl">
              Paciente:{" "}
              <span className="font-bold">{data[0]?.patients.name}</span>
            </h1>

            <p className="text-right font-light">
              <span className="font-normal">Fecha de creación</span><br/>
              {dayjs(data[0]?.clinicalRecords.createdAt).format('dddd D MMMM, YYYY')}<br/> ({dayjs(data[0]?.clinicalRecords.createdAt).fromNow()})
            </p>
            </div>

            <blockquote className="max-w-prose whitespace-pre-line">
              <Record content={data[0]?.clinicalRecords.message} />
            </blockquote>

          </section>
        )}
      </AppLayout>
    </Layout>
  );
};

export default RecordByIdPage;
