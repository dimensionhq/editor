import { getOwnPropertyDescriptors } from "mobx/dist/internal";
import { ImageElement } from "../types";

interface Props {
    children: React.ReactNode,
    element: ImageElement,
}

const ImageBlock = (props: Props) => {
    return (
        <img className="de-img de" src={props.element.url!} alt={props.element.alt!} />
    );
}

export default ImageBlock