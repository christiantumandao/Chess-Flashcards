import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import Folder from "./Folder";
import { FaPlusCircle } from "react-icons/fa";

const Folders = (props) => {

    const { currentFolder,
            testMode,
            autoPlayOpening,
            flashcardIdx,
            deleteFlashcard,
            folders,
            deleteFolder,
            setCurrentFolder ,
        } = props;

    const [folderName, setFolderName] = useState("");
    const [showAddOpeningInput, setShowAddOpeningInput] = useState(false);

    return (
        <>
        {
        (currentFolder) ? 

        // maps out openings in folder
        currentFolder.openings.map((opening, idx)=>(
            <Flashcard 
                key = { opening.moves + idx }
                idx = { idx }
                testMode = { testMode }
                flashcard = { opening }
                autoPlayOpening = { autoPlayOpening }
                flashcardIdx = { flashcardIdx }
                deleteFlashcard = { deleteFlashcard }
                showDelete = { true }
            />
        ))

        : // maps out differnet folders
        <div className="flashcards-container"> 
        {
            (showAddOpeningInput) ? 
            <div className="add-folder-input-wrapper">
                <div className="add-folder-input-container">

                    <div className="add-folder-input-field">
                        <label>Folder Name</label>
                        <input 
                            type="text"
                            placeholder="(e.g) Sicilian"
                        />
                    </div>

                    <div className="add-folder-buttons">
                        <button className="create-folder">
                            Create
                        </button>
                        <button className="cancel-create-folder" onClick = {()=> (setShowAddOpeningInput(false))}>
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
            : 
            <button 
                onClick = { ()=> setShowAddOpeningInput(true) }
                className="add-folder-wrapper">
                    <FaPlusCircle />
                    <h4>Create Folder</h4>
            </button>
        }

        {
            folders.map((folder, idx) => (
                <Folder 
                    key = { idx }
                    folder = { folder }
                    deleteFolder = { deleteFolder }
                    setCurrentFolder = { setCurrentFolder }
                />
            ))
        }
        </div> 
}
        </>
    )
}

export default Folders;