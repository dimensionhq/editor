import React, { useEffect } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import CodeSandboxBlock from "../components/codesandbox";
import FigmaBlock from "../components/figma";
import ImageBlock from "../components/image";
import ListBlock from "../components/list";
import TodoList from "../components/todo";
import VideoBlock from "../components/video";
import { BlockType } from "../types";
import BlockControls from "./controls";

interface Props {
    children: React.ReactNode,
    type: BlockType,
    element: any,
    isTopElement: boolean,
    dragHandleProps?: DraggableProvidedDragHandleProps,
}

const BlockWrapper = (props: Props) => {
    const [selected, setSelected] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onSelect = (e: any) => {
            console.log(e)
            setSelected(e.selected)
        }
        ref.current?.addEventListener('selectable-select', onSelect)
    }, [])

    return (
        <div ref={ref} className="de-block" id={`${props.element.id}`} data-selected={selected} data-block={true}>
            <div style={{ userSelect: "none" }}>
                <BlockControls element={props.element} dragHandleProps={props.dragHandleProps} />
            </div>
            <Block {...props} />
        </div>
    )
}
const Block = (props: Props) => {
    switch (props.type) {
        case BlockType.Paragraph:
            return <p className="de-p de">{props.children}</p>;
        case BlockType.H1:
            return <h1 className="de-h1 de">{props.children}</h1>;
        case BlockType.H2:
            return <h2 className="de-h2 de">{props.children}</h2>;
        case BlockType.H3:
            return <h3 className="de-h3 de">{props.children}</h3>;
        case BlockType.BulletedList:
            return <ListBlock>{props.children}</ListBlock>
        case BlockType.CheckList:
            return <TodoList element={props.element}>{props.children}</TodoList>
        case BlockType.CodeSandbox:
            return <CodeSandboxBlock element={props.element}>{props.children}</CodeSandboxBlock>
        case BlockType.Image:
            return <ImageBlock element={props.element}>{props.children}</ImageBlock>
        case BlockType.Video:
            return <VideoBlock element={props.element}>{props.children}</VideoBlock>
        case BlockType.Figma:
            return <FigmaBlock element={props.element}>{props.children}</FigmaBlock>
        default:
            return <p className="de-p de">{props.children}</p>;
    }
}

export default BlockWrapper;