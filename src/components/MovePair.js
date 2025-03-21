import React from "react";

const MovePair = (props) => {
    const { moveHistory, idx, currMove } = props;
    const pairIdx = (idx === 0) ? "1. " : (idx+2) / 2 +".";
    return (
        <div className={(pairIdx % 2 !== 0) ? "movepair-container movepair-shadow" : "movepair-container"}>
            <div className="move-number">
                {
                    (idx === 0) ? "1." : 
                    (idx+2) / 2 +"."
                }
            </div>
            <div className={(currMove === idx+1) ? "white-move move-highlight" : "white-move"}>
                {moveHistory[idx]}
            </div>
            {
                (idx+1 <= moveHistory.length - 1) ? 
                <div className={(currMove === idx+2) ? "black-move move-highlight" : "black-move"}>
                    {moveHistory[idx+1]}
                </div> : null
            }
        </div>
    )
}

export default MovePair;