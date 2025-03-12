import React, { useState , useEffect} from "react";
import "../styles/game.css";

import 'firebase/firestore';
import { db, auth } from "../firebase.config";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "@firebase/firestore";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const startingFen = "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Game = (props) => {

    const currPath = useLocation();
    const [user] = useAuthState(auth);

    const { game, setGame, 
        currOpening, makeAMove,
        setCurrOpening, 
        color, 
        testMode, flashcardIdx, 
        setFlashcardIdx, flashcardMoves, setFlashcardMoves,
        playerMoveIdx, setPlayerMoveIdx, parseMoves,
        setMoveHistory,
        onFinishFlashcards, autoPlay, testingFlashcards } = props;

    const [flashGreen, setFlashGreen] = useState(false);
    const [flashRed, setFlashRed] = useState(false);
    const animationSpeed = 100;

    // for updating the title of opening is being played in toolbar
    useEffect(()=> {
        if (!testMode) {
            findOpening(); 
        } else if (currPath.pathname === "/flashcards" && testMode) {
            validateMove();
        } 
    },[game, currPath, testMode]);


    // when using a flashcard, the bot must play first:
    useEffect(()=>{
        setTimeout(()=>{
            if (color==='black' && playerMoveIdx===0 && flashcardMoves) {
                makeAMove(flashcardMoves[0]);
            }
        }, 1000);
    },[testMode, playerMoveIdx, currOpening,
        flashcardMoves, color])

    useEffect(()=>{
        setTimeout(()=>{
            setFlashGreen(false);
        },1000);
    },[flashGreen]);

    useEffect(()=>{
        setTimeout(()=>{
            setFlashRed(false);
        },1000)
    },[flashRed]);

    // will fire when board is reset or player has made move during testing
    const validateMove = () => {
        const moveHistory = game.history();
        const move = moveHistory[moveHistory.length - 1];
        setTimeout(()=>{
            if (game.fen() === startingFen) return;
            else  validateMove_both(move);
        }, animationSpeed)

    }


    const validateMove_both = (move) => {
        if (!move) return;
        else {
                const isCorrect = (flashcardMoves[playerMoveIdx] === move);
                if (isCorrect) {
                    // next flashcard
                    if ((playerMoveIdx + 1) >= flashcardMoves.length) {
                        onNextFlashcard();
                    // next move in flashcard
                    } else {
                        checkBot();
                    }
                } else {
                    setFlashRed(true);
                    setPlayerMoveIdx(0);
                    setGame(new Chess());
                    incrementIncorrects();
                    
                }
        }
    }

    /**
     * once bot has played, will trigger use effect again 
     * and enter the root else statement
     */

    const checkBot = () => {
            // checking if move prompts bot
            if ((color === 'black' && playerMoveIdx % 2 === 1) || (color === 'white' && playerMoveIdx % 2 === 0)) {
                setTimeout(()=>{
                    makeAMove(flashcardMoves[playerMoveIdx+1]);
                    if ((playerMoveIdx + 1) >= flashcardMoves.length) {
                        onNextFlashcard();
                    // next move in flashcard
                    } else {
                        setPlayerMoveIdx(playerMoveIdx+1);
                    }
                },animationSpeed);
            // not a bot play (or bot has played)
            } else {
                setPlayerMoveIdx(playerMoveIdx+1);
            }
           // checking player move
    }


    const onNextFlashcard = () => {
        setTimeout(()=>{
            setFlashGreen(true);
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
            incrementCorrects();
        },500);
    }
    

    const incrementCorrects = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "userData", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const correct =userData.correct;
                const newCorrect = correct+1;
                await updateDoc(userRef, {
                    correct: newCorrect
                });
            } else {
                console.error("Error finding user while attempting to update")
            }

        } catch (error) {
            console.error("Error occured while  attempting to update user data");
        }
    }

    const incrementIncorrects = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "userData", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const incorrect =userData.incorrect;
                const newIncorrect = incorrect+1;
                await updateDoc(userRef, {
                    incorrect: newIncorrect
                });
            } else {
                console.error("Error finding user while attempting to update")
            }
        } catch (error) {
            console.error("Error finding user while attempting to update");
        }
    }
  
    const findOpening = async () => {
        try {
            const currFen = game.fen();
            if (currFen === startingFen) return;

            const openingsCollection = collection(db, 'openings');
            
            const q =  query(openingsCollection, where("fen", "==",currFen));

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const match = querySnapshot.docs[0].data();
              setCurrOpening(match);
            } else {
              // opening not in db
              setCurrOpening(null);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    const onDrop = (sourceSquare, targetSquare) => {
        const move = makeAMove({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // always promote to a queen for example simplicity
        });
        return move;
    } 

    return (
        <div className="game-wrapper">
            <div className={(flashGreen) ? "gamegui-container flash-green" : (flashRed) ? "gamegui-container flash-red" : "gamegui-container"}>
                <Chessboard 
                    position = { game.fen() }
                    onPieceDrop = { onDrop }
                    

                    animationDuration={(autoPlay) ? animationSpeed : 0}
                    boardOrientation={(color==='both') ? 'white' : color}
                    customBoardStyle = { (window.innerWidth > 425) ?                  
                        { borderRadius: '5px' } : {} }
                />
            </div>

        </div>
    )
}

export default Game;