import React, { useState, useEffect, useCallback } from "react";
import Game from "./Game";
import Toolbar from "./Toolbar";

import { Chess } from "chess.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.config";

const startingFen = "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const MainBody = (props) => {

   // const { tab,flashcards,setFlashcards  } = props;
   const { tab } = props;
    const [user] = useAuthState(auth);

    const [game, setGame] = useState(new Chess()); 
    const [history, setHistory] = useState([startingFen]);
    const [moveHistory, setMoveHistory] = useState([]);
    const [currMove, setCurrMove] = useState(0);

    const [testingFlashcards, setTestingFlashcards] = useState([]);
    const [currOpening, setCurrOpening]= useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [folders, setFolders] = useState([]);

    // auto playing openings
    const [autoPlay, setAutoPlay] = useState(false);
    const [autoPlayIdx, setAutoPlayIdx] = useState(0);
    const [autoPlayMoves, setAutoPlayMoves] = useState([]);


    // user attempting flashcard
    const [color, setColor] = useState("both"); // what color user will be playing
    const [flashcardIdx, setFlashcardIdx] = useState(0);
    const [flashcardMoves, setFlashcardMoves] = useState([]);
    const [playerMoveIdx, setPlayerMoveIdx] = useState(0);
    const [testMode, setTestMode] = useState(false);


    const  makeAMove = useCallback( (move) => {

        try {
            const isFirstMove = (game.fen() === startingFen);
            const gameCopy = new Chess(game.fen());
            gameCopy.move(move);
            setGame(gameCopy);

            const newHistory = history.slice(0, currMove + 1);
            newHistory.push(gameCopy.fen());
            setHistory(newHistory);
            setCurrMove(currMove + 1);

            if (isFirstMove) {
                setMoveHistory([gameCopy.history()[0]]);
            } else {
                const newMoveHistory = moveHistory.slice(0, currMove);
                newMoveHistory.push(gameCopy.history()[0]);
                setMoveHistory(newMoveHistory);
            }

        } catch {
            console.error("Invalid move")
        }
    },[currMove, game, history, moveHistory])



    // event listener for seeing player history with arrows
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowLeft') {
                undo();
            } else if (event.key === 'ArrowRight') {
                redo();
              }

        };
    
        // Attach the event listener when the component mounts
        window.addEventListener('keydown', handleKeyPress);
    
        // Remove the event listener when the component unmounts
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
    });


    // useEffect for autoplaying an opening
    useEffect(()=> {

        const autoPlayMove = () => {
            if (autoPlayIdx === autoPlayMoves.length) {
                setTimeout(()=>{
                    setAutoPlay(false);
                },1000)
            }
            else {
                setTimeout(()=> {
                
                    makeAMove(autoPlayMoves[autoPlayIdx]);
                    setAutoPlayIdx(autoPlayIdx + 1);
                },500);
            }
        }

        if (!testMode && autoPlay && autoPlayIdx <= autoPlayMoves.length) {
            autoPlayMove();
        }

    },[game, testMode, autoPlay, autoPlayIdx, autoPlayMoves, makeAMove])

    // incase user changes tab in middle of autoplaying an opening
    useEffect(()=>{
        setTestMode(false);

        const newGame = new Chess();
        setGame(newGame);
        setHistory([startingFen]);
        setMoveHistory([]);
        setCurrMove(0);
    },[tab])

    const testFlashcards = (color, flashcardsToTest) => {
        if (flashcards.length === 0) {
            alert("Do not have any flashcards");
            return;
        }
        const firstMoveSet = parseMoves(flashcardsToTest[0].moves);
        setTestingFlashcards(flashcardsToTest);
        setTestMode(true);
        setFlashcardIdx(0);
        setFlashcardMoves(firstMoveSet);
        setPlayerMoveIdx(0);
        setCurrOpening(flashcardsToTest[0]);
        setGame(new Chess());
    }

    const onFinishFlashcards = () => {
        setGame(new Chess());
        setTestMode(false);
        setFlashcardIdx(0);
        setFlashcardMoves([]);
        setPlayerMoveIdx(0);
        setCurrOpening(null);
        setTestingFlashcards([]);
    }


    const autoPlayOpening = (flashcard) => {
        if (autoPlay === true) return; // have pop up saying auto play in progress
        setGame(new Chess());
        setHistory([startingFen]);
        setCurrMove(0);

        const moves = parseMoves(flashcard.moves);
        setCurrOpening(flashcard);
        setAutoPlay(true);
        setAutoPlayMoves(moves);
        setAutoPlayIdx(0);
    }

    const parseMoves = (moves) => {
        const moves_ = moves.split(" ");
        const res = [];
        let i = 3;
        moves_.forEach((m) => {
            if (i===3) i=1;
            else {
                res.push(m);
                i++;
            }
        })
        return res;
    }

    const restart = () => {
        const newGame = new Chess();
        setGame(newGame);
        setHistory([startingFen]);
        setMoveHistory([]);
        setCurrMove(0);
    }

    const redo = () => {
        if (currMove === history.length - 1) return;
        else {
            setCurrMove(currMove + 1);
            setGame(new Chess(history[currMove + 1]));
        }
    }

    const undo = () => {
        if (currMove === 0) return;
        else if (currMove === 1) {
            setCurrMove(0);
            setGame(new Chess());
        }
        else {
            setCurrMove(currMove -1);
            const prevMove = history[currMove - 1];
            setGame(new Chess(prevMove));
        }
    }

    return (
        
        <div className="mainbody">
            <Game 
                game = { game } 
                restart = { restart }
                history = { history }
                moveHistory = { moveHistory }
                currMove = { currMove }
                setGame = { setGame }
                makeAMove = { makeAMove }

                currOpening = { currOpening }
                setCurrOpening = { setCurrOpening }
                flashcards = { flashcards }
                setFlashcards = { setFlashcards }
                autoPlayOpening = { autoPlayOpening }
                color = { color }
                setColor = { setColor }
                autoPlay = { autoPlay }

                flashcardIdx = { flashcardIdx }
                setFlashcardIdx = { setFlashcardIdx }
                testMode = { testMode }
                setTestMode = { setTestMode }
                flashcardMoves = { flashcardMoves }
                setFlashcardMoves = { setFlashcardMoves }
                playerMoveIdx = { playerMoveIdx }
                setPlayerMoveIdx = { setPlayerMoveIdx }
                onFinishFlashcards = { onFinishFlashcards }

                parseMoves = { parseMoves }
                testingFlashcards = { testingFlashcards }
            />
            <Toolbar 
                tab = { tab }
                restart = { restart } 
                makeAMove = { makeAMove }
                moveHistory = { moveHistory }
                game = { game } 
                history = { history }
                currMove = { currMove }
                undo = { undo }
                redo = { redo }
                setGame = { setGame }
                currOpening = { currOpening }
                setCurrOpening = { setCurrOpening }
                flashcards = { flashcards }
                setFlashcards = { setFlashcards }
                autoPlayOpening = { autoPlayOpening }
                color = { color }
                setColor = { setColor }

                folders = { folders }
                setFolders = { setFolders }

                flashcardIdx = { flashcardIdx }
                setFlashcardIdx = { setFlashcardIdx }
                testMode = { testMode }
                setTestMode = { setTestMode }
                flashcardMoves = { flashcardMoves }
                setFlashcardMoves = { setFlashcardMoves }
                playerMoveIdx = { playerMoveIdx }
                setPlayerMoveIdx = { playerMoveIdx }


                testFlashcards = { testFlashcards }
                onFinishFlashcards = { onFinishFlashcards }
                testingFlashcards = { testingFlashcards }
                setTestingFlashcards = { setTestingFlashcards }

            />
        </div>
    )
}

export default MainBody;