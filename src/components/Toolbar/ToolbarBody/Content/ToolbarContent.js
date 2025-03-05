import React from "react";
import MovePair from "../../../MovePair";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import { db } from "../../../../firebase.config";
import Flashcard from "./Flashcard";
import FolderFocus from "./FolderFocus";
import Folders from "./Folders";
import { useLocation } from "react-router-dom";

const ToolbarContent = (props) => {

    const { user,
        flashcards, 
        folders, setFolders,
        currentFolder, setCurrentFolder,
        toolbarTab, setToolbarTab,
        editFolderMode, setEditFolderMode,
        editFlashcardsMode,
        addOpeningsToFolder, setAddOpeningsToFolder,

        autoPlayOpening,
        testMode,
        game,
        searchResults,
        flashcardIdx,
        setFlashcards,
        currMove,
        startingFen,
        moveHistory,
    } = props;

    const currPath = useLocation();

    const deleteFlashcardFromFolder = async (fc, currFolder) => {
        if (!user) return;
        if (!currFolder || !fc) {
            console.error("Error resolving folder/flashcard");
            return
        }

        try {
            const ref = doc(db, "userData", user.uid, "folders", currFolder.name);

            const newCurrentFolder = { ...currFolder };
            newCurrentFolder.openings = currFolder.openings.filter((opening) => (
                opening.eco !== fc.eco &&
                opening.name !== fc.name &&
                opening.moves !== fc.moves &&
                opening.fen !== fc.fen
            ))

            const newFolders = folders.map((folder)=>{
                if (folder.name === currFolder) return newCurrentFolder;
                else return folder;
            })
            
            await setDoc(ref, newCurrentFolder)
                .then(()=>{
                    setCurrentFolder(newCurrentFolder);
                    setFolders(newFolders);
                })
        } catch(e) {
            console.error(e);
        }
    }

    // this is ONLY for deleting flashcards from main set
    const deleteFlashcardFromMain = async (fc) => {
        if (!user) {
            console.error('User not signed in');
            return;
        };
        if (!fc || !fc.id) {
            console.error("Issue resolving flashcard to delete");
            return;
        }

        try {
            const ref = doc(db, "userData", user.uid, "flashcards", fc.id);
            await deleteDoc(ref)
                .then(()=>{
                    const newFlashcards = flashcards.filter((f)=>f.id !== fc.id);
                    setFlashcards(newFlashcards);
                })
                .catch((e) => {
                    console.error(e);
                })
        } catch (e) {
            console.error(e);
        }
    }

    const showMoveHistory = () => {
        return (
            <div className="">
                {
                    moveHistory.map((move, idx)=> (
                       (idx % 2 === 0) ? 
                            <MovePair
                                key = { move } 
                                moveHistory = { moveHistory } 
                                idx = { idx } 
                                currMove = { currMove } 
                            /> 
                        : null
                    ))
                }
            </div>
        )
    }


    return (
            (toolbarTab === "Folders" && currPath.pathname === "/flashcards") ? 
                
                <Folders
                    currentFolder = { currentFolder}
                    folders = { folders }
                    setFolders = { setFolders }
                    setCurrentFolder = { setCurrentFolder }
                    setAddOpeningsToFolder = { setAddOpeningsToFolder }
                    setToolbarTab = { setToolbarTab }
                    user = { user }
                />
                
            :
            (toolbarTab === "FolderFocus" && currentFolder && currPath.pathname === "/flashcards") ?

                <FolderFocus 
                    currentFolder = { currentFolder }
                    addOpeningsToFolder = { addOpeningsToFolder }
                    setAddOpeningsToFolder = { setAddOpeningsToFolder }
                    testMode = { testMode }
                    autoPlayOpening = { autoPlayOpening }
                    flashcardIdx = { flashcardIdx }
                    editFolderMode = { editFolderMode }
                    flashcards = { flashcards }
                    user = { user }
                    folders = { folders }
                    setFolders = { setFolders }
                    setCurrentFolder = { setCurrentFolder }
                    setEditFolderMode = { setEditFolderMode }
                    toolbarTab = { toolbarTab }
                    setFlashcards = { setFlashcards }
                    deleteFlashcard = { deleteFlashcardFromFolder }

                />
            :
            <div className="flashcards-container">
            {
                // if in flashcard mode
                (flashcards && currPath.pathname === "/flashcards") ?
                    flashcards.map((flashcard, idx)=>(
                        <Flashcard 
                            key = { flashcard.moves + idx }
                            idx = { idx }
                            testMode = { testMode }

                            flashcard = { flashcard }
                            flashcards = { flashcards }
                            setFlashcards = { setFlashcards }
                            autoPlayOpening = { autoPlayOpening }
                            flashcardIdx = { flashcardIdx }
                            deleteFlashcard = { deleteFlashcardFromMain }
                            showDelete = { editFlashcardsMode }
                            toolbarTab = { toolbarTab }
                            folders = { folders }
                        />
                    )) 
                // if searched, none found
                /*: (searchResults && searchResults.length === 1 && currPath.pathname === "/" && searchResults[0] === "empty" && !currOpening) ?
                    <h1 className="empty-query-message">
                        No openings found. Try a different query or play a move to get started.
                    </h1>*/
                // if nothing done so far

                : (searchResults.length === 0 && currPath.pathname === "/" && game.fen() === startingFen) ?
                    <h1 className="empty-query-message">
                        Play a move or search for an opening above to get started.
                    </h1>
                // if searched and has results
                : (searchResults && searchResults.length > 0 && currPath.pathname === "/") ?
                    searchResults.map((flashcard, idx)=>(
                        <Flashcard
                            key = { flashcard.moves }
                            idx = { idx }
                            showDelete = { false }
                            toolbarTab = { toolbarTab }

                            folders = { folders }
                            flashcard = { flashcard }
                            flashcards = { flashcards }
                            setFlashcards = { setFlashcards }

                            autoPlayOpening = { autoPlayOpening }
                            testMode = { testMode }
                        />
                    ))
                : (currPath.pathname === "/") ? 
                    showMoveHistory()
                : null
                
            }
            </div>
    )
}

export default ToolbarContent;