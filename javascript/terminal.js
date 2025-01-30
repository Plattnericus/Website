

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
            const input = sanitizeInput(this.value.toLowerCase());
            const output = document.getElementById('output');
    
            const promptAndInput = `<span style=\"color: green;\">user@host:~$ </span>${input}`; 
    
            if (input.startsWith('siggidysay ')) {
                const input2 = input.substring('siggidysay '.length);
                const cowsayOutput = formatCowsay(input2);
                output.innerHTML += `${promptAndInput}\n${cowsayOutput}\n`;
            } else if (input === 'help') {
                output.innerHTML += `${promptAndInput}<p>    help                                     -   THIS LIST
    version                                  -   TERMINAL VERSION
    shutdown                                 -   SHUTDOWN TERMINAL
    clear                                    -   CLEARS CONSOLE
    date                                     -   DATE AND TIME
    ip                                       -   YOUR IP
    vacation                                 -   SCHOOL VACATIONS
    calc (NUMBER) (OPERATOR) (NUMBER)        -   CALCULATOR
    random (NUMBER)                          -   RANDOM NUMBERS
    mensa                                    -   SHOWS THE CAFETERIA PLAN 
    timetable                                -   timetable of the BFS FI 2
    minecraft random                         -   shows images of our MC WORLD</p>\n`;
            } else if (input === 'version') {
                output.innerHTML += `${promptAndInput}\nVERSION 1.69 - Finished\n`;
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
                output.innerHTML += `${promptAndInput}\nCOMMANDS THAT STILL NEED TO BE PROGRAMMED:\neverything is finished!!!\n`;
            } else if (input === 'shutdown') {
                simulateShutdown();
            } else if (input === 'timetable') {
                asciiTimetable();
            } else if (input === 'vacation') {
                vacation(); 
            } else if(input == 'mensa'){
                asciiMensaplan();
            } else if (input === 'version') {
                output.innerHTML += `${promptAndInput}\nVERSION 1.69 - Finished\n`;
            } else if (input === 'sudo su -') {
                output.innerHTML += `${promptAndInput}\nSieder hoff nit!! HAHAHAHAHAHA`;
            } else if (input.startsWith('get money')) {
                output.innerHTML += `${promptAndInput}\n`;
                const amount = parseInt(input.split(' ')[2], 10); 
                if (!isNaN(amount)) {
                    output.innerHTML += '\n<Du hast ' + amount + '$ bekommen!!\n';
                    score = amount; 
                } else {
                    output.innerHTML += "<span style=\"color: red;\">[Arity] Wrong number of arguments. Function 'get money' expects 0 got 1!</span>\n";
                }
            } else if (input === 'clear') {
                output.innerHTML = ''; 
            }  else if (input.startsWith('ineedmoneypls')) {
                let moneyInput; 
                
                const inputParts = input.split(' ');
            

                if (inputParts.length > 2) {
                    const action = inputParts[1].toLowerCase();
                    moneyInput = parseInt(inputParts[2]);
            
                    if (!isNaN(moneyInput) && moneyInput >= 0) { 
                        switch (action) {
                            case 'add':
                                score += moneyInput; 
                                output.innerHTML += `${promptAndInput}\nMONEY got added: ${moneyInput}\n`;
                                break;
                            case 'set':
                                score = moneyInput; 
                                output.innerHTML += `${promptAndInput}\nMONEY set to: ${moneyInput}\n`;
                                break;
                            case 'remove':
                                if (moneyInput <= score) { 
                                    score -= moneyInput; 
                                    output.innerHTML += `${promptAndInput}\nMONEY got removed: ${moneyInput}\n`;
                                } else {
                                    output.innerHTML += `${promptAndInput}\nCannot remove ${moneyInput}, insufficient funds.\n`;
                                }
                                break;
                            default:
                                output.innerHTML += `${promptAndInput}\nInvalid action. Please use add, set, or remove.\n`;
                                break;
                        }
                        saveScore();
                    } else {
                        output.innerHTML += `${promptAndInput}\nInvalid money input. Please enter a non-negative number.\n`;
                    }
                } else {
                    output.innerHTML += `${promptAndInput}\nJUST kidding you dont get any money here!\n`;
                }
                        }
            else if (input.trim() === '') {                     
                output.innerHTML += `${promptAndInput}\n`;
            } else if (input === 'siggidy random') {
                output.innerHTML += `${promptAndInput}\n`;
                displayRandomContent(); 
            } else if (input === 'minecraft random') {
                output.innerHTML += `${promptAndInput}\n`;
                displayRandomMinecraftContent(); 
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
            } else if (input.startsWith('random ') || input.startsWith('random')) {
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
            } else if (input.startsWith('rps ') || input.startsWith('rps')) {
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
        
            function sanitizeInput(input) {
                const div = document.createElement('div');
                div.innerText = input;
                return div.innerHTML;
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

let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

function saveScore() {
    localStorage.setItem('score', score);
}
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


function asciiMensaplan() {
    const output = document.getElementById('output');
    const input = document.getElementById('input').value.toLowerCase();
    const promptAndInput = `<span class="prompt">user@host:~$</span>${input}`;

    output.innerHTML += `${promptAndInput}\n`;

    // Timetable data with unique meal names
    const timetableData = {
        "Montag": [
            "Farfalle mit Zucchini und Lachssauce",
            "Gebratene Hähnchenschenkel mit Pommes Frites",
            "Kräuterknödel mit Pilzsauce",
            "Truthahngeschnetzeltes mit Reis",
            "Hirtenmaccheroni mit Mozzarelline",
            "Rindsbraten mit Eierspätzle",
        ],
        "Dienstag": [
            "Truthahnbraten mit Reis",
            "Fusilli mit Thunfischsauce",
            "Wienerschnitzel (Truthahn) mit Ofenkartoffeln",
            "Spinatspätzle mit Schinken und Sahnesauce",
            "Champignonschnitzel mit Kroketten",
            "Schollenfilet gebacken mit Kräuterkartoffeln",
        ],
        "Mittwoch": [
            "Rindsgulasch mit Polenta",
            "Schlutzkrapfen mit Butter und Parmesan",
            "Kalbsbraten mit gedünstetem Reis",
            "Penne mit Bolognesersauce",
            "Wienerschnitzel (Truthahn) mit Bratkartoffeln",
            "Vollkornnudel mit Gemüsesauce",
        ],
        "Donnerstag": [
            "Spinat- und Käseknödel mit Gorgonzolasauce",
            "Fleischkrapfen mit Kartoffelpüree",
            "Conchiglie mit Tomaten-Basilikumsauce und Mozzarelline",
            "Kalbsgulasch mit Reis",
            "Pennette mit Meeresfrüchten",
            "Lasagne Bolognese oder Gemüse",
        ],
        "Freitag": [
            "Kartoffelnocken mit Tomatensauce",
            "Kabeljau gratiniert mit Polenta",
            "Lachsschnitte im Ofen mit Schnittlauchkartoffeln",
            "Pizza mit Thunfisch oder Margherita",
            "Käsepressknödel mit Lauchsoße",
            "Gegrilltes Kalbswürstel mit Petersilienkartoffeln",
        ]
    };

    // Week date ranges
    const times = [
        "03.02 - 07.02",
        "10.02 - 14.02",
        "17.02 - 21.02",
        "24.02 - 28.02",
        "03.03 - 07.03",
        "10.03 - 14.03"
    ];

    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7; // Adjust to start with Monday
    const currentDate = now.getDate();
    const currentMonth = now.getMonth() + 1;

    // Determine current week's range
    const currentWeekIndex = times.findIndex((time) => {
        const [start, end] = time.split(" - ").map(d => {
            const [day, month] = d.split(".").map(Number);
            return { day, month };
        });

        const startDate = new Date(now.getFullYear(), start.month - 1, start.day);
        const endDate = new Date(now.getFullYear(), end.month - 1, end.day);
        const todayDate = new Date(now.getFullYear(), currentMonth - 1, currentDate);

        return todayDate >= startDate && todayDate <= endDate;
    });

    // Create the table
    const table = document.createElement('table');
    table.classList.add('table-mensa'); // Use custom class

    // Table header
    const headerRow = document.createElement('tr');
    const monthHeader = document.createElement('th');
    monthHeader.textContent = ' ';
    monthHeader.classList.add('th-mensa');
    headerRow.appendChild(monthHeader);

    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    days.forEach(day => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = day;
        dayHeader.classList.add('th-mensa');
        headerRow.appendChild(dayHeader);
    });

    table.appendChild(headerRow);

    // Table body
    times.forEach((time, rowIndex) => {
        const row = document.createElement('tr');

        const monthCell = document.createElement('td');
        monthCell.textContent = time;
        monthCell.classList.add('td-mensa');
        row.appendChild(monthCell);

        days.forEach((day, dayIndex) => {
            const subjectCell = document.createElement('td');
            const subject = timetableData[day]?.[rowIndex] || "";

            // Make meal names clickable
            const clickableMeal = document.createElement('a');
            clickableMeal.href = `https://www.google.com/search?hl=en&tbm=isch&q=${encodeURIComponent(subject)}`;
            clickableMeal.target = "_blank"; // Open in a new tab
            clickableMeal.textContent = subject;

            subjectCell.appendChild(clickableMeal);
            subjectCell.classList.add('td-mensa');

            // Highlight current day's meal
            if (rowIndex === currentWeekIndex && dayIndex === currentDayIndex) {
            subjectCell.style.backgroundColor = 'rgba(11, 186, 14, 0.4)';
            } else if (subject === "") {
                subjectCell.style.backgroundColor = '#161616d2'; // Dark background for empty cells
            }

            row.appendChild(subjectCell);
        });

        table.appendChild(row);
    });

    output.scrollTop = output.scrollHeight;
    output.appendChild(table);

    // Add custom CSS for the links
    const style = document.createElement('style');
    style.innerHTML = `
        .td-mensa a {
            color: white;
            text-decoration: none;
        }
        .td-mensa a:hover {
            color: green;
        }
    `;
    document.head.appendChild(style);
}





function asciiTimetable() {
    const output = document.getElementById('output');
    const input = document.getElementById('input').value.toLowerCase();
    const promptAndInput = `<span class="prompt">user@host:~$</span>${input}`;

    output.innerHTML += `${promptAndInput}\n`;

    const timetableData = {
        "Monday": ["M1-M3", "M1-M3", "M1-M3", "M1-M3", "Rel", "Ger", "", "M4", "M4", "M4"], 
        "Tuesday": ["Maths", "Maths", "Eng", "M1-M3", "M1-M3", "M1-M3"],
        "Wednesday": ["Eng", "Ital", "M1-M3", "M1-M3", "GK-ZG", "", "M4", "M4"],
        "Thursday": ["Sports", "Sports", "Ger", "Ger", "Maths", "", "M1-M3", "M1-M3", "M1-M3", "M1-M3"],
        "Friday": ["Ital", "Ital", "GK-ZG", "Eng", "Eng"]
    }; 
    
    const weekDates = getWeekDates();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = ["07:50", "08:40", "09:30", "10:35", "11:25", "12:15", "13:15", "14:05", "15:05", "15:55", "16:45"]; 

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

    const table = document.createElement('table');
    table.classList.add('timetable');

    const headerRow = document.createElement('tr');

    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Zeit';
    headerRow.appendChild(timeHeader);

    days.forEach((day, index) => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = `${day}\n(${weekDates[index]})`;

        const dayOfWeek = (index + 1) % 7;
        if (dayOfWeek < currentDay) {
            dayHeader.classList.add('past-day');
        } else if (dayOfWeek === currentDay) {
            dayHeader.classList.add('current-day');
        }

        headerRow.appendChild(dayHeader);
    });

    table.appendChild(headerRow);

    times.forEach((time, rowIndex) => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        days.forEach((day, dayIndex) => {
            const subjectCell = document.createElement('td');
            const subject = timetableData[day]?.[rowIndex] || "";
            subjectCell.textContent = subject;

            const dayOfWeek = (dayIndex + 1) % 7;

            const isSameWeek = dayOfWeek >= currentDay || currentDay === 6; 
            const isPastTimeToday = (dayOfWeek === currentDay && time < currentTime);

            if (dayOfWeek < currentDay) {
                subjectCell.classList.add('past-day');
            } else if (dayOfWeek === currentDay) {
                if (isPastTimeToday) {
                    subjectCell.classList.add('past-hour');
                } else if (time >= currentTime) {
                    subjectCell.classList.add('current-hour');
                }
            } else {
                subjectCell.classList.add('future-hour'); 
            }

            row.appendChild(subjectCell);
        });

        table.appendChild(row);
    });
    output.scrollTop = output.scrollHeight;

    output.appendChild(table);
}


