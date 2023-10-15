import { RouterOutputs, api } from "~/utils/api";
import LoadingPatient from "./LoadingPatient";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import invariant from "tiny-invariant";

type Patients = RouterOutputs["patients"]["getPatients"];

type PatientsListProps = {
  handlePatientClick: (patientId: string | undefined) => void;
  loading: boolean;
  onSubmit: () => Promise<unknown>;
  patients: Patients | undefined;
};

export default function PatientsList({
  handlePatientClick,
  loading,
  onSubmit,
  patients,
}: PatientsListProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();
  const { isLoading, mutateAsync } = api.patients.editPatient.useMutation();
  const { patientId } = router.query;

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const name = data.get("name");
    invariant(
      typeof patientId === "string",
      "patientId should be a string",
    );
    invariant(name, "Name should be defined");

    void await mutateAsync({
      id: patientId,
      name: name.toString(),
    })

    void onSubmit();

    setIsEditMode(false);
  };

  return (
    <div className="overflow-y-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading && <LoadingPatient />}
          {!loading &&
            patients &&
            patients.length > 0 &&
            patients.map((patient) => (
              <tr
                key={patient?.id}
                className={
                  patient?.id === patientId
                    ? "bg-fuchsia-200"
                    : "bg-transparent"
                }
                onClick={() => !isEditMode && handlePatientClick(patient?.id)}
              >
                <td className="whitespace-nowrap px-6 py-4 underline-offset-4 transition-all">
                  {isEditMode && patient?.id === patientId ? (
                    <form
                      className="flex"
                      aria-disabled={isLoading}
                      onSubmit={(e) => void handleEdit(e)}
                    >
                      <input
                        id="name"
                        name="name"
                        defaultValue={patient.name}
                        required
                        className="focus:ring-primary-color w-full rounded-lg px-4 py-2 focus:ring"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
                      >
                        Go
                      </button>
                      <button
                        type="reset"
                        className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
                        onClick={() => setIsEditMode(false)}
                      >
                        Nah
                      </button>
                    </form>
                  ) : (
                    <span>{patient?.name}</span>
                  )}
                </td>

                {patient?.id === patientId && !isEditMode && (
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar paciente
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
