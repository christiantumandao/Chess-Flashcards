import React, { useState, useEffect } from "react";
import "../styles/addOpeningsToFolder.css";

import { FaWindowClose } from "react-icons/fa";
import Flashcard from "./Flashcard";
import FlashcardToAdd from "./FlashcardToAdd";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase.config";


const AddOpeningsToFolder = (props) => {
    const { flashcards,
            setAddOpeningsToFolder,
            currentFolder,
            setCurrentFolder,
            autoPlayOpening,
            user,
            folders,
            setFolders
     } = props;

    const [openingsToAdd, setOpeningsToAdd] = useState([]);
    const [addableFlashcards, setAddableFlashcards] = useState([]);

    useEffect(()=> {

        const filterFlashcards = () => {
            const flashcardEcos = currentFolder.openings.map((f)=>f.eco);
            const newAddableFlashcards = flashcards.filter((flashcard) => !flashcardEcos.includes(flashcard.eco));
            setAddableFlashcards(newAddableFlashcards);
        }

        if (addableFlashcards.length === 0 && flashcards.length !== 0) filterFlashcards();
    },[]);

    const handleAddOpenings = async () => {

        if (!user) return;

        if (openingsToAdd.length === 0) return;

        try {
            const folderRef = doc(db, "userData", user.uid, "folders", currentFolder.name);
            const folderSnap = await getDoc(folderRef);
            if (folderSnap.exists()) {

                const newFolder = folderSnap.data();
                
                openingsToAdd.forEach(opening => {
                    newFolder.openings.push(opening);
                });

                await setDoc(folderRef, newFolder)
                    .then(()=>{
                        setAddOpeningsToFolder(false);
                        setOpeningsToAdd([]);
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

    return (


            <div className = "add-openings-modal-container">
                <div className="add-openings-modal-header">
                    <button onClick = {()=> setAddOpeningsToFolder(false) }className="close-add-openings-modal-btn">
                        <FaWindowClose />
                    </button>
                    <h4>Add Flashcards to { currentFolder.name }</h4>
                </div>

                <div className="add-openings-modal-body">
                {
                    addableFlashcards.map((flashcard, idx)=>
                        <FlashcardToAdd 
                            key = { flashcard.eco }
                            flashcard = { flashcard }
                            autoPlayOpening = { autoPlayOpening }
                            setOpeningsToAdd = { setOpeningsToAdd }
                            openingsToAdd = { openingsToAdd }
                            selected = { openingsToAdd.some(f => f.eco === flashcard.eco) }
                        />
                    )
                }
                </div>

                <button className="add-openings-btn" onClick = { handleAddOpenings }>
                    Add Openings
                </button>

        </div>
    )
}

export default AddOpeningsToFolder;