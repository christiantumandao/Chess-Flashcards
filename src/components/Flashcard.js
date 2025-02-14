import React from "react";
import "../styles/flashcard.css";
import { useLocation } from "react-router-dom";

import { FaRegTrashAlt } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.config";


const Flashcard = (props) => {
    const { flashcard, testMode, flashcardIdx, idx, deleteFlashcard, showDelete } = props;
    const currPath = useLocation();

    const parseName = () => {
        return "["+flashcard.eco+"] "+flashcard.name;
    }
    const [user] = useAuthState(auth);

    const handleDeleteFlashcard = async (e) => {
        e.stopPropagation();
        await deleteFlashcard(flashcard.eco, flashcard);
    }

    return (
        <div 
            className={(testMode && idx === flashcardIdx) ? "flashcard-wrapper flashcard-highlight" : "flashcard-wrapper"} 
            onClick ={ () => {
                if (!testMode) props.autoPlayOpening(flashcard)
            }}>
            <div className="flashcard-body">
                <h4 className="flashcard-title">
                    { (flashcard) ? parseName() : null}
                </h4>
                <p>
                {(testMode) ? null : flashcard.moves }
                </p>
            </div>
            {
                (showDelete && !testMode && user) ?        
                    <button 
                        onClick = { handleDeleteFlashcard }
                        className="delete-container red-btn">
                    <FaRegTrashAlt />
                    </button>

                    : null
            }

        </div>
    );
}

export default Flashcard;