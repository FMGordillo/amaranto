import { Combobox, Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, FunctionComponent, forwardRef, useCallback, useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { api } from "~/utils/api";
import { useSnackbar } from "notistack";
import useDebounce from "~/utils/useDebounce";
import type { Patient } from "./CreatePatientModal";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, COMMAND_PRIORITY_CRITICAL, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";

const IS_APPLE = false;

const ToolbarEditor: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (selection) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  return (
    <div>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'w-8 h-8 border bg-slate-200 ' + (isBold ? 'font-bold' : '')}
        title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
        type="button"
        aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'
          }`}>
        <i>B</i>
      </button>

      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
        type="button"
        aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'
          }`}>
        <i className="format italic" />
      </button>
    </div>
  )
}

const theme = {
  // Theme styling goes here
}

function onError(error: Error) {
  throw error;
}

const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError,
};

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
    const { enqueueSnackbar } = useSnackbar();
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
            onSuccess: (data) => {
              enqueueSnackbar({
                variant: "success",
                message: "La visita fue registrada exitosamente"
              });
              void onSubmit(data)
            },
            onSettled: () => void onClose(),
          },
        );
      } catch (error) {
        enqueueSnackbar({
          variant: "error",
          message: "Por favor, consulte con el administrador",
        });
        console.log(error);
      }
    };

    return (
      <Dialog.Panel
        ref={ref}
        className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Create a new clinical record
        </Dialog.Title>
        <div className="mt-2">

          <form
            className="flex flex-col gap-4"
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

              <LexicalComposer initialConfig={initialConfig}>
                <ToolbarEditor />
                <AutoFocusPlugin />
                <RichTextPlugin
                  contentEditable={<ContentEditable
                    id="recordDescription"
                    name="message"
                    required
                    className="border p-2 h-32 resize-y rounded-lg" />}
                  placeholder={<div>Enter some text...</div>}
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </LexicalComposer>
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
                <div className="relative">
                  <Combobox.Input
                    required
                    id="patientInput"
                    aria-disabled={!!patient}
                    className={`focus:ring-primary-color w-full rounded-lg border px-4 py-2 focus:ring ${patient ? "bg-gray-300" : ""
                      }`}
                    onChange={(event) => setPatientInput(event.target.value)}
                    displayValue={(p: Patient | undefined) => (p ? p.name : "")}
                  />

                {patientSearchResult.isFetching && <img className="absolute inset-y-2 w-6 animate-spin right-1" src="/loading.svg" />}
                </div>
                
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
                className="self-end rounded-lg bg-fuchsia-700 px-4 py-2 text-white hover:bg-pink-600"
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
