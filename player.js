let token;
let league;
let playerId;

// Mapping der Event-IDs zu Wörtern
const eventMap = new Map([
    [49, "Präziser langer Pass"],
    [45, "Flanke"],
    [46, "Pass gegn. Hälfte"],
    [48, "Erfolgr. Abwurf (TW)"],
    [52, "Luftzweikampf verloren"],
    [79, "Luftzweikampf gewonnen"],
    [87, `<i class="fa-solid fa-bullseye" style="color: #ffffff;"></i> Elfmeter verwandelt`],
    [103, "Großchance vergeben"],
    [104, "Flanke geblockt"],
    [111, "Parade (TW)"],
    [113, "Geklärt"],
    [112, "Ballbesitz n. gebl. Schuss"],
    [117, "Foul"],
    [118, "Gefoult im letzten Drittel"],
    [121, "Flanke abgefangen (TW)"],
    [124, "Pass gestört"],
    [125, "Ballgewinn"],
    [130, "Ballverlust"],
    [132, "Elfmeter verschuldet"],
    [135, "Faustabwehr"],
    [136, `Rote Karte <i class="fa-solid fa-square" style="color: #f94c1f;"></i>`],
    [137, "Schuss gehalten (TW)"],
    [138, "Fernschuss gehalten (TW)"],
    [142, "Ball im Stand abgew. (TW)"],
    [143, "Pass vord. Drittel"],
    [144, "Torschussvorlage"],
    [148, "Abseits"],
    [149, "Torschuss (aufs Tor)"],
    [152, "Gegner ausgedribbelt"],
    [153, "Ecke rausgeholt"],
    [154, "Gewonnener Zweikampf"],
    [155, `Gelbe Karte <i class="fa-solid fa-square" style="color: #FFD43B;"></i>`],
    [156, "Startelf"],
    [157, "Luftzweikampf verloren"],
    [159, "Teamtor"],
    [160, "Tor kassiert"],
    [165, "Spiel gewonnen"],
    [166, "Spiel verloren"],
    [167, "Minutenbonus"],
    [170, "Teamtor"],
    [171, "Tor kassiert"],
    [174, `<i class="fa-solid fa-bullseye" style="color: #ffffff;"></i> Tor (MF) `],
    [185, `<i class="fa-solid fa-bullseye" style="color: #ffffff;"></i> Tor (ANG) `],
    [191, "Zu Null gespielt (ANG)"],
    [207, "Schuss geblockt"],
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
    let playerPoints = plCenterData.p;
    if (playerPoints === undefined){
        playerPoints = 0;
    }
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
            const eventWord = getEventWord(event.eti); // Direkt die Funktion aufrufen
            if (points > 0 && points < 15) {
                pColor = "#9ddd49";
                points = `+${points}`;
            }
            else if (points >= 15) {
                pColor = "#24dc84";
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
