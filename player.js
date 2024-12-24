let token;
let league;
let playerId;

// Mapping der Event-IDs zu Wörtern
const eventMap = new Map([
    [143, "Pass vord. Drittel"],
    [166, "Spiel verloren"],
    [167, "Minutenbonus"],
    [124, "Pass gestört"],
    // Füge hier alle weiteren Event-IDs und deren Wörter hinzu
]);

// Funktion zum Abrufen des zugeordneten Wortes für eine Event-ID
function getEventWord(eventId) {
    return eventMap.get(eventId) || "";
}

async function playerCenter () {
    const url = `https://api.kickbase.com/v4/competitions/1/playercenter/${playerId}?leagueId=${league}`;
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
    const plCenterData = await response.json(); // PlayerCenter Data
    console.log(plCenterData);
    const events = plCenterData.events;
    document.getElementById("playerPicture").innerHTML = `<img src="https://kickbase.b-cdn.net/pool/playersbig/${playerId}.png" alt="Player Picture" style="width: 100px; height: auto; vertical-align: middle;">`;
    document.getElementById("playerName").innerHTML = `<strong>${plCenterData.n} ${plCenterData.p}</strong>`;
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
            const eventWord = getEventWord(event.eti); // Direkt die Funktion aufrufen
            if (points > 0) {
                pColor = "#25dc84";
                points = `+${points}`;
            }
            else if (points === 0) { 
                return;  // Nichts tun, wenn Punkte 0 sind
            }
            else {
                pColor = "#f94c1f";
            }

            plCenterTable += `
                    <tr>
                        <td class="custom-cell" style="padding-right: 10px; padding-top: 15px; color: ${pColor};"><strong>${points}</strong></td>
                        <td style="padding-top: 15px; padding-right: 10px; font-size: 14px">${eventWord}</td>
                        <td class="custom-cell" style="text-align: right; padding-top: 15px; font-size: 14px; color: #7e8187">${matchTime}'</td>
                    </tr>
                `;
        });
        plCenterTable += `
                    </tbody>
                </table>
        `;
        document.getElementById("mainContent").innerHTML = plCenterTable;

    } else {
        console.log("Keine Events gefunden.");
    }
}

// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    playerId = localStorage.getItem('player');
    if (token && league && playerId) {
        try {
            playerCenter();
        }
        catch {
            window.location.href = "index.html";
        }
    }
    else {
        window.location.href = "index.html";
    }
}
