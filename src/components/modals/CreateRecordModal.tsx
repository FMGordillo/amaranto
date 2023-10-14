import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment } from "react";
import invariant from "tiny-invariant";
import { api } from "~/utils/api";

type CreateRecordModalProps = {
  patientId: string;
  onClose: () => void;
  onSubmit: () => Promise<unknown>;
  open: boolean;
};

export default function CreateRecordModal({
  onClose,
  onSubmit,
  open,
  patientId,
}: CreateRecordModalProps) {
  const { isLoading, mutateAsync: createRecord } =
    api.clinicalRecords.createRecord.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);

      const message = data.get("message");
      invariant(message, "Message should be defined");
      invariant(
        typeof patientId === "string",
        "patientId should be a string",
      );

      void await createRecord({
        message: message.toString(),
        patientId,
      });
      void onSubmit();
      onClose();
    } catch (error) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create a new clinical record
                </Dialog.Title>
                <div className="mt-2">
                  <form
                    aria-disabled={isLoading}
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
                    <button
                      type="submit"
                      className="rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
                    >
                      Create Record
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
