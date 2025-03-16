import React, { useState, useEffect, useCallback } from "react";
import Game from "./Game";
import Toolbar from "./Toolbar/Toolbar";

import { Chess } from "chess.js";
import { incrementIncorrects } from "../util/users";

const startingFen = "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const MainBody = (props) => {

   // const { tab,flashcards,setFlashcards  } = props;
   const { tab, setTab } = props;

    const [game, setGame] = useState(new Chess()); 
    const [history, setHistory] = useState([startingFen]);  // holds the history of fens
    const [moveHistory, setMoveHistory] = useState([]);     // holds history of moves
    const [currMove, setCurrMove] = useState(0);            // used for tracking player history

    const [flashcards, setFlashcards] = useState([]);
    const [folders, setFolders] = useState([]);

    const [currOpening, setCurrOpening]= useState(null); // contains opening name of whatever is on board

    // auto playing openings
    const [autoPlay, setAutoPlay] = useState(false);
    const [autoPlayIdx, setAutoPlayIdx] = useState(0);
    const [autoPlayMoves, setAutoPlayMoves] = useState([]);

    // for playing flashcards
    const [color, setColor] = useState("white");                     // what color user will be playing
    const [testingFlashcards, setTestingFlashcards] = useState([]); 
    const [flashcardIdx, setFlashcardIdx] = useState(0);            // idx for testingFlashcards
    const [flashcardMoves, setFlashcardMoves] = useState([]);
    const [playerMoveIdx, setPlayerMoveIdx] = useState(0);          // the move idx in testing a flashcard
    const [testMode, setTestMode] = useState(false);
    const [flashGreen, setFlashGreen] = useState(false);
    const [flashRed, setFlashRed] = useState(false);

    const [freestyle, setFreestyle] = useState(false);
    const [trieHead, setTrieHead] = useState(null);
    const [currTrie, setCurrTrie] = useState(null);


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
            console.error("Invalid move:", move)
        }
    },[currMove, game, history, moveHistory])



    // event listener for seeing player history with arrows
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowLeft' && !testMode) {
                undo();
            } else if (event.key === 'ArrowRight' && !testMode) {
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

    // incase user changes tab in middle of autoplaying an opening or playing flashcards
    useEffect(()=>{
        resetVariables();
    },[tab])

    const resetVariables = () => {

        const newGame = new Chess();
        setGame(newGame);
        setHistory([startingFen]);
        setCurrOpening(null);
        setMoveHistory([]);
        setCurrMove(0);

        setTestMode(false);
        setTestingFlashcards([]);
        setFlashcardIdx(0);
        setFlashcardMoves([]);
        setPlayerMoveIdx(0);

        setFreestyle(false);
        setCurrTrie(null);
        setTrieHead(null);

        setAutoPlayIdx(0);
        setAutoPlay(false);
        setAutoPlayMoves([]);
}


    const beginFreestyle = (color, head) => {
        if (head.length === 0) {
            console.error("No flashcards to build trie off of");
            return;
        }
        setFreestyle(true);
        setTrieHead(head);
        setCurrTrie(head);
        setTestMode(false); //double check
        setPlayerMoveIdx(0);
        setGame(new Chess());
        setMoveHistory([]);
        setHistory([startingFen]);

        // game logic in Game component

    }

    const testFlashcards = (color, flashcardsToTest) => {
        if (flashcards.length === 0) {
            console.error("Do not have any flashcards to begin testing");
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
        setMoveHistory([]);
        setHistory([startingFen]);

        // game logic in Game component
    }

    const handleSkip = () => {

        setFlashRed(true);
        incrementIncorrects();

        if ((flashcardIdx + 1) >= testingFlashcards.length) {
            onFinishFlashcards();
            return;
        }
        const idx = flashcardIdx+1;
        const newFlashcard = testingFlashcards[idx];
        const newMoves = parseMoves(newFlashcard.moves);

        setGame(new Chess());

        setCurrOpening(newFlashcard);
        setFlashcardIdx(idx);
        setFlashcardMoves(newMoves);
        setMoveHistory([]);

        setPlayerMoveIdx(0);

    }

    const onFinishFlashcards = () => {
        resetVariables();
    }


    const autoPlayOpening = (flashcard) => {
        if (autoPlay === true) return; // have pop up saying auto play in progress
        setGame(new Chess());
        setHistory([startingFen]);
        setCurrMove(0);

        setMoveHistory([]);
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
                setMoveHistory = { setMoveHistory }
                currMove = { currMove }
                setGame = { setGame }
                makeAMove = { makeAMove }
                setHistory = { setHistory } 
                setCurrMove = { setCurrMove }

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

                freestyle = { freestyle }
                currTrie = { currTrie }
                setCurrTrie = { setCurrTrie}
                trieHead = { trieHead }

                parseMoves = { parseMoves }
                testingFlashcards = { testingFlashcards }

                flashGreen = { flashGreen }
                flashRed = { flashRed }
                setFlashGreen = { setFlashGreen }
                setFlashRed = { setFlashRed }
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
                setTab = { setTab }

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

                freestyle = { freestyle }

                handleSkip = { handleSkip }
                testFlashcards = { testFlashcards }
                onFinishFlashcards = { onFinishFlashcards }
                testingFlashcards = { testingFlashcards }
                setTestingFlashcards = { setTestingFlashcards }
                setTrieHead = { setTrieHead }
                beginFreestyle = { beginFreestyle }

            />
        </div>
    )
}

export default MainBody;