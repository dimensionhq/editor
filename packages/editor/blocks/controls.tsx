import { nanoid } from "nanoid"
import { useContext } from "react"
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd"
import { Transforms } from "slate"
import { ReactEditor } from "slate-react"
import EditorContext from "../ctx"
import { BlockType, CustomElement } from "../types"

interface Props {
    dragHandleProps?: DraggableProvidedDragHandleProps,
    element: any,
}

const BlockControls = (props: Props) => {
    const editorContext = useContext(EditorContext)

    return (
        <div style={{ display: "flex" }}>
            <div {...props.dragHandleProps}
                className="de-control-button">Move</div>
            <button className="de-control-button" onClick={() => {
                if (!editorContext.editor) return;

                Transforms.removeNodes(editorContext.editor, {
                    at: ReactEditor.findPath(editorContext.editor, props.element),
                })
                editorContext.setElements(editorContext.elements.filter((e: CustomElement) => e.id !== props.element.id))

            }}>Delete</button>
            <button onClick={() => {
                if (!editorContext.editor) return;
                const block: CustomElement = {
                    type: BlockType.Paragraph,
                    children: [{ text: "" }],
                    id: nanoid()
                }

                const path = [ReactEditor.findPath(editorContext.editor, props.element)[0] + 1];

                Transforms.insertNodes(editorContext.editor, block as any, {
                    at: path
                })

                editorContext.setElements([...editorContext.elements, block])

                // autofocus the new block
                setTimeout(() => {
                    if (!editorContext.editor) return;

                    ReactEditor.focus(editorContext.editor);
                    Transforms.select(editorContext.editor, {
                        anchor: { path: [path[0], 0], offset: 0 },
                        focus: { path: [path[0], 0], offset: 0 },
                    });
                }, 0);

            }} className="de-control-button">Add</button>
        </div >
    )
}

export default BlockControls