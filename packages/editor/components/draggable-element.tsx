import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import BlockWrapper from "../blocks";
import EditorContext from "../ctx";
import { BlockType } from "../types";

interface Props {
    children: React.ReactNode,
    type: BlockType,
    element: any,
    isTopElement: boolean,
}

const DraggableElement = (props: Props) => {
    // get index from initial value
    const ctx = useContext(EditorContext)
    const index = ctx.elements.findIndex((el) => el.id === props.element.id)

    return (
        <Draggable index={index} draggableId={props.element.id}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="de-block"
                >
                    <BlockWrapper dragHandleProps={provided.dragHandleProps} {...props}>
                        {props.children}
                    </BlockWrapper>
                </div>
            )}
        </Draggable>
    )
};

export default DraggableElement