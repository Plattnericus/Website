$(document).ready(function() {
    /* Canvas-Animation für "Letters Dropping" */
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var fontSize = 16;
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var drops = [];
    var columns;
    var fallSpeed = 2; 

    // Historie für Befehle
    var commandHistory = [];
    var historyIndex = -1;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = 0;
        }
    }

    function draw() {
        context.fillStyle = "rgba(0, 0, 0, 0.05)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = fontSize + "px monospace";
        context.fillStyle = "#00cc33";

        for (var i = 0; i < columns; i++) {
            var index = Math.floor(Math.random() * str.length);
            var x = i * fontSize;
            var y = drops[i] * fontSize;

            context.fillText(str[index], x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function updateCanvas() {
        draw();
        requestAnimationFrame(updateCanvas);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateCanvas();

    document.addEventListener('click', function() {
        document.getElementById('input').focus();
    });
    
    document.getElementById('input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const input = this.value.toLowerCase(); 
            const output = document.getElementById('output');
    
            const promptAndInput = `<span class="prompt">user@host:~$</span>${input}`;

            // Befehle verarbeiten
            if (input === 'help') {
                output.innerHTML += `${promptAndInput}\nVerfügbare Befehle: help, version, shutdown, clear, date, ip, todo, vacation\n`;
            } else if (input === 'version') {
                output.innerHTML += `${promptAndInput}\nVERSION 0.2\n`;
            } else if (input === 'date') {
                const currentDate = new Date(); 
                const formattedDate = currentDate.toLocaleString();
                output.innerHTML += `${promptAndInput}\n${formattedDate}\n`;
            } else if (input === 'ip') {
                fetch('https://api.ipify.org?format=json') 
                    .then(response => response.json())
                    .then(data => {
                        const userIP = data.ip; 
                        output.innerHTML += `${promptAndInput}\nYour IP: ${userIP}\n`; 
                    })
                    .catch(error => {
                        output.innerHTML += `Error getting your IP address\n`;
                        console.error('Error:', error);
                    });
            } else if (input === 'todo') {
                output.innerHTML += `${promptAndInput}\nBEFEHLE DIE MAN NOCH PROGRAMMIEREN MUSS:\nsiedersay STRING\nmensa\ncalc\nrandom INT\nrps\nvacation\n`;
            } else if (input === 'vacation') {
                vacation();
            } else if (input === 'shutdown') {
                output.innerHTML += `${promptAndInput}\n`;
                simulateShutdown(output);
            } else if (input === 'clear') {
                output.innerHTML = ''; 
            } else {
                output.innerHTML += `${promptAndInput}\n<span style="color: red;">COMMAND "${input}" HAS NOT BEEN FOUND</span>\n`;
            }

            commandHistory.push(input);
            historyIndex = commandHistory.length; 
            this.value = '';
    
            // Automatisch nach unten scrollen
            output.scrollTop = output.scrollHeight; // Scroll direkt nach dem Hinzufügen
        }
    });

    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else if (historyIndex === commandHistory.length - 1) {
                historyIndex++;
                this.value = ''; 
            }
        }
    });
});

