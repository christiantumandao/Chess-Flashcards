import React, { useState } from "react";
import "../styles/flashcard.css";
import { useLocation } from "react-router-dom";

import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.config";


const Folder = (props) => {

    const { folder, deleteFolder, deleteFolderRecursive, setCurrentFolder } = props;

    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [edit, setEdit] = useState(false);

    const handleDeleteFolder = async () => {

    }

    const handleDeleteFolderRecursive = async () => {

    }

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDeleteMessage(true);
    }

    return (
        (!showDeleteMessage) ?
        <div 
        onClick = { ()=> {
            setCurrentFolder(folder);
        } }
        className="folder-wrapper">
            <div className="flashcard-body">
                <h4 className="folder-title">
                    { folder.name }
                </h4>

            </div>

        </div> :
        <div className = "flashcard-wrapper">
            Delete openings in folder as well? This will also remove them from other folders!

            <button>Delete Folder</button>
            <button>Delete Folder and Openings</button>
        </div>
    );
}

export default Folder;