import React from "react";
import MovePair from "../../../MovePair";
import { collection, deleteDoc, doc, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../../../firebase.config";
import Flashcard from "./Flashcard";
import FolderFocus from "./FolderFocus";
import Folders from "./Folders";
import { useLocation } from "react-router-dom";
import { getDefaultCards } from "../../../../util/helper";
import SelectOpeningsInFolder from "./SelectOpeningsInFolder";

const ToolbarContent = (props) => {

    const { user,
        flashcards, 
        folders, setFolders,
        currentFolder, setCurrentFolder,
        getUserCards,
        toolbarTab, setToolbarTab,
        editFolderMode, setEditFolderMode,
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

    const deleteFlashcard = async (eco, fc, user) => {
        if (!user) return;
        /**
         * delete from db
         * delete from local array (flashcards)
         */

        try {
            if (eco === 'usr') { // not doing this yet
                // get the id of the opening from firebase
                // delete with id
                const q = query(collection(db, "userData", user.uid, "flashcards"), where("moves", "==", fc.moves));
                const querySnapshot = await getDocs(q);

                let qs = [];
                querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    qs.push(doc.id);
                });

                const path = "userData/"+user.uid+"/flashcards";
                await deleteDoc(doc(db, path, qs[0]));

                
            }
            else {     
                const path = "userData/"+user.uid+"/flashcards";
                await deleteDoc(doc(db, path, eco));
                const newFlashcards = flashcards.filter((flashcard) => flashcard.moves !== eco);
                setFlashcards(newFlashcards);
            }

            try {
                if (!user) {
                    getDefaultCards(setFlashcards);
                } else {
                    await getUserCards();
                }
            } catch (e) {
                console.error(e);
            }
            
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
                            deleteFlashcard = { deleteFlashcard }
                            showDelete = { true }
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
                            testMode = { testMode }
                            toolbarTab = { toolbarTab }
                            flashcard = { flashcard }
                            flashcards = { flashcards }
                            setFlashcards = { setFlashcards }
                            autoPlayOpening = { autoPlayOpening }
                            folders = { folders }
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