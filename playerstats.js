let token;
let league;
let playerId;

async function playerCenter() {
    const url = `https://api.kickbase.com/v4/competitions/1/players/${playerId}`;
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

    const plData = await response.json(); // PlayerCenter Data
    console.log(plData);

    let secondsPlayed = plData.sec;
    let totalPoints = plData.tp || 0;
    let avgPoints = plData.ap;
    let minutesPlayed = secondsPlayed / 60;
    let pointsPerMin = totalPoints / minutesPlayed;

    document.getElementById("playerPicture").innerHTML = `<img src="https://kickbase.b-cdn.net/pool/playersbig/${playerId}.png" alt="Player Picture" style="width: 100px; height: auto; vertical-align: middle;">`;
    document.getElementById("playerName").innerHTML = `<strong>${plData.ln}</strong>`;
    document.getElementById("totalPointsCont").innerHTML=`<p><i class="fa-solid fa-square-poll-vertical"></i> ${totalPoints}</p>`;
    document.getElementById("pointsPerMinCont").innerHTML=`<p><i class="fa-regular fa-clock"></i> ${pointsPerMin.toFixed(2)}</p>`;
}

// Funktion zum Überprüfen des Tokens und Laden der Eventtypen
window.onload = async function () {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    playerId = localStorage.getItem('player');

    if (token && league && playerId) {
        playerCenter();
    } else {
        window.location.href = "index.html";
    }
};
