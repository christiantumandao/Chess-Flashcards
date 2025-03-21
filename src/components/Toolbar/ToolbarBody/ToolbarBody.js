import React from "react";

import { useLocation } from "react-router-dom";

import ToolbarBodyHeader from "./ToolbarBodyHeader";
import ToolbarContent from "./Content/ToolbarContent";

const ToolbarBody = (props) => {

    const { user,
            flashcards, 
            folders, setFolders,
            currentFolder, setCurrentFolder,
            toolbarTab, setToolbarTab,

            editFolderMode, setEditFolderMode,
            editFlashcardsMode, setEditFlashcardsMode,

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
            freestyle
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
                        folders = { folders }
                        setFolders = { setFolders } 

                        addOpeningsToFolder = { addOpeningsToFolder } 
                        setAddOpeningsToFolder = { setAddOpeningsToFolder }
                        editFolderMode = { editFolderMode }
                        setEditFolderMode = { setEditFolderMode }   
                        editFlashcardsMode = { editFlashcardsMode }
                        setEditFlashcardsMode = { setEditFlashcardsMode }

                        user = { user }
                        testMode = { testMode }
                        freestyle = { freestyle }
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
                toolbarTab = { toolbarTab } 
                setToolbarTab = { setToolbarTab }
                
                editFolderMode = { editFolderMode } 
                setEditFolderMode = { setEditFolderMode }
                addOpeningsToFolder = { addOpeningsToFolder } 
                editFlashcardsMode = { editFlashcardsMode }
                setAddOpeningsToFolder = { setAddOpeningsToFolder }
        
                autoPlayOpening = { autoPlayOpening }
                testMode = { testMode }
                freestyle = { freestyle }
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