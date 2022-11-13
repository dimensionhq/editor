import { createRef } from "react"
import { useContext } from "react"
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd"
import { Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { IconDragDrop, IconPlus, IconX } from "tabler-icons"
import PopoverComponent from "../components/primitives/popover"
import EditorContext from "../ctx"
import { CustomElement } from "../types"
import AddComponent from "./add"

interface Props {
    dragHandleProps?: DraggableProvidedDragHandleProps,
    element: any,
}

const BlockControls = (props: Props) => {
    const editorContext = useContext(EditorContext)
    const add_ref = createRef<HTMLButtonElement>()


    return (
        <div style={{ display: "flex" }} className="de-control-buttons">
            <div {...props.dragHandleProps}
                className="de-control-button">
                <IconDragDrop size={16} />
            </div>
            <PopoverComponent element={props.element}>
                <button style={{ cursor: "pointer" }} id={`de-control-button-add-${props.element.id}`} onClick={() => {

                }} ref={add_ref} className="de-control-button"><IconPlus size={16} /></button>
                <AddComponent element={props.element} />
            </PopoverComponent>
            <button style={{ cursor: "pointer" }} className="de-control-button" onClick={() => {
                if (!editorContext.editor) return;

                Transforms.removeNodes(editorContext.editor, {
                    at: ReactEditor.findPath(editorContext.editor, props.element),
                })
                editorContext.setElements(editorContext.elements.filter((e: CustomElement) => e.id !== props.element.id))
            }}>
                <IconX size={16} />
            </button>
        </div >
    )
}

export default BlockControls