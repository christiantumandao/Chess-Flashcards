const getDefaultCards = (setFlashcards) => {
    try {
        setFlashcards([
            {
                eco: "D53",
                fen: "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
                moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7",
                name: "Queen's Gambit Declined"
            }, 
            {
                eco: "B90",
                fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
                moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6",
                name: "Sicilian Defense: Najdorf Variation"
            },
            {
                eco: "C02",
                fen: "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR w KQkq - 1 5",
                moves: "1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6",
                name: "French Defense: Advance Variation"
            },

        ]);

    } catch (e) {
        console.error(e);
    }
}

const getDefaultFolders = (setFolders) => {
    try {
        setFolders([
            {
                name: "King's Pawn Openings",
                openings: [
                    {
                        eco: "C44",
                        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
                        moves: "1. e4 e5 2. Nf3 Nc6 3. d4",
                        name: "Scotch Game"
                    },
                    {
                        eco: "C60",
                        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
                        name: "Ruy Lopez"
                    },
                    {
                        eco: "C36",
                        fen: "rnbqkbnr/ppp2ppp/8/3P4/5p2/5N2/PPPP2PP/RNBQKB1R b KQkq - 0 4",
                        moves: "1. e4 e5 2. f4 exf4 3. Nf3 d5 4. exd5",
                        name: "King's Gambit Accepted: Modern Defense"
                    }
                ]
            },
            {
                name: "Queen's Pawn Openings",
                openings: [
                    {
                        eco: "D02",
                        fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
                        moves: "1. d4 d5 2. Nf3 Nf6 3. Bf4",
                        name: "Queen's Pawn Game: London System"
                    },
                    {
                        eco: "D53",
                        fen: "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
                        moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7",
                        name: "Queen's Gambit Declined"
                    },
                    {
                        eco: "A85",
                        fen: "rnbqkb1r/ppppp2p/5np1/5pB1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 1 4",
                        moves: "1. d4 f5 2. c4 Nf6 3. Nc3 g6 4. Bg5",
                        name: "Dutch: Queen's Knigh Variation"
                    }
                ]
            }

        ]);

    } catch (e) {
        console.error(e);
    }
}

const parseQuery = (str) => {
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}

const parseName = (currOpening) => {
    return "["+currOpening.eco+"] "+currOpening.name;
}

const shuffleCards = (flashcards, setFlashcards) => {
    const array = [...flashcards];
    let currentIndex = array.length,  randomIndex;

    while (currentIndex > 0) {
  
      // get random idx
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // swap idxs
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    setFlashcards(array);
}

const validateFolderName = (name, setErrorMessage, folders) => {
    if (name.length === 0) {
        setErrorMessage("Must have a non-empty name!");
        return false;
    }

    if (name.length > 30) {
        setErrorMessage("Name cannot be more than 30 characters!");
    }

    if (folders.some((folder) => folder.name === name)) {
        setErrorMessage("You have a folder with this name!");
        return false;
    }

    setErrorMessage("");
    return true;
}

const formatMoveHistory =  (moveHistory) => {

    let mc = 1;
    let str = "";
    
    for (let i = 0; i < moveHistory.length; i++) {

        if (i % 2 === 0) {
            str += mc + ". " + moveHistory[i];
            mc++;
        } else {
            if (i === moveHistory.length - 1) str += " "+moveHistory[i];
            else str += " "+moveHistory[i]+" ";
        }

    }
    return str;
}



export { getDefaultCards, parseQuery, parseName, shuffleCards, validateFolderName, getDefaultFolders, formatMoveHistory };