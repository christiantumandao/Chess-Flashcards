import React, { useState, useEffect } from "react";
import "../../../../styles/selectOpeningsInFolder.css";

import { FaWindowClose } from "react-icons/fa";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../../../../firebase.config";
import { useNavigate } from "react-router-dom";
import FlashcardToSelect from "./FlashcardToSelect";


const SelectOpeningsInFolder = (props) => {
    const { 
            mode, // delete, add
            flashcards,
            setAddOpeningsToFolder,
            setEditFolderMode,
            currentFolder,
            setCurrentFolder,
            autoPlayOpening,
            user,
            folders,
            setFolders,
     } = props;

    const nav = useNavigate();

    const [selectedFlashcards, setSelectedFlashcards] = useState([]);
    const [addableFlashcards, setAddableFlashcards] = useState([]);

    useEffect(()=> {

        const filterFlashcards = () => {
            const flashcardEcos = currentFolder.openings.map((f)=>f.eco);
            const newAddableFlashcards = flashcards.filter((flashcard) => !flashcardEcos.includes(flashcard.eco));
            setAddableFlashcards(newAddableFlashcards);
        }

        if (mode === "add" && addableFlashcards.length === 0 && flashcards.length !== 0) filterFlashcards();

    },[]);

    const handleDeleteOpeningsFromFolder = async () => {
        if (!user || selectedFlashcards.length === 0) return;

        try {
            // create a new object of current folders and set it over the current one in db
            // update the state of current folder
            // update the state of folders

            const newCurrentFolder = {...currentFolder};
            newCurrentFolder.openings = newCurrentFolder.openings.filter((opening) => 
                !selectedFlashcards.some(flashcard => flashcard.moves === opening.moves && 
                                                        flashcard.name === opening.name &&
                                                        flashcard.fen === opening.fen )
            );

            const folderRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            await setDoc(folderRef, newCurrentFolder)
                .then(() => {
                    setCurrentFolder(newCurrentFolder);

                    const newFolders = folders.filter((folder)=>!folder.name !== newCurrentFolder.name);
                    newFolders.push(newCurrentFolder);
                    setFolders(newFolders);
                    setAddOpeningsToFolder(false);

                    setEditFolderMode(false);
                })
                .catch((e) => console.error);
        } catch (e) {
            console.error(e);
        }

    }

    const handleAddOpenings = async () => {

        if (!user || selectedFlashcards.length === 0) return;

        try {
            const folderRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            const folderSnap = await getDoc(folderRef);
            if (folderSnap.exists()) {

                const newFolder = folderSnap.data();
                
                selectedFlashcards.forEach(opening => {
                    newFolder.openings.push(opening);
                });

                await setDoc(folderRef, newFolder)
                    .then(()=>{
                        setAddOpeningsToFolder(false);
                        setSelectedFlashcards([]);
                        const newFolders = folders.filter((f) => f.name !== newFolder.name);
                        setCurrentFolder(newFolder);
                        newFolders.push(newFolder);
                        setFolders(newFolders);
                    })
                    .catch(e => console.error(e));
            } else {
                console.error("Error: folder not found in DB");
            }
            


        } catch (e) {
            console.error(e);
        }
    }


    const getHeader = () => {
        return (
            <div className="add-openings-modal-header">
                    {
                        (mode === "add") ?
                        <button onClick = {()=> setAddOpeningsToFolder(false) }className="close-add-openings-modal-btn">
                            <FaWindowClose />
                        </button>
                        : null
                    }

                {
                    (mode === "delete") ? 
                        <h4>Delete Flashcards From { currentFolder.name }</h4>
                    :
                    (mode === "add") ? 
                        <h4>Add Flashcards to { currentFolder.name }</h4>
                    :
                        <h4>Delete Flashcards</h4>
                }
        </div>
        )
    }

    const getFlashcardsToDeleteFromFolder = () => {
        return (
            (currentFolder.openings.length > 0) ? 
                currentFolder.openings.map((flashcard, idx)=>
                    <FlashcardToSelect 
                        key = { flashcard.moves + idx }
                        flashcard = { flashcard }
                        autoPlayOpening = { autoPlayOpening }
                        setSelectedFlashcards = { setSelectedFlashcards }
                        selectedFlashcards = { selectedFlashcards }
                        selected = { selectedFlashcards.some(f => f.moves + idx === flashcard.moves + idx) }
                    />
                ) 
            : 
                <h5 className="no-openings-to-add">
                    You do not seem to have any openings in this folder... Add openings to your main flashcards list in Explore.
                </h5>
        )
    }

    const getFlashcardsToAdd = () => {
        return (
            (addableFlashcards.length > 0) ? 
                addableFlashcards.map((flashcard, idx)=>
                    <FlashcardToSelect 
                        key = { flashcard.moves  + idx}
                        flashcard = { flashcard }
                        autoPlayOpening = { autoPlayOpening }
                        setSelectedFlashcards = { setSelectedFlashcards }
                        selectedFlashcards = { selectedFlashcards }
                        selected = { selectedFlashcards.some(f => f.moves + idx === flashcard.moves + idx) }
                    />
                ) 
            : 
                <h5 className="no-openings-to-add">
                    You do not seem to have openings to add to this folder... Add openings to your main flashcards list in Explore.
                </h5>
        )
    }

    const getButtons = () => {
        return (
            (
                (mode === "add" && addableFlashcards.length === 0) ||
                (mode === "delete" &&
                    (!currentFolder || currentFolder.openings.length === 0)
                )
            ) ? 
                <button className="add-openings-btn" onClick = { () => nav("/") }>
                    Explore
                </button>
            : 
                (mode === "delete") ?
                    <button className="delete-openings-btn red-btn" onClick = { handleDeleteOpeningsFromFolder }>
                        Delete Flashcards
                    </button>

            :
                <button className="add-openings-btn" onClick = { handleAddOpenings }>
                    Add Openings
                </button>
            )
    }

    return (


            <div className = "add-openings-modal-container">
                { getHeader() }

                <div className="add-openings-modal-body">
                {
                    (mode === "add") ?
                        getFlashcardsToAdd()
                    :
                        getFlashcardsToDeleteFromFolder() 

                        
                }
                </div>
                {
                    getButtons()
                }


        </div>
    )
}

export default SelectOpeningsInFolder;