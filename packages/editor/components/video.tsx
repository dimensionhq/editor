import { ImageElement, VideoElement } from "../types";

interface Props {
    children: React.ReactNode,
    element: VideoElement,
}

const Video = (props: Props) => {
    return (
        <iframe width="100%"
            height="315"
            src={props.element.url!}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
}

export default Video