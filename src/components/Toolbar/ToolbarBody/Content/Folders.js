import React, { useState, useEffect } from "react";
import FolderWrapper from "./FolderWrapper";
import { FaPlusCircle } from "react-icons/fa";

import CreateFolder from "./CreateFolder";

// rename to "FoldersTab" ? 
// component outputs either the folders user has OR the openings of a selected folder
const Folders = (props) => {

    const { currentFolder,
            folders,
            setFolders,
            setCurrentFolder,
            setAddOpeningsToFolder,
            setToolbarTab,
        } = props;

    const [showAddFolder, setShowAddFolder] = useState(false);

    // if user goes back to folders during adding openings, it will reset addOpeningsToFolder
    useEffect(()=> {
        if (currentFolder) setAddOpeningsToFolder(false);
    },[currentFolder])

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