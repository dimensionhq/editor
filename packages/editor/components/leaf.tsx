export default function Leaf(props: any) {
    if (props.leaf.placeholder) {
        return (
            <>
                <span contentEditable={false}>
                    {props.leaf.placeholder}
                </span>
                <span {...props.attributes}>{props.children}</span>
            </>
        );
    }

    if (props.leaf.strikeThrough) {
        props.children = <del>{props.children}</del>;
    }

    if (props.leaf.bold) {
        props.children = <strong>{props.children}</strong>;
    }

    if (props.leaf.italic) {
        props.children = <em>{props.children}</em>;
    }

    if (props.leaf.underline) {
        props.children = <u>{props.children}</u>;
    }


    return <span {...props.attributes}>{props.children}</span>;
}
