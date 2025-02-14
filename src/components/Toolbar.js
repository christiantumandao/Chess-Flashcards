import React, { useCallback, useEffect, useState } from "react";
import "../styles/toolbar.css";

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaArrowsAltV } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";



import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.config";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, setDoc, where } from "@firebase/firestore";
import { getDefaultCards, parseName, parseQuery, shuffleCards } from "../util/helper";

import MovePair from "./MovePair";
import Folder from "./Folder";
import Folders from "./Folders";
import Flashcard from "./Flashcard";
import ToolbarBodyHeader from "./ToolbarBodyHeader";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


const Toolbar = (props) => {
    const currPath = useLocation();
    const [user] = useAuthState(auth);
    const nav = useNavigate();

    const { tab } = props;

    const { game, undo, redo, currMove, restart, moveHistory,
            currOpening, 
            flashcards, 
            setFlashcards,
            autoPlayOpening, 
            color, setColor,
            folders, setFolders,

            testFlashcards, onFinishFlashcards,
            testMode, 
            flashcardIdx } = props;

    const [flashcardsOrFolder, setFlashcardsOrFolder] = useState("Flashcards");
    const [editFolderMode, setEditFolderMode] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [addOpeningsToFolder, setAddOpeningsToFolder] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [resultLimit, setResultLimit] = useState(20);
    const [showAddButton, setShowAddButton] = useState(true);


    const [modal, setModal] = useState("");

    const getUserCards = useCallback( async () => {
        try {
            const userCards = [];
            const querySnapshot = await getDocs(collection(db, "userData", user.uid, "flashcards"));
            querySnapshot.forEach((doc) => {
                userCards.push(doc.data());
            });
            setFlashcards(userCards);
        } catch (e) {
            console.error(e);
        }  
    },[user, setFlashcards])

    const getUserFolders = useCallback( async () => {
        try {
            const userFolders = [];
            const querySnapshot = await getDocs(collection(db, "userData", user.uid, "folders"));
            querySnapshot.forEach((doc) => {
                userFolders.push(doc.data());
            })
            setFolders(userFolders);
        } catch (e) {
            console.error(e);
        }
    },[user, setFolders]);

    // whenever the component is mounted or login changes, we get the user's cards
    // TO DO: 
    // TODO - non urgent: remove setFlashcard from dependency array
    useEffect(()=> {
        const fetchCards = async () => {
            try {
                if (!user) {
                    getDefaultCards(setFlashcards);
                } else {
                    await getUserCards();
                }
            } catch (e) {
                console.error(e);
            }
        }

        const fetchFolders = async () => {
            if (!user) {
                return;
            }

            try {
                await getUserFolders();
            } catch (e) {
                console.error(e);
            }
        }

        const fetchData = async () => {
            await fetchCards();
            await fetchFolders();
        }
        fetchData();
        setSearchResults([]);

        return () => {
            setSearchResults([]);
        }
    },[user, getUserCards, setFlashcards])

    // if the current position changes, then currOpening will change, and so add showAddButton
    useEffect(()=> {
        setShowAddButton(true);
    },[currOpening])

    // this is to make sure we test the correct flashcards when we press begin
    useEffect(()=>{
        if (flashcardsOrFolder === "Flashcards") setCurrentFolder(null);
    },[flashcardsOrFolder])


    const search = async () => {
        try {
            const sq = parseQuery(searchQuery);
            if (searchQuery.length === 0) {
                setSearchResults([]);
                return;
            }

            const collectionRef = collection(db, "openings");
            const q = query(collectionRef, where("name", ">=", sq), limit(resultLimit));
            const querySnapshot = await getDocs(q);
            const res = []
            querySnapshot.forEach((doc)=> {
                res.push(doc.data());
            })
            setSearchResults(res);
        } catch (e) {
            console.error(e);
        }
    }

    const addOpening = async () => {
        if (!user) {
            setModal("sign-in");
            return;
        }
        try {
            const isAdded = await checkIfAdded(currOpening);
            if (isAdded) {
                setModal("added");
                setShowAddButton(false);
                return;
            }

            // if the opening to be added is in the DB
            if (currOpening) {
                const docRef = doc(db, "userData", user.uid, "flashcards",currOpening.eco);
                await setDoc(docRef, {
                    fen: currOpening.fen,
                    eco: currOpening.eco, 
                    moves: currOpening.moves,
                    name: currOpening.name
                }).then(()=>{
                        const newFlashcards = [...flashcards];
                        newFlashcards.push(currOpening);
                        setFlashcards(newFlashcards);

                        setShowAddButton(false);    
                }).catch((e)=>{
                    console.error(e);
                });
            }

            // if the opening to be added is NOT in the db
            else {
                const customMoves = formatMoveHistory();
                const newOpening = {
                    fen: game.fen(),
                    eco: "usr",
                    moves: customMoves,
                    name: customMoves
                }
                const collectionRef = collection(db, "userData", user.uid, "flashcards");
                await addDoc(collectionRef, newOpening)
                    .then(()=>{
                        const newFlashcards = [...flashcards];
                        newFlashcards.push(newOpening);
                        setFlashcards(newFlashcards);
                        setShowAddButton(false);
                }).catch((e)=>{
                    console.error(e);
                })
            }
            
            
        } catch (e) {
            console.error(e);
        }
        
    }

    const formatMoveHistory =  () => {

        let mc = 1;
        let str = "";
        for (let i = 0; i<moveHistory.length; i++) {
            if (i%2 === 0) {
                str += mc + ". " + moveHistory[i];
                mc++;
            } else {
                if (i === moveHistory.length - 1) str += " "+moveHistory[i];
                else str += " "+moveHistory[i]+" ";
            }
        }
        return str;
    }

    const checkIfAdded = async () => {
        const name = (currOpening) ? currOpening.moves : formatMoveHistory();
        const q = query(collection(db, "userData", user.uid, "flashcards"), where("moves", "==", name));

        const querySnapshot = await getDocs(q);
        const cards = [];
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            cards.push(doc.data());
        });
        if (cards.length > 0) return true;
        else return false;
    }

    const showMoveHistory = () => {
        return (
            <div className="">
                {
                    moveHistory.map((move, idx)=> (
                       (idx % 2 === 0) ? <MovePair key = { move } moveHistory = { moveHistory } idx = { idx } currMove = { currMove } /> : null
                    ))
                }
            </div>
        )
    }

    const parseMoveHistory = () => {
        let title = "";
        let cnt = 1;
        for (let i = 0; i < moveHistory.length; i++) {
            if (i >= 5) break;
            else if (i % 2 === 0) {
                title+= (cnt + ". ");
                cnt++;
            }
            title+=moveHistory[i] + " ";
        }
        return (
            <p>{title}</p>
        )
    }

    /**
     TO DO:
        1. Check if deleting within a folder
            - if so, ask to delete in folder OR delete in folder and card
            - if not, check if it exists in any folders,
                - if it does, show warning and ask to confirm
     */
    const deleteFlashcard = async (eco, fc) => {
        if (!user) return;
        /**
         * delete from db
         * delete from local array (flashcards)
         */

        try {
            if (eco === 'usr') {
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

    const deleteFolder = () => {
        // ask 
    } 

    const deleteFolderRecursive = async () => {

    }

    const getModal = () => {
        return (
            (modal.length <= 0) ? null :
            <div className="small-modal-wrapper">
                <div className="small-modal-container">
                    <div className="small-modal-message">
                        { (modal === "sign-in") ? "You must be signed in to add!" : "Card already added!" }
                    </div>
                    <div className="small-modal-buttons">
                        {
                            (modal === "sign-in") ? 
                                <>
                                    <button className= "small-modal-sign-in" onClick = { ()=> nav("/log-in") }>
                                        Sign in
                                    </button>
                                    <button className= "small-modal-cancel" onClick = { ()=> setModal("") }>
                                        Cancel
                                    </button>
                                </> 
                                : (modal === "added") ? 
                                <>
                                    <button
                                        onClick = { ()=> setModal("")} >
                                        Got it
                                    </button>
                                </> : null       
                        }
                    </div>
                </div>
            </div>
        )
    }

    const handleBegin = () => {
        if (flashcardsOrFolder === "Folders" && currentFolder && currentFolder.openings.length > 0) testFlashcards(color, currentFolder.openings);
        else testFlashcards(color, flashcards);
    }


    return (
        <div className="toolbar-wrapper">
            <div className="toolbar-container">

                <div className="toolbar-header">

                    <h2 className="toolbar-title">{(tab === 'test') ? "Flashcards" : "Explorer"}</h2>
                    {
                            (currPath.pathname === "/") ? 
                            <div className="search-container">
                            <input 
                                type="search"
                                placeholder="Search openings"
                                value = { searchQuery }
                                onChange = { (e)=> setSearchQuery(e.target.value)}
                                required
                            />
                            <div className="search-btns">
                                <select
                                    value = { resultLimit }
                                    onChange = {(e) => setResultLimit(e.target.value)}
                                >
                                    <option value = {5}>5</option>
                                    <option value = {10}>10</option>
                                    <option value = {20}>20</option>
                                    <option value = {50}>50</option>

                                </select>
                                <button
                                    onClick = { search }
                                >
                                    <FaSearch />
                                </button>
                            </div>


                            </div> : 
                            <div className="selectcolor-container">
                         
                                {
                                    (testMode) ? 
                                    <button 
                                        className="exit-test" 
                                        onClick = { () => onFinishFlashcards(false)}>
                                            Exit
                                    </button> :
                                    <>
                                        <select                 
                                            value = { color }
                                            onChange = { (e)=> setColor(e.target.value)}
                                            >
                                            <option value = "both">Both</option>
                                            <option value = "white">White</option>
                                            <option value = "black">Black</option>
                                        </select>
                                        <button 
                                            className="begin-test" 
                                            onClick={ handleBegin }>
                                                Begin
                                        </button>
                                    </>
                                    
                                }
                                {
                                    (testMode) ? null : 
                                    <button onClick ={ ()=> shuffleCards(flashcards, setFlashcards) } className="shuffle-button">
                                        Shuffle
                                    </button>
                                }
                            </div>
                        }

                    <div className="toolbar-description">
                        { (currOpening) ? parseName(currOpening) : (game.fen() !== startingFen) ? parseMoveHistory() : null }

                        {

                            ((game.fen() !== startingFen && showAddButton && currOpening && !testMode) || (currPath.pathname === "/" && showAddButton && game.fen() !== startingFen)) ?            
                            <button onClick = { addOpening }>
                                <FaPlus />
                            </button> : null
                        }
    
                        { getModal() }
                        
                    </div>
                </div>

                {/** Toolbar Body */}
                <div className={currentFolder && currPath.pathname === "/flashcards" ? "toolbar-body toolbar-body-folder-highlight" : "toolbar-body"}>

                    {/** Header of Body */}
                    {
                    (flashcards && currPath.pathname === "/flashcards") ? 
                        <ToolbarBodyHeader 
                            flashcardsOrFolder = { flashcardsOrFolder }
                            setFlashcardsOrFolder = { setFlashcardsOrFolder }
                            currentFolder = { currentFolder }
                            setCurrentFolder = { setCurrentFolder }   
                            editFolderMode = { editFolderMode }
                            setEditFolderMode = { setEditFolderMode }   
                            user = { user }
                            folders = { folders }
                            setFolders = { setFolders }
                            addOpeningsToFolder = { addOpeningsToFolder } 
                        />
                    : null
                    }


                    {/** Body of Body */}
                    
                    {
                    (flashcardsOrFolder === "Folders" && currPath.pathname === "/flashcards") ? 
                        
                        <Folders 
                            currentFolder = { currentFolder }
                            testMode = { testMode }
                            autoPlayOpening = { autoPlayOpening }
                            flashcardIdx = { flashcardIdx }
                            folders = { folders }
                            setFolders = { setFolders }
                            deleteFolder = { deleteFolder }
                            setCurrentFolder = { setCurrentFolder }        
                            editFolderMode = { editFolderMode }   
                            flashcards = { flashcards }
                            user = { user }
                            addOpeningsToFolder = { addOpeningsToFolder }
                            setAddOpeningsToFolder = { setAddOpeningsToFolder }
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
                                    autoPlayOpening = { autoPlayOpening }
                                    flashcardIdx = { flashcardIdx }
                                    deleteFlashcard = { deleteFlashcard }
                                    showDelete = { true }
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
                                    flashcard = { flashcard }
                                    autoPlayOpening = { autoPlayOpening }
                                />
                            ))
                        : (currPath.pathname === "/") ? 
                            showMoveHistory()
                        : null
                        
                    }
                    </div>
                    }

                </div>
                

                {/** Footer */}
                <div className="toolbar-footer">
                    <div className="buttons-container">
                        {
                        (!testMode) ? 
                        <>
                            <button
                                onClick = { ()=>{
                                    restart();
                                } }
                            >
                                <FaRedo />
                            </button>
    
                            <button
                                onClick = { () => {
                                    if (color === 'white' || color ==='both') setColor('black');
                                    else setColor('white');
                                } }
                            >
                                <FaArrowsAltV />
                            </button>

                            <button
                                onClick = { ()=> {
                                    undo()
                                }}
                            >
                                <FaArrowLeft />
                            </button>

                            <button
                                onClick = { ()=> {
                                    redo()
                                }}
                            >
                            <FaArrowRight />
                            </button>
                        </> : null
                        }
                    </div>
                </div>

            </div>

            
        </div>
    )
}

export default Toolbar;