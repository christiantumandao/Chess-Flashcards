import React, { useEffect, useState } from "react";
import "../../../../styles/flashcard.css";

import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../firebase.config";
import { doc, setDoc } from "@firebase/firestore";


const Flashcard = (props) => {
    const { flashcard,
            flashcards,
            setFlashcards,
            testMode, 
            flashcardIdx, 
            idx, 
            autoPlayOpening,
            deleteFlashcard, 
            showDelete,
            currentFolder, setCurrentFolder,
            setFolders,
            folders,
            toolbarTab } = props;

    const [user] = useAuthState(auth);
    const [editFlashcard, setEditFlashcard] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(()=>{
        setNewName("");
    },[editFlashcard])

    const handleDeleteFlashcard = async (e) => {
        e.stopPropagation();

        if (toolbarTab === "Flashcards") await deleteFlashcard(flashcard);
        else if (toolbarTab === "FolderFocus" && currentFolder) await deleteFlashcard(flashcard, currentFolder);
        else {
            console.error("Error resolving flashcard/folder for deletion");
        }
    }

    const getFlashcardContent = () => {
        return(
            <>
                <h4 className="flashcard-title">
                    { (flashcard) ? parseName() : null}
                </h4>
                <p>
                    {(testMode) ? null : flashcard.moves }
                </p>
            </>
        )
    }

    const getEditFlashcard = () => {
        return (
            <form 
                className="edit-flashcard-name-form"
                onSubmit = { handleEditFlashcardName }>
                    
                <input 
                    placeholder={(flashcard) ? parseName() : null }
                    value = { newName }
                    onChange = { (e) => setNewName(e.target.value)}
                    onClick = { (e) => e.stopPropagation()}
                    required
                />
                <button 
                    onClick = { (e) => e.stopPropagation()}
                    className= "edit-flashcard-btn green-btn" type="submit">
                    Change
                </button>
            </form>
        )
    }

    const getFlashcardButtons = () => {
        if (user) {
        return (
            <button 
                onClick = { (e)=> {
                    setEditFlashcard(true); 
                    e.stopPropagation()
                }}
                className="flashcard-button-container edit-flashcard-button">
                <FaRegEdit />
            </button>
        )}
        else return null;
    }

    const getEditingFlashcardButtons = () => {
        return (
            <button 
                onClick = { (e)=> { 
                    setEditFlashcard(false); 
                    e.stopPropagation()
                }}
                className="edit-flashcard-button">
                Cancel
            </button>
        )
    }

    const handleEditFlashcardName = async (e) => {
        e.preventDefault();
        if (!user) return;
       
        (currentFolder && toolbarTab === "FolderFocus") ? handleEditInFolder() : handleEditFlashcard();
    }

    const handleEditInFolder = async () => {
        try {
            const ref = doc(db, "userData", user.uid, "folders", currentFolder.name);

            const newFolder = {
                name: currentFolder.name,
                openings: currentFolder.openings.map((opening) => {
                if (opening.moves === flashcard.moves) {
                    return {...opening, name: newName};
                } else return opening;
            })}
            await setDoc(ref, newFolder)
                .then(()=>{
                    setNewName("");
                    setEditFlashcard(false);
                    // setCurrentFolders
                    const newFolders = folders.map((folder)=> {
                        if (folder.name === currentFolder.name) {
                            return newFolder;
                        } else return folder;
                    })
                    setFolders(newFolders);
                    setCurrentFolder(newFolder);
                    setEditFlashcard(false);
                })
                .catch((e)=> {
                    console.error(e);
                }) 
        } catch (e) {
            console.error(e);
        }
    }

    const handleEditFlashcard = async () => {
        try {
            if (!flashcard.id) {
                console.error("Cannot resolve flaschard id");
                return;
            }
            const ref = doc(db, "userData", user.uid, "flashcards", flashcard.id);
            const newFlashcard = {...flashcard, name: newName};
            const newFlashcards = flashcards.map((f)=> {
                if (f.id === flashcard.id) {
                    return newFlashcard;
                } else return f;
            })
            await setDoc(ref, newFlashcard)
                .then(()=>{
                    setNewName("");
                    setFlashcards(newFlashcards);
                    setEditFlashcard(false);
                })
                .catch((e)=> {
                    console.error(e);
                })
            

        } catch (e) {

        }
    }

    const parseName = () => {
        return "["+flashcard.eco+"] "+flashcard.name;
    }

    return (
        <div 
            className={(testMode && idx === flashcardIdx) ? "flashcard-wrapper flashcard-highlight" : "flashcard-wrapper"} 
            onClick ={ () => {
                if (!testMode) autoPlayOpening(flashcard)
            }}>     

            <div className="flashcard-body">
            {
                (!editFlashcard) ? 
                    getFlashcardContent() :
                    getEditFlashcard()
            }
            </div>

            {
                (editFlashcard) ?
                    getEditingFlashcardButtons() :
                    getFlashcardButtons()
            }

            {
                (showDelete) ? 
                   <button 
                    onClick = { handleDeleteFlashcard }
                    className="red-btn delete-flashcard-btn flashcard-button-container">
                        <FaRegTrashAlt />
                   </button>
                : null
            }


        </div>
    );
}

export default Flashcard;