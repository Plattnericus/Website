let englishWords = [];
let germanWords = [];
let correctEnglish = [];
let correctGerman = [];
let currentMode;
let askGerman = false;

function showAddWords() {
    document.getElementById('add-words').classList.remove('hidden');
    document.getElementById('ask-words').classList.add('hidden');
}

function showAskWords() {
    document.getElementById('ask-words').classList.remove('hidden');
    document.getElementById('add-words').classList.add('hidden');
}

function addWord() {
    const englishWord = document.getElementById('english-word').value;
    const germanWord = document.getElementById('german-word').value;

    if (englishWord && germanWord) {
        englishWords.push(englishWord);
        germanWords.push(germanWord);
        
        saveWordsToServer(englishWord, germanWord);

        document.getElementById('english-word').value = '';
        document.getElementById('german-word').value = '';
        alert('Wörter wurden gespeichert.');
    } else {
        alert('Bitte beide Wörter eingeben.');
    }
}

function startQuiz() {
    currentMode = document.getElementById('mode-select').value;
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('result').textContent = '';
    askGerman = currentMode === "deutschToEnglish" || (currentMode === "random" && askGerman);
    askWord();
}

function askWord() {
    const randomIndex = Math.floor(Math.random() * englishWords.length);
    const englishWord = englishWords[randomIndex];
    const germanWord = germanWords[randomIndex];

    if (askGerman) {
        document.getElementById('question').textContent = `Übersetze folgendes Wort ins Englische: ${germanWord} (Deutsch)`;
    } else {
        document.getElementById('question').textContent = `Übersetze folgendes Wort ins Deutsche: ${englishWord} (Englisch)`;
    }
}

function checkAnswer() {
    const answer = document.getElementById('answer').value.trim();
    const randomIndex = Math.floor(Math.random() * englishWords.length);
    const englishWord = englishWords[randomIndex];
    const germanWord = germanWords[randomIndex];

    if (askGerman) {
        if (answer.toLowerCase() === englishWord.toLowerCase()) {
            correctEnglish.push(englishWord);
            document.getElementById('result').textContent = 'Richtig! Das Wort wird gespeichert.';
        } else {
            document.getElementById('result').textContent = `Falsch! Die richtige Antwort war: ${englishWord}`;
        }
    } else {
        if (answer.toLowerCase() === germanWord.toLowerCase()) {
            correctGerman.push(germanWord);
            document.getElementById('result').textContent = 'Richtig! Das Wort wird gespeichert.';
        } else {
            document.getElementById('result').textContent = `Falsch! Die richtige Antwort war: ${germanWord}`;
        }
    }

    askGerman = currentMode === "random" ? !askGerman : askGerman;
    askWord();
}

function saveWordsToServer(englishWord, germanWord) {
    fetch('/save-words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ english: englishWord, german: germanWord }),
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Fehler:', error));
}
