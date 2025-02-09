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

        ])
    } catch (e) {
        console.log(e);
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

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    setFlashcards(array);
}

export { getDefaultCards, parseQuery, parseName, shuffleCards };