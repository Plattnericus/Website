$(document).ready(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var fontSize = 16;
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var drops = [];
    var columns;
    var fallSpeed = 2;

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


    //Terminal eingabefeld


    document.getElementById('input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {     
            event.preventDefault(); 
            const input = this.value.toLowerCase(); 
            const output = document.getElementById('output');
    
            const promptAndInput = `<span style=\"color: green;\">user@host:~$ </span>${input}`; 
    
            if (input.startsWith('siggidysay ')) {
                const input2 = input.substring('siggidysay '.length);
                const cowsayOutput = formatCowsay(input2);
                output.innerHTML += `${promptAndInput}\n${cowsayOutput}\n`;
            } else if (input === 'help') {
                output.innerHTML += `${promptAndInput}\nAvailable Commands:\nhelp - THIS LIST\nversion - TERMINAL VERSION\nshutdown - SHUTDOWN TERMINAL\nclear - CLEARS CONSOLE\ndate - DATE AND TIME\nip - YOUR IP\nvacation - SCHOOL VACATIONS\ncalc (NUMBER) (OPERATOR) (NUMBER) - CALCULATOR\nrandom (NUMBER) - RANDOM NUMBERS\ntimetable - This is the Timetable of the BFS FI 2\n`;
            } else if (input === 'version') {
                output.innerHTML += `${promptAndInput}\nVERSION 0.69\n`;
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
                        output.innerHTML += `${promptAndInput}\nError getting your IP address\n`;
                        console.error('Error:', error);
                    });
            } else if (input === 'todo') {
                output.innerHTML += `${promptAndInput}\nCOMMANDS THAT STILL NEED TO BE PROGRAMMED:\nmensa\n`;
            } else if (input === 'timetable') {
                
                asciiTimetable();
            }else if (input === 'vacation') {
                vacation(); 
            } else if (input === 'shutdown') {
                output.innerHTML += `${promptAndInput}\n`;
                simulateShutdown(output);
            } else if (input === 'clear') {
                output.innerHTML = ''; 
            } else if (input.trim() === '') {                     
                output.innerHTML += `${promptAndInput}\n`;
            } else if (input === 'siggidy random') {
                output.innerHTML += `${promptAndInput}\n`;
                displayRandomContent(); 
            } else if (input.startsWith('calc ')) {
                const calculation = input.substring('calc '.length).trim();
                const calcMatch = calculation.match(/^(\d+)\s*([\+\-\*\/])\s*(\d+)$/);
            
                if (calcMatch) {
                    const number1 = parseFloat(calcMatch[1]);  
                    const operator = calcMatch[2];             
                    const number2 = parseFloat(calcMatch[3]);  
                    let result;
            
                    switch (operator) {
                        case '+':
                            result = number1 + number2;
                            break;
                        case '-':
                            result = number1 - number2;
                            break;
                        case '*':
                            result = number1 * number2;
                            break;
                        case '/':
                            result = number2 !== 0 ? number1 / number2 : '<span style="color: red;">ERROR: YOU CAN\'T DO THAT!</span>';
                            break;
                        default:
                            result = '<span style="color: red;">ERROR: UNKNOWN OPERATOR USE ONE OF THESE: `+, -, *, /`</span>';
                    }
            
                    output.innerHTML += `${promptAndInput}\nANSWER: ${result}\n`;
                } else {
                    output.innerHTML += `${promptAndInput}\n<span style="color: red;">ERROR: USE SOMETHING LIKE 'calc 5 + 3'</span>\n`;
                }
            } else if (input.startsWith('random ')) {
                let parts = input.split(' ');
                let number = parseInt(parts[1]);
            
                if (isNaN(number)) {
                    output.innerHTML += `${promptAndInput}\n<span style="color: red;">ERROR: PLEASE TYPE IN A NUMBER</span>\n`;
                } else if (number < 1) {
                    output.innerHTML += `${promptAndInput}\n<span style="color: red;">ERROR: THE NUMBER SHOULD BE AT LEAST 1</span>\n`;
                } else {
                    let randomNumber = Math.floor(Math.random() * number + 1);
                    output.innerHTML += `${promptAndInput}\nRANDOM NUMBER BETWEEN 1 and ${number}: ${randomNumber}\n`;
                }
            } else if (input.startsWith('rps ')) {
                let parts = input.split(' ');
                let numberCOMPUTER = Math.floor(Math.random() * 3);
                const rps = parts[1];
                switch(rps) {
                    case 'scissors':
                        if (numberCOMPUTER === 0) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE SCISSORS TOO: DRAW\n`;   
                        } else if (numberCOMPUTER === 1) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE PAPER: YOU WON\n`;   
                        } else if (numberCOMPUTER === 2) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE ROCK: YOU LOST\n`;   
                        }
                        break;
                    case 'paper':
                        if (numberCOMPUTER === 0) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE SCISSORS: YOU LOST\n`;   
                        } else if (numberCOMPUTER === 1) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE PAPER TOO: DRAW\n`;   
                        } else if (numberCOMPUTER === 2) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE ROCK: YOU WON\n`;   
                        }
                        break;                        
                    case 'rock':
                        if (numberCOMPUTER === 0) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE SCISSORS: YOU WON\n`;   
                        } else if (numberCOMPUTER === 1) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE PAPER: YOU LOST\n`;   
                        } else if (numberCOMPUTER === 2) {
                            output.innerHTML += `${promptAndInput}\nTHE COMPUTER CHOSE ROCK TOO: DRAW\n`;   
                        }
                        break;
                    default:     
                        output.innerHTML += `${promptAndInput}\n<span style="color: red;">ERROR: TRY 'rps (rock/paper/scissors)'</span>\n`;      
                }
            } else {
                output.innerHTML += `${promptAndInput}\n<span style="color: red;">ERROR: COMMAND "${input}" HAS NOT BEEN FOUND</span>\n`;
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


const scrollableDiv = document.getElementById('scrollableDiv');

inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && inputField.value.trim() !== '') {
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.textContent = inputField.value;
    scrollableDiv.appendChild(newMessage);

    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

    inputField.value = '';
  }
});


