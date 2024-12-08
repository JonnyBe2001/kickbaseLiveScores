// Globale Variable für das aktuell geöffnete Team
let currentOpenDropdown = null;
let token = localStorage.getItem('token');  // Token aus dem localStorage laden
let leagueId = null;
let playerId ="1473";



// Funktion zum Login
async function login() {
    // Eingabewerte holen
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        em: email,
        ext: false,
        loy: false,
        pass: password,
        rep:{},
    };

    try {
        const response = await fetch('https://api.kickbase.com/v4/user/login', {
            method: 'POST',
            mode: 'cors', // CORS hinzufügen
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
        let loginToken = data.tkn;
        //localStorage.setItem('token', loginToken); Token im localStorage speichern

        leagueId = data.srvl[0]?.id; //get first league

        token = loginToken;
        hideLoginForm();
        loginSuccess();

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}


async function loginSuccess() {
    console.log("success");
    const response = await fetch('https://api.kickbase.com/v4/leagues/5679965/users/3283344/teamcenter', {
        method: 'POST',
        mode: 'cors', // CORS hinzufügen
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
    });
}





// Funktion zum Anzeigen des Login-Formulars
function showLoginForm() {
    document.getElementById('loginForm').style.display = '';  // Entfernt den Inline-Stil
}

function hideLoginForm() {
    document.getElementById('loginForm').classList.add('hidden');  // Zeige das Login-Formular

}

// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    if (token) {
        // Versuche, die Ligen mit dem gespeicherten Token abzurufen
        temporaryQuickFix();
    } else {
        // Zeige das Login-Formular, falls kein Token vorhanden ist
        showLoginForm();
    }
};