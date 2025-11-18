let decks = [];
let xp = 0;

document.getElementById('create-deck').addEventListener('click', () => {
    const title = document.getElementById('deck-title').value;
    const text = document.getElementById('deck-text').value;
    if (!title || !text) return alert('Please add title and material');
    
    const deck = {title, text, flashcards: [], quizzes: []};
    decks.push(deck);
    renderDecks();
    document.getElementById('deck-title').value = '';
    document.getElementById('deck-text').value = '';
    xp += 10; 
    updateXP();
});

function renderDecks() {
    const deckList = document.getElementById('deck-list');
    deckList.innerHTML = '';
    decks.forEach((deck, index) => {
        const div = document.createElement('div');
        div.className = 'deck-item';
        div.innerHTML = `
            <h3>${deck.title}</h3>
            <button onclick="studyDeck(${index})">Study</button>
            <button onclick="listenDeck(${index})">Podcast</button>
        `;
        deckList.appendChild(div);
    });
}

function studyDeck(index) {
    const deck = decks[index];
    const text = deck.text;
    const sentences = text.split('.').filter(s => s.length > 3);
    deck.flashcards = sentences.map(s => ({question: s, answer: s}));
    alert(`Flashcards and quiz generated for ${deck.title}!`);
    xp += 20;
    updateXP();
}

function listenDeck(index) {
    const deck = decks[index];
    speak(deck.text);
    xp += 5;
    updateXP();
}

function updateXP() {
    document.querySelector('#xp span').innerText = xp;
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = document.getElementById('leaderboard-list');
    leaderboard.innerHTML = `<li>You: ${xp} XP</li>`;
}