function asciiTimetable() {
    const output = document.getElementById('output');
    const input = document.getElementById('input').value.toLowerCase();
    const promptAndInput = `<span class="prompt">user@host:~$</span>${input}`;
 

    const timetableData = {
        "Montag": ["M1-M3", "M1-M3", "M1-M3", "M1-M3", "Rel", "Deu", "", "M4", "M4", "M4"],
        "Dienstag": ["Mathe", "Mathe", "Eng", "M1-M3", "M1-M3", "M1-M3"],
        "Mittwoch": ["Eng", "Ital", "M1-M3", "M1-M3", "GK-ZG", "", "M4", "M4"],
        "Donnerstag": ["Sport", "Sport", "Deu", "Deu", "Mathe", "", "M1-M3", "M1-M3", "M1-M3", "M1-M3"],
        "Freitag": ["Ital", "Ital", "GK-ZG", "Eng", "Eng"]
    };

    const weekDates = getWeekDates();
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const times = ["07:50", "08:40", "09:30", "10:35", "11:25", "12:15", "13:15", "14:05", "15:05", "15:55"];
    const cellWidth = 19; 

    output.innerHTML = `${promptAndInput}\n+-------------------+-------------------+-------------------+-------------------+-------------------+-------------------+\n`;
    output.innerHTML += "|       Zeit        |      Montag       |     Dienstag      |     Mittwoch      |    Donnerstag     |      Freitag      |\n";

    output.innerHTML += "|                   ";
    for (let i = 0; i < 5; i++) {
        output.innerHTML += "|       " + weekDates[i] + "       ";
    }
    output.innerHTML += "|\n";
    output.innerHTML += "+-------------------+-------------------+-------------------+-------------------+-------------------+-------------------+\n";

    for (let i = 0; i < times.length; i++) {
        output.innerHTML += `|       ${times[i]}       `;
        days.forEach(day => {
            let subject = timetableData[day]?.[i] || ""; 
            let paddedSubject = subject.padStart((cellWidth + subject.length) / 2).padEnd(cellWidth, ' '); 
            output.innerHTML += `|${paddedSubject}`;
        });
        output.innerHTML += "|\n";
        output.innerHTML += "+-------------------+-------------------+-------------------+-------------------+-------------------+-------------------+\n";
    }

}

