import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Flashcard from "./Flashcard";
import SelectOpeningsInFolder from "./SelectOpeningsInFolder";
import { useNavigate } from "react-router-dom";

const FolderFocus = (props) => {

    const {
        flashcards,
        setFlashcards,
        currentFolder, setCurrentFolder,
        folders, setFolders,

        addOpeningsToFolder, setAddOpeningsToFolder,
        editFolderMode,

        user,
        toolbarTab, 
        deleteFlashcard,
        testMode,
        autoPlayOpening,
        flashcardIdx,
        freestyle
    } = props;

    const [showSignInMsg, setShowSignInMsg] = useState(false);
    const nav = useNavigate();  
    
    useEffect(()=>{
        setShowSignInMsg(false);
        
        return ()=>{
            setShowSignInMsg(false);
        }
    },[toolbarTab]);

    const getAddToFolderElement = () => {
        return (
            (addOpeningsToFolder || editFolderMode || testMode || freestyle) ? null :
            <button 
                onClick = { ()=> (user) ? setAddOpeningsToFolder(true) : setShowSignInMsg(true) }
                className="add-folder-wrapper">
                    <FaPlusCircle />
                    <h4>Add Openings</h4>
            </button>
        )
    }

    const getSignInMessage = () => {
        return (
            <div className="add-folder-input-wrapper">
                <div>
                    You must be signed in to edit this folder!
                </div>

                <button 
                    className="add-folder-sign-in-msg"
                    onClick = { () => nav("/log-in") }>
                    Sign in here
                </button>
            </div>
        )
    }

    const showFolderOpenings = () => {
        return (

            currentFolder.openings.map((opening, idx)=>(
                <Flashcard 
                    key = { opening.moves + idx }
                    idx = { idx }
                    testMode = { testMode }
                    freestyle = { freestyle }
                    flashcard = { opening }
                    setFlashcards = { setFlashcards }
                    flashcards = { flashcards }
                    setFolders = { setFolders }
                    autoPlayOpening = { autoPlayOpening }
                    flashcardIdx = { flashcardIdx }
                    showDelete = { editFolderMode }
                    toolbarTab = { toolbarTab }
                    currentFolder = { currentFolder }
                    setCurrentFolder = { setCurrentFolder }
                    folders = { folders }

                />
            ))

        );
    }

    const showEditFolderOpenings = () => {
        return (

            currentFolder.openings.map((opening, idx)=>(
                <Flashcard 
                    key = { opening.moves + idx }
                    idx = { idx }
                    testMode = { testMode }
                    freestyle = { freestyle }
                    flashcard = { opening }
                    setFlashcards = { setFlashcards }
                    flashcards = { flashcards }
                    setFolders = { setFolders }
                    autoPlayOpening = { autoPlayOpening }
                    flashcardIdx = { flashcardIdx }
                    showDelete = { true }
                    toolbarTab = { toolbarTab }
                    currentFolder = { currentFolder }
                    setCurrentFolder = { setCurrentFolder }
                    folders = { folders }
                    deleteFlashcard = { deleteFlashcard }

                />
            ))

        );
    }

    return (
        
        (addOpeningsToFolder && currentFolder) ? 
            <SelectOpeningsInFolder
                flashcards = { flashcards }
                setFlashcards = { setFlashcards }
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
            showEditFolderOpenings()
        :
            <div className="flashcards-container">
                { (showSignInMsg) ? getSignInMessage() : getAddToFolderElement() }
                { showFolderOpenings() }
            </div>
        
    )
}

export default FolderFocus;