import React from "react";
import "../styles/more.css";
const More = () => {
    return (
        <div className="more-wrapper page">
            <div className="more-blob">
                <h4>Welcome to Chess Flashcards!</h4>
                <div className="move-text-container">
                    <p>
                        Are you ready to take your chess opening knowledge to the next level? Look no further than Chess Flashcards, your one-stop solution for mastering chess openings like a pro!
                    </p>

                    <br />

                    <h4>How does it work?</h4>
                    <p>
                        The concept is simple yet effective. Chess Flashcards offers you a carefully curated selection of opening positions, each represented as a flashcard. On one side of the card, you'll find the initial position of the opening, while on the other side, you'll see the name of the opening and its key moves.
                    </p>
                </div>

            </div>

            <div className="more-blob">
                <h4>Credits:</h4>
                <p style={{fontSize: "1rem"}}>Christian Tumandao</p>
                <p style={{fontSize: "1rem"}}>Built on React and GCP</p>
            </div>
        </div>
    )
}

export default More;