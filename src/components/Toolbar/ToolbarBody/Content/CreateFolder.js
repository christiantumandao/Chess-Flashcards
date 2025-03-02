import React, { useState } from "react";

import { auth, db } from "../../../../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "@firebase/firestore";
import { validateFolderName } from "../../../../util/helper";

const CreateFolder = (props) => {

    const {
        folders,
        setFolders,
        showAddFolder,
        setShowAddFolder
    } = props;

    const [user] = useAuthState(auth);
    const [folderName, setFolderName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!user) {
            setErrorMessage("You must be signed in to create a folder!");
            return;
        }

        const validName = await validateFolderName(folderName, setErrorMessage, folders);
        if (!validName) {
            console.log("something went wrong");
            return;
        }

        try {

            const docRef = doc(db, "userData", user.uid, "folders", folderName);
            const folderToAdd = {
                name: folderName,
                openings: [

                ]
            };

            await setDoc(docRef, folderToAdd)
                .then( () => {
                    const newFolders = [...folders];
                    newFolders.push(folderToAdd);
                    setFolders(newFolders);
                    setShowAddFolder(false);
                }).catch( (e) => {
                    console.error(e);
                })

        } catch {

        }
        setErrorMessage("");
    }


    return (
        <form className="add-folder-input-container" onSubmit = { handleCreateFolder }>

            { (errorMessage.length > 0) ? <p className="error-message">{ errorMessage }</p> : null }

            <div className="add-folder-input-field">
                <label>Folder Name</label>
                <input 
                    type="text"
                    placeholder="(e.g) Sicilian"
                    value = { folderName }
                    onChange = { (e) => setFolderName(e.target.value) }
                    required
                />
            </div>

            <div className="add-folder-buttons">
                <button
                    type="submit"
                    className="create-folder">
                    Create
                </button>
                <button className="cancel-create-folder" onClick = {()=> (setShowAddFolder(false))}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default CreateFolder;