function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); 

    let mondayOffset = currentDay === 6 ? 2 : (currentDay === 0 ? -6 : 1 - currentDay);

    const weekStartDate = new Date(today.setDate(today.getDate() + mondayOffset));

    const weekDates = [];

    for (let i = 0; i < 5; i++) {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);
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
                max-width: 100%; 
                overflow-x: auto; 
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
        { name: "Faschingsferien", date: new Date("May 1, 2025 00:00:00").getTime(), pastMessage: "[✔️] [2025] [01.03.25] Faschingsferien: <span style=\"color: green;\">Countdown complete.</span>", upcomingMessage: "[❌] [2025] [01.03.25] Faschingsferien: " },
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

            output.innerHTML += `${event.upcomingMessage} <span style="color: red;">${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.</span>\n`;
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
        "*Italienisch Präsentation*\n\nSiggidy missing",
        "Teacher: Was ist die Absicht von Donald Trump?\n\nSiggidy: Atombombe!\n\nTeacher: Siggidy, das ist jetzt nicht passend zum Unterricht!! ab zum Nachsitzen und danach gibt es ein Gespräch mit dem Direktor!!",
        "<img src='pictures/sieder/dasiggidy.webp' alt='\n\nDaSiggidy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyfinger.webp' alt='\n\nSiggidy is showing his looooong Finger' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyhome.webp' alt='\n\nHome of Siggiyy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidyyyy.webp' alt='\n\nJust Siggidy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidy-am-Busbahnhof.webp' alt='\n\nSiggidy at the Railwaystation' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidy-boss.webp' alt='\n\nJust a BOSS' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidy-sieda.webp' alt='\n\nSiggidy' width='250px' height='250px'>",
        "<img src='pictures/sieder/siggidy-sitting_outside.webp' alt='\n\nJust Siggidy sitting outside' width='250px' height='250px'>",
