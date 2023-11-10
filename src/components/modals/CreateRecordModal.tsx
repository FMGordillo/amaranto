// eslint-disable
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, forwardRef, useState } from "react";
import invariant from "tiny-invariant";
import { api } from "~/utils/api";
import { useNotification } from "../Notification";
import useDebounce from "~/utils/useDebounce";
import type { Patient } from "./CreatePatientModal";

export type ClinicalRecord = {
  message: string;
  patientId: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type CreateRecordModalProps = {
  onClose: () => void;
  onSubmit: (data: ClinicalRecord[]) => void;
  open: boolean;
  patient?: Patient;
};

const CreateRecord = forwardRef<HTMLDivElement, CreateRecordModalProps>(
  ({ patient, onSubmit, onClose }, ref) => {
    const addNotification = useNotification();
    const [patientInput, setPatientInput] = useState("");
    const patientSearch = useDebounce(patientInput, 500);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
      patient ?? null,
    );

    const patientSearchResult = api.patients.getPatientBySearch.useQuery(
      patientSearch,
      { enabled: patientSearch.length > 1 },
    );

    const createClinicalRecord = api.clinicalRecords.createRecord.useMutation();

    const handleOptionSelect = (option: Patient) => {
      setSelectedPatient(option);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();

        if (createClinicalRecord.isLoading) return;

        const data = new FormData(e.currentTarget as HTMLFormElement);

        const message = data.get("message");
        invariant(message, "Message should be defined");
        invariant(!!selectedPatient, "Select a patient");

        void createClinicalRecord.mutate(
          {
            message: message.toString(),
            patientId: selectedPatient.id,
          },
          {
            onSuccess: (data) => void onSubmit(data),
            onSettled: () => void onClose(),
          },
        );
      } catch (error) {
        addNotification({
          title: "Error al crear visita",
          type: "error",
          message: "Por favor, consulte con el administrador",
        });
        console.log(error);
      }
    };

    return (
      <Dialog.Panel
        ref={ref}
        className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Create a new clinical record
        </Dialog.Title>
        <div className="mt-2">
          <form
            aria-disabled={createClinicalRecord.isLoading}
            onSubmit={(e) => void handleSubmit(e)}
          >
            <div className="mb-4">
              <label
                htmlFor="recordDescription"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Record Description
              </label>
              <textarea
                id="recordDescription"
                name="message"
                className="focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring"
                rows={4}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="patientInput"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Nombre del paciente{" "}
              </label>
              <Combobox
                value={selectedPatient}
                disabled={!!patient}
                onChange={handleOptionSelect}
              >
                <Combobox.Input
                  required
                  id="patientInput"
                  aria-disabled={!!patient}
                  className={`focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring ${patient ? "bg-gray-300" : ""
                    }`}
                  onChange={(event) => setPatientInput(event.target.value)}
                  displayValue={(p: Patient | undefined) => (p ? p.name : "")}
                />
                <Combobox.Options className="bg-white">
                  {patientSearchResult.data?.map((patient) => (
                    <Combobox.Option
                      className="bg-gray-100 px-8 py-4 hover:cursor-pointer hover:bg-gray-200"
                      key={patient.id}
                      value={patient}
                    >
                      {patient.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>

            <button
              aria-disabled={createClinicalRecord.isLoading}
              type="submit"
              className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
            >
              Create Record
            </button>
          </form>
        </div>
      </Dialog.Panel>
    );
  },
);

export default function CreateRecordModal(props: CreateRecordModalProps) {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <CreateRecord {...props} />
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
