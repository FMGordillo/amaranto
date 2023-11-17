import { Dialog, Transition } from "@headlessui/react";
import { type FormEvent, Fragment } from "react";
import invariant from "tiny-invariant";
import { api } from "~/utils/api";
import { useSnackbar } from "notistack";

export type Patient = {
  name: string;
  id: string;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
};

type CreatePatientModalProps = {
  onClose: () => void;
  onSubmit: (data: Patient[]) => void;
  open: boolean;
};

export default function CreatePatientModal({
  onSubmit,
  onClose,
  open,
}: CreatePatientModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: createPatient } = api.patients.createPatient.useMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const name = data.get("name");
      invariant(name, "Name should be defined");
      // TODO: Handle error correctly

      void createPatient(name.toString(), {
        onSuccess: (data) => {
          void onSubmit(data);
          enqueueSnackbar({
            variant: "success",
            message: "Paciente creado correctamente",
          });
          onClose();
        },
      });
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: "Por favor, consulte con el administrador del sistema",
      });
      console.log(error);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="min-w-md w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Crear nuevo paciente
                </Dialog.Title>
                <div className="mt-2">
                  <form
                    className="flex flex-col"
                    onSubmit={(e) => void handleSubmit(e)}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-600"
                      >
                        Nombre
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
                      className="self-end rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
                    >
                      Crear
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
