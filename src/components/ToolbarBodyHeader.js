import { addDoc, deleteDoc, setDoc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaRegEdit } from "react-icons/fa";
import { db } from "../firebase.config";
import { doc } from "@firebase/firestore";
import { validateFolderName } from "../util/helper";

const ToolbarBodyHeader = (props) => {

    const {
        flashcardsOrFolder,
        setFlashcardsOrFolder,
        currentFolder,
        setCurrentFolder,
        editFolderMode,
        setEditFolderMode,
        user,
        folders,
        setFolders,
        addOpeningsToFolder

    } = props;

    const [newFolderName, setNewFolderName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        setEditFolderMode(false);
    },[])

    useEffect(()=>{
        setNewFolderName("");
        setErrorMessage("");
    },[editFolderMode])



    const handleDeleteFolder = async () => {
        try {
            console.log("deleting")

            const folderToDelete = currentFolder.name;

            const docRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            await deleteDoc(docRef)
                .then(()=>{
                    const newFolders = folders.filter((folder) => folder.name !== folderToDelete);
                    setFolders(newFolders);
                    setCurrentFolder(null);
                    setEditFolderMode(false);
                    setFlashcardsOrFolder("Folders");
                    console.log("delete complete")
                })
                .catch((e)=>{
                    console.error(e);
                })
        } catch (e) {
            console.error(e);
        }
    }

    const handleChangeFolderName = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Must be signed in!");
            return;
        }

        const validName = validateFolderName(newFolderName, setErrorMessage, folders);
        if (!validName) return;
        try {
            // get ref of folder with new name
            // delete document in db 
            // add it again with the new name
            // we must delete the document instead of updating to also update its id

            const oldName = currentFolder.name;
            const docRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            const newRef = doc(db, "userData", user.uid, "folders", newFolderName);

            const newCurrentFolder = {...currentFolder};
            newCurrentFolder.name = newFolderName;

            await deleteDoc(docRef)
                .then(()=>{

                })
                .catch((e)=> console.error(e));
            
            await setDoc(newRef, newCurrentFolder)
                .then(()=>{
                    setCurrentFolder(newCurrentFolder);
                    const newFolders = folders.filter((f)=> f.name !== oldName);
                    newFolders.push(newCurrentFolder);
                    setFolders(newFolders);
                    setEditFolderMode(false);
                })
                .catch((e)=>{
                    console.error(e);
                })


        } catch (e) {
            alert("An error occured changing folder name");
            console.error(e);
            setEditFolderMode(false);
        }


    }

    return (
        <div className="toolbar-body-header">
        
            <div className="toolbar-body-top-header">   
                { 
                    (editFolderMode) ? 
                        <>
                            <button 
                                onClick = { handleDeleteFolder }
                                className="delete-folder-btn red-btn">
                                Delete Folder
                            </button>

                            <button onClick = { () => setEditFolderMode(false) }className="cancel-edit-folder-btn">
                                Cancel
                            </button>
                        </>
                    :
                    <>
                        {
                            (flashcardsOrFolder === "Folders" && currentFolder) ? 
                            <button 
                            className="flashcards-folders-back-btn"
                            onClick = { () => setCurrentFolder(null)}>
                                <FaArrowLeft />
                            </button>
                            : null
                        }

                        <button 
                            className={ (flashcardsOrFolder === "Folders" && currentFolder) ? "flashcards-folders-btn margin-left-auto" : "flashcards-folders-btn"}
                            onClick = { () => (flashcardsOrFolder === "Folders") ? setFlashcardsOrFolder("Flashcards")  : setFlashcardsOrFolder("Folders")}>
                                {(flashcardsOrFolder === "Folders") ? "Flashcards" : "Folders" }
                        </button>
                    </>
                }
                

            


            </div>
            
            {
            (addOpeningsToFolder) ? null :
            <div className="toolbar-body-bottom-header">
                {
                    (editFolderMode) ? 
                    <div className="edit-name-container">
                    { errorMessage.length !== 0 ? <p className="error-message align-left">{ errorMessage }</p> : null }
                    <form className="edit-name-field-set" onSubmit = { handleChangeFolderName } >
                        <input 
                            type="text"
                            placeholder={currentFolder.name}
                            value = { newFolderName }
                            onChange = { (e) => setNewFolderName(e.target.value) }
                            required
                        />

                        {
                        (newFolderName.length !== 0) ? 
                        <button type="submit">
                            Change name
                        </button> : null
                        }
                    </form>
                    </div>
                    :
                    <h3>{(flashcardsOrFolder === "Folders") ? (currentFolder) ? currentFolder.name : "Folders" : "Flashcards"}</h3>
                }


                {
                    (flashcardsOrFolder === "Folders" && currentFolder && !editFolderMode) ?
                        <button onClick = { () => setEditFolderMode(true) }className="edit-folder-btn">
                            <FaRegEdit />
                        </button>
                    :
                    null
                }
            </div>
            }

        </div> 
    )
}

export default ToolbarBodyHeader;