function getWeekDates() {
    const today = new Date();
    const weekStart = today.getDate() - today.getDay() + 1; 
    const weekDates = [];

    for (let i = 0; i < 5; i++) { 
        const date = new Date(today.setDate(weekStart + i));
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        weekDates.push(`${day}.${month}`);
    }

    return weekDates;
}


function formatCowsay(text) {
    return `
<div style="font-family: monospace; white-space: pre; /* Verhindert Zeilenumbruch und behält Leerzeichen bei */overflow-x: auto; /* Ermöglicht horizontales Scrollen, falls notwendig */max-width: 100%; /* Passt das div an die Bildschirmgröße an */">
#(#((((((((((((((((((((#%%#%&&&%%%%%%%#%##((((((////////////                                      
(((((((((((((((###%%%%&@@@@@@&@@@@@@@@@&&&&&&%%##((((///////                                      
(((((((((((##%%%&&&&@@@@@@@@@@@@@@@@@@@@@@&@@@&&&&%#(((/////                                      
((((((((((##%&@@@@@&&@@@@@@@@@@@@@@@@@@@@@&&@@@@@@&&%#(((///                 @@@@@@@@                      
((((((((((#%&&&&&&&&&&&&@@@@&&&&@@@@@@@@@@@@@@&&&@@@@&%##(//           @@@@           @@@@         
(((((((((((#&&&&%%%&&&&&&&&%%&&&&&&&&&&%%&&@@@@@&%&@&&&%##(/       @@                        @@@    
((((((((((##%#(%%%%#%%%%%%%%%#%%%%%%&&&&&@&&&&&&&&&&&&%%#((/    @@                               @  
((((((/(((#####(((####%###%#####%&&&&&&&&@%%#%%%%%%%&&%%#(//  @@                                   @
//////////(////**///((####(((##(%###(###%#%%##%%%((#%%###//* @                                      @
/////////    ...,**//*//(((/(/(((((((/((((#(((((###(/,.#(//*@@                                       @
////*         ..*/((#(((((////*////*////////(((((%(*     /**@  ${text}                    
                 ...,,**/(((////////////((#%%%%%%((*       , @                                       @
                 ,**%%&@#,,,,****//////(((//(##(/*,          (@                                     @
                    */%&##&/*..,*//////#%%&&&//((,             @%                                 @@
           (%&&&.    .,**//*,.. .*////((##((/****                @@                            ,@   
         %&&&&@@@   ...,,,....   ,//////////****,                @                         @@@      
        (%&&&&%%&&    ..,...     .//**////*****,                @,@@*     (@@@@@@@@@@@@@            
         ,/#%%#%&##   ..,,,.     .*//**///****/              #@.                                    
        */*((%%%&#%&,  .,,,     .,*///**//**,&%           (                                          
     /(#/(%%(#%%&&@@&& .,,,,,.  ,***//*(//*/&&%%(/                                                  
    (#####%#%#(%&&@@&&@#....,,*,,**/*/*&@&&%%%%%##.                                                
   ,###%%#%(&&#%#%&&@&@@@& ..,**//////*&@&&&%%&%%%%%%#                                              
   (#%%%%%%%&&&&#%#%&&@@@@@@,,,**/*//&&@&&&&&&&%%%%%%%/                                             
  /##%%%%%&%&&&&&%&%#%&&&&@@@@@@@@@&&%&&&&&&&&&%%%%%%%%                                             
  #%#%%%%%%%&&&&&%%&&&&&%&&&&&&@@&&&&&&&&&&&&&&%&%%%%%%                                             
  /%&&(%&&#%%&&&&&%%%%&&&#&&&&&&&&&&&&&&&&&&&&&%&&&&&&%*                                             
   %&%%#&&&%&&&&&%%%%&&&#&&&&&&&&&&&&&&&&&&&&&%&&&&&&&&%                                              
   /%&&&&%%%&&&&&%%%%%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&                                               
   //%&&&&&#%&&&&%%%%%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&                                                
   (#%%%%%&(&&&&%(((#%#%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  
    </div>

    <style>
        /* Media query for smaller screens */
        @media (max-width: 600px) {
            div {
                max-width: 100%; /* Div nimmt die volle Breite des Bildschirms ein */
                overflow-x: auto; /* Ermöglicht horizontales Scrollen auf kleinen Bildschirmen */
            }
        }
    </style>
`                                                
}

