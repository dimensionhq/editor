import React from "react";
import { CheckListElement } from "../types";

interface Props {
    element: CheckListElement
    children: React.ReactNode;
};

const TodoList = (props: Props) => {
    return (
        <div className="de-checklist">
            <input type="checkbox" defaultChecked={props.element.checked} />
            <span>{props.children}</span>
        </div>
    )
}

export default TodoList;