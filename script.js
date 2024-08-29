let leagueId;
let token = localStorage.getItem('token');
console.log(token);

const tableUrl = 'https://api.kickbase.com/competition/table?matchDay=1';  // Endpunkt für die Tabelle

fetchLeagues();
 
// leagueFetch triggered in login
async function fetchLeagues() {
    try {
        const response = await fetch('https://api.kickbase.com/leagues/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Setzt das Authentifizierungstoken im Authorization-Header
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Ligen! Status: ${response.status}`);
            alert("Fehler");
        }

        const data = await response.json();
        leagueId = data.leagues[0]?.id;
        console.log("League ID:" + leagueId);

        await fetchLeagueLineup();

    } catch (error) {
        console.error('Fehler beim Abrufen der Ligen:', error);
        document.getElementById('output').textContent = 'Fehler beim Abrufen der Ligen.';
    }
}


/*
// Funktion zum Abrufen der Liga-Statistiken
async function fetchLeagueStats() {
    if (!leagueId) {
        console.error('League ID ist nicht verfügbar.');
        document.getElementById('output').textContent = 'Keine League ID verfügbar.';
        return;
    }

    try {
        const response = await fetch(`https://api.kickbase.com/leagues/${leagueId}/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Setzt das Authentifizierungstoken im Authorization-Header
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Liga-Statistiken! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extrahiere Benutzer-ID und Namen
        const users = data.users.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {});

        // Zeige die Benutzerdaten an
        const userStats = data.matchDays[0].users.map(userStat => {
            const userName = users[userStat.userId];
            return {
                userId: userStat.userId,
                username: userName || 'Unbekannt',
                dayPoints: userStat.dayPoints,
                dayPlacement: userStat.dayPlacement,
                teamValue: userStat.teamValue
            };
        });

        // Formatierte Ausgabe
        const outputHtml = userStats.map(stat => `
            <div>
                <strong>Benutzername:</strong> ${stat.username} <br>
                <strong>Benutzer-ID:</strong> ${stat.userId} <br>
                <strong>Tagesspunkte:</strong> ${stat.dayPoints} <br>
                <strong>Tageseinstufung:</strong> ${stat.dayPlacement} <br>
                <strong>Teamwert:</strong> ${stat.teamValue} <br>
                <button>Live</button>
                <hr>
            </div>
        `).join('');

        document.getElementById('output').innerHTML = outputHtml;

    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Statistiken:', error);
        document.getElementById('output').textContent = 'Fehler beim Abrufen der Liga-Statistiken.';
    }
}

// Event-Listener für den Button
document.getElementById('leagueStats').addEventListener('click', () => {
    fetchLeagueStats();
});

*/


// Funktion zum Abrufen der Liga-Aufstellungen und Ausgabe der Spielernamen
async function fetchLeagueLineup() {
    if (!leagueId) {
        document.getElementById('lineUpOutput').textContent = 'Liga-ID ist nicht verfügbar.';
        return;
    }

    try {
        const response = await fetch(`https://api.kickbase.com/leagues/${leagueId}/lineupex`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Setzt das Authentifizierungstoken im Authorization-Header
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Liga-Aufstellungen! Status: ${response.status}`);
        }

        const data = await response.json();

        // Ausgabe der gesamten Antwort in der Konsole
        console.log('Liga-Aufstellungen:', data);

        // Die 11 Spieler IDs, die im Lineup enthalten sind
        const lineupPlayerIds = data.lineup;
        
        // Die Liste aller Spieler
        const allPlayers = data.players;

        // Speichern der Spielerdetails in einem Array
        const lineupPlayersDetails = lineupPlayerIds.map(playerId => {
            return allPlayers.find(p => p.id === playerId);
        });

        // Die IDs der Spieler ausgeben
        console.log('Spieler-IDs im Lineup:', lineupPlayersDetails.map(player => player.id));

        let lineUpArray = [];

        // Positionen als Mapping-Objekt
        const positionMap = {
            1: 'GK',
            2: 'DEF',
            3: 'MID',
            4: 'ST'
        };

        // Zum Beispiel kannst du für jeden Spieler die Punkte abrufen:
        const pointsPromises = lineupPlayersDetails.map(async (player) => {
            const points = await fetchPlayerPoints(player.id);
            console.log(`Punkte für ${player.lastName} (ID: ${player.id}): ${points}`);
            
            // Bestimme die Position basierend auf der player.position-Nummer
            const position = positionMap[player.position];

            // Formatierte Ausgabe mit Name, Position und Punkten
            return `${player.lastName} (${position}) - ${points} Punkte`;
        });

        // Warten, bis alle Punkte abgerufen wurden
        Promise.all(pointsPromises).then(results => {
            // Array in HTML umwandeln
            const lineUpHtml = results.map(item => `<li>${item}</li>`).join('');
            
            // HTML in das Element einfügen
            document.getElementById('lineUpOutput').innerHTML = `<ul>${lineUpHtml}</ul>`;
        });


    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Aufstellungen:', error);
        document.getElementById('lineUpOutput').textContent = 'Fehler beim Abrufen der Liga-Aufstellungen.';
    }
}



// Funktion zum Abrufen der Punkte eines Spielers
async function fetchPlayerPoints(playerId, playerName) {
    const url = `https://api.kickbase.com/players/${playerId}/points`;

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
            throw new Error(`Fehler beim Abrufen der Punkte für Spieler ${playerId}! Status: ${response.status}`);
        }

        const data = await response.json();

        // Daten aus der Antwort extrahieren
        const sArray = data.s;
        if (sArray && sArray.length > 0) {
            // Finde das letzte Element im Array und den Wert von 'p'
            const lastElement = sArray[sArray.length - 1];
            const lastPValue = lastElement.p;

            // Ausgabe des Wertes
            console.log('letzter/aktueller Spieltag:', lastPValue);
            return lastPValue;
        } else {
            console.log('Das Array ist leer oder nicht vorhanden.');
            return 0;  // Standardwert bei fehlenden Daten
        }
    } catch (error) {
        console.error('Fehler bei der API-Anfrage:', error);
        return null;  // Rückgabe von null im Fehlerfall
    }
}