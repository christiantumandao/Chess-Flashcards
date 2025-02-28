import React from "react";

const FlashcardToSelect = (props) => {

    const { autoPlayOpening, flashcard, setSelectedFlashcards, selectedFlashcards, selected } = props;

    const handlePlay = (e) => {
        e.stopPropagation();
        autoPlayOpening(flashcard);
    }
    return (
        <div onClick = {()=>{
            if (!selected) {
                const newSelectedFlashcards = [...selectedFlashcards];
                newSelectedFlashcards.push(flashcard);
                setSelectedFlashcards(newSelectedFlashcards);
            } else {
                const newSelectedFlashcards = selectedFlashcards.filter((f) => f.eco !== flashcard.eco);
                setSelectedFlashcards(newSelectedFlashcards);
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

export default FlashcardToSelect;