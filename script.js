let decks = [];
let xp = 0;

// Create deck
document.getElementById('create-deck').addEventListener('click', () => {
    const title = document.getElementById('deck-title').value;
    const text = document.getElementById('deck-text').value;
    if(!title || !text) return alert("Add title and material!");

    const deck = {title, text, flashcards: [], quizzes: []};
    decks.push(deck);
    renderDecks();
    document.getElementById('deck-title').value = '';
    document.getElementById('deck-text').value = '';

    xp += 10;
    updateXP();
});

// Render decks
function renderDecks(){
    const deckList = document.getElementById('deck-list');
    deckList.innerHTML = '';
    decks.forEach((deck,index)=>{
        const div = document.createElement('div');
        div.className = 'deck-card';
        div.innerHTML = `
            <h3>${deck.title}</h3>
            <button onclick="studyDeck(${index})">Study</button>
            <button onclick="listenDeck(${index})">Podcast</button>
            <button onclick="quizDeck(${index})">Quiz</button>
        `;
        deckList.appendChild(div);
    });
}

// Study deck (flashcards)
function studyDeck(index){
    const deck = decks[index];
    const sentences = deck.text.split('.').filter(s=>s.length>3);
    deck.flashcards = sentences.map(s=>({question:s,answer:s}));
    alert(`Flashcards created for ${deck.title}!`);
    xp += 20;
    updateXP();
}

// Text-to-speech podcast
function listenDeck(index){
    const deck = decks[index];
    speak(deck.text);
    xp += 5;
    updateXP();
}

// Quiz (simple)
function quizDeck(index){
    const deck = decks[index];
    const questions = deck.flashcards.length ? deck.flashcards : deck.text.split('.').filter(s=>s.length>3).map(s=>({question:s,answer:s}));
    let score = 0;
    questions.forEach(q=>{
        const answer = prompt(q.question);
        if(answer && answer.trim() !== "") score++;
    });
    alert(`You got ${score} / ${questions.length}`);
    xp += score*5;
    updateXP();
}

// Update XP
function updateXP(){
    document.getElementById('xp-number').innerText = xp;
    document.getElementById('xp-fill').style.width = `${Math.min(xp,100)}%`;
    renderLeaderboard();
}

// Leaderboard (mock)
function renderLeaderboard(){
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = `<li>You: ${xp} XP</li>`;
}
