async function leagueToggle() {
    const url = `https://api.kickbase.com/v4/leagues/selection`;
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Leagues:", data);

        // Tabelle aufbauen (nur Name)
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th style="text-align:middle;">Liga wählen</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.it.forEach(league => {
            tableHTML += `
                <tr style="cursor:pointer;" onclick="selectLeague('${league.i}', '${league.n}')">
                    <td style="padding:10px;">${league.n}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        document.getElementById("mainContent").innerHTML = tableHTML;

    } catch (err) {
        console.error("Fehler bei leagueToggle:", err);
    }
}

function selectLeague(leagueId, leagueName) {
    // Werte in localStorage speichern
    localStorage.setItem("league", leagueId);
    localStorage.setItem("leagueName", leagueName);

    console.log("League gesetzt:", leagueId, leagueName);

    // Weiterleitung auf index.html
    window.location.href = "index.html";
}

window.onload = async function () {
    token = localStorage.getItem('token');

    if (token) {
        try {
            await leagueToggle();
        } catch (error) {
            console.error(error);
            window.location.href = "index.html";
        }
    } else {
        window.location.href = "index.html";
    }
};
