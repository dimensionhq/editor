import { useCallback, useState } from "react";
import { createEditor } from "slate";
import { withReact, Slate, Editable, RenderElementProps } from "slate-react";
import Block from "./blocks";
import { BlockType, CustomElement } from "./types";
import { nanoid } from "nanoid";

const initialValue: CustomElement[] = [
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
    {
        id: nanoid(),
        type: BlockType.CodeSandbox,
        children: [{ text: "" }],
        url: "https://codesandbox.io/embed/nextjs-fxis37?file=%2FREADME.md",
    },
    {
        id: nanoid(),
        type: BlockType.Image,
        children: [{ text: "" }],
        alt: "Image",
        url: "https://cdn.britannica.com/74/114874-050-6E04C88C/North-Face-Mount-Everest-Tibet-Autonomous-Region.jpg"
    },
    {
        id: nanoid(),
        type: BlockType.Video,
        children: [{ text: "" }],
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: nanoid(),
        type: BlockType.Figma,
        children: [{ text: "" }],
        url: "https://www.figma.com/embed?embed_host=astra&url=\
        https://www.figma.com/file/BK6bZ0ZMhEAnQ93O1wBIej/Figma-Bootcamp-lpu-(Community)?node-id=0%3A1&t=MvQIMdpuEHpNenNC-1"
    }
];

const App = () => {
    const [editor] = useState(() => withReact(createEditor()));

    const renderElements = useCallback((props: RenderElementProps) => {
        let element = props.element as any;

        return (
            <Block element={element} type={element.type}>
                {props.children}
            </Block>
        );
    }, []);

    return (
        <Slate editor={editor} value={initialValue}>
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
        </Slate>
    );
};

export default App;
