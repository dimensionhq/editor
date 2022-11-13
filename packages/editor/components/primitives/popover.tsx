import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useEffect } from 'react';

interface Props {
    children: React.ReactNode[],
    element: any,
}

const PopoverComponent = (props: Props) => {
    const [open, setOpen] = useState(false);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const [slash, setSlash] = useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!triggerRef.current) return;
        triggerRef.current.addEventListener("open-popover", () => {
            setOpen(true);
            setSlash(true)
        })
    }, [])

    useEffect(() => {
        console.log(open)
        if (open === false) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        // check if escape key is pressed
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open])

    return (
        <Popover.Root open={open}>
            <Popover.Trigger ref={triggerRef} asChild id={`de-control-button-add-${props.element.id}`} onClick={() => {
                setOpen(true)
            }}>
                {props.children[0]}
            </Popover.Trigger>
            <Popover.Portal >
                <Popover.Content ref={popoverRef} className="de-popover-content" sideOffset={5}>
                    {React.cloneElement(props.children[1] as React.ReactElement, { slash, element: props.element })}
                    <Popover.Close onClick={() => setOpen(false)} id="de-popover-close" style={{ display: "none" }}>asd</Popover.Close>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
};

export default PopoverComponent;
