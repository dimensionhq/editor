import { nanoid } from "nanoid";
import React, { useContext, useMemo, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconBrandCodesandbox, IconBrandFigma, IconH1, IconH2, IconH3, IconList, IconListCheck, IconNews, IconPhoto, IconVideo } from "tabler-icons";
import EditorContext from "../ctx";
import { CustomElement, BlockType } from "../types";

const items = {
    "Text": [
        {
            id: 0,
            title: "Paragraph",
            icon: <IconNews size={16} />,
            type: BlockType.Paragraph
        },
        {
            id: 1,
            title: "Heading 1",
            icon: <IconH1 size={16} />,
            type: BlockType.H1
        },
        {
            id: 2,
            title: "Heading 2",
            icon: <IconH2 size={16} />,
            type: BlockType.H2
        },
        {
            id: 3,
            title: "Heading 3",
            icon: <IconH3 size={16} />,
            type: BlockType.H3
        },
        {
            id: 4,
            title: "List",
            icon: <IconList size={16} />,
            type: BlockType.BulletedList
        },
        {
            id: 5,
            title: "Checklist",
            icon: <IconListCheck size={16} />,
            type: BlockType.CheckList
        },
    ],
    "Media": [
        {
            id: 6,
            title: "Image",
            icon: <IconPhoto size={16} />,
            type: BlockType.Image
        },
        {
            id: 7,
            title: "Video",
            icon: <IconVideo size={16} />,
            type: BlockType.Video
        },
    ],
    "Embed": [
        {
            id: 8,
            title: "CodeSandbox",
            icon: <IconBrandCodesandbox size={16} />,
            type: BlockType.CodeSandbox
        },
        {
            id: 9,
            title: "Figma",
            icon: <IconBrandFigma size={16} />,
            type: BlockType.Figma
        },
    ],
}

interface Props {
    element: any;
    slash?: boolean;
}

const AddComponent = (props: Props) => {
    const [query, setQuery] = useState("");
    let [currentSelection, setCurrentSelection] = useState(0)

    const editorContext = useContext(EditorContext)

    const filteredItems = useMemo(() => {
        const result = {};
        for (const [key, value] of Object.entries(items)) {
            const filtered = value.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

            if (filtered.length > 0) {
                // @ts-ignore
                result[key] = filtered as any;
            }
        }
        setCurrentSelection(0)

        // rewrite ids
        let id = 0;
        for (const [key, value] of Object.entries(result)) {
            // @ts-ignore
            for (const item of value) {
                item.id = id;
                id++;
            }
        }

        return result;
    }, [query]);

    return (
        <div className="de-add-control-popover" id="popover">
            <input onKeyDown={(e) => {
                let selection = currentSelection;
                let isUp = e.key === "ArrowUp";
                if (e.key === "Enter") {
                    const item: any = document.querySelector(`[data-state="${selection}"]`);
                    item?.click();
                }

                if (e.key === "ArrowDown") {
                    if (currentSelection > 8) {
                        selection = 9;
                        setCurrentSelection(selection)
                    } else {
                        selection++;
                        setCurrentSelection(currentSelection + 1);
                    }
                }
                if (e.key === "ArrowUp") {
                    if (currentSelection < 1) {
                        selection = 0;
                        setCurrentSelection(0);
                    } else {
                        selection--;
                        setCurrentSelection(currentSelection - 1);
                    }
                }

                const selector = document.querySelector(`[data-state="${selection}"]`)

                selector?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }} className="search" value={query} onInput={(e) => setQuery(e.currentTarget.value)} />
            {Object.keys(filteredItems).map((key, index) => (
                <React.Fragment key={index}>
                    <h1 className="section">{key}</h1>
                    {/* @ts-ignore */}
                    {filteredItems[key].map((item: any, idx: any) => (
                        <div onClick={() => {
                            if (!editorContext.editor) return;
                            const editor = editorContext.editor;
                            let block: CustomElement = {
                                id: nanoid(),
                                type: item.type,
                                children: [{ text: "" }],
                            }
                            if (item.type === BlockType.Image || item.type === BlockType.Video || item.type === BlockType.CodeSandbox || item.type === BlockType.Figma) {
                                block = {
                                    id: nanoid(),
                                    type: item.type,
                                    url: null,
                                    alt: null,
                                    children: [{ text: "" }],
                                }
                            } else if (item.type === BlockType.CheckList) {
                                block = {
                                    id: nanoid(),
                                    type: item.type,
                                    children: [{ text: "", }],
                                    checked: false
                                }
                            }

                            if (props.slash) {
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
                            } else {
                                const path = [ReactEditor.findPath(editor, props.element)[0] + 1];

                                Transforms.insertNodes(editor, block, {
                                    at: path,
                                });
                                editorContext.setElements([...editorContext.elements, block]);
                                setTimeout(() => {
                                    ReactEditor.focus(editor);
                                    Transforms.select(editor, {
                                        anchor: { path: [path[0], 0], offset: 0 },
                                        focus: { path: [path[0], 0], offset: 0 },
                                    });
                                }, 0);
                            }
                            document.getElementById("de-popover-close")?.click();
                        }
                        } className="item" key={idx} data-state={item.id} data-selected={currentSelection == item.id ? true : false} >
                            <div className="icon">{item.icon}</div>
                            <div className="text">{item.title}</div>
                        </div>
                    ))}
                </React.Fragment>
            ))
            }
        </div >
    )
}

export default AddComponent