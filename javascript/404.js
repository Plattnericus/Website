document.addEventListener('DOMContentLoaded', () => {
    const terminalAudio = document.getElementById('terminalAudio');
    const matrixText = document.getElementById('matrixText');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const ctx = matrixCanvas.getContext('2d');
    
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    terminalAudio.volume = 0.2;
    terminalAudio.play().catch(e => console.log("Audio play failed:", e));
    
    const letters = "01";
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    const drawMatrix = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        ctx.fillStyle = "#00ff00";
        ctx.font = `${fontSize}px 'IBM Plex Mono'`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    };
    
    setInterval(drawMatrix, 50);
    
    const animateMatrixText = () => {
        const originalText = matrixText.textContent;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let iterations = 0;
        
        const interval = setInterval(() => {
            matrixText.textContent = originalText.split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                setTimeout(animateMatrixText, 2000);
            }
            
            iterations += 1 / 3;
        }, 30);
    };
    
    animateMatrixText();
    
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const href = button.getAttribute('href');
            
            button.classList.add('clicked');
            
            setTimeout(() => {
                if (href.startsWith('http') || href.startsWith('mailto')) {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }, 500);
        });
    });
    
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
});