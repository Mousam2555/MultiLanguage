// scripts.js

function changeLanguage() {
    const selectedLanguage = document.getElementById('languageSelect').value;
    const body = document.getElementById('body');

    if (selectedLanguage === 'fr') {
        authenticateByEmail();
        body.style.backgroundColor = 'yellow';
    } else if (selectedLanguage === 'hi') {
        authenticateByMobile();
        body.style.backgroundColor = 'blue';
    } else if (selectedLanguage === 'zh') {
        authenticateByMobile();
        body.style.backgroundColor = 'green';
    } else {
        authenticateByMobile();
        body.style.backgroundColor = 'white';
    }

    i18next.changeLanguage(selectedLanguage, (err, t) => {
        if (err) return console.error(err);
        updateContent();
    });
}

function updateContent() {
    document.getElementById('content').innerHTML = i18next.t('content');
}

function authenticateByEmail() {
    const email = prompt("Please enter your email:");
    if (email) {
        sendOtpToEmail(email);
    }
}

function authenticateByMobile() {
    const mobile = prompt("Please enter your mobile number:");
    if (mobile) {
        sendOtpToMobile(mobile);
    }
}

function sendOtpToEmail(email) {
    fetch('/send-email-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        }).then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
}

function sendOtpToMobile(mobile) {
    fetch('/send-mobile-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: mobile })
        }).then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
}

i18next.init({
    lng: 'en',
    resources: {
        en: { translation: { "content": "Welcome to our website!" } },
        es: { translation: { "content": "¡Bienvenido a nuestro sitio web!" } },
        hi: { translation: { "content": "हमारी वेबसाइट पर आपका स्वागत है!" } },
        pt: { translation: { "content": "Bem-vindo ao nosso site!" } },
        zh: { translation: { "content": "欢迎访问我们的网站！" } },
        fr: { translation: { "content": "Bienvenue sur notre site Web!" } }
    }
}, (err, t) => {
    if (err) return console.error(err);
    updateContent();
});