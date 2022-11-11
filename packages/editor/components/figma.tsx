import { FigmaElement, ImageElement, VideoElement } from "../types";

interface Props {
    children: React.ReactNode,
    element: FigmaElement,
}

const FigmaBlock = (props: Props) => {
    return (
        <iframe width="100%"
            height="315"
            src={props.element.url!}
            title="Figma"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
}

export default FigmaBlock