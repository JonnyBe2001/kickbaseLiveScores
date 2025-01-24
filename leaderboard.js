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
                <th style="text-align: left; padding-right: 100px;"><a id="topBtn" href="leaderboard.html" style="color: #fb4404;">MD ${currentMatchday}</a></th>
                <th><a id="topBtn" href="season.html" style="color: #a8a8aa; text-decoration: none;">Saison</a></th>
            </tr>
        </thead>
        <tbody>`;
    // Daten nach `mdp` sortieren (absteigend)
    leaderboardData.us.sort((a, b) => b.mdp - a.mdp);

    // Daten hinzufügen
    leaderboardData.us.forEach(user => {
        const mdp = user.mdp !== undefined ? user.mdp : 0; // Fallback auf 0, falls mdp nicht definiert ist
        let pColor;
        if (mdp<500) {
            pColor = "#f94c1f";
        }
        else if (mdp>=500 && user.mdp<750) {
            pColor = "#ee8728";
        }
        else if (mdp>=750 && user.mdp<1500) {
            pColor = "#9ddd49";
        }
        else if (mdp>=1500) {
            pColor = "#24dc84";   
        }
        else if (mdp>=400) {
            pColor = "#e1bc37";
        }

        tableHTML += `
            <tr>
                <td style="padding-top:20px;">${user.n}</td>
                <td style="text-align: right; color: ${pColor}; padding-top:20px;"><strong>${mdp}</strong></td>
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
window.onload = async function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    if (token && league) {
        try {
            await getMatchday();
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