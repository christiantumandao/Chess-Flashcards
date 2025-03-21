import React, { useEffect } from "react";
import EditFolderName from "./Content/EditFolderName";
import { deleteDoc, doc } from "@firebase/firestore";
import { db } from "../../../firebase.config";
import { FaRegEdit } from "react-icons/fa";

const ToolbarBodyHeader = (props) => {
    const {
        toolbarTab,
        setToolbarTab,
        currentFolder,
        setCurrentFolder,

        editFolderMode,
        setEditFolderMode,
        editFlashcardsMode,
        setEditFlashcardsMode,

        user,
        folders,
        setFolders,
        setAddOpeningsToFolder,
        testMode,
        freestyle

    } = props;

    useEffect(()=>{
        setEditFolderMode(false);
        setEditFlashcardsMode(false);

        return (
            () => {
                setEditFolderMode(false);
                setEditFlashcardsMode(false);               
            }
        )
    },[setEditFlashcardsMode, setEditFolderMode])

    // CONDITIONAL COMPONENTS

    const getTopHeader = () => {
        return (
            <div className="toolbar-body-top-header">   
            {  
                    (editFolderMode) ?
                        getEditFolderTopHeaderComponent()
                :   (editFlashcardsMode) ?
                        getEditFlashcardsTopHeaderComponent() 
                :
                        getFlashcardsOrFolders()
                    
            }
            </div>
        )
    }

    const getEditFlashcardsTopHeaderComponent = () => {
        return (
            <button onClick = { () => setEditFlashcardsMode(false) }className="cancel-edit-flashcards-btn">
                Exit
            </button>
        )
    }

    const getEditFolderTopHeaderComponent = () => {
        return (
            <>
                <button 
                    onClick = { handleDeleteFolder }
                    className="delete-folder-btn red-btn">
                    Delete Folder
                </button>

                <button onClick = { () => setEditFolderMode(false) }className="cancel-edit-folder-btn">
                    Exit
                </button>
            </>
        )
    }

    const getFlashcardsOrFolders = () => {
        return (
            <div className="folders-flashcards-button-container">
                <button
                    className={(toolbarTab === "Flashcards") ? "flashcards-folders-btn-selected border-right" :"flashcards-folders-btn border-right"}
                    disabled = { (toolbarTab === "Flashcards" || testMode || freestyle) }
                    onClick = { () => {
                        setToolbarTab("Flashcards");
                        setCurrentFolder(null);
                        setAddOpeningsToFolder(false);
                    }}
                >
                    Flashcards
                </button>
                <button
                    className={(toolbarTab === "Folders") ? "flashcards-folders-btn-selected" :"flashcards-folders-btn"}
                    disabled = { (toolbarTab === "Folders" || testMode || freestyle) }
                    onClick = { () => {
                        setToolbarTab("Folders");
                        setCurrentFolder(null);
                        setAddOpeningsToFolder(false);
                }}>
                    Folders
                </button>
            </div>
        )
    }



    const getBottomHeader = () => {
        return (
            <div className="toolbar-body-bottom-header">
            {
                (editFolderMode) ? 
                    <EditFolderName 
                    user = { user }
                    setEditFolderMode = { setEditFolderMode }
                    currentFolder = { currentFolder }
                    setCurrentFolder = { setCurrentFolder }
                    folders = { folders }
                    setFolders = { setFolders }
                    /> :
                <h3>
                {
                    (toolbarTab === "Folders") ?
                        "Folders" :
                    (toolbarTab === "FolderFocus" && currentFolder) ?
                        currentFolder.name :
                        "Flashcards"
                }
                </h3>
            }

            {
                (toolbarTab === "FolderFocus" && !editFolderMode && user && !testMode && !freestyle) ?
                    <button onClick = { () => setEditFolderMode(true) }className="edit-folder-btn">
                        <FaRegEdit />
                    </button>
                :  (toolbarTab === "Flashcards" && !editFlashcardsMode && user && !testMode && !freestyle) ? 
                    <button onClick = { () => setEditFlashcardsMode(true) }className="edit-folder-btn">
                        <FaRegEdit />
                    </button> : null  
            }
            </div>
        )
    }

    const handleDeleteFolder = async () => {
        try {

            const folderToDelete = currentFolder.name;

            const docRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            await deleteDoc(docRef)
                .then(()=>{
                    const newFolders = folders.filter((folder) => folder.name !== folderToDelete);
                    setFolders(newFolders);
                    setCurrentFolder(null);
                    setEditFolderMode(false);
                    setToolbarTab("Folders");
                })
                .catch((e)=>{
                    console.error(e);
                })
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div className="toolbar-body-header">
        
        { getTopHeader() }
        { getBottomHeader() }

        </div> 
    )
}

export default ToolbarBodyHeader;