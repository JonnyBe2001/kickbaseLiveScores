// Endpunkt für das Login
const loginUrl = 'https://api.kickbase.com/user/login';

// global variables
let token;
let leagueId;

// Daten für Login
const loginData = {
    email: '',  // Platzhalter, wird durch die Eingabe ersetzt
    password: '',  // Platzhalter, wird durch die Eingabe ersetzt
    ext: false
};

// Funktion zum Login
async function login() {
    // Eingabewerte holen
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginData.email = email;
    loginData.password = password;

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
        return;
    }

    try {
        const response = await fetch('https://api.kickbase.com/leagues/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Ligen! Status: ${response.status}`);
        }

        const data = await response.json();
        leagueId = data.leagues[0]?.id;
        console.log('League ID:', leagueId);

        // Fetch league lineup after fetching leagues
        fetchLeagueLineup();

    } catch (error) {
        console.error('Fehler beim Abrufen der Ligen:', error);
    }
}

// Funktion zum Abrufen der Liga-Aufstellung und Ausgabe der Spielernamen
async function fetchLeagueLineup() {
    if (!leagueId) {
        console.error('League ID ist nicht verfügbar.');
        return;
    }

    try {
        const response = await fetch(`https://api.kickbase.com/leagues/${leagueId}/lineupex`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Liga-Aufstellungen! Status: ${response.status}`);
        }

        const data = await response.json();
        const lineupPlayerIds = data.lineup;
        const allPlayers = data.players;

        const lineupPlayersDetails = lineupPlayerIds.map(playerId => {
            return allPlayers.find(p => p.id === playerId);
        });

        // Spieler-Punkte abrufen und anzeigen
        const lineupDetails = await Promise.all(lineupPlayersDetails.map(async player => {
            const points = await fetchPlayerPoints(player.id);
            return {
                lastName: player.lastName,
                points: points,
                position: getPositionLabel(player.position) // Funktion zum Ermitteln der Position
            };
        }));

        // Formatierte Ausgabe
        const outputHtml = lineupDetails.map((player, index) => `
            <div>
                ${index + 1}: ${player.lastName} (${player.position} - ${player.points})
            </div>
        `).join('');
        
        document.getElementById('lineUpOutput').innerHTML = outputHtml;

    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Aufstellungen:', error);
    }
}

// Funktion zum Abrufen der Punkte eines Spielers
async function fetchPlayerPoints(playerId) {
    const url = `https://api.kickbase.com/players/${playerId}/points`;

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
            throw new Error(`Fehler beim Abrufen der Punkte für Spieler ${playerId}! Status: ${response.status}`);
        }

        const data = await response.json();
        const sArray = data.s;

        if (sArray && sArray.length > 0) {
            const lastElement = sArray[sArray.length - 1];
            const lastPValue = lastElement.p;
            return lastPValue;
        } else {
            return 0; // Standardwert bei fehlenden Daten
        }
    } catch (error) {
        console.error('Fehler bei der API-Anfrage:', error);
        return null; // Rückgabe von null im Fehlerfall
    }
}

// Funktion zum Ermitteln der Position
function getPositionLabel(position) {
    switch (position) {
        case 1:
            return 'GK'; // Torwart
        case 2:
            return 'DEF'; // Abwehr
        case 3:
            return 'MID'; // Mittelfeld
        case 4:
            return 'ST'; // Stürmer
        default:
            return 'UNBEKANNT'; // Unbekannt
    }
}

// Event-Listener für den Login-Button
document.getElementById('loginBtn').addEventListener('click', login);
