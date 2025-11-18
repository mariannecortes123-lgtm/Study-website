/* ========== Text-to-Speech / Podcast ========== */

// Check if browser supports speech synthesis
const synth = window.speechSynthesis;

function speak(text){
    if(!text) return;
    if(synth.speaking){
        synth.cancel(); // Stop current speech
    }

    const utterThis = new SpeechSynthesisUtterance(text);

    // Optional: voice selection
    const voices = synth.getVoices();
    utterThis.voice = voices.find(v => v.lang === 'en-US') || voices[0];

    // Optional: adjust speed and pitch
    utterThis.rate = 1; // speed (0.5-2)
    utterThis.pitch = 1; // pitch (0-2)

    synth.speak(utterThis);
}

/* ========== Playlist / Podcast Mode ========== */
class Podcast {
    constructor(deck){
        this.deck = deck;
        this.sentences = deck.text.split('.').filter(s=>s.length>2);
        this.index = 0;
        this.playing = false;
    }

    play(){
        if(this.index >= this.sentences.length){
            this.index = 0;
            this.playing = false;
            return;
        }
        this.playing = true;
        speak(this.sentences[this.index]);
        const sentenceLength = this.sentences[this.index].length;
        const duration = sentenceLength * 60; // rough ms estimate
        setTimeout(()=>{
            this.index++;
            if(this.playing) this.play();
        }, duration);
    }

    pause(){
        this.playing = false;
        synth.cancel();
    }

    stop(){
        this.playing = false;
        this.index = 0;
        synth.cancel();
    }

    next(){
        synth.cancel();
        if(this.index < this.sentences.length - 1){
            this.index++;
            this.play();
        }
    }

    previous(){
        synth.cancel();
        if(this.index > 0){
            this.index--;
            this.play();
        }
    }
}

/* ========== Example Usage ========== */
// Use: listenDeck(index) from script.js
// let podcast = new Podcast(decks[0]);
// podcast.play();
// podcast.pause();
// podcast.next();
