import {
  useState,
  useCallback,
  useEffect,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { mergeRegister } from "@lexical/utils";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  createEmptyHistoryState,
  HistoryPlugin,
} from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  EditorState,
  EditorThemeClasses,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from "lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const theme: EditorThemeClasses = {
  text: {
    underline: "underline",
  },
};

function onError(error: Error) {
  throw error;
}

const initialConfig: InitialConfigType = {
  namespace: "MyEditor",
  theme,
  onError,
};

// eslint-disable-next-line
export const CAN_USE_DOM: boolean =
  // eslint-disable-next-line
  typeof window !== "undefined" &&
  // eslint-disable-next-line
  typeof window?.document?.createElement !== "undefined";

const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const ToolbarButton: FunctionComponent<
  PropsWithChildren<{
    ariaLabel: string;
    disabled?: boolean;
    icon: string;
    isActive?: boolean;
    onClick: () => void;
    title: string;
  }>
> = ({ isActive, onClick, icon, title, ariaLabel, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={
      "h-8 w-8 border-slate-700 bg-slate-200 " +
      (isActive ? "bg-slate-300 font-bold" : "")
    }
    title={title}
    type="button"
    aria-label={ariaLabel}
  >
    <i className="flex items-center justify-center">
      <img className="h-5 w-5" src={`/editor/${icon}.svg`} />
    </i>
  </button>
);

const UnderscorePlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode) => {
      if (textNode.hasFormat("underline")) {
        console.log("no se", textNode);
      }
    });
  }, [editor]);

  return null;
};

const ToolbarPlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [isEditable, setIsEditable] = useState(true);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isSubrayar, setIsUnderline] = useState(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection() as RangeSelection;

    if (selection) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
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

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  return (
    <div className="mb-1 flex">
      <ToolbarButton
        disabled={!canUndo ?? !isEditable}
        icon="undo"
        title={`Deshacer ${IS_APPLE ? "(⌘Z)" : "(Ctrl+Z)"}`}
        isActive={false}
        ariaLabel="Undo"
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      />

      <ToolbarButton
        disabled={!canRedo ?? !isEditable}
        icon="redo"
        title={`Rehacer ${IS_APPLE ? "(⌘Y)" : "(Ctrl+Y)"}`}
        isActive={false}
        ariaLabel="Redo"
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      />

      <ToolbarButton
        isActive={isBold}
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        title={`Negrita ${IS_APPLE ? "(⌘B)" : "(Ctrl+B)"}`}
        ariaLabel={`Dar formato de negrita. Atajo: ${
          IS_APPLE ? "⌘B" : "Ctrl+B"
        }`}
        icon="bold"
      />

      <ToolbarButton
        isActive={isItalic}
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        title={`Cursiva ${IS_APPLE ? "(⌘I)" : "(Ctrl+I)"}`}
        ariaLabel={`Dar formato de cursiva. Atajo: ${
          IS_APPLE ? "⌘I" : "Ctrl+I"
        }`}
        icon="italic"
      />

      {/* <ToolbarButton */}
      {/*   isActive={isSubrayar} */}
      {/*   disabled={!isEditable} */}
      {/*   onClick={() => { */}
      {/*     activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"); */}
      {/*   }} */}
      {/*   title={`Subrayar ${IS_APPLE ? "(⌘I)" : "(Ctrl+I)"}`} */}
      {/*   ariaLabel={`Dar formato de subrayado. Atajo: ${ */}
      {/*     IS_APPLE ? "⌘U" : "Ctrl+U" */}
      {/*   }`} */}
      {/*   icon="underline" */}
      {/* /> */}
    </div>
  );
};

export const Editor: FunctionComponent<{
  handleContentChange: (content: string) => void;
}> = ({ handleContentChange }) => {
  const [historyState] = useState(() => createEmptyHistoryState());

  const handleFormChange = (editorState: EditorState) => {
    editorState.read(() => {
      const currentContent = $convertToMarkdownString(TRANSFORMERS);
      handleContentChange(currentContent);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <AutoFocusPlugin />
      <HistoryPlugin externalHistoryState={historyState} />
      <OnChangePlugin onChange={handleFormChange} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            id="recordDescription"
            className="h-32 resize-y overflow-y-auto rounded-lg border border-slate-700 p-2"
          />
        }
        placeholder={<div />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <UnderscorePlugin />
    </LexicalComposer>
  );
};
