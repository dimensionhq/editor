import { useContext, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconPhoto } from "tabler-icons";
import EditorContext from "../ctx";
import { ImageElement } from "../types";
import Placeholder from "./placeholder";

interface Props {
    children: React.ReactNode,
    element: ImageElement,
}

interface ImageProps {
    element: ImageElement,
}

const ImageDialog = (props: ImageProps) => {
    const [url, setUrl] = useState("");
    const [alt, setAlt] = useState("");
    const editorContext = useContext(EditorContext);

    return (
        <div className="de-dialog" id="de-dialog">
            <div className="de-dialog-header">
                <h3>Embed an image from a URL</h3>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!url) return;
                if (!editorContext.editor) return;
                const editor = editorContext.editor;
                const block: ImageElement = {
                    ...props.element,
                    url,
                    alt,
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
                <div className="de-form-group">
                    <label className="de-form-alt" >Alt text</label>
                    <input type="text" value={alt} onInput={(e) => { setAlt(e.currentTarget.value) }} className="de-form-text" />
                </div>
                <button type="submit" className="de-dialog-submit-button">Embed</button>
            </form>
        </div >
    )
}

const ImageBlock = (props: Props) => {
    if (props.element.url === undefined) {
        return (
            <Placeholder dialog={<ImageDialog element={props.element}></ImageDialog>}>
                <IconPhoto />
                <span>Embed an image from a URL</span>
            </Placeholder >
        )
    } else {
        return (
            <img className="de-img de" src={props.element.url!} alt={props.element.alt!} />
        );
    }
}

export default ImageBlock