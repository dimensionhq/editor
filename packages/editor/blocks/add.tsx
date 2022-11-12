import { IconBrandCodepen, IconBrandCodesandbox, IconBrandFigma, IconH1, IconH2, IconH3, IconH4, IconList, IconListCheck, IconNews, IconPhoto, IconPictureInPicture, IconVideo } from "tabler-icons";
const AddComponent = () => {
    return (
        <div className="de-add-control-popover">
            <h1 className="section">Text</h1>
            <div className="item">
                <IconNews size={16} />
                <span>Paragraph</span>
            </div>
            <div className="item">
                <IconH1 size={16} />
                <span>Heading 1</span>
            </div>
            <div className="item">
                <IconH2 size={16} />
                <span>Heading 2</span>
            </div>
            <div className="item">
                <IconH3 size={16} />
                <span>Heading 3</span>
            </div>
            <div className="item">
                <IconList size={16} />
                <span>List</span>
            </div>
            <div className="item">
                <IconListCheck size={16} />
                <span>TodoList</span>
            </div>
            <div className="separator"></div>
            <h1 className="section">Media</h1>
            <div className="item">
                <IconPhoto size={16} />
                <span>Image</span>
            </div>
            <div className="item">
                <IconVideo size={16} />
                <span>Image</span>
            </div>
            <div className="separator"></div>
            <h1 className="section">Embeds</h1>
            <div className="item">
                <IconBrandCodesandbox size={16} />
                <span>Codesandbox</span>
            </div>
            <div className="item">
                <IconBrandFigma size={16} />
                <span>Figma</span>
            </div>
        </div>
    )
}

export default AddComponent