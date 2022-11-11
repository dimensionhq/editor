import dynamic from "next/dynamic";

const Editor = dynamic(() => {
  return import("@dimension/editor")
}, {
  ssr: false
})

export default function Web() {
  return (
    <div className="app">
      <Editor />
    </div>
  );
}
