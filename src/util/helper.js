const getDefaultCards = (setFlashcards) => {
    try {
        setFlashcards([
            {
                eco: "B50",
                fen:"rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
                moves: "1. e4 c5 2. Nf3 d6",
                name: "Sicilian Defense: Modern Variations",
            },
            {
                eco: "C00",      
                fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",  
                moves: "1. e4 e6 2. d4 d5",
                name: "French Defense"
            },
            {
                eco: "D10",
                fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
                moves: "1. d4 d5 2. c4 c6",
                name: "Slav Defense"
            }
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