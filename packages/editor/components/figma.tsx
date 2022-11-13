import { useContext, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconBrandFigma, IconPhoto } from "tabler-icons";
import EditorContext from "../ctx";
import { FigmaElement, ImageElement, VideoElement } from "../types";
import Placeholder from "./placeholder";

interface Props {
    children: React.ReactNode,
    element: FigmaElement,
}


interface DialogProps {
    element: FigmaElement,
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
                const block: FigmaElement = {
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

const FigmaBlock = (props: Props) => {
    if (!props.element.url) {
        return (
            <Placeholder dialog={<FigmaDialog element={props.element}></FigmaDialog>}>
                <IconBrandFigma />
                <span>Embed a figma file from an URL</span>
            </Placeholder>
        )
    } return (
        <iframe width="100%"
            height="315"
            src={`https://www.figma.com/embed?embed_host=astra&url=${props.element.url!}`}
            title="Figma"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
}

export default FigmaBlock