import Layout from "~/components/Layout";
import invariant from "tiny-invariant";
import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateRecord() {
  const navigator = useRouter();
  const { isLoading, mutateAsync: createPatient } =
    api.patients.createPatient.useMutation();

  const { data: session } = useSession();

  if (!session) {
    return <span>Access denied</span>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const name = data.get("name");
      invariant(name, "Name should be defined");

      await createPatient(name.toString());

      navigator.push("/patients");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Nuevo paciente - Amaranto">
      <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 mt-8 text-2xl font-semibold">Nuevo paciente</h2>

        <form aria-disabled={isLoading} onSubmit={(e) => void handleSubmit(e)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              className="focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
          >
            Create Patient
          </button>
        </form>
      </div>
    </Layout>
  );
}
