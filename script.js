// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCag-o71OwAgoR1JgHUmEfTRoKGdV-nwis",
    authDomain: "multilanguage-7543d.firebaseapp.com",
    projectId: "multilanguage-7543d",
    storageBucket: "multilanguage-7543d.appspot.com",
    messagingSenderId: "72653547419",
    appId: "1:72653547419:web:f5aa7a2f0925e74d60a33e",
    measurementId: "G-8WRRBS1TSN"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Initialize reCAPTCHA verifier
let appVerifier;

function changeLanguage()  {
    const selectedLanguage = document.getElementById('languageSelect').value;
    const body = document.getElementById('body');

    if (selectedLanguage === 'fr') {
        authenticateByEmail();
        body.style.backgroundColor = 'yellow';
    } else if (selectedLanguage === 'hi' || selectedLanguage === 'zh') {
        authenticateByMobile(selectedLanguage);
        // body.style.backgroundColor = selectedLanguage === 'hi' ? 'blue' : 'green';
    } else {
        authenticateByMobile(selectedLanguage);
        // body.style.backgroundColor = 'white';
    }

    // i18next.changeLanguage(selectedLanguage, (err, t) => {
    //     if (err) return console.error(err);
    //     updateContent();
    // });
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

function authenticateByMobile(language) {
    const mobile = prompt("Please enter your mobile number (in +1234567890 format):");
    if (mobile) {
        sendOtpToMobile(mobile,language);
    }
}

function sendOtpToEmail(email) {
    const actionCodeSettings = {
        url: 'https://mousam2555.github.io/MultiLanguage/',
        handleCodeInApp: true
    };

    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
            // Save the email locally to complete sign-in later
            window.localStorage.setItem('emailForSignIn', email);
            alert('Email sent! Please check your email for the OTP.');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
}

function sendOtpToMobile(mobile,selectedLanguage) {
    if (!appVerifier) {
        appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible'
        });
    }

    appVerifier.render().then(function(widgetId) {
        auth.signInWithPhoneNumber(mobile, appVerifier)
            .then((confirmationResult) => {
                const otp = prompt("Enter the OTP sent to your mobile:");
                return confirmationResult.confirm(otp);
            })
            .then((result) => {
                alert('Phone number verified!');
                i18next.changeLanguage(selectedLanguage, (err, t) => {
                    if (err) return console.error(err);
                    updateContent();
                });

                if (selectedLanguage === 'fr') {
                    body.style.backgroundColor = 'yellow';
                } else if (selectedLanguage === 'hi' || selectedLanguage === 'zh') {
                    
                    body.style.backgroundColor = selectedLanguage === 'hi' ? 'blue' : 'green';
                }
                 else {
                    
                    body.style.backgroundColor = 'white';
                }
            
               


            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }).catch((error) => {
        console.error('Error rendering reCAPTCHA:', error);
    });
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
