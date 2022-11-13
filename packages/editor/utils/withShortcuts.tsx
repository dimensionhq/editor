import { Editor, Element, Point, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { BlockType, CustomElement } from "../types";

const SHORTCUTS: Record<string, BlockType> = {
    "*": BlockType.BulletedList,
    "-": BlockType.BulletedList,
    "+": BlockType.BulletedList,
    "#": BlockType.H1,
    "##": BlockType.H2,
    "###": BlockType.H3,
    "[]": BlockType.CheckList,
};

export const HOTKEYS: Record<string, string> = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+s": "strikeThrough",
};

function withShortcuts(editor: ReactEditor) {
    const { deleteBackward, insertText } = editor;

    editor.insertText = (text) => {
        const { selection } = editor;

        if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;

            const block = Editor.above(editor, {
                match: (n) => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = { anchor, focus: start };

            const beforeText = Editor.string(editor, range) + text.slice(0, -1);
            const type = SHORTCUTS[beforeText];

            if (type) {
                Transforms.select(editor, range);

                if (!Range.isCollapsed(range)) {
                    Transforms.delete(editor);
                }

                const newProperties: Partial<CustomElement> = {
                    type,
                };
                Transforms.setNodes<CustomElement>(editor, newProperties, {
                    match: (n) => Editor.isBlock(editor, n),
                });

                return;
            }
        }

        insertText(text);
    };

    editor.deleteBackward = (...args: unknown[]) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: (n) => Editor.isBlock(editor, n),
            });

            if (match) {
                const [block, path] = match;
                const start = Editor.start(editor, path);

                if (
                    !Editor.isEditor(block) &&
                    Element.isElement(block) &&
                    // @ts-ignore
                    block.type !== BlockType.Paragraph &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<CustomElement> = {
                        type: BlockType.Paragraph,
                    };
                    Transforms.setNodes(editor, newProperties);

                    return;
                }
            }

            // @ts-ignore
            deleteBackward(...args);
        }
    };

    return editor;
}

export function isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor);

    // @ts-ignore
    return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: string) {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}


export default withShortcuts;