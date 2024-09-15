// Globale Variable für das aktuell geöffnete Team
let currentOpenDropdown = null;
let token = localStorage.getItem('token');  // Token aus dem localStorage laden
let leagueId = null;
let playerId ="1473";

// Funktion zum Öffnen und Schließen von Dropdowns
function toggleDropdown(event) {
    const dropdownContent = event.currentTarget.nextElementSibling;
    // Wenn ein anderes Dropdown geöffnet ist, schließen
    if (currentOpenDropdown && currentOpenDropdown !== dropdownContent) {
        currentOpenDropdown.classList.remove('show');
    }

    // Toggle current dropdown
    dropdownContent.classList.toggle('show');

    // Aktualisieren der offenen Dropdown-Referenz
    currentOpenDropdown = dropdownContent.classList.contains('show') ? dropdownContent : null;
}

// Funktion zum Login
async function login() {
    // Eingabewerte holen
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password,
        ext: false
    };

    try {
        const response = await fetch('https://api.kickbase.com/user/login', {
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
        let loginToken = data.token;
        localStorage.setItem('token', loginToken);  // Token im localStorage speichern

        token = loginToken;
        hideLoginForm();
        fetchLeagues();  // Fetch leagues after login

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}

// Funktion zum Abrufen der Ligen
async function fetchLeagues() {
    if (!token) {
        console.error('Token ist nicht verfügbar.');
        showLoginForm();  // Falls kein Token verfügbar, zeige das Login-Formular
        return;
    }

    try {
        const response = await fetch('https://api.kickbase.com/leagues/', {
            method: 'GET',
            mode: 'cors', // CORS hinzufügen
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`  // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Ligen! Status: ${response.status}`);
        }

        const data = await response.json();
        leagueId = data.leagues[0]?.id;

        // Fetch league lineup after fetching leagues
        fetchLeagueLineup();

    } catch (error) {
        console.error('Fehler beim Abrufen der Ligen:', error);
        showLoginForm();  // Falls ein Fehler auftritt, Login-Formular anzeigen, um einen neuen Token zu holen
    }
}

// Funktion zum Abrufen der Liga-Aufstellung und Ausgabe der Spielernamen und Live-Punkte
async function fetchLeagueLineup() {
    if (!leagueId) {
        console.error('League ID ist nicht verfügbar.');
        return;
    }

    try {
        const url = `https://api.kickbase.com/leagues/${leagueId}/live`;
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // CORS hinzufügen
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`  // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Liga-Livepunkte! Status: ${response.status}`);
        }

        const data = await response.json();
        const teams = data.u;

        // Leeren des bisherigen Inhalts
        document.getElementById('lineUpOutput').innerHTML = '';

        // Erstellen der Dropdowns für jedes Team
        teams.forEach(team => {
            createDropdown(team.n, team.pl, team.id);
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Livepunkte:', error);
    }
}

// Funktion zum Erstellen von Dropdowns
function createDropdown(teamName, players) {
    const container = document.getElementById('lineUpOutput');
    // Spieler nach Position sortieren
    players.sort((a, b) => a.p - b.p);

    // Gesamtpunkte des Teams berechnen
    const totalPoints = players.reduce((acc, player) => acc + player.t, 0);

    // Team Header mit Gesamtpunkten
    const teamHeader = document.createElement('div');
    teamHeader.className = 'team-header';
    teamHeader.textContent = `${teamName} (${totalPoints})`;
    teamHeader.addEventListener('click', toggleDropdown);

    // Dropdown Content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `<tr><th>Name</th><th>Position</th><th>Punkte</th></tr>`;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${player.n}</td><td>${getPositionLabel(player.p)}</td><td>${player.t}</td>`;

        // Hinzufügen des onClick-Event-Listeners zur Zeile
        row.addEventListener('click', () => showPlayerHistory(player.id, player.n, player.t)); // Spieler ID direkt übergeben

        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    dropdownContent.appendChild(table);

    container.appendChild(teamHeader);
    container.appendChild(dropdownContent);
}

// Funktion zum Ermitteln der Position
function getPositionLabel(position) {
    switch (position) {
        case 1:
            return 'TW';  // Torwart
        case 2:
            return 'ABW'; // Abwehr
        case 3:
            return 'MF';  // Mittelfeld
        case 4:
            return 'ST';  // Stürmer
        default:
            return 'Unbekannt'; // Unbekannt
    }
}

async function showPlayerHistory(playerId, playerName, playerPkt) {
    console.log(`Zeige Historie für Spieler mit ID: ${playerId}`);

    // Den Inhalt des Elements mit ID 'mainContent' verstecken
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // Spieler-ID im Element 'playerIdDisplay' anzeigen
    const playerIdDisplay = document.getElementById('playerIdDisplay');
    if (playerIdDisplay) {
        // Inhalt zurücksetzen
        playerIdDisplay.innerHTML = `<h2>${playerName} (${playerPkt})</h2>`;

        // Erstelle und füge den Reload-Button hinzu
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Zurück';
        reloadButton.addEventListener('click', () => location.reload()); // Seite neu laden beim Klicken
        playerIdDisplay.appendChild(reloadButton);

        if (!leagueId) {
            console.error('League ID ist nicht verfügbar.');
            return;
        }

        const url = `https://api.kickbase.com/leagues/${leagueId}/live/players/${playerId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Abrufen des Player Feeds! Status: ${response.status}`);
            }

            const data = await response.json();

            // Tabelle erstellen
            const table = document.createElement('table');
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `<tr><th>Spielminute</th><th>Punkte</th></tr>`;
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            // Sortieren nach Spielminute (absteigend)
            const sortedEvents = data.e.sort((a, b) => b.ts - a.ts);
            sortedEvents.forEach(event => {
                const row = document.createElement('tr');
                const pointsCell = document.createElement('td');
                
                // Punkte formatieren
                const pointsText = event.p > 0 ? `+${event.p}` : event.p;
                pointsCell.textContent = pointsText;
                
                // Styling der Punkte-Zelle basierend auf dem Wert
                if (event.p > 0) {
                    pointsCell.style.color = 'green';  // Positive Punkte in Grün
                } else if (event.p < 0) {
                    pointsCell.style.color = 'red';  // Negative Punkte in Rot
                }
                row.innerHTML = `<td>${event.ts}</td>`;
                row.appendChild(pointsCell);
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);

            playerIdDisplay.appendChild(table);  // Tabelle zum playerIdDisplay hinzufügen

        } catch (error) {
            console.error('Fehler:', error);
        }
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
    if (token) {
        // Versuche, die Ligen mit dem gespeicherten Token abzurufen
        fetchLeagues();
    } else {
        // Zeige das Login-Formular, falls kein Token vorhanden ist
        showLoginForm();
    }
};