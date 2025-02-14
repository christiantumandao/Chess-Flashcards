import React, { useState } from "react";

const FlashcardToAdd = (props) => {

    const { autoPlayOpening, flashcard, setOpeningsToAdd, openingsToAdd, selected } = props;

    const handlePlay = (e) => {
        e.stopPropagation();
        autoPlayOpening(flashcard);
    }
    return (
        <div onClick = {()=>{
            if (!selected) {
                const newOpeningsToAdd = [...openingsToAdd];
                newOpeningsToAdd.push(flashcard);
                setOpeningsToAdd(newOpeningsToAdd);
            } else {
                const newOpeningsToAdd = openingsToAdd.filter((f) => f.eco !== flashcard.eco);
                setOpeningsToAdd(newOpeningsToAdd);
            }

        }}
        className="flashcard-to-add-container">
            <input 
                type='checkbox'
                checked = { selected }
                onChange = {()=>{}}
                
            />
            <div className="flashcard-to-add-left">
                <div className={(selected) ? "fta-title fta-title-selected" : "fta-title"}>
                    { flashcard.name }
                </div>
                <div className={(selected) ? "fta-moves fta-moves-selected" : "fta-moves"}>
                    { flashcard.moves }
                </div>
            </div>
            <div className="flashcard-to-add-right">
                <button className="play-btn" onClick = { handlePlay }>
                    Play
                </button>

            </div>
        </div>
    )
}

export default FlashcardToAdd;