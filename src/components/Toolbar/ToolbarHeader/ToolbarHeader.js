import React, { useState, useEffect } from "react";
import "../../../styles/toolbarHeader.css";

import { db } from "../../../firebase.config";
import { doc, setDoc } from "@firebase/firestore";

import { formatMoveHistory, parseName, shuffleCards } from "../../../util/helper";

import { CgAddR, CgCheckR } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { BsCaretDown } from "react-icons/bs";
import { FaRegQuestionCircle } from "react-icons/fa";


import TopHeaderExplore from "./TopHeaderExplore";

const ToolbarHeader = (props) => {

    const { tab,
            game,
            currOpening,
            currPath,
            flashcards, setFlashcards,
            moveHistory,
            currMove,
            setSearchResults,
            testMode,
            color, setColor,
            handleBegin,
            user,
            onFinishFlashcards,
            startingFen,
            toolbarTab,
            addOpeningsToFolder,
            handleFreestyle,
            freestyle,
            handleSkip,
            editFolderMode,
            editFlashcardsMode

    } = props;

    const nav = useNavigate();
    
    const [modal, setModal] = useState("");
    const [showAddButton, setShowAddButton] = useState(true);
    const [isAddLoading, setIsAddLoading] = useState(false);


    // if the current position changes, then currOpening will change, and so add showAddButton
    useEffect(()=> {
        if (game.fen() === startingFen || testMode || freestyle) setShowAddButton(false);
        else if (flashcards.some((flashcard) => flashcard.fen === game.fen())) {
            setShowAddButton(false);
        } else {
            setShowAddButton(true);
        }

    },[currOpening, flashcards, game, startingFen, testMode, freestyle])

    const addOpening = async () => {
        if (!user) {
            setModal("sign-in");
            return;
        }
        try {
            setIsAddLoading(true);
            const name = (currOpening) ? currOpening.moves : formatMoveHistory(moveHistory);
            const isAdded = (flashcards.some((flashcard) => flashcard.moves === name))
            if (isAdded) {
                setModal("added");
                setShowAddButton(false);
                setIsAddLoading(false);
                return;
            }


            const flashcardMoves = (currOpening) ? currOpening.moves : formatMoveHistory(moveHistory);
            const flashcardECO = (currOpening) ? currOpening.eco : "usr";
            const flashcardName = (currOpening) ? currOpening.name : flashcardMoves;

            const docRef = doc(db, "userData", user.uid, "flashcards", flashcardECO);
            await setDoc(docRef, {
                fen: game.fen(),
                eco: flashcardECO, 
                moves: flashcardMoves,
                name: flashcardName,
            });

            const newFlashcards = [...flashcards];
            newFlashcards.push({...currOpening, id: currOpening.eco});
            setFlashcards(newFlashcards);
            setShowAddButton(false);       
            
        } catch (e) {
            console.error(e);
        } finally {
            setIsAddLoading(false);
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
                                    <button className= "small-modal-sign-in green-btn" onClick = { ()=> nav("/log-in") }>
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

   /*const checkIfAdded = async () => {
       /* const q = query(collection(db, "userData", user.uid, "flashcards"), where("moves", "==", name));

        const querySnapshot = await getDocs(q);
        const cards = [];
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            cards.push(doc.data());
        });
        if (cards.length > 0) return true;
        else return false; 
    }*/


    // this is for displaying a custom opening in the title
    const parseMoveHistory = () => {
        let title = "";
        let cnt = 1;
        for (let i = 0; i < moveHistory.length; i++) {
            if (i === currMove) break;
            else if (i >= 7) {
                title+="...";
                break;
            }
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
    
    const getTestOptions = () => {
        return (
            <div className="selectcolor-container">
                        
                {
                    (testMode || freestyle) ? 
                        <>
                            <div className="playing-as">
                                <p>Playing as:</p>
                                { 
                                    (color === "white" ) ?
                                        <span>White</span>

                                    : (color === "black") ?
                                        <span className="black">Black</span>

                                    :
                                        <span className="both">Both</span>
                                }
                            </div>

                            {
                                (!freestyle) ? 
                                    <button
                                        className="skip-btn"
                                        onClick = { handleSkip }
                                        >
                                        Skip
                                    </button> : null
                            }
                            <button 
                                className="exit-test red-btn" 
                                onClick = { () => onFinishFlashcards(false)}>
                                    Exit
                            </button>

                        </>
                    :
                    (editFlashcardsMode || editFolderMode) ? null
                    :
                        <>
                            <div className="select-element">
                                <select                 
                                    value = { color }
                                    onChange = { (e)=> setColor(e.target.value)}
                                    >
                                    <option value = "both">Both</option>
                                    <option value = "white">White</option>
                                    <option value = "black">Black</option>
                                </select>
                            <BsCaretDown />
                            </div>
                            <button 
                                className="begin-test" 
                                onClick={ handleBegin }>
                                    Begin
                            </button>

                            <div className="freestyle-container">

                                <div className="tooltip-container">
                                    <FaRegQuestionCircle />
                                    <div className="tooltip">
                                        <Link to="/about">Read more</Link>
                                    </div>
                                </div>
                                <button 
                                className = ""
                                onClick = { () => handleFreestyle() }>
                                    Freestyle

                                </button>
                            </div>

                            <button onClick ={ ()=> shuffleCards(flashcards, setFlashcards) } className="shuffle-button">
                                Shuffle
                            </button>
            
                    
                        </>
                    
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
                { (freestyle) ? "Freestyle Aracde" : (currOpening) ? parseName(currOpening) : (game.fen() !== startingFen) ? parseMoveHistory() : null }

                {
                    (freestyle) ? null :
                    (showAddButton) ?           
                        <button 
                        className={(isAddLoading) ? "hidden" : "add-opening-btn"}
                        onClick = { addOpening }>
                            <CgAddR />
                        </button> 
                    : 
                    (game.fen() !== startingFen) ?
                        <button className="tooltip-container" disabled>
                            <CgCheckR />
                            <div className="tooltip">
                                Opening is added
                            </div>
                        </button> : null

                }

                { getSignInMessage() }

                
            </div>

        </div>
    )
}

export default ToolbarHeader;