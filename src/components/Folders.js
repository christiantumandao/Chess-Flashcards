import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import Folder from "./Folder";
import { FaPlusCircle } from "react-icons/fa";

import CreateFolder from "./CreateFolder";
import AddOpeningsToFolder from "./AddOpeningsToFolder";
import { db } from "../firebase.config";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

// rename to "FoldersTab" ? 
// component outputs either the folders user has OR the openings of a selected folder
const Folders = (props) => {

    const { currentFolder,
            testMode,
            autoPlayOpening,
            flashcardIdx,
            folders,
            setFolders,
            deleteFolder,
            setCurrentFolder,
            flashcards,
            editFolderMode,
            user,
            addOpeningsToFolder,
            setAddOpeningsToFolder

        } = props;

    const [showAddFolder, setShowAddFolder] = useState(false);

    // if user goes back to folders during adding openings, it will reset addOpeningsToFolder
    useEffect(()=> {
        if (currentFolder) setAddOpeningsToFolder(false);
    },[currentFolder])

    const deleteFlashcardFromFolder = async (eco, flashcard) => {

        // called as such in <Flashcard /> : await deleteFlashcard(flashcard.eco, flashcard);

        if (!user || !currentFolder) return;

        try {
            // grab folder
            // update its openings folder,
            const folderRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            const folderSnapshot = await getDoc(folderRef);
            if (folderSnapshot.exists()) {
                const folderFromDB = folderSnapshot.data();

                const newOpenings = folderFromDB.openings.filter((opening) => opening.eco !== eco);
                folderFromDB.openings = newOpenings;
                const newCurrentFolder = {...currentFolder};
                newCurrentFolder.openings = newOpenings;
                await updateDoc(folderRef, {openings: newOpenings})
                    .then(()=>{
                        setCurrentFolder(newCurrentFolder);
                        const newFolders = folders.filter((folder)=> folder.name !== currentFolder.name);
                        newFolders.push(newCurrentFolder);
                        setFolders(newFolders);
                    })
                    .catch((e)=> console.error(e));
            } else {
                console.error("Error in deleting flashcard from folder: Could not find folder in DB");
            }
        } catch (e) {
            console.error(e);
        }

    }

    const getCreateFolderEelement = () => {
        return (
            (showAddFolder) ? 
            <div className="add-folder-input-wrapper">
                <CreateFolder 
                    folders = { folders }
                    setFolders = { setFolders }
                    showAddFolder = { showAddFolder }
                    setShowAddFolder = { setShowAddFolder }
                />

            </div>
            : 
            <button 
                onClick = { ()=> setShowAddFolder(true) }
                className="add-folder-wrapper">
                    <FaPlusCircle />
                    <h4>Create Folder</h4>
            </button>
        );
    }

    const getFolders = () => {
        return (
            folders.map((folder, idx) => (
                <Folder 
                    key = { idx }
                    folder = { folder }
                    deleteFolder = { deleteFolder }
                    setCurrentFolder = { setCurrentFolder }
                />
            ))
        )
    }

    const getAddToFolderElement = () => {
        return (
            (addOpeningsToFolder || editFolderMode) ? null :
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
                    autoPlayOpening = { autoPlayOpening }
                    flashcardIdx = { flashcardIdx }
                    deleteFlashcard = { deleteFlashcardFromFolder }
                    showDelete = { editFolderMode }
                />
            ))

        );
    }


    return (
        <>
            {
                (addOpeningsToFolder && currentFolder) ? 
                    <AddOpeningsToFolder 
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

                (currentFolder) ? 
                    // showing folder contents
                    <div className="flashcards-container">
                        { getAddToFolderElement() }
                        { showFolderOpenings() }
                    </div>

                    : 

                    // maps out differnet folders
                    <div className="flashcards-container"> 
                        { getCreateFolderEelement() }
                        { getFolders() }
                    </div> 
            }
        </>
    )
}

export default Folders;