function vacation() {
    const now = new Date().getTime();
    const events = [
        { name: "Schulstart", date: new Date("Sep 05, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [05.09.24] Schulstart: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2024] [05.09.24] Schulstart: " },
        { name: "Allerheiligen", date: new Date("Nov 01, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [01.11.24] Allerheiligen: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2024] [01.11.24] Allerheiligen: " },
        { name: "Sant Ambrogio", date: new Date("Dec 07, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [07.12.24] Sant Ambrogio: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2024] [07.12.24] Sant Ambrogio: " },
        { name: "Weihnachtsferien", date: new Date("Dec 23, 2024 00:00:00").getTime(), pastMessage: "[✔️] [2024] [23.12.24] Weihnachtsferien: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2024] [23.12.24] Weihnachtsferien: " },
        { name: "Faschingsferien", date: new Date("Feb 10, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [10.02.25] Faschingsferien: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [10.02.25] Faschingsferien: " },
        { name: "Osterferien", date: new Date("Apr 17, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [17.04.25] Osterferien: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [17.04.25] Osterferien: " },
        { name: "Tag der Befreiung", date: new Date("Apr 25, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [25.04.25] Tag der Befreiung: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [25.04.25] Tag der Befreiung: " },
        { name: "Tag der Arbeit", date: new Date("May 01, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [01.05.25] Tag der Arbeit: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [01.05.25] Tag der Arbeit: " },
        { name: "Tag der Republik", date: new Date("Jun 02, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [02.06.25] Tag der Republik: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [02.06.25] Tag der Republik: " },
        { name: "Pfingsten", date: new Date("Jun 08, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [08.06.25] Pfingsten: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [08.06.25] Pfingsten: " },
        { name: "Schulende", date: new Date("Jun 13, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [13.06.25] Schulende: Countdown <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [13.06.25] Schulende: " }
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

            output.innerHTML += `${event.upcomingMessage} <span style="color: red;">${days} Tage, ${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden.</span>\n`;
        }
    });

    output.scrollTop = output.scrollHeight;  
}

function simulateShutdown(outputDiv) {
    const shutdownMessages = [
        "<span style=\"color: yellow;\">[INFO]</span> Starting shutdown sequence...",
        "<span style=\"color: red;\">[ERROR]</span> Failed to stop web server: apache2. Unable to terminate the service, please check logs.",
        "<span style=\"color: green;\">[OK]</span> Stopping web server: apache2.",
        "<span style=\"color: green;\">[OK]</span> Stopping database server: mysql.",
        "<span style=\"color: green;\">[OK]</span> Stopping system logging service: rsyslog.",
        "<span style=\"color: green;\">[OK]</span> Stopping OpenSSH server: sshd.",
        "<span style=\"color: green;\">[OK]</span> Unmounting /dev/sda1...",
        "<span style=\"color: green;\">[OK]</span> Unmounting /dev/sdb1...",
        "<span style=\"color: red;\">[ERROR]</span> Unable to unmount /dev/sda2. Device is busy or in use by another process.",
        "<span style=\"color: green;\">[OK]</span> Flushing file systems...",
        "<span style=\"color: green;\">[OK]</span> Stopping remaining processes...",
        "<span style=\"color: yellow;\">[INFO]</span> Sending SIGTERM to remaining processes...",
        "<span style=\"color: yellow;\">[INFO]</span> Sending SIGKILL to remaining processes...",
        "<span style=\"color: green;\">[OK]</span> Unmounting remaining file systems...",
        "<span style=\"color: yellow;\">[INFO]</span> Deactivating swap...",
        "<span style=\"color: yellow;\">[INFO]</span> Powering off...",
        "<span style=\"color: yellow;\">[INFO]</span> Syncing file systems...",
        "<span style=\"color: green;\">[OK]</span> System will halt now.",
        "<span style=\"color: green;\">[OK]</span> System halted.",
        "<span style=\"color: yellow;\">[INFO]</span> Restarting system checks... Performing final diagnostics.",
        "<span style=\"color: green;\">[OK]</span> Closing all active sessions... Ensuring user data is saved.",
        "<span style=\"color: green;\">[OK]</span> Terminating background services... Cleaning up resources.",
        "<span style=\"color: yellow;\">[INFO]</span> Running final synchronization... Ensuring no data is lost.",
        "<span style=\"color: green;\">[OK]</span> Powering down peripherals... Disabling connected devices.",
        "<span style=\"color: yellow;\">[INFO]</span> Finalizing shutdown... Preparing to cut power.",
        "<span style=\"color: green;\">[OK]</span> All processes terminated successfully.",
        "<span style=\"color: yellow;\">[INFO]</span> Awaiting power-off confirmation... Ensuring readiness.",
        "Powering off...",
        "<span style=\"color: yellow;\">[INFO]</span> <span style=\"color: green;\">System has powered off.</span>"
    ];

    let index = 0;

    function displayNextMessage() {
        const outputDiv = document.getElementById('output'); 
    
        if (index < shutdownMessages.length) {
            outputDiv.innerHTML += `<p>${shutdownMessages[index]}</p>`;

            setTimeout(function() {
                outputDiv.scrollTop = outputDiv.scrollHeight;
            }, 10);
            
            index++;
            setTimeout(displayNextMessage, 200);
        } else {
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 300);
        }
    }

    displayNextMessage();
}

function displayRandomContent() {
    const randomItems = [
        "2 Lügen, 1 Wahrheit: \n\nIch bin ein Rassist! \nIch bin ein Nazisst \nMein schwarzes Schwein heißt Leon",
        "io cago nel salotto",
        "Wie sagt man, ??? eeeehmm ...",
        "Teacher: Was ist die Absicht von Donald Trump?\n\nSiggidy: Atombombe!\n\nTeacher: Siggidy, das ist jetzt nicht passend zum Unterricht!! ab zum Nachsitzen und danach gibt es ein Gespräch mit dem Direktor!!",
        "<img src='pictures/sieder/dasiggidy.png' alt='\n\nDaSiggidy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyfinger.png' alt='\n\nSiggidy is showing his looooong Finger' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyhome.png' alt='\n\nHome of Siggiyy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyyyy.png' alt='\n\nJust Siggidy' width='250px' height='250px'>",

        {
            type: 'video',
            src: 'pictures/siggidy-videos/siggidy-main.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0 
        },
        {
            type: 'video',
            src: 'pictures/siggidy-videos/Schuhe-schnueffeln.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0 
        },
        {
            type: 'video',
            src: 'pictures/sexy-rock.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0
        },
        {
            type: 'video',
            src: 'pictures/siggidy-videos/siggidy-edit.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0
        }
    ];

    const randomIndex = Math.floor(Math.random() * randomItems.length);
    const output = document.getElementById('output');
    
    const selectedItem = randomItems[randomIndex];
    
    if (typeof selectedItem === 'string') {
        output.innerHTML += `${selectedItem}\n`;
    } else if (selectedItem.type === 'video') {
        const video = document.createElement('video');
        video.setAttribute('width', selectedItem.width);
        video.setAttribute('height', selectedItem.height);
        video.setAttribute('loop', 'true');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true'); 
        video.volume = 0; 
        
        const source = document.createElement('source');
        source.setAttribute('src', selectedItem.src);
        source.setAttribute('type', 'video/mp4');
        
        video.appendChild(source);
        output.appendChild(video);

        output.appendChild(document.createElement('br'));

        video.addEventListener('click', () => {
            video.muted = false; 
            video.volume = selectedItem.volume; 
        });
    }
}

displayRandomContent();