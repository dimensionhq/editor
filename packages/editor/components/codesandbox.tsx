import { useState, useContext } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconBrandCodesandbox } from "tabler-icons";
import EditorContext from "../ctx";
import { CodeSandboxElement } from "../types";
import Placeholder from "./placeholder";

interface CodeSandboxBlock {
    element: CodeSandboxElement;
    children: React.ReactNode;
}

interface DialogProps {
    element: CodeSandboxElement,
}

const FigmaDialog = (props: DialogProps) => {
    const [url, setUrl] = useState("");
    const editorContext = useContext(EditorContext);

    return (
        <div className="de-dialog" id="de-dialog">
            <div className="de-dialog-header">
                <h3>Embed a figma file from an URL</h3>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!url) return;
                if (!editorContext.editor) return;
                const editor = editorContext.editor;
                const block: CodeSandboxElement = {
                    ...props.element,
                    url,
                }
                const path = [ReactEditor.findPath(editor, props.element)[0]];
                // @ts-ignore
                Transforms.setNodes(editor, block, { at: path });

                editorContext.setElements([...editorContext.elements, block]);
                setTimeout(() => {
                    ReactEditor.focus(editor);
                    Transforms.select(editor, {
                        anchor: { path: [path[0], 0], offset: 0 },
                        focus: { path: [path[0], 0], offset: 0 },
                    });
                }, 0);
            }}
                className="de-dialog-body">
                <div className="de-form-group">
                    <label className="de-form-alt" >URL</label>
                    <input type="text" value={url} onInput={(e) => { setUrl(e.currentTarget.value) }} className="de-form-text" />
                </div>

                <button type="submit" className="de-dialog-submit-button">Embed</button>
            </form>
        </div >
    )
}

const CodeSandboxBlock = (props: CodeSandboxBlock) => {
    if (!props.element.url) {
        return (
            <Placeholder dialog={<FigmaDialog element={props.element}></FigmaDialog>}>
                <IconBrandCodesandbox />
                <span>Embed a codesandbox file from an URL</span>
            </Placeholder>
        )

    }
    return (
        <div className="de-code-sandbox de">
            <iframe className="de-code-sandbox-iframe" src={props.element.url!} />
        </div>
    );
}

export default CodeSandboxBlock;