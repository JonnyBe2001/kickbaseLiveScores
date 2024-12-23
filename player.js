let token;
let league;
let playerId;

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
    let plCenterTable = `<table class="custom-table">
                    <thead>
                        <tr class="custom-header">
                            <th class="custom-cell" style="text-align: left; padding-right: 20px;">${plCenterData.n}</th>
                            <th><img src="https://kickbase.b-cdn.net/pool/playersbig/${playerId}.png" alt="Player Picture" style="width: 100px; height: auto; vertical-align: middle;"></th>
                            <th>${plCenterData.p}</th>
                        </tr>
                    </thead>
                    <tbody>`;
    if (events && events.length > 0) {
        events.forEach(event => {
            const matchTime = event.mt; // Spielminute
            const points = event.p;  // Punkte
            plCenterTable += `
                    <tr>
                        <td class="custom-cell" style="padding-right: 20px; padding-top: 15px;"><strong>${points}</strong></td>
                        <td></th>
                        <td class="custom-cell" style="text-align: right">${matchTime}'</td>
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