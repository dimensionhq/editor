import { createContext } from "react";
import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { CustomElement } from "./types";

interface IEditorContext {
    elements: CustomElement[],
    setElements: (elements: CustomElement[]) => void,
    editor: ReactEditor | null
}

const EditorContext = createContext<IEditorContext>({
    elements: [],
    editor: null,
    setElements: () => { }
});

export default EditorContext;