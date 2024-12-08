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
        fetchTeamcenter();

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}


async function fetchTeamcenter() {
    console.log("success");
    const url = `https://api.kickbase.com/v4/leagues/${leagueId}/users/${userId}/teamcenter`;
        const response = await fetch(url, {
    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
    });
    const tcdata = await response.json(); // Teamcenter Data
    // Erstelle die Tabelle und fülle sie mit den Daten
const outputDiv = document.getElementById("lineUpOutput");
const table = document.createElement("table");
const tbody = document.createElement("tbody");

// Füge die Header-Zeile hinzu
const headerRow = document.createElement("tr");
headerRow.innerHTML = "<th>Spieler Name</th><th>Punkte</th>";
tbody.appendChild(headerRow);

// Gehe durch alle lp-Elemente und erstelle eine Zeile
tcdata.lp.forEach((item) => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${item.n}</td><td>${item.p || 'N/A'}</td>`;
  tbody.appendChild(row);
});

// Füge den Tabellenkörper zur Tabelle hinzu
table.appendChild(tbody);

// Füge die Tabelle zum div-Element hinzu
outputDiv.appendChild(table);
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