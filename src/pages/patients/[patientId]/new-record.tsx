import invariant from 'tiny-invariant';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Header from "~/components/Header";
import { api } from "~/utils/api";

export default function CreateRecord() {
  const navigator = useRouter();
  const params = useParams();
  const { isLoading, mutateAsync: createRecord } = api.clinicalRecords.createRecord.useMutation();
  const { data: patientData } = api.patients.getPatient.useQuery(params?.patientId as string,
    { enabled: !!params?.patientId }
  );

  const { data: session } = useSession();

  const patient = (patientData ?? [])[0]

  if (!session) {
    return <span>Access denied</span>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const message = data.get('message')
      invariant(message, "Message should be defined")
      invariant(typeof params.patientId === 'string', "patientId should be a string")

      await createRecord({
        message: message.toString(),
        patientId: params?.patientId,
      });

      navigator.push("/patients");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Nuevo registro - Amaranto</title>
      </Head>

      <div className="h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 mt-8 text-2xl font-semibold">{patient?.name}</h2>

          <form aria-disabled={isLoading} onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-4">
              <label htmlFor="recordDescription" className="block text-gray-600 text-sm font-medium mb-2">Record Description</label>
              <textarea id="recordDescription" name="message" className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-primary-color" rows={4} required></textarea>
            </div>
            <button type="submit" className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-pink-600">Create Record</button>
          </form>
        </div>
      </div>
    </>
  )
}