// Die Vacation-Funktion
function vacation() {
    const now = new Date().getTime();
    const events = [
        { name: "Schulstart", date: new Date("Sep 05, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [05.09.24] Schulstart: Countdown complete.", upcomingMessage: "[❌] [2024] [05.09.24] Schulstart: " },
        { name: "Allerheiligen", date: new Date("Nov 01, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [01.11.24] Allerheiligen: Countdown complete.", upcomingMessage: "[❌] [2024] [01.11.24] Allerheiligen: " },
        { name: "Sant Ambrogio", date: new Date("Dec 07, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [07.12.24] Sant Ambrogio: Countdown complete.", upcomingMessage: "[❌] [2024] [07.12.24] Sant Ambrogio: " },
        { name: "Weihnachtsferien", date: new Date("Dec 23, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [23.12.24] Weihnachtsferien: Countdown complete.", upcomingMessage: "[❌] [2024] [23.12.24] Weihnachtsferien: " },
        { name: "Faschingsferien", date: new Date("Feb 10, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [10.02.25] Faschingsferien: Countdown complete.", upcomingMessage: "[❌] [2025] [10.02.25] Faschingsferien: " },
        { name: "Osterferien", date: new Date("Apr 17, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [17.04.25] Osterferien: Countdown complete.", upcomingMessage: "[❌] [2025] [17.04.25] Osterferien: " },
        { name: "Tag der Befreiung", date: new Date("Apr 25, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [25.04.25] Tag der Befreiung: Countdown complete.", upcomingMessage: "[❌] [2025] [25.04.25] Tag der Befreiung: " },
        { name: "Tag der Arbeit", date: new Date("May 01, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [01.05.25] Tag der Arbeit: Countdown complete.", upcomingMessage: "[❌] [2025] [01.05.25] Tag der Arbeit: " },
        { name: "Tag der Republik", date: new Date("Jun 02, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [02.06.25] Tag der Republik: Countdown complete.", upcomingMessage: "[❌] [2025] [02.06.25] Tag der Republik: " },
        { name: "Pfingsten", date: new Date("Jun 08, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [08.06.25] Pfingsten: Countdown complete.", upcomingMessage: "[❌] [2025] [08.06.25] Pfingsten: " },
        { name: "Schulende", date: new Date("Jun 13, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [13.06.25] Schulende: Countdown complete.", upcomingMessage: "[❌] [2025] [13.06.25] Schulende: " }
    ];
    

    const output = document.getElementById('output');
    const input = document.getElementById('input').value.toLowerCase();
    const promptAndInput = `<span class="prompt">user@host:~$</span>${input}`;

    output.innerHTML += `${promptAndInput}\n`;

    events.forEach(event => {
        const timeleft = event.date - now;

        if (timeleft < 0) {
            output.innerHTML += `${event.pastMessage}\n`;
        } else {
            const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

            output.innerHTML += `${event.upcomingMessage} ${days} Tage, ${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden.\n`;
        }
    });

    output.scrollTop = output.scrollHeight;  
}

// Die Shutdown-Simulation
function simulateShutdown(outputDiv) {
    const shutdownMessages = [
        "[INFO] Starting shutdown sequence...",
        "[OK] Stopping web server: apache2.",
        "[OK] Stopping database server: mysql.",
        "[OK] Stopping system logging service: rsyslog.",
        "[OK] Stopping OpenSSH server: sshd.",
        "[OK] Unmounting /dev/sda1...",
        "[OK] Unmounting /dev/sdb1...",
        "[OK] Flushing file systems...",
        "[OK] Stopping remaining processes...",
        "[INFO] Sending SIGTERM to remaining processes...",
        "[INFO] Sending SIGKILL to remaining processes...",
        "[OK] Unmounting remaining file systems...",
        "[INFO] Deactivating swap...",
        "[INFO] Powering off...",
        "[INFO] Syncing file systems...",
        "[OK] System will halt now.",
        "[OK] System halted.",
        "Powering off in 3... 2... 1...",
        "[INFO] System has powered off."
    ];

    let index = 0;

    function displayNextMessage() {
        const outputDiv = document.getElementById('output'); // Output Div
    
        if (index < shutdownMessages.length) {
            outputDiv.innerHTML += `<p>${shutdownMessages[index]}</p>`;

            // Automatisch nach unten scrollen
            setTimeout(function() {
                outputDiv.scrollTop = outputDiv.scrollHeight;
            }, 10);
            
            index++;
            setTimeout(displayNextMessage, 200); // Weiter mit der nächsten Nachricht
        } else {
            setTimeout(() => {
                window.location.href = "index.html"; // Nach der letzten Nachricht
            }, 3000);
        }
    }

    displayNextMessage();
}
