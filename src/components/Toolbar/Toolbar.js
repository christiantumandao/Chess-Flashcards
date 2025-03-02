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

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Toolbar = (props) => {
    const currPath = useLocation();
    const [user] = useAuthState(auth);

    const { game, undo, redo, currMove, restart, moveHistory,
            currOpening, 
            flashcards, 
            setFlashcards,
            autoPlayOpening, 
            color, setColor,
            folders, setFolders,
            tab,

            testFlashcards, onFinishFlashcards,
            testMode, 
            flashcardIdx } = props;

    const [searchResults, setSearchResults] = useState([]);

    const [toolbarTab, setToolbarTab] = useState("Flashcards");
    const [editFolderMode, setEditFolderMode] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [addOpeningsToFolder, setAddOpeningsToFolder] = useState(false);

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
    },[user, getUserCards, getUserFolders, setFlashcards])



    useEffect(()=>{
        setToolbarTab("Flashcards");
    },[tab]);


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
                    testMode = { testMode }
                    color = { color }
                    setColor = { setColor }
                    handleBegin = { handleBegin }
                    flashcards = { flashcards }
                    setFlashcards = { setFlashcards }
                    moveHistory = { moveHistory }
                    onFinishFlashcards = { onFinishFlashcards }
                    startingFen = { startingFen }
                    addOpeningsToFolder = { addOpeningsToFolder }
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
                    getUserCards = { getUserCards } 
                />
                

                {/** Footer */}
                <div className="toolbar-footer">
                    <div className="buttons-container">
                        {
                        (!testMode) ? 
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