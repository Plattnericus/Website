document.addEventListener('DOMContentLoaded', function() {
    const cookiePopup = document.getElementById('cookiePopup');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    if (!getCookie('cookieConsent')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 1500);
    }

    cookieAccept.addEventListener('click', () => {
        setCookie('cookieConsent', 'accepted', 365);
        cookiePopup.classList.remove('active');
    });

    cookieDecline.addEventListener('click', () => {
        setCookie('cookieConsent', 'declined', 30);
        cookiePopup.classList.remove('active');
    });
});