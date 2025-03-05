import React, { useState, useEffect } from "react";
import FolderWrapper from "./FolderWrapper";
import { FaPlusCircle } from "react-icons/fa";

import CreateFolder from "./CreateFolder";
import { useNavigate } from "react-router-dom";

// rename to "FoldersTab" ? 
// component outputs either the folders user has OR the openings of a selected folder
const Folders = (props) => {

    const { currentFolder,
            folders,
            setFolders,
            setCurrentFolder,
            setAddOpeningsToFolder,
            setToolbarTab,
            user
        } = props;

    const [showAddFolder, setShowAddFolder] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    const nav = useNavigate();

    // if user goes back to folders during adding openings, it will reset addOpeningsToFolder
    useEffect(()=> {
        if (currentFolder) setAddOpeningsToFolder(false);
    },[currentFolder, setAddOpeningsToFolder])


    useEffect(()=> {
        return (()=>{
            setShowSignIn(false);
            setShowAddFolder(false);
        })
    },[])

    const getCreateFolderEelement = () => {
        return (
            (showAddFolder) ? 
            <div className="add-folder-input-wrapper">
                <CreateFolder 
                    folders = { folders }
                    setFolders = { setFolders }
                    setShowAddFolder = { setShowAddFolder }
                />

            </div>
            : 
            (showSignIn) ?
            getSignIn()
            :
            <button 
                onClick = { ()=> (user) ? setShowAddFolder(true) : setShowSignIn(true) }
                className="add-folder-wrapper">
                    <FaPlusCircle />
                    <h4>Create Folder</h4>
            </button>
        );
    }

    const getSignIn = () => {
        return (
            <div className="add-folder-input-wrapper">
                <div>
                    You must be signed in to create a folder!
                </div>

                <button 
                    className="add-folder-sign-in-msg"
                    onClick = { () => nav("/log-in") }>
                    Sign in here
                </button>
            </div>
        )
    }

    const getFolders = () => {
        return (
            folders.map((folder, idx) => (
                <FolderWrapper 
                    key = { idx }
                    folder = { folder }
                    setCurrentFolder = { setCurrentFolder }
                    setToolbarTab = { setToolbarTab }
                />
            ))
        )
    }



    return (
            

                // maps out differnet folders
                <div className="flashcards-container"> 
                    { getCreateFolderEelement() }
                    { getFolders() }
                </div> 
            
        
    )
}

export default Folders;