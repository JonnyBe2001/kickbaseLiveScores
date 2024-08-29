// Endpunkt für das Login
const loginUrl = 'https://api.kickbase.com/user/login';

// global variables
let token;

// data for login
const loginData = {
    email: 'jonas.bauer90@outlook.de',  // Ersetze dies durch deine E-Mail-Adresse
    password: 'Mueller25!',        // Ersetze dies durch dein Passwort
    ext: false
};

// login function, also triggers fetchleague
async function login() {
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error(`Login fehlgeschlagen! Status: ${response.status}`);
        }

        const data = await response.json();
        token = data.token;
        localStorage.setItem('token', token);

        console.log('Token:', token);

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}