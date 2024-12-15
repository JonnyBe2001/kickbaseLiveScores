let token;
let league;


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
        localStorage.setItem("token", loginToken);
        token = loginToken;

        leagueId = data.srvl[0]?.id; //get first league
        localStorage.setItem("league", leagueId);
        league = leagueId;

        hideLoginForm();
        myeleven();

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}

async function myeleven() {
    const url = `https://api.kickbase.com/v4/leagues/${league}/teamcenter/myeleven`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const myelevenData = await response.json(); // Teamcenter Data

        // Punkte der ersten 11 Elemente aus `lp`
        let pointsHTML = `Teampunkte: ${myelevenData.p}<br>--------------------`;
        for (let i = 0; i < 11; i++) {
            if (myelevenData.lp[i]) { // Sicherstellen, dass das Element existiert
                let points = myelevenData.lp[i].p; // Punkte des jeweiligen Elements
                const name = myelevenData.lp[i].n; // Punkte des jeweiligen Elements
                if (points === undefined) {
                    points = "0";
                }
                pointsHTML += `<br>${name}: ${points}`;
            } else {
                pointsHTML += `<br>Spieler ${i + 1}: Keine Daten verfügbar`;
            }
        }

        // Ausgabe der Punkte
        document.getElementById("mainContent").innerHTML = pointsHTML;

    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById("mainContent").innerHTML = "Ein Fehler ist aufgetreten. Bitte überprüfe die Konsole.";
    }
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
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    if (token && league) {
        try {
            myeleven();
        }
        catch {
            showLoginForm();
        }
    }
    else {
        showLoginForm();
    }
}