import React, { useState } from "react";

import { auth, db } from "../../../../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "@firebase/firestore";
import { validateFolderName } from "../../../../util/helper";

const CreateFolder = (props) => {

    const {
        folders,
        setFolders,
        setShowAddFolder,
        isLoading, setIsLoading
    } = props;

    const [user] = useAuthState(auth);
    const [folderName, setFolderName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!user) {
            setErrorMessage("You must be signed in to create a folder!");
            setIsLoading(false);
            setErrorMessage("");
            return;
        }
        const validName = validateFolderName(folderName, setErrorMessage, folders);
        if (!validName) {
            console.error("Something went wrong validating name of folder");
            setIsLoading(false);
            setErrorMessage("");
            return;
        }

        try {

            const docRef = doc(db, "userData", user.uid, "folders", folderName);
            const folderToAdd = {
                name: folderName,
                openings: [

                ]
            };

            await setDoc(docRef, folderToAdd);

            const newFolders = [...folders];
            newFolders.push(folderToAdd);
            setFolders(newFolders);
            setShowAddFolder(false);


        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            setErrorMessage("");
        }
    }


    return (
        <form 
        className= {(isLoading) ? "hidden" : "add-folder-input-container" }
        onSubmit = { handleCreateFolder }>

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