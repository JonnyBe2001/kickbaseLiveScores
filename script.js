// Globale Variable für das aktuell geöffnete Team
let currentOpenDropdown = null;
let token = localStorage.getItem('token');  // Token aus dem localStorage laden
let leagueId = null;
let userId = null;
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
        userId = data.u.id;

        token = loginToken;
        hideLoginForm();
        players();
        myeleven();
        performance();

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}


async function players() {
    const url = `https://api.kickbase.com/v4/competitions/1/players/8229?leagueId=5679965`;
        const response = await fetch(url, {
    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
    });
    const playerData = await response.json(); // Teamcenter Data
    const playerPoints = playerData.ph[0]?.p;

    document.getElementById("players").innerHTML=`<strong>/players </strong> Grabara: ${playerPoints}`
}

async function myeleven() {
    const url = `https://api.kickbase.com/v4/leagues/5679965/teamcenter/myeleven`;
        const response = await fetch(url, {
    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
    });
    const myelevenData = await response.json(); // Teamcenter Data
    const myelevenPoints = myelevenData.lp[0].p;

    document.getElementById("myeleven").innerHTML=`<br><strong>/myeleven </strong> Grabara: ${myelevenPoints}`
}

async function performance() {
    const url = `https://api.kickbase.com/v4/competitions/1/players/8229/performance?leagueId=5679965`;
        const response = await fetch(url, {
    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
    });
    const performanceData = await response.json(); // Teamcenter Data
    const performanceElement = performanceData.it[0].ph.find(element => element.cur);
    const performancePoints = performanceElement.p;

    document.getElementById("performance").innerHTML=`<br><strong>/performance </strong> Grabara: ${performancePoints}`
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
        // Zeige das Login-Formular, falls kein Token vorhanden ist
        showLoginForm();
}