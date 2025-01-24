let token;
let league;
let oponentId;
let currentMatchday;
let totalPoints = 0;

async function oponentsEleven() {
    const url = `https://api.kickbase.com/v4/leagues/${league}/ranking?dayNumber=${currentMatchday}`;
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
    const leaderboardData = await response.json(); // PlayerCenter Data
    const opponent = leaderboardData.us.find(user => user.i === oponentId);

    if (opponent) {
        const playerName = opponent.n;  // Name des Spielers
        const lineUp = opponent.lp;  // Punkte des Spielers
        console.log(`Name: ${playerName}`);
        console.log(`LineUp: ${lineUp}`);
        let pointsHTML = `
                <table class="custom-table">
                    <thead>
                        <tr class="custom-header" style="border-top: 1px solid blue">
                            <th class="custom-cell" style="text-align: left; padding-right: 20px;">${playerName}</th>
                            <th></th>
                            <th></th>
                            <th class="custom-cell"></th>
                        </tr>
                    </thead>
                    <tbody>          
        `;
        for (const playerId of lineUp) {
            const url = `https://api.kickbase.com/v4/competitions/1/playercenter/${playerId}?leagueId=${league}`;
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

                const plCenterData = await response.json(); // PlayerCenter Data
                let points = plCenterData.p;
                let pColor;

                if (points === undefined) {
                    points = 0;
                }

                totalPoints += points;

                if (points<0) {
                    pColor = "#f94c1f";
                }
                else if (points===0) {
                    pColor = "#7e8187";
                }
                else if (points>0 && points<100) {
                    pColor = "#ee8728";
                }
                else if (points>=100 && points<200) {
                    pColor = "#9ddd49";
                }
                else if (points>=200 && points<400) {
                    pColor = "#24dc84";   
                }
                else if (points>=400) {
                    pColor = "#e1bc37";
                }
                else {
                    pColor = "#a8a8aa";
                }

                pointsHTML += `
                    <tr onclick="handleRowClick(${plCenterData.i});" style="cursor: pointer;">
                        <td style="padding-top: 15px;">${plCenterData.n}</td>
                        <td></td>
                        <td></td>
                        <td class="custom-cell" style="color: ${pColor}; text-align: right"><strong>${points}</strong></td>
                    </tr>
                `;
            } catch (error) {
                console.error(`Fehler beim Abrufen der Daten für Spieler ${playerId}:`, error);
                // Hier kannst du ein Platzhalterwert oder eine Fehlermeldung anzeigen, wenn der API-Aufruf fehlschlägt
                pointsHTML += `
                    <tr>
                        <td style="padding-top: 15px;">Error</td>
                        <td></td>
                        <td></td>
                        <td>--</td>
                    </tr>
                `;
            }
        }

        pointsHTML += `
                <tr>
                    <td style="padding-top: 15px;"><strong>Total</strong></td>
                    <td></td>
                    <td></td>
                    <td><strong>${totalPoints}</strong></td>
                </tr>
                </tbody>
                </table>
                `;

        // Die fertige HTML-Struktur in das "mainContent"-Element einfügen
        document.getElementById("mainContent").innerHTML = pointsHTML;
        pointsHTML += `
                </tbody>
                </table>
                `
        document.getElementById("mainContent").innerHTML = pointsHTML;
    } else {
        console.log('Spieler nicht gefunden!');
    }

    


    
}

function handleRowClick (selectedPlayerId) {
    localStorage.setItem("player", selectedPlayerId);
    window.location.href = "player.html";
}


// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    oponentId = localStorage.getItem('oponent');
    currentMatchday = localStorage.getItem('currMd');
    if (token && league && oponentId && currentMatchday) {
        try {
            console.log("success");
            oponentsEleven();
        }
        catch {
            window.location.href = "index.html";
        }
    }
    else {
        window.location.href = "index.html";
    }
}