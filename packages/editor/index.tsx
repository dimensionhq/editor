import React, { useCallback, useEffect, useState } from "react";
import { createEditor, Descendant, Editor, Range, Transforms } from "slate";
import { withReact, Slate, Editable, RenderElementProps, ReactEditor } from "slate-react";
import Block from "./blocks";
import { BlockType, CreateNewBlockFromBlock, CustomElement } from "./types";
import { nanoid } from "nanoid";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import EditorContext from "./ctx";
import DraggableElement from "./components/draggable-element";
// @ts-ignore
import withShortcuts, { HOTKEYS, toggleMark } from "./utils/withShortcuts";
import isHotkey from "is-hotkey";
import Leaf from "./components/leaf";
import BoxSelection from "./utils/box-selection"

interface Props {
    onChange?: ((value: Descendant[]) => void) | undefined
    initialValue: CustomElement[]
}

function isNodeWithId(editor: Editor, id: string) {
    return (node: Node) => Editor.isBlock(editor, node) && (node as any).id === id;
}

const App = (props: Props) => {
    const [editor] = useState(() => withShortcuts(withReact(createEditor())));
    const [elements, setElements] = useState(props.initialValue);
    const ref = React.useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const { insertBreak } = editor;
        // Override editor to insert paragraph or element after inserting new line
        editor.insertBreak = () => {
            if (editor.selection) {
                const previousBlock = editor.children[
                    editor.selection.anchor.path[0]
                ] as CustomElement;

                let newBlock;

                // Default paragraph new line
                const paragraphBlock: CustomElement = {
                    type: BlockType.Paragraph,
                    children: [{ text: "" }],
                    id: nanoid(),
                };

                // If caret at position 0, convert previous block to empty paragraph
                if (editor.selection.anchor.offset === 0) {
                    Transforms.setNodes(editor, paragraphBlock, {
                        at: editor.selection,
                    });

                    // Pass state of old block to new block
                    newBlock = previousBlock;
                }

                // Create different current element on new line if set in Block.tsx
                if (
                    !newBlock &&
                    previousBlock?.type &&
                    Object.keys(CreateNewBlockFromBlock).includes(previousBlock?.type)
                ) {
                    newBlock = CreateNewBlockFromBlock[previousBlock.type]();
                }

                if (!newBlock) {
                    newBlock = paragraphBlock;
                }

                insertBreak();
                Transforms.setNodes(editor, newBlock as any, {
                    at: editor.selection,
                });
            } else {
                insertBreak();
            }
        };
    }, [editor]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Delete") {
                const selected_nodes = document.getElementsByClassName("de-selected")
                // loop through selected nodes and remove them
                for (let i = 0; i < selected_nodes.length; i++) {
                    const node = selected_nodes[i];
                    const id = node.getAttribute("data-id");
                    if (id) {
                        Transforms.removeNodes(editor, { at: [], match: isNodeWithId(editor, id) as any });
                        setElements(elements.filter((element) => element.id !== id));
                    }
                }
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        }
    }, [])

    useEffect(() => {
        const instance = new BoxSelection({
            container: document.getElementById('de-container'),
            itemSelector: '.de-itemSelector',
            selectedClass: '.de-selected',
            selectionClass: '.de-selection',
            mode: 'loose',
            onSelectionChange: () => { }
        })

        return () => {
            instance.unbind()
        }
    }, [])


    return (
        <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
            <div id="de-container">
                <EditorContext.Provider value={{ elements: elements, setElements: setElements, editor: editor }}>
                    <Slate onChange={props.onChange} editor={editor} value={props.initialValue}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="ROOT-DROPPABLE">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <Editable
                                            renderLeaf={Leaf}
                                            style={{
                                                width: "75%",
                                            }}
                                            renderElement={renderElements}
                                            onKeyDown={(event) => {
                                                for (const hotkey in HOTKEYS) {
                                                    if (
                                                        isHotkey(hotkey, event as any) &&
                                                        editor.selection
                                                    ) {
                                                        event.preventDefault();
                                                        const mark = HOTKEYS[hotkey];
                                                        toggleMark(editor, mark);
                                                    }

                                                    // check if slash is pressed and caret is at position 0
                                                    if (event.key === "/" && editor.selection && editor.selection.anchor.offset === 0) {
                                                        event.preventDefault();
                                                        const block = editor.children[
                                                            editor.selection.anchor.path[0]
                                                        ] as CustomElement;

                                                        document.getElementById(`de-control-button-add-${block.id}`)?.dispatchEvent(new Event('open-popover'))
                                                    }
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
            </div>
        </div>
    );
};


export default App;
