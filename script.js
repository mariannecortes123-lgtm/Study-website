/* ========== Global Variables ========== */
let decks = [];
let users = []; // For leaderboard & social features
let xp = 0;
let coins = 0;
let level = 1;

// Example badges and avatars
const badges = [
    {id: 1, name: "First Deck", unlocked: false},
    {id: 2, name: "Quiz Master", unlocked: false},
    {id: 3, name: "Podcast Pro", unlocked: false},
];

const avatars = [
    {id: 1, src: "avatars/avatar1.png"},
    {id: 2, src: "avatars/avatar2.png"},
    {id: 3, src: "avatars/avatar3.png"},
];

/* ========== Classes ========== */
class Deck {
    constructor(title, text){
        this.title = title;
        this.text = text;
        this.flashcards = this.generateFlashcards();
        this.quizzes = [];
        this.completed = false;
    }

    // Generate flashcards from pasted text
    generateFlashcards(){
        let sentences = this.text.split('.').filter(s=>s.length>3);
        return sentences.map((s, i)=>({id: i+1, question: s, answer: s}));
    }

    // Generate a simple quiz from flashcards
    generateQuiz(){
        this.quizzes = this.flashcards.map(fc=>{
            let words = fc.answer.split(" ");
            let randomIndex = Math.floor(Math.random()*words.length);
            let missingWord = words[randomIndex];
            let question = fc.answer.replace(missingWord, "_____");
            return {question, answer: missingWord};
        });
    }
}

/* ========== Deck Functions ========== */
function createDeck(title, text){
    const deck = new Deck(title, text);
    decks.push(deck);
    renderDecks();
    gainXP(10);
    gainCoins(5);
}

function renderDecks(){
    const deckList = document.getElementById('deck-list');
    deckList.innerHTML = '';
    decks.forEach((deck, index)=>{
        const div = document.createElement('div');
        div.className = 'deck-card';
        div.innerHTML = `
            <h3>${deck.title}</h3>
            <button onclick="studyDeck(${index})">Study</button>
            <button onclick="listenDeck(${index})">Podcast</button>
            <button onclick="quizDeck(${index})">Quiz</button>
            <button onclick="completeDeck(${index})">Complete</button>
        `;
        deckList.appendChild(div);
    });
}

/* ========== Study / Flashcards ========== */
function studyDeck(index){
    const deck = decks[index];
    let fc = deck.flashcards;
    fc.forEach(card=>{
        alert(`Flashcard: ${card.question}`);
    });
    gainXP(fc.length * 2);
}

/* ========== Podcast / Text-to-Speech ========== */
function listenDeck(index){
    const deck = decks[index];
    speak(deck.text);
    gainXP(5);
}

/* ========== Quizzes ========== */
function quizDeck(index){
    const deck = decks[index];
    deck.generateQuiz();
    let score = 0;
    deck.quizzes.forEach(q=>{
        let answer = prompt(q.question);
        if(answer && answer.toLowerCase().trim() === q.answer.toLowerCase()) score++;
    });
    alert(`Quiz Completed! Score: ${score}/${deck.quizzes.length}`);
    gainXP(score * 3);
    gainCoins(score * 2);
    checkBadges();
}

/* ========== Complete Deck ========== */
function completeDeck(index){
    decks[index].completed = true;
    alert(`${decks[index].title} marked as completed!`);
    gainXP(20);
    gainCoins(10);
    checkBadges();
}

/* ========== XP / Coins / Level Functions ========== */
function gainXP(amount){
    xp += amount;
    if(xp >= level * 100){
        level++;
        alert(`Congrats! You reached level ${level}!`);
    }
    updateUI();
}

function gainCoins(amount){
    coins += amount;
    updateUI();
}

function updateUI(){
    document.getElementById('xp-number').innerText = xp;
    document.getElementById('xp-fill').style.width = `${Math.min(xp, level*100)}%`;
    document.getElementById('coins').innerText = coins;
    document.getElementById('level').innerText = level;
    renderBadges();
    renderAvatars();
}

/* ========== Badges Functions ========== */
function checkBadges(){
    badges.forEach(b=>{
        if(b.id === 1 && decks.length >= 1) b.unlocked = true; // First Deck
        if(b.id === 2 && decks.some(d=>d.quizzes.length > 0)) b.unlocked = true; // Quiz Master
        if(b.id === 3 && decks.some(d=>d.flashcards.length > 0)) b.unlocked = true; // Podcast Pro
    });
}

function renderBadges(){
    const badgesList = document.getElementById('badges-list');
    badgesList.innerHTML = '';
    badges.forEach(b=>{
        const img = document.createElement('img');
        img.src = b.unlocked ? `badges/badge${b.id}.png` : 'badges/locked.png';
        img.title = b.name;
        badgesList.appendChild(img);
    });
}

/* ========== Avatars Functions ========== */
function renderAvatars(){
    const avatarsList = document.getElementById('avatars-list');
    avatarsList.innerHTML = '';
    avatars.forEach(a=>{
        const img = document.createElement('img');
        img.src = a.src;
        img.onclick = ()=>alert(`Avatar ${a.id} selected!`);
        avatarsList.appendChild(img);
    });
}

/* ========== Event Listeners ========== */
document.getElementById('create-deck').addEventListener('click', ()=>{
    const title = document.getElementById('deck-title').value;
    const text = document.getElementById('deck-text').value;
    if(!title || !text) return alert("Please add a title and study material!");
    createDeck(title, text);
    document.getElementById('deck-title').value = '';
    document.getElementById('deck-text').value = '';
});

/* ========== Stats Tracking ========== */
function showStats(){
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <p>Total Decks: ${decks.length}</p>
        <p>Total XP: ${xp}</p>
        <p>Coins: ${coins}</p>
        <p>Level: ${level}</p>
        <p>Quizzes Taken: ${decks.reduce((acc,d)=>acc+d.quizzes.length,0)}</p>
        <p>Flashcards Created: ${decks.reduce((acc,d)=>acc+d.flashcards.length,0)}</p>
    `;
}

/* ========== Initial Render ========== */
updateUI();
showStats();
