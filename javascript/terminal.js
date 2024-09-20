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
                output.innerHTML += `${promptAndInput}\nVerfügbare Befehle: help, version, shutdown, clear\n`;
            } else if (input === 'version') {
                output.innerHTML += `${promptAndInput}\nVERSION 0.1\n`;
            } else if (input === 'todo') {
                output.innerHTML += `${promptAndInput}\nBEFEHLE DIE MAN NOCH PROGRAMMIEREN MUSS:\nsiedersay STRING\ndate\nip\nmensa\ncalc\nrandom INT\nrps\nvacation\n`;
            } else if (input === 'shutdown') {
                output.innerHTML += `${promptAndInput}\n`;
                const outputDiv = document.getElementById('output');
                simulateShutdown(outputDiv);
            } else if (input === 'clear') {
                output.innerHTML = ''; 
            } else {
                output.innerHTML += `${promptAndInput}\n<span style="color: red;">COMMAND "${input}" HAS NOT BEEN FOUND</span>\n`;
            }

            commandHistory.push(input);
            historyIndex = commandHistory.length; 
            this.value = '';
            output.scrollTop = output.scrollHeight;
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

// Die Shutdown-Simulation vom zweiten Code
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
        if (index < shutdownMessages.length) {
            outputDiv.innerHTML += `<p>${shutdownMessages[index]}</p>`;
            outputDiv.scrollTop = outputDiv.scrollHeight;
            index++;
            setTimeout(displayNextMessage, 200);
        } else {
            // Weiterleitung nach dem letzten Shutdown-Message
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000); // Verzögerung für eine bessere Nutzererfahrung
        }
    }

    displayNextMessage();
}
