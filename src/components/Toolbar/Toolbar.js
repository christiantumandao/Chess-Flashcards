import React, { useCallback, useEffect, useState } from "react";
import "../../styles/toolbar.css";

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaArrowsAltV } from "react-icons/fa";

import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import { collection, getDocs } from "@firebase/firestore";
import { getDefaultCards, getDefaultFolders } from "../../util/helper";

import ToolbarHeader from "./ToolbarHeader/ToolbarHeader";
import ToolbarBody from "./ToolbarBody/ToolbarBody";
import buildTrie from "../../util/Trie";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Toolbar = (props) => {
    const currPath = useLocation();
    const [user] = useAuthState(auth);

    const { game, undo, redo, currMove, restart, moveHistory,
            currOpening, 
            flashcards, 
            setFlashcards,
            autoPlayOpening, 
            handleSkip,
            color, setColor,
            folders, setFolders,
            tab,

            setTrieHead, beginFreestyle,
            testFlashcards, onFinishFlashcards,
            testMode, freestyle,
            flashcardIdx } = props;

    const [searchResults, setSearchResults] = useState([]);

    const [toolbarTab, setToolbarTab] = useState("Flashcards");
    const [editFolderMode, setEditFolderMode] = useState(false);
    const [editFlashcardsMode, setEditFlashcardsMode] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [addOpeningsToFolder, setAddOpeningsToFolder] = useState(false);

    const getUserCards = useCallback( async () => {
        try {
            const userCards = [];
            const querySnapshot = await getDocs(collection(db, "userData", user.uid, "flashcards"));
            querySnapshot.forEach((doc) => {
                userCards.push({
                    ...doc.data(),
                    id: doc.id
                });
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

            try {
                if (!user) {
                    getDefaultFolders(setFolders);
                    return;
                } else {
                    await getUserFolders();
                }
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
    },[user, getUserCards, getUserFolders, setFlashcards, setFolders])

    useEffect(()=>{
        setToolbarTab("Flashcards");
    },[tab, setToolbarTab]);

    const handleFreestyle = () => {
        let head = null;

        if (toolbarTab === "FolderFocus" && (!currentFolder || currentFolder.openings.length === 0)) return;
        if (toolbarTab === "FolderFocus" && currentFolder.openings.length > 0) head = buildTrie(currentFolder.openings);
        else head = buildTrie(flashcards);  
        setTrieHead(head);
        beginFreestyle(color, head);

    }



    const handleBegin = () => {
        if (toolbarTab === "FolderFocus" && (!currentFolder || currentFolder.openings.length === 0)) return;
        if (toolbarTab === "FolderFocus" && currentFolder.openings.length > 0) testFlashcards(color, currentFolder.openings);
        else testFlashcards(color, flashcards);
    }


    return (
        <div className="toolbar-wrapper">
            <div className="toolbar-container">

                {/**Header */}

                <ToolbarHeader 
                    user = { user }
                    game = { game }
                    tab = { tab }
                    toolbarTab = { toolbarTab }
                    currOpening = { currOpening }
                    currPath = { currPath }
                    setSearchResults = { setSearchResults }
                    editFlashcardsMode = { editFlashcardsMode }
                    editFolderMode = { editFolderMode }
                    testMode = { testMode }
                    color = { color }
                    setColor = { setColor }
                    handleBegin = { handleBegin }
                    flashcards = { flashcards }
                    setFlashcards = { setFlashcards }
                    moveHistory = { moveHistory }
                    currMove = { currMove }
                    onFinishFlashcards = { onFinishFlashcards }
                    startingFen = { startingFen }
                    addOpeningsToFolder = { addOpeningsToFolder }
                    handleFreestyle = { handleFreestyle }
                    freestyle = { freestyle }
                    handleSkip = { handleSkip }
                />

                {/** Toolbar Body */}
                <ToolbarBody
                    user = { user }
                    flashcards = { flashcards }
                    folders = { folders }
                    setFolders = { setFolders }
                    currentFolder = { currentFolder }
                    setCurrentFolder = { setCurrentFolder }
        
        
                    toolbarTab = { toolbarTab }
                    setToolbarTab = { setToolbarTab }

                    editFolderMode = { editFolderMode }
                    setEditFolderMode = { setEditFolderMode }
                    editFlashcardsMode = { editFlashcardsMode }
                    setEditFlashcardsMode = { setEditFlashcardsMode }

                    addOpeningsToFolder = { addOpeningsToFolder }
                    setAddOpeningsToFolder = { setAddOpeningsToFolder }

                    autoPlayOpening = { autoPlayOpening }
                    testMode = { testMode }
                    game = { game }
                    searchResults = { searchResults }
                    flashcardIdx = { flashcardIdx }
                    setFlashcards = { setFlashcards }
                    currMove = { currMove }
                    startingFen = { startingFen }
                    moveHistory = { moveHistory }
                    freestyle = { freestyle }
                />
                

                {/** Footer */}
                <div className="toolbar-footer">
                    <div className="buttons-container">
                        {
                        (!testMode && !freestyle) ? 
                        <>
                            <button onClick = { restart }>
                                <FaRedo />
                            </button>
    
                            <button
                                onClick = { () => {
                                    if (color === 'white' || color ==='both') setColor('black');
                                    else setColor('white');
                                }}
                            >
                                <FaArrowsAltV />
                            </button>

                            <button onClick = { undo }>
                                <FaArrowLeft />
                            </button>

                            <button
                                onClick = { redo } >
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