!
        {
            type: 'video',
            src: 'pictures/siggidy-videos/siggidy-main.mp4',
            width: 280,
            height: 360,
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
            src: 'pictures/siggidy-videos/siggidy-edit.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0
        },
        {
            type: 'video',
            src: 'pictures/siggidy-videos/sigggidyasssss.mp4',
            width: 280,
            height: 360,
            volume: 2.0
        },
        {
            type: 'video',
            src: 'pictures/siggidy-videos/siggidyballer.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0
        },
        {
            type: 'video',
            src: 'pictures/siggidy-videos/leondance.mp4',
            width: 280,
            height: 360,
            loop: true,
            autoplay: true,
            volume: 2.0
        },
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


function displayRandomMinecraftContent() {
    const randomItems = [
        "<img src='pictures/minecraft/Before-the-disaster.webp' alt='\n\nBefore Disaster' width='500px' height='250px'>",
        "<img src='pictures/minecraft/budda-nearly-finished.webp' alt='\n\nBudda nearly finished!' width='500px' height='250px'>",
        "<img src='pictures/minecraft/Budda-ryhox-and-nexor.webp' alt='\n\nBudda pic: Ryhox and Nexor together' width='500px' height='250px'>",
        "<img src='pictures/minecraft/budda.webp' alt='\n\nBudda' width='500px' height='250px'>",
        "<img src='pictures/minecraft/END-WORLD.webp' alt='\n\nThis is our End of the World' width='500px' height='250px'>",
        "<img src='pictures/minecraft/first-pic-in-our-base.webp' alt='\n\nThis is our first pic in our first Base!' width='500px' height='250px'>",
        "<img src='pictures/minecraft/gang-pic.webp' alt='\n\nThis is our Gang!! Cheeesee!!' width='500px' height='250px'>",
        "<img src='pictures/minecraft/moments-before-disaster.webp' alt='\n\nThis is a Moment before Disaster! Siggidy didn\'t make it :(' width='500px' height='250px'>",
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

displayRandomMinecraftContent();
