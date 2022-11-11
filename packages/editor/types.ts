export enum BlockType {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    BulletedList = "bulleted-list",
    CheckList = "check-list",
    Paragraph = "paragraph",
    Image = "image",
    Video = "video",
    CodeSandbox = "codesandbox",
    Figma = "figma",
}

export type TextBlockTypes =
    | BlockType.H1
    | BlockType.H2
    | BlockType.H3
    | BlockType.Paragraph
    | BlockType.BulletedList
    | BlockType.CheckList;

export type BlockElement = {
    id: string;
    children: CustomText[];
};

export type ParagraphElement = BlockElement & {
    type: BlockType.Paragraph;
};

export type HeadingElement = BlockElement & {
    type: BlockType.H1 | BlockType.H2 | BlockType.H3;
};

export type ListElement = BlockElement & {
    type: BlockType.BulletedList;
};

export type CheckListElement = BlockElement & {
    type: BlockType.CheckList;
    checked: boolean;
};

export type ImageElement = BlockElement & {
    type: BlockType.Image;
    url: string | null;
    alt: string | null;
    children: [{ text: "" }];
};

export type VideoElement = BlockElement & {
    type: BlockType.Video;
    url: string | null;
    children: [{ text: "" }];
};

export type CodeSandboxElement = BlockElement & {
    type: BlockType.CodeSandbox;
    url: string | null;
    children: [{ text: "" }];
};

export type FigmaElement = BlockElement & {
    type: BlockType.Figma;
    url: string | null;
    children: [{ text: "" }];
};


export type CustomElement =
    | ParagraphElement
    | HeadingElement
    | ListElement
    | CheckListElement
    | ImageElement
    | VideoElement
    | CodeSandboxElement
    | FigmaElement;


export type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikeThrough?: boolean;
} & LeafDecoration;

type LeafDecoration = {
    placeholder?: string;
};