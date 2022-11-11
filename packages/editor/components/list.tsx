import { ListElement } from "../types";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
};

const ListBlock = (props: Props) => {
    return (
        <ul className="de-ul de">
            <li className="de-li">{props.children}</li>
        </ul>
    );
}

export default ListBlock;