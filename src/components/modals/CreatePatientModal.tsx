import { Dialog, Listbox, Transition } from "@headlessui/react";
import { type FormEvent, Fragment, useState } from "react";
import invariant from "tiny-invariant";
import { api } from "~/utils/api";
import { useSnackbar } from "notistack";
import { IDENTIFICATION_TYPES, type IdentificationType } from '~/utils/constants'
import { getButtonClass } from "../Button";

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
  const [id, setId] = useState<IdentificationType | null>(null)
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, mutate: createPatient } = api.patients.createPatient.useMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const name = data.get("name");
      invariant(name, "Complete el nombre por favor");
      const surname = data.get("surname");
      invariant(surname, "Complete el apellido por favor");

      void createPatient(name.toString(), {
        onSuccess: (data) => {
          void onSubmit(data);
          enqueueSnackbar({
            variant: "success",
            message: "Paciente creado correctamente",
          });
          onClose();
        },
        onError: error => {
          enqueueSnackbar({
            variant: "error",
            message: error.message,
          });
        },
      });
    } catch (error) {
      console.log('hey', error)
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
              <Dialog.Panel className="min-w-lg w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                    <div className="flex justify-between mb-4">
                      <div>
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

                      <div>
                        <label
                          htmlFor="surname"
                          className="mb-2 block text-sm font-medium text-gray-600"
                        >
                          Apellido
                        </label>
                        <input
                          id="surname"
                          name="surname"
                          className="focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring"
                          required
                        />
                      </div>
                    </div>


                    <div className="flex justify-between mb-4">
                      <div>
                        <label
                          htmlFor=""
                          className="mb-2 block text-sm font-medium text-gray-600"
                        >
                          Documento de identificación
                        </label>
                        <Listbox name="identification_type" value={id} onChange={(a) => setId(a)}>
                          <Listbox.Button className={getButtonClass('outline')}>{id?.title ?? 'Seleccioná un tipo de documento'}</Listbox.Button>
                          <Listbox.Options
                            className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                          >
                            {IDENTIFICATION_TYPES.map((identification) => (
                              <Listbox.Option
                                key={identification.id}
                                value={identification}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-fuchsia-100 text-fuchsia-900' : 'text-gray-900'
                                  }`
                                }
                              // disabled={identification.unavailable}
                              >
                                {identification.title}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>

                      <div>
                        <label
                          htmlFor="identification_value"
                          className="mb-2 block text-sm font-medium text-gray-600"
                        >
                          Documento de identificación
                        </label>
                        <input
                          id="identification"
                          name="identification"
                          className="focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring"
                          required
                        />
                      </div>
                    </div>


                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-600"
                      >
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring"
                        required
                      />
                    </div>

                    <button
                      aria-disabled={isLoading}
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
