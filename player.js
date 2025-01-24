let token;
let league;
let playerId;
let eventMap = new Map(); // Dynamische Map für Eventtypen

// API-Call, um Eventtypen abzurufen
async function fetchEventTypes() {
    const url = `https://api.kickbase.com/v4/live/eventtypes`;
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

    const eventTypesData = await response.json();

    // Erstelle das Mapping aus der API-Antwort
    eventTypesData.it.forEach(event => {
        eventMap.set(event.i, event.ti);
    });

    console.log("EventMap erfolgreich geladen:", eventMap);
}

// Funktion zum Abrufen des zugeordneten Wortes für eine Event-ID
function getEventWord(eventId) {
    return eventMap.get(eventId) || ""; // Standardwert, falls ID nicht gefunden
}

async function playerCenter() {
    const url = `https://api.kickbase.com/v4/competitions/1/playercenter/${playerId}?leagueId=${league}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const plCenterData = await response.json(); // PlayerCenter Data
    console.log(plCenterData);

    const events = plCenterData.events;
    let playerPoints = plCenterData.p || 0;

    document.getElementById("playerPicture").innerHTML = `<img src="https://kickbase.b-cdn.net/pool/playersbig/${playerId}.png" alt="Player Picture" style="width: 100px; height: auto; vertical-align: middle;">`;
    document.getElementById("playerName").innerHTML = `<strong>${plCenterData.n} ${playerPoints}</strong>`;

    let plCenterTable = `
    <table class="custom-table">
        <thead>
            <tr class="custom-header">
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;

    if (events && events.length > 0) {
        events.forEach(event => {
            const matchTime = event.mt; // Spielminute
            let points = event.p;  // Punkte
            let pColor;
            const eventWord = getEventWord(event.eti); // Dynamische Zuordnung

            if (points > 0 && points < 15) {
                pColor = "#9ddd49";
                points = `+${points}`;
            } else if (points >= 15) {
                pColor = "#24dc84";
                points = `+${points}`;
            } else if (points === 0) {
                return; // Ignorieren, wenn Punkte 0 sind
            } else {
                pColor = "#f94c1f";
            }

            plCenterTable += `
                <tr>
                    <td class="custom-cell" style="padding-right: 10px; padding-top: 15px; color: ${pColor};"><strong>${points}</strong></td>
                    <td style="padding-top: 15px; padding-right: 10px; font-size: 14px">${eventWord}</td>
                    <td class="custom-cell" style="text-align: right; padding-top: 15px; font-size: 14px; color: #7e8187">${matchTime}'</td>
                </tr>`;
        });

        plCenterTable += `
            </tbody>
        </table>`;
        document.getElementById("mainContent").innerHTML = plCenterTable;

    } else {
        console.log("Keine Events gefunden.");
    }
}

// Funktion zum Überprüfen des Tokens und Laden der Eventtypen
window.onload = async function () {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    playerId = localStorage.getItem('player');

    if (token && league && playerId) {
        try {
            await fetchEventTypes(); // Eventtypen laden
            playerCenter(); // Player-Daten laden
        } catch (error) {
            console.error(error);
            window.location.href = "index.html";
        }
    } else {
        window.location.href = "index.html";
    }
};
