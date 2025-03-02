import React, { useState, useEffect } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "@firebase/firestore";

import { parseName, shuffleCards } from "../../../util/helper";

import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TopHeaderExplore from "./TopHeaderExplore";
import { BsCaretDown } from "react-icons/bs";

const ToolbarHeader = (props) => {

    const { tab,
            game,
            currOpening,
            currPath,
            flashcards, setFlashcards,
            moveHistory,
            setSearchResults,
            testMode,
            color, setColor,
            handleBegin,
            user,
            onFinishFlashcards,
            startingFen,
            toolbarTab,
            addOpeningsToFolder

    } = props;

    const nav = useNavigate();
    
    const [modal, setModal] = useState("");
    const [showAddButton, setShowAddButton] = useState(true);

    // if the current position changes, then currOpening will change, and so add showAddButton
    useEffect(()=> {
        if (!currOpening || game.fen() === startingFen || testMode) setShowAddButton(false);
        else if (currOpening && flashcards.some((flashcard) => flashcard.fen === game.fen())) {
            setShowAddButton(false);
        } else if (currOpening) {
            setShowAddButton(true);
        }

    },[currOpening])

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

    const getSignInMessage = () => {
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

    // conditional components
    
    
    const getTestOptions = () => {
        return (
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
                        <BsCaretDown />
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
        )
    }

    return (
        <div className="toolbar-header">
            <h2 className="toolbar-title">{(tab === 'test') ? "Your Openings" : "Explorer"}</h2>
                {
                    (currPath.pathname === "/") ? 
                        <TopHeaderExplore 
                            setSearchResults = { setSearchResults }
                        /> 
                    : 
                    (!addOpeningsToFolder && (toolbarTab === "Flashcards" || toolbarTab === "FolderFocus")) ?
                        getTestOptions() : <div className="selectcolor-container"></div>
                }

            <div className="toolbar-description">
                { (currOpening) ? parseName(currOpening) : (game.fen() !== startingFen) ? parseMoveHistory() : null }

                {

                    (showAddButton) ?           
                    <button onClick = { addOpening }>
                        <FaPlus />
                    </button> : null
                }

                { getSignInMessage() }
                
            </div>
        </div>
    )
}

export default ToolbarHeader;