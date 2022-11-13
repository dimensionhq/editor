import React, { useContext, useEffect, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconVideo } from "tabler-icons";
import EditorContext from "../ctx";
import { VideoElement } from "../types";
import Placeholder from "./placeholder";

interface Props {
    children: React.ReactNode,
    element: VideoElement,
}

interface DialogProps {
    element: VideoElement,
}

const VideoDialog = (props: DialogProps) => {
    const [url, setUrl] = useState("");
    const [alt, setAlt] = useState("");
    const editorContext = useContext(EditorContext);

    return (
        <div id="de-dialog" className="de-dialog">
            <div className="de-dialog-header">
                <h3>Embed a video from a URL</h3>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!editorContext.editor) return;
                if (!url) return;
                const editor = editorContext.editor;
                const block: VideoElement = {
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

const Video = (props: Props) => {
    if (!props.element.url) {
        return (
            <Placeholder dialog={<VideoDialog element={props.element}></VideoDialog>}>
                <IconVideo />
                <span>Embed a video from a URL</span>
            </Placeholder>
        )
    }
    return (
        <iframe width="100%"
            height="315"
            src={props.element.url!}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
}

export default Video