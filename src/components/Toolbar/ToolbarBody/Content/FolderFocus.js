import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import Flashcard from "./Flashcard";
import SelectOpeningsInFolder from "./SelectOpeningsInFolder";

const FolderFocus = (props) => {

    const {
        currentFolder,
        addOpeningsToFolder, setAddOpeningsToFolder,
        testMode,
        autoPlayOpening,
        flashcardIdx,
        editFolderMode, setEditFolderMode,
        flashcards,
        user,
        folders, 
        setFolders,
        setCurrentFolder,
        toolbarTab, 
        setFlashcards
    } = props;

    

    const getAddToFolderElement = () => {
        return (
            (addOpeningsToFolder || editFolderMode || testMode) ? null :
            <button 
                onClick = { ()=> setAddOpeningsToFolder(true) }
                className="add-folder-wrapper">
                    <FaPlusCircle />
                    <h4>Add Openings</h4>
            </button>
        )
    }

    const showFolderOpenings = () => {
        return (

            currentFolder.openings.map((opening, idx)=>(
                <Flashcard 
                    key = { opening.moves + idx }
                    idx = { idx }
                    testMode = { testMode }
                    flashcard = { opening }
                    setFlashcards = { setFlashcards }
                    flashcards = { flashcards }
                    setFolders = { setFolders }
                    autoPlayOpening = { autoPlayOpening }
                    flashcardIdx = { flashcardIdx }
                    showDelete = { false }
                    toolbarTab = { toolbarTab }
                    currentFolder = { currentFolder }
                    setCurrentFolder = { setCurrentFolder }
                    folders = { folders }

                />
            ))

        );
    }
    return (
        
        (addOpeningsToFolder && currentFolder) ? 
            <SelectOpeningsInFolder
                mode = "add"
                flashcards = { flashcards }
                setAddOpeningsToFolder = { setAddOpeningsToFolder }
                currentFolder = { currentFolder }
                setCurrentFolder = { setCurrentFolder }
                autoPlayOpening = { autoPlayOpening }
                user = { user }
                folders = { folders }
                setFolders = { setFolders }
            /> 
        :
        (editFolderMode && currentFolder) ?
            <SelectOpeningsInFolder 
                mode = "delete"
                flashcards = { flashcards }
                setAddOpeningsToFolder = { setAddOpeningsToFolder }
                currentFolder = { currentFolder }
                setCurrentFolder = { setCurrentFolder }
                autoPlayOpening = { autoPlayOpening }
                user = { user }
                folders = { folders }
                setFolders = { setFolders }
                setEditFolderMode = { setEditFolderMode }
            />
        :
            <div className="flashcards-container">
                { getAddToFolderElement() }
                { showFolderOpenings() }
            </div>
        
    )
}

export default FolderFocus;