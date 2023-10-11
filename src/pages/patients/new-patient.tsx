import invariant from 'tiny-invariant';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Header from "~/components/Header";
import { api } from "~/utils/api";

export default function CreateRecord() {
  const navigator = useRouter();
  const { isLoading, mutateAsync: createPatient } = api.patients.createPatient.useMutation();

  const { data: session } = useSession();

  if (!session) {
    return <span>Access denied</span>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const name = data.get('name')
      invariant(name, "Name should be defined")

      await createPatient(name.toString());

      navigator.push("/patients");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Nuevo paciente - Amaranto</title>
      </Head>

      <div className="h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 mt-8 text-2xl font-semibold">Nuevo paciente</h2>

          <form aria-disabled={isLoading} onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 text-sm font-medium mb-2">Name</label>
              <input id="name" name="name" className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-primary-color" required />
            </div>
            <button type="submit" className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-pink-600">Create Patient</button>
          </form>
        </div>
      </div>
    </>
  )
}
