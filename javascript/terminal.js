var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var fontSize = 16;
var str = "Letters Dropping";
var drops = [];
var columns;
var fallSpeed = 1; 

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
    context.fillStyle = "rgba(0,0,0,0.05)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "700 " + fontSize + "px sans-serif";
    context.fillStyle = "#00cc33";

    for (var i = 0; i < columns; i++) {
        var index = Math.floor(Math.random() * str.length);
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        context.fillText(str[index], x, y);

        if (y >= canvas.height && Math.random() > 0.99) {
            drops[i] = 0;
        }
        drops[i] += fallSpeed;
    }
}

function update() {
    draw();
    requestAnimationFrame(update);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
update();



$(document).ready(function() {
    const $input = $('#input');
    const $output = $('#output');
    const $form = $('#form');
    const $fakeClose = $('#fakeClose');
    const $fakeMinimize = $('#fakeMinimize');
    const $fakeZoom = $('#fakeZoom');

    function resetForm() {
        const message = "PLEASE TYPE `HELP` FOR HELP";
        $output.text('');
        $input.val('');
        $('.new-output').removeClass('new-output');
        $('.terminal').append(`<p class="prompt">${message}</p><p class="prompt output new-output"></p>`);
    }

    function cmdKittens() {
        window.location.href = '/';  // Navigate to home
    }

    function textEffect(line) {
        const alpha = [';', '.', ',', ':', ';', '~', '`'];
        const animationSpeed = 10;
        let index = 0;
        const string = line.text();
        const splitString = string.split("");
        const copyString = splitString.slice(0);

        let emptyString = copyString.map(function(el){
            return [alpha[Math.floor(Math.random() * (alpha.length))], index++];
        });

        emptyString = shuffle(emptyString);

        $.each(copyString, function(i, el){
            const newChar = emptyString[i];
            toUnderscore(copyString, line, newChar);

            setTimeout(function(){
                fromUnderscore(copyString, splitString, newChar, line);
            }, i * animationSpeed);
        });
    }

    function toUnderscore(copyString, line, newChar) {
        copyString[newChar[1]] = newChar[0];
        line.text(copyString.join(''));
    }

    function fromUnderscore(copyString, splitString, newChar, line) {
        copyString[newChar[1]] = splitString[newChar[1]];
        line.text(copyString.join(''));
    }

    function shuffle(o) {
        for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    $input.on('input', function() {
        const value = $(this).val();
        $('.new-output').text(value);
    });

    $form.on('submit', function(e) {
        e.preventDefault();
        const inputValue = $input.val().toLowerCase();
        if (inputValue === 'kittens') {
            cmdKittens();
        } else {
            resetForm();
        }
    });

    function handleDocumentClick() {
        $input.focus();
    }

    $(document).on('click', handleDocumentClick);

    $fakeClose.add($fakeMinimize).add($fakeZoom).on('click', cmdKittens);

    // Initialize focus
    $input.focus();
});
