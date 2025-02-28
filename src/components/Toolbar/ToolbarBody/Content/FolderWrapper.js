import React from "react";
import "../../../../styles/flashcard.css";

const FolderWrapper = (props) => {

    const { folder, setCurrentFolder, setToolbarTab } = props;

    return (
        <div 
        onClick = { ()=> {
            setCurrentFolder(folder);
            setToolbarTab("FolderFocus");
        } }
        className="folder-wrapper">
            <div className="flashcard-body">
                <h4 className="folder-title">
                    { folder.name }
                </h4>

            </div>

        </div>
    );
}

export default FolderWrapper;