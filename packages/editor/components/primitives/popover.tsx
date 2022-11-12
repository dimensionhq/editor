import React from 'react';
import * as Popover from '@radix-ui/react-popover';

interface Props {
    children: React.ReactNode[],

}

const PopoverComponent = (props: Props) => (
    <Popover.Root>
        <Popover.Trigger asChild>
            {props.children[0]}
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content className="de-popover-content" sideOffset={5}>
                {props.children[1]}
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
);

export default PopoverComponent;
