let token;
let league;
let currentMatchday


async function showLeaderboard () {
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
    // Tabelle erstellen
    let tableHTML = `
    <table>
        <thead>
            <tr>
                <th style="text-align: left; padding-right: 100px;">Ranking</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;

    // Daten nach `mdp` sortieren (absteigend)
    leaderboardData.us.sort((a, b) => b.mdp - a.mdp);

    // Daten hinzufügen
    leaderboardData.us.forEach(user => {
        tableHTML += `
            <tr>
                <td>${user.n}</td>
                <td style="text-align: right">${user.mdp}</td>
            </tr>`;
    });

    tableHTML += `
            </tbody>
        </table>`;

    // Tabelle in die Seite einfügen
    document.getElementById("mainContent").innerHTML = tableHTML;

}

async function getMatchday () {
    const url = `https://api.kickbase.com/v4/competitions/1/players/8229?leagueId=${league}`; // 8229=Grabara - if he leaves change Id
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
    const data = await response.json(); // PlayerCenter Data
    currentMatchday = data.mdsum.find(match => match.cur === true)?.day;
    console.log(currentMatchday);
}

// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    if (token && league) {
        try {
            getMatchday();
            showLeaderboard();
        }
        catch {
            window.location.href = "index.html";
        }
    }
    else {
        window.location.href = "index.html";
    }
}