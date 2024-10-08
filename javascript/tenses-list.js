async function addWord() {
    const englishWord = document.getElementById('english-word').value;
    const germanWord = document.getElementById('german-word').value;

    if (englishWord && germanWord) {
        englishWords.push(englishWord);
        germanWords.push(germanWord);
        document.getElementById('english-word').value = '';
        document.getElementById('german-word').value = '';

        // Speichere die Wörter auf GitHub über den Backend-Server
        await saveWordsToGitHub('englisch_words.txt', englishWords.join('\n'));
        await saveWordsToGitHub('deutsche_wörter.txt', germanWords.join('\n'));

        alert('Wörter wurden gespeichert.');
    } else {
        alert('Bitte beide Wörter eingeben.');
    }
}

async function saveWordsToGitHub(filename, content) {
    const response = await fetch('/saveWords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename, content })
    });

    if (!response.ok) {
        console.error('Fehler beim Speichern der Datei auf GitHub:', response.statusText);
    }
}
