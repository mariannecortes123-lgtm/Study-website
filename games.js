/* ========== Study Games ========== */

/* ========== Simple Flashcard Memory Game ========== */
class MemoryGame {
    constructor(deck){
        this.deck = deck;
        this.cards = [...deck.flashcards]; // Copy flashcards
        this.cards = this.cards.concat(this.cards); // Duplicate for memory matching
        this.cards.sort(()=> Math.random() - 0.5); // Shuffle
        this.selectedCards = [];
        this.matchedCards = [];
        this.score = 0;
    }

    startGame(){
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = '';
        this.cards.forEach((card, index)=>{
            const btn = document.createElement('button');
            btn.textContent = '❓';
            btn.className = 'memory-card';
            btn.onclick = ()=> this.flipCard(index, btn);
            gamesList.appendChild(btn);
        });
    }

    flipCard(index, btn){
        if(this.selectedCards.includes(index) || this.matchedCards.includes(index)) return;
        btn.textContent = this.cards[index].question.substring(0,15)+'...';
        this.selectedCards.push(index);

        if(this.selectedCards.length === 2){
            setTimeout(()=>{
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch(){
        const [first, second] = this.selectedCards;
        const btns = document.querySelectorAll('.memory-card');
        if(this.cards[first].question === this.cards[second].question){
            this.matchedCards.push(first, second);
            this.score += 10;
        } else {
            btns[first].textContent = '❓';
            btns[second].textContent = '❓';
        }
        this.selectedCards = [];
        if(this.matchedCards.length === this.cards.length){
            alert(`Memory Game Completed! Score: ${this.score}`);
            gainXP(this.score);
            gainCoins(Math.floor(this.score/2));
        }
    }
}

/* ========== Quick Quiz Game ========== */
class QuickQuizGame {
    constructor(deck){
        this.deck = deck;
        this.questions = deck.flashcards.slice(0,10); // first 10 flashcards
        this.current = 0;
        this.correct = 0;
    }

    startGame(){
        this.askQuestion();
    }

    askQuestion(){
        if(this.current >= this.questions.length){
            alert(`Quick Quiz Finished! Score: ${this.correct}/${this.questions.length}`);
            gainXP(this.correct*5);
            gainCoins(this.correct*3);
            return;
        }
        const q = this.questions[this.current];
        const answer = prompt(`Question: ${q.question.substring(0,50)}...`);
        if(answer && answer.toLowerCase().trim() === q.answer.toLowerCase()){
            this.correct++;
        }
        this.current++;
        this.askQuestion();
    }
}

/* ========== Game Selection for Decks ========== */
function playGame(deckIndex, gameType){
    const deck = decks[deckIndex];
    if(gameType === 'memory'){
        const game = new MemoryGame(deck);
        game.startGame();
    } else if(gameType === 'quickquiz'){
        const game = new QuickQuizGame(deck);
        game.startGame();
    } else {
        alert('Game type not implemented yet!');
    }
}

/* ========== Example Usage ========== */
// You can add buttons on deck cards:
// <button onclick="playGame(0, 'memory')">Memory Game</button>
// <button onclick="playGame(0, 'quickquiz')">Quick Quiz Game</button>
