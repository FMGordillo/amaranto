import { RouterOutputs } from "~/utils/api";
import LoadingPatient from "./LoadingPatient";

type Patients = RouterOutputs['patients']['getPatients']

type PatientsListProps = {
  handlePatientClick: (patientId: string | undefined) => void;
  loading: boolean;
  patients: Patients | undefined;
};

export default function PatientsList({
  handlePatientClick,
  loading,
  patients,
}: PatientsListProps) {

  return (
    <div className="max-h-96 overflow-y-scroll">
      <table className="divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {loading && <LoadingPatient />}
          {!loading &&
            patients &&
            patients.length > 0 &&
            patients.map((patient) => (
              <tr key={patient?.id}>
                {/* TODO: Add an "edit patient" action here */}
                <td className="whitespace-nowrap px-6 py-4 underline-offset-4 transition-all">
                  {patient?.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-4">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handlePatientClick(patient?.id)}
                    >
                      Create Record
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
