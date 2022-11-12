import React, { useMemo, useState } from "react";
import { IconBrandCodesandbox, IconBrandFigma, IconH1, IconH2, IconH3, IconList, IconListCheck, IconNews, IconPhoto, IconVideo } from "tabler-icons";

const items = {
    "Text": [
        {
            id: 0,
            type: "Paragraph",
            icon: <IconNews size={16} />,
        },
        {
            id: 1,
            type: "Heading 1",
            icon: <IconH1 size={16} />,
        },
        {
            id: 2,
            type: "Heading 2",
            icon: <IconH2 size={16} />,
        },
        {
            id: 3,
            type: "Heading 3",
            icon: <IconH3 size={16} />,
        },
        {
            id: 4,
            type: "List",
            icon: <IconList size={16} />,
        },
        {
            id: 5,
            type: "Checklist",
            icon: <IconListCheck size={16} />,
        },
    ],
    "Media": [
        {
            id: 6,
            type: "Image",
            icon: <IconPhoto size={16} />,
        },
        {
            id: 7,
            type: "Video",
            icon: <IconVideo size={16} />,
        },
    ],
    "Embed": [
        {
            id: 8,
            type: "CodeSandbox",
            icon: <IconBrandCodesandbox size={16} />,
        },
        {
            id: 9,
            type: "Figma",
            icon: <IconBrandFigma size={16} />,
        },
    ],
}

const AddComponent = () => {
    const [query, setQuery] = useState("");
    let [currentSelection, setCurrentSelection] = useState(0)
    const filteredItems = useMemo(() => {
        const result = {};
        for (const [key, value] of Object.entries(items)) {
            const filtered = value.filter((item) => item.type.toLowerCase().includes(query.toLowerCase()));

            if (filtered.length > 0) {
                // @ts-ignore
                result[key] = filtered as any;
            }
        }
        return result;
    }, [query]);

    return (
        <div className="de-add-control-popover" id="popover">
            <input onKeyDown={(e) => {
                let selection = currentSelection;
                let isUp = e.key === "ArrowUp";
                if (e.key === "ArrowDown") {
                    if (currentSelection > 8) {
                        selection = 9;
                        setCurrentSelection(9)
                    } else {
                        selection++;
                        setCurrentSelection(currentSelection + 1);
                    }
                }
                if (e.key === "ArrowUp") {
                    if (currentSelection < 1) {
                        selection = 0;
                        setCurrentSelection(0);
                    } else {
                        selection--;
                        setCurrentSelection(currentSelection - 1);
                    }
                }

                const selector = document.querySelector(`[data-state="${selection}"]`)

                if (selection == 0) {
                    console.log("SCROLL TO TOP")
                    selector?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                // check if selector is in view of #popover
                if (selector) {
                    const popover = document.querySelector("#popover");
                    if (!popover) return;
                    const popoverRect = popover.getBoundingClientRect();
                    const selectorRect = selector.getBoundingClientRect();
                    if (selectorRect.top < popoverRect.top) {
                        selector.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else if (selectorRect.bottom > popoverRect.bottom) {
                        selector.scrollIntoView({ behavior: "smooth", block: "end" });
                    }
                }

                selector?.scrollIntoView({ behavior: "smooth", block: isUp ? "start" : "end" });
            }} className="search" value={query} onInput={(e) => setQuery(e.currentTarget.value)} />
            {Object.keys(filteredItems).map((key, index) => (
                <React.Fragment key={index}>
                    <h1 className="section">{key}</h1>
                    {/* @ts-ignore */}
                    {filteredItems[key].map((item: any, idx: any) => (
                        <div className="item" key={idx} data-state={item.id} data-selected={currentSelection == item.id ? true : false} >
                            <div className="icon">{item.icon}</div>
                            <div className="text">{item.type}</div>
                        </div>
                    ))}
                </React.Fragment>
            ))
            }
        </div >
    )
}

export default AddComponent