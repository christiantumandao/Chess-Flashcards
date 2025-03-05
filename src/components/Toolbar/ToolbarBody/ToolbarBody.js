import React from "react";

import { useLocation } from "react-router-dom";

import ToolbarBodyHeader from "./ToolbarBodyHeader";
import ToolbarContent from "./Content/ToolbarContent";

const ToolbarBody = (props) => {

    const { user,
            flashcards, 
            folders, setFolders,
            currentFolder, setCurrentFolder,
            getUserCards,
            toolbarTab, setToolbarTab,

            editFolderMode, setEditFolderMode,

            addOpeningsToFolder, setAddOpeningsToFolder,

            autoPlayOpening,
            testMode,
            game,
            searchResults,
            flashcardIdx,
            setFlashcards,
            currMove,
            startingFen,
            moveHistory,
    } = props;

    const currPath = useLocation();

    return (
        <div className={currentFolder && currPath.pathname === "/flashcards" ? "toolbar-body toolbar-body-folder-highlight" : "toolbar-body"}>

            {/** Header of Body */}

            {
                (flashcards && currPath.pathname === "/flashcards") ? 
                    <ToolbarBodyHeader 
                        toolbarTab = { toolbarTab }
                        setToolbarTab = { setToolbarTab }
                        currentFolder = { currentFolder }
                        setCurrentFolder = { setCurrentFolder }   
                        editFolderMode = { editFolderMode }
                        setEditFolderMode = { setEditFolderMode }   
                        user = { user }
                        folders = { folders }
                        setFolders = { setFolders }
                        addOpeningsToFolder = { addOpeningsToFolder } 
                        setAddOpeningsToFolder = { setAddOpeningsToFolder }
                        testMode = { testMode }
                    />
                    : null
            }


            {/** Body of Body */}
            
            <ToolbarContent 
                user = { user }
                flashcards = { flashcards }
                folders = { folders }
                setFolders = { setFolders }
                currentFolder = { currentFolder } 
                setCurrentFolder = { setCurrentFolder }
                getUserCards = { getUserCards }
                toolbarTab = { toolbarTab } 
                setToolbarTab = { setToolbarTab }
                editFolderMode = { editFolderMode } 
                setEditFolderMode = { setEditFolderMode }
                addOpeningsToFolder = { addOpeningsToFolder } 
                setAddOpeningsToFolder = { setAddOpeningsToFolder }
        
                autoPlayOpening = { autoPlayOpening }
                testMode = { testMode }
                game = { game }
                searchResults = { searchResults }
                flashcardIdx = { flashcardIdx }
                setFlashcards = { setFlashcards }
                currMove = { currMove }
                startingFen = { startingFen }
                moveHistory = { moveHistory }
            />
            
            

        </div>
    )
}


export default ToolbarBody;