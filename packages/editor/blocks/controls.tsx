import { nanoid } from "nanoid"
import { useContext } from "react"
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd"
import { Transforms } from "slate"
import { ReactEditor } from "slate-react"
import PopoverComponent from "../components/primitives/popover"
import EditorContext from "../ctx"
import { BlockType, CustomElement } from "../types"
import AddComponent from "./add"

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

            <PopoverComponent>
                <button className="de-control-button">Add</button>
                <AddComponent />
            </PopoverComponent>
        </div >
    )
}

export default BlockControls