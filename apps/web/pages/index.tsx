import { CustomElement, BlockType } from "@dimension/editor/types";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid"

const Editor = dynamic(() => {
  return import("@dimension/editor")
}, {
  ssr: false
})

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

export default function Web() {
  return (
    <div className="app">
      <Editor initialValue={initialValue} onChange={console.log} />
    </div>
  );
}
