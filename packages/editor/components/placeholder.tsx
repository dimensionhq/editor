import { useEffect, useState } from "react"

interface Props {
    children: React.ReactNode,
    dialog: React.ReactNode,
}

const Placeholder = (props: Props) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const dialog = document.getElementById("de-dialog")
        console.log(dialog)
        const handleClickOutside = (e: MouseEvent) => {
            if (dialog && !dialog.contains(e.target as Node)) {
                console.log("FALSE")
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [open])

    return (
        <div onClick={() => {
            setOpen(true)
        }} className="de-placeholder" contentEditable="false">
            {props.children}
            {open && props.dialog}
        </div>
    )
}

export default Placeholder