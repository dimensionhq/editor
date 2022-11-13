import React, { useCallback, useEffect, useState } from "react";
import { createEditor, Editor, Range, Transforms } from "slate";
import { withReact, Slate, Editable, RenderElementProps, ReactEditor } from "slate-react";
import Block from "./blocks";
import { BlockType, CreateNewBlockFromBlock, CustomElement } from "./types";
import { nanoid } from "nanoid";
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import EditorContext from "./ctx";
import DraggableElement from "./components/draggable-element";
// @ts-ignore
import RectangleSelection from "react-rectangle-selection"
import withShortcuts, { HOTKEYS, toggleMark } from "./utils/withShortcuts";
import isHotkey from "is-hotkey";
import Leaf from "./components/leaf";

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
    const [editor] = useState(() => withShortcuts(withReact(createEditor())));
    const [elements, setElements] = useState(initialValue);
    const [selected, setSelected] = useState<string[]>([]);
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
        let blocks = document.querySelectorAll(`[data-block="true"]`)
        // remove data-selected={selected} if not in selected array
        blocks.forEach(block => {
            if (!selected.includes(block.id)) {
                block.removeAttribute('data-selected')
            } else {
                block.setAttribute('data-selected', 'true')
            }
        });
    }, [selected])

    return (
        <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* <RectangleSelection
                onSelect={(e: any, coords: any) => {
                    let coordsOrigin = coords.origin;
                    let coordsFinal = coords.target;

                    const top = Math.min(coordsOrigin[1], coordsFinal[1]);
                    const left = Math.min(coordsOrigin[0], coordsFinal[0]);
                    const width = Math.abs(coordsOrigin[0] - coordsFinal[0]);
                    const height = Math.abs(coordsOrigin[1] - coordsFinal[1]);

                    const finalCoords = { top, left, width, height };

                    // check if any block is in selection
                    let blocks = document.querySelectorAll(`[data-block="true"]`)
                    let selectedBlocks: string[] = [];
                    blocks.forEach(block => {
                        // check if block and finalCoords collide
                        let blockRect = block.getBoundingClientRect();

                        // check if block is in selection
                        if (blockRect.top >= finalCoords.top && blockRect.top <= finalCoords.top + finalCoords.height) {
                            selectedBlocks.push(block.id)
                        }

                    })
                    setSelected(selectedBlocks)
                }}
                style={{
                    backgroundColor: "rgba(0,0,255,0.4)",
                    borderColor: "blue"
                }}
            > */}

            <EditorContext.Provider value={{ elements: elements, setElements: setElements, editor: editor }}>
                <Slate editor={editor} value={initialValue}>
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
            {/* </RectangleSelection> */}
        </div>
    );
};


export default App;
