import { CodeSandboxElement } from "../types";

interface CodeSandboxBlock {
    element: CodeSandboxElement;
    children: React.ReactNode;
}

const CodeSandboxBlock = (props: CodeSandboxBlock) => {
    return (
        <div className="de-code-sandbox de">
            <iframe className="de-code-sandbox-iframe" src={props.element.url!} />
        </div>
    );
}

export default CodeSandboxBlock;