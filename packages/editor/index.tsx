import { useCallback, useContext, useEffect, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withReact, Slate, Editable, RenderElementProps, ReactEditor } from "slate-react";
import Block from "./blocks";
import { BlockType, CustomElement } from "./types";
import { nanoid } from "nanoid";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import DraggableElement from "./components/draggable-element";
import EditorContext from "./ctx";

export let initialValue: CustomElement[] = [
    {
        id: nanoid(),
        type: BlockType.Paragraph,
        children: [
            {
                text: "Magic gives developers the tools to make adoption frictionless, secure, and non-custodial.",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.H1,
        children: [
            {
                text: "Instant Web3 wallets for your customers",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.H2,
        children: [
            {
                text: "Supercharge conversion",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.BulletedList,
        children: [
            {
                text: "Instant onboarding",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.BulletedList,
        children: [
            {
                text: "No friction",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [
            {
                text: "No friction",
            },
        ],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Signup & Login Form" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Wallet Selector" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Email Collection" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Transaction Signing" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Fiat On-Ramp" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Asset Management" }],
    },
    {
        id: nanoid(),
        type: BlockType.CheckList,
        checked: false,
        children: [{ text: "Brand Custom" }],
    },

];

function isNodeWithId(editor: Editor, id: string) {
    return (node: Node) => Editor.isBlock(editor, node) && (node as any).id === id;
}

const App = () => {
    const [editor] = useState(() => withReact(createEditor()));
    const [elements, setElements] = useState(initialValue);

    const renderElements = useCallback((props: RenderElementProps) => {
        let element = props.element as any;
        const path = ReactEditor.findPath(editor, props.element);
        const isTopLevel = path.length === 1;

        if (isTopLevel) {
            return (
                <DraggableElement isTopElement={isTopLevel} element={props.element} type={(props.element as any).type}>
                    {props.children}
                </DraggableElement>
            )
        }
        return (
            <Block isTopElement={isTopLevel} element={element} type={element.type}>
                {props.children}
            </Block>
        );
    }, []);

    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (!result.destination) return;

        Transforms.moveNodes(editor, {
            at: [],
            match: isNodeWithId(editor, result.draggableId) as any,
            to: [result.destination.index],
        })

        // update elements state 
        const newElements = Array.from(elements);
        const [removed] = newElements.splice(result.source.index, 1);
        newElements.splice(result.destination.index, 0, removed);
        setElements(newElements);
    }

    return (
        <EditorContext.Provider value={{ elements: elements, setElements: setElements, editor: editor }}>
            <Slate editor={editor} value={initialValue}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="ROOT-DROPPABLE">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <Editable
                                    style={{
                                        width: "75%",
                                    }}
                                    renderElement={renderElements}
                                    onKeyDown={(event) => {
                                        if (event.key === "&") {
                                            // Prevent the ampersand character from being inserted.
                                            event.preventDefault();
                                            // Execute the `insertText` method when the event occurs.
                                            editor.insertText("and");
                                        }
                                    }}
                                />
                                {provided.placeholder}
                            </div>
                        )}

                    </Droppable>
                </DragDropContext>
            </Slate>
        </EditorContext.Provider>
    );
};


export default App;
