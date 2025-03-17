class Trie {
    constructor(move) {
        this.children = {};
        this.isLastMove = false; // dont need, will just check if children.length === 0
    }
}

function addFlashcardMoves(moves, head) {
    let curr = head;

    moves.forEach((move) => {

        if (!curr.children[move]) {
            curr.children[move] = new Trie();
            curr = curr.children[move];
        } else {
            curr = curr.children[move];
        }

    });

    curr.isLastMove = true;
} 

export default function buildTrie(flashcards) {
    //console.log("Building tree...");
    try {
        const head = new Trie();

        flashcards.forEach((flashcards) => {

            // parsing moves into array and removing numbered elements
            const arr = flashcards.moves.split(" ");
            const parsedMoves =  arr.filter((move, idx) => idx % 3 !== 0);

            // adding the sequence of mvoes in flashcard to trie from head
            addFlashcardMoves(parsedMoves, head);
        });

        return head;

    } catch (e) {
        console.error(e);
        return null;
